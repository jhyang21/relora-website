import postgres, { type Sql } from "postgres";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { normalizeAnalyticsDistinctId } from "@/lib/analytics/shared";
import {
  captureServerAnalyticsEvent,
  getRequestSiteHost,
} from "@/lib/analytics/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_DETAILS_LENGTH = 500;
const MAX_NAME_LENGTH = 120;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_MAX_REQUESTS_PER_IP = 10;
const RATE_LIMIT_MAX_REQUESTS_PER_EMAIL = 3;
const RATE_LIMIT_PRUNE_AGE_SECONDS = RATE_LIMIT_WINDOW_SECONDS * 2;
const VALID_REQUEST_TYPES = new Set([
  "access",
  "correction",
  "deletion",
  "account_deletion",
  "opt_out",
]);
const NOTIFY_EMAIL = "andrew@immform.com";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  access: "Access my data",
  correction: "Correct my data",
  deletion: "Delete my data",
  account_deletion: "Delete my account",
  opt_out: "Opt out of data processing",
};

let sqlClient: Sql | null = null;
let schemaReadyPromise: Promise<void> | null = null;

type RateLimitResult = {
  count: number;
  retry_after_seconds: number;
};
type RateLimitState = {
  limited: boolean;
  retryAfterSeconds: number;
};
type SafeRequestAnalyticsProperties = {
  request_type: string | null;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getSqlClient(): Sql {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Missing POSTGRES_URL environment variable.");
  }

  if (!sqlClient) {
    sqlClient = postgres(process.env.POSTGRES_URL, { prepare: false });
  }

  return sqlClient;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

async function ensureSchemas(sql: Sql): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS data_requests (
          id           SERIAL PRIMARY KEY,
          email        TEXT NOT NULL,
          request_type TEXT NOT NULL,
          name         TEXT,
          details      TEXT,
          status       TEXT NOT NULL DEFAULT 'pending',
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS api_rate_limits (
          key          TEXT PRIMARY KEY,
          window_start TIMESTAMPTZ NOT NULL,
          count        INTEGER NOT NULL
        )
      `;
    })();
  }

  try {
    await schemaReadyPromise;
  } catch (error) {
    schemaReadyPromise = null;
    throw error;
  }
}

async function pruneRateLimitRows(sql: Sql): Promise<void> {
  await sql`
    DELETE FROM api_rate_limits
    WHERE window_start <= NOW() - (${RATE_LIMIT_PRUNE_AGE_SECONDS} * INTERVAL '1 second')
  `;
}

async function hitRateLimit(
  sql: Sql,
  key: string,
  maxRequests: number,
): Promise<RateLimitState> {
  const [result] = await sql<RateLimitResult[]>`
    WITH upserted AS (
      INSERT INTO api_rate_limits AS rl (key, window_start, count)
      VALUES (${key}, NOW(), 1)
      ON CONFLICT (key)
      DO UPDATE SET
        window_start = CASE
          WHEN rl.window_start <= NOW() - (${RATE_LIMIT_WINDOW_SECONDS} * INTERVAL '1 second')
            THEN NOW()
          ELSE rl.window_start
        END,
        count = CASE
          WHEN rl.window_start <= NOW() - (${RATE_LIMIT_WINDOW_SECONDS} * INTERVAL '1 second')
            THEN 1
          ELSE rl.count + 1
        END
      RETURNING window_start, count
    )
    SELECT
      count,
      GREATEST(
        0,
        ${RATE_LIMIT_WINDOW_SECONDS}::int - FLOOR(EXTRACT(EPOCH FROM (NOW() - window_start)))::int
      )::int AS retry_after_seconds
    FROM upserted
  `;

  if (!result) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  return {
    limited: result.count > maxRequests,
    retryAfterSeconds: result.retry_after_seconds,
  };
}

async function notifyNewRequest(params: {
  email: string;
  requestType: string;
  name: string;
  details: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const label = REQUEST_TYPE_LABELS[params.requestType] ?? params.requestType;

  await resend.emails.send({
    from: "Relora <notifications@reloraapp.com>",
    to: NOTIFY_EMAIL,
    subject: `Data request: ${label}`,
    text: [
      "New data request submitted on reloraapp.com/request-data",
      "",
      `Type: ${label}`,
      `Email: ${params.email}`,
      params.name ? `Name: ${params.name}` : null,
      params.details ? `Details: ${params.details}` : null,
      "",
      "Review pending requests in the data_requests table.",
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const siteHost = getRequestSiteHost(request);
  let analyticsDistinctId: string | null = null;
  let safeAnalyticsProperties: SafeRequestAnalyticsProperties = {
    request_type: null,
  };

  async function captureRequestFailure(
    statusCode: number,
    errorCode: string,
  ): Promise<void> {
    await captureServerAnalyticsEvent({
      distinctId: analyticsDistinctId,
      event: "data_request_submit_failed",
      properties: {
        ...safeAnalyticsProperties,
        error_code: errorCode,
        status_code: statusCode,
      },
      siteHost,
    }).catch(() => undefined);
  }

  async function captureRequestSuccess(): Promise<void> {
    await captureServerAnalyticsEvent({
      distinctId: analyticsDistinctId,
      event: "data_request_submit_succeeded",
      properties: {
        ...safeAnalyticsProperties,
        result: "submitted",
        status_code: 200,
      },
      siteHost,
    }).catch(() => undefined);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ipAddress = getClientIp(request);

    const email = normalizeEmail(normalizeText(body.email));
    const website = normalizeText(body.website);
    const requestType = normalizeText(body.requestType);
    const name = normalizeText(body.name);
    const details = normalizeText(body.details);

    analyticsDistinctId = normalizeAnalyticsDistinctId(body.analyticsDistinctId);
    safeAnalyticsProperties = {
      request_type: VALID_REQUEST_TYPES.has(requestType) ? requestType : null,
    };

    if (website.length > 0) {
      return NextResponse.json(
        { ok: true, message: "Request received." },
        { status: 200 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      await captureRequestFailure(400, "invalid_email");
      return NextResponse.json(
        { ok: false, message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (!VALID_REQUEST_TYPES.has(requestType)) {
      await captureRequestFailure(400, "invalid_request_type");
      return NextResponse.json(
        { ok: false, message: "Please select a valid request type." },
        { status: 400 },
      );
    }

    if (details.length > MAX_DETAILS_LENGTH) {
      await captureRequestFailure(400, "details_too_long");
      return NextResponse.json(
        { ok: false, message: "Please keep your details under 500 characters." },
        { status: 400 },
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      await captureRequestFailure(400, "name_too_long");
      return NextResponse.json(
        { ok: false, message: "Please keep your name under 120 characters." },
        { status: 400 },
      );
    }

    const sql = getSqlClient();
    await ensureSchemas(sql);
    await pruneRateLimitRows(sql);

    if (ipAddress !== "unknown") {
      const ipLimitResult = await hitRateLimit(
        sql,
        `ip:${ipAddress}`,
        RATE_LIMIT_MAX_REQUESTS_PER_IP,
      );
      if (ipLimitResult.limited) {
        await captureRequestFailure(429, "rate_limited_ip");
        return NextResponse.json(
          {
            ok: false,
            code: "rate_limited",
            message: "Too many requests. Please try again later.",
          },
          {
            status: 429,
            headers: { "Retry-After": String(ipLimitResult.retryAfterSeconds) },
          },
        );
      }
    }

    const emailLimitResult = await hitRateLimit(
      sql,
      `email:${email}`,
      RATE_LIMIT_MAX_REQUESTS_PER_EMAIL,
    );
    if (emailLimitResult.limited) {
      await captureRequestFailure(429, "rate_limited_email");
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimitResult.retryAfterSeconds) },
        },
      );
    }

    await sql`
      INSERT INTO data_requests (email, request_type, name, details)
      VALUES (
        ${email},
        ${requestType},
        ${name || null},
        ${details || null}
      )
    `;

    await notifyNewRequest({ email, requestType, name, details }).catch(
      () => undefined,
    );

    await captureRequestSuccess();
    return NextResponse.json(
      {
        ok: true,
        code: "submitted",
        message: "Your request has been received. We will respond within 45 days.",
      },
      { status: 200 },
    );
  } catch {
    await captureRequestFailure(500, "unknown_error");
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not submit your request right now. Please email contact@immform.com.",
      },
      { status: 500 },
    );
  }
}
