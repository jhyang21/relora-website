import postgres, { type Sql } from "postgres";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_DETAILS_LENGTH = 500;
const MAX_NAME_LENGTH = 120;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_MAX_REQUESTS_PER_IP = 10;
const RATE_LIMIT_MAX_REQUESTS_PER_EMAIL = 3;
const RATE_LIMIT_PRUNE_AGE_SECONDS = RATE_LIMIT_WINDOW_SECONDS * 2;
const VALID_REQUEST_TYPES = new Set(["access", "correction", "deletion", "account_deletion", "opt_out"]);

let sqlClient: Sql | null = null;
let schemaReadyPromise: Promise<void> | null = null;

type RateLimitResult = {
  count: number;
  retry_after_seconds: number;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSqlClient() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Missing POSTGRES_URL environment variable.");
  }

  if (!sqlClient) {
    sqlClient = postgres(process.env.POSTGRES_URL, { prepare: false });
  }

  return sqlClient;
}

function getClientIp(request: Request) {
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

async function ensureSchemas(sql: Sql) {
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

async function pruneRateLimitRows(sql: Sql) {
  await sql`
    DELETE FROM api_rate_limits
    WHERE window_start <= NOW() - (${RATE_LIMIT_PRUNE_AGE_SECONDS} * INTERVAL '1 second')
  `;
}

async function hitRateLimit(sql: Sql, key: string, maxRequests: number) {
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ipAddress = getClientIp(request);

    const email = normalizeEmail(normalizeText(body.email));
    const website = normalizeText(body.website);
    const requestType = normalizeText(body.requestType);
    const name = normalizeText(body.name);
    const details = normalizeText(body.details);

    if (website.length > 0) {
      return NextResponse.json({ ok: true, message: "Request received." }, { status: 200 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (!VALID_REQUEST_TYPES.has(requestType)) {
      return NextResponse.json(
        { ok: false, message: "Please select a valid request type." },
        { status: 400 },
      );
    }

    if (details.length > MAX_DETAILS_LENGTH) {
      return NextResponse.json(
        { ok: false, message: "Please keep your details under 500 characters." },
        { status: 400 },
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { ok: false, message: "Please keep your name under 120 characters." },
        { status: 400 },
      );
    }

    const sql = getSqlClient();
    await ensureSchemas(sql);
    await pruneRateLimitRows(sql);

    if (ipAddress !== "unknown") {
      const ipLimitResult = await hitRateLimit(sql, `ip:${ipAddress}`, RATE_LIMIT_MAX_REQUESTS_PER_IP);
      if (ipLimitResult.limited) {
        return NextResponse.json(
          { ok: false, code: "rate_limited", message: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": String(ipLimitResult.retryAfterSeconds) } },
        );
      }
    }

    const emailLimitResult = await hitRateLimit(sql, `email:${email}`, RATE_LIMIT_MAX_REQUESTS_PER_EMAIL);
    if (emailLimitResult.limited) {
      return NextResponse.json(
        { ok: false, code: "rate_limited", message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(emailLimitResult.retryAfterSeconds) } },
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

    return NextResponse.json(
      { ok: true, code: "submitted", message: "Your request has been received. We will respond within 45 days." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not submit your request right now. Please email contact@immform.com." },
      { status: 500 },
    );
  }
}
