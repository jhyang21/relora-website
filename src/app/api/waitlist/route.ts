import postgres, { type Sql } from "postgres";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { normalizeAnalyticsDistinctId } from "@/lib/analytics/shared";
import {
  captureServerAnalyticsEvent,
  getRequestSiteHost,
} from "@/lib/analytics/server";
import {
  COMMITMENT_OPTIONS,
  EMOTIONAL_HOOK_OPTIONS,
  FEATURE_SIGNAL_OPTIONS,
  IDENTITY_OPTIONS,
} from "@/lib/waitlistOptions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_GOLD_INSIGHT_LENGTH = 500;
const MAX_IDENTITY_OTHER_LENGTH = 120;
const OTHER_IDENTITY_OPTION = "Other";
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS_PER_IP = 20;
const RATE_LIMIT_MAX_REQUESTS_PER_EMAIL = 5;
const RATE_LIMIT_PRUNE_AGE_SECONDS = RATE_LIMIT_WINDOW_SECONDS * 2;
const NOTIFY_EMAIL = "andrew@immform.com";

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
type SafeWaitlistAnalyticsProperties = {
  commitment: string | null;
  feature_signal_count: number;
  identity: string | null;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFeatureSignal(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }

    const normalized = item.trim();
    if (FEATURE_SIGNAL_OPTIONS.has(normalized)) {
      unique.add(normalized);
    }
  }

  return [...unique];
}

function getSqlClient(): Sql {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Missing POSTGRES_URL environment variable.");
  }

  if (!sqlClient) {
    // Keep prepared statements off for compatibility with transaction poolers.
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

async function ensureWaitlistSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS identity TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS emotional_hook TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS gold_insight TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS feature_signal TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS commitment TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS identity_other TEXT
  `;

  await sql`
    ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_key
    ON waitlist_signups (email)
  `;
}

async function ensureRateLimitSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS api_rate_limits (
      key TEXT PRIMARY KEY,
      window_start TIMESTAMPTZ NOT NULL,
      count INTEGER NOT NULL
    )
  `;
}

async function ensureSchemas(sql: Sql): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await ensureWaitlistSchema(sql);
      await ensureRateLimitSchema(sql);
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

async function notifyWaitlistSignup(params: {
  email: string;
  identity: string;
  emotionalHook: string;
  goldInsight: string;
  featureSignals: string[];
  commitment: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Relora <notifications@reloraapp.com>",
    to: NOTIFY_EMAIL,
    subject: `New waitlist signup: ${params.email}`,
    text: [
      "New waitlist signup on reloraapp.com",
      "",
      `Email: ${params.email}`,
      `Identity: ${params.identity}`,
      `Emotional hook: ${params.emotionalHook}`,
      `Gold insight: ${params.goldInsight}`,
      `Features: ${params.featureSignals.join(", ")}`,
      `Commitment: ${params.commitment}`,
    ].join("\n"),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const siteHost = getRequestSiteHost(request);
  let analyticsDistinctId: string | null = null;
  let safeAnalyticsProperties: SafeWaitlistAnalyticsProperties = {
    commitment: null,
    feature_signal_count: 0,
    identity: null,
  };

  async function captureWaitlistFailure(
    statusCode: number,
    errorCode: string,
  ): Promise<void> {
    await captureServerAnalyticsEvent({
      distinctId: analyticsDistinctId,
      event: "waitlist_submit_failed",
      properties: {
        ...safeAnalyticsProperties,
        error_code: errorCode,
        status_code: statusCode,
      },
      siteHost,
    }).catch(() => undefined);
  }

  async function captureWaitlistSuccess(
    result: "created" | "updated",
  ): Promise<void> {
    await captureServerAnalyticsEvent({
      distinctId: analyticsDistinctId,
      event: "waitlist_submit_succeeded",
      properties: {
        ...safeAnalyticsProperties,
        result,
        status_code: 200,
      },
      siteHost,
    }).catch(() => undefined);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ipAddress = getClientIp(request);

    const email = normalizeEmail(normalizeText(body.email));
    const company = normalizeText(body.company);
    const identity = normalizeText(body.identity);
    const identityOther = normalizeText(body.identityOther);
    const emotionalHook = normalizeText(body.emotionalHook);
    const goldInsight = normalizeText(body.goldInsight);
    const commitment = normalizeText(body.commitment);
    const featureSignals = normalizeFeatureSignal(body.featureSignal);

    analyticsDistinctId = normalizeAnalyticsDistinctId(body.analyticsDistinctId);
    safeAnalyticsProperties = {
      commitment: COMMITMENT_OPTIONS.has(commitment) ? commitment : null,
      feature_signal_count: featureSignals.length,
      identity: IDENTITY_OPTIONS.has(identity) ? identity : null,
    };

    if (company.length > 0) {
      return NextResponse.json({ ok: true, message: "Saved." }, { status: 200 });
    }

    if (!EMAIL_REGEX.test(email)) {
      await captureWaitlistFailure(400, "invalid_email");
      return NextResponse.json(
        { ok: false, message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (!IDENTITY_OPTIONS.has(identity)) {
      await captureWaitlistFailure(400, "invalid_identity");
      return NextResponse.json(
        { ok: false, message: "Please choose what best describes you." },
        { status: 400 },
      );
    }

    if (identity === OTHER_IDENTITY_OPTION && identityOther.length === 0) {
      await captureWaitlistFailure(400, "missing_identity_other");
      return NextResponse.json(
        { ok: false, message: "Please share what best describes you." },
        { status: 400 },
      );
    }

    if (identityOther.length > MAX_IDENTITY_OTHER_LENGTH) {
      await captureWaitlistFailure(400, "identity_other_too_long");
      return NextResponse.json(
        { ok: false, message: "Please keep your custom identity under 120 characters." },
        { status: 400 },
      );
    }

    if (!EMOTIONAL_HOOK_OPTIONS.has(emotionalHook)) {
      await captureWaitlistFailure(400, "invalid_emotional_hook");
      return NextResponse.json(
        { ok: false, message: "Please choose how often this happens for you." },
        { status: 400 },
      );
    }

    if (goldInsight.length === 0) {
      await captureWaitlistFailure(400, "missing_gold_insight");
      return NextResponse.json(
        { ok: false, message: "Please share one detail you wish you had remembered." },
        { status: 400 },
      );
    }

    if (goldInsight.length > MAX_GOLD_INSIGHT_LENGTH) {
      await captureWaitlistFailure(400, "gold_insight_too_long");
      return NextResponse.json(
        { ok: false, message: "Please keep your response under 500 characters." },
        { status: 400 },
      );
    }

    if (featureSignals.length === 0 || featureSignals.length > 2) {
      await captureWaitlistFailure(400, "invalid_feature_signal_count");
      return NextResponse.json(
        { ok: false, message: "Please select one or two features that matter most." },
        { status: 400 },
      );
    }

    if (!COMMITMENT_OPTIONS.has(commitment)) {
      await captureWaitlistFailure(400, "invalid_commitment");
      return NextResponse.json(
        { ok: false, message: "Please choose one beta access option to continue." },
        { status: 400 },
      );
    }

    const identityOtherValue =
      identity === OTHER_IDENTITY_OPTION ? identityOther : null;

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
        await captureWaitlistFailure(429, "rate_limited_ip");
        return NextResponse.json(
          {
            ok: false,
            code: "rate_limited",
            message: "Too many requests. Please try again in a minute.",
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
      await captureWaitlistFailure(429, "rate_limited_email");
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          message: "Too many requests. Please try again in a minute.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimitResult.retryAfterSeconds) },
        },
      );
    }

    const [insertedSignup] = await sql<{ id: number }[]>`
      INSERT INTO waitlist_signups (
        email,
        identity,
        identity_other,
        emotional_hook,
        gold_insight,
        feature_signal,
        commitment
      )
      VALUES (
        ${email},
        ${identity},
        ${identityOtherValue},
        ${emotionalHook},
        ${goldInsight},
        ${featureSignals.join(", ")},
        ${commitment}
      )
      ON CONFLICT (email)
      DO NOTHING
      RETURNING id
    `;

    if (insertedSignup) {
      await notifyWaitlistSignup({
        email,
        identity,
        emotionalHook,
        goldInsight,
        featureSignals,
        commitment,
      }).catch(() => undefined);

      await captureWaitlistSuccess("created");
      return NextResponse.json(
        { ok: true, code: "created", message: "Thanks for joining the waitlist." },
        { status: 200 },
      );
    }

    await sql`
      UPDATE waitlist_signups
      SET
        identity = ${identity},
        identity_other = ${identityOtherValue},
        emotional_hook = ${emotionalHook},
        gold_insight = ${goldInsight},
        feature_signal = ${featureSignals.join(", ")},
        commitment = ${commitment}
      WHERE email = ${email}
    `;

    await captureWaitlistSuccess("updated");
    return NextResponse.json(
      {
        ok: true,
        code: "updated",
        message: "You are already on the waitlist. We updated your responses.",
      },
      { status: 200 },
    );
  } catch {
    await captureWaitlistFailure(500, "unknown_error");
    return NextResponse.json(
      { ok: false, message: "Could not save your signup right now." },
      { status: 500 },
    );
  }
}
