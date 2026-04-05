import postgres, { type Sql } from "postgres";
import { NextResponse } from "next/server";
import {
  captureServerAnalyticsEvent,
  getRequestSiteHost,
} from "@/lib/analytics/server";
import type {
  AnalyticsPayload,
  ServerAnalyticsEvent,
} from "@/lib/analytics/shared";
import { isDemoScenarioSlug } from "@/lib/demoScenarios";

const SESSION_ID_REGEX = /^[a-zA-Z0-9-]{8,120}$/;
const MAX_TEXT_LENGTH = 120;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS_PER_IP = 240;
const RATE_LIMIT_MAX_REQUESTS_PER_SESSION = 120;
const RATE_LIMIT_PRUNE_AGE_SECONDS = RATE_LIMIT_WINDOW_SECONDS * 2;

let sqlClient: Sql | null = null;
let schemaReadyPromise: Promise<void> | null = null;

type RateLimitRow = {
  count: number;
  retry_after_seconds: number;
};

type DemoEngagementRow = {
  scenario: string | null;
  demo_completed: boolean;
  replayed: boolean;
  cta_clicked: string | null;
};

type DemoEngagementEventType =
  | "scenario_started"
  | "replayed"
  | "completed"
  | "cta_clicked";

type DemoEngagementPayload = {
  sessionId: string;
  scenario: string;
  demoCompleted: boolean | undefined;
  replayed: boolean | undefined;
  ctaClicked: string;
  eventType: DemoEngagementEventType | null;
};

type DemoAnalyticsEvent = {
  event: ServerAnalyticsEvent;
  properties: AnalyticsPayload;
};

function normalizeText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}

function normalizeBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  return undefined;
}

function normalizeEventType(value: unknown): DemoEngagementEventType | null {
  if (
    value === "scenario_started" ||
    value === "replayed" ||
    value === "completed" ||
    value === "cta_clicked"
  ) {
    return value;
  }

  return null;
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

function normalizeDemoEngagementPayload(
  body: Record<string, unknown>,
): DemoEngagementPayload {
  return {
    sessionId: normalizeText(body.sessionId),
    scenario: normalizeText(body.scenario),
    demoCompleted: normalizeBoolean(body.demoCompleted),
    replayed: normalizeBoolean(body.replayed),
    ctaClicked: normalizeText(body.ctaClicked),
    eventType: normalizeEventType(body.eventType),
  };
}

function validateDemoEngagementPayload(
  payload: DemoEngagementPayload,
): NextResponse | null {
  if (!SESSION_ID_REGEX.test(payload.sessionId)) {
    return NextResponse.json({ ok: false, message: "Invalid demo session." }, { status: 400 });
  }

  if (payload.scenario && !isDemoScenarioSlug(payload.scenario)) {
    return NextResponse.json({ ok: false, message: "Invalid demo scenario." }, { status: 400 });
  }

  if (payload.ctaClicked.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ ok: false, message: "Invalid CTA click." }, { status: 400 });
  }

  return null;
}

function buildScenarioAnalyticsProperties(
  scenario: string | null,
): AnalyticsPayload {
  if (!scenario) {
    return {};
  }

  return { scenario };
}

function buildDemoAnalyticsEvents(
  payload: DemoEngagementPayload,
  scenario: string | null,
): DemoAnalyticsEvent[] {
  const scenarioProperties = buildScenarioAnalyticsProperties(scenario);

  switch (payload.eventType) {
    case "scenario_started":
      return [{ event: "demo_scenario_started", properties: scenarioProperties }];
    case "replayed":
      return [{ event: "demo_replayed", properties: scenarioProperties }];
    case "completed":
      return [{ event: "demo_completed", properties: scenarioProperties }];
    case "cta_clicked":
      return [
        {
          event: "demo_cta_clicked",
          properties: {
            ...scenarioProperties,
            cta_id: payload.ctaClicked,
          },
        },
      ];
    default:
      if (payload.replayed) {
        return [{ event: "demo_replayed", properties: scenarioProperties }];
      }

      if (payload.demoCompleted) {
        return [{ event: "demo_completed", properties: scenarioProperties }];
      }

      if (payload.ctaClicked) {
        return [
          {
            event: "demo_cta_clicked",
            properties: {
              ...scenarioProperties,
              cta_id: payload.ctaClicked,
            },
          },
        ];
      }

      if (payload.scenario) {
        return [{ event: "demo_scenario_started", properties: scenarioProperties }];
      }

      return [];
  }
}

function getNextScenario(
  existingScenario: string | null | undefined,
  scenario: string,
): string | null {
  if (existingScenario) {
    return existingScenario;
  }

  if (scenario) {
    return scenario;
  }

  return null;
}

async function ensureDemoEngagementSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS demo_engagements (
      session_id      TEXT PRIMARY KEY,
      scenario        TEXT,
      demo_completed  BOOLEAN NOT NULL DEFAULT FALSE,
      replayed        BOOLEAN NOT NULL DEFAULT FALSE,
      cta_clicked     TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS session_id TEXT
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS scenario TEXT
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS demo_completed BOOLEAN NOT NULL DEFAULT FALSE
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS replayed BOOLEAN NOT NULL DEFAULT FALSE
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS cta_clicked TEXT
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `;
  await sql`
    ALTER TABLE demo_engagements
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

async function createSchemaReadyPromise(sql: Sql): Promise<void> {
  await ensureDemoEngagementSchema(sql);
  await ensureRateLimitSchema(sql);
}

async function ensureSchemas(sql: Sql): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = createSchemaReadyPromise(sql);
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
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const [result] = await sql<RateLimitRow[]>`
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

function buildRateLimitedResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      code: "rate_limited",
      message: "Too many requests. Please try again in a minute.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

function buildSuccessResponse(wasUpdate: boolean): NextResponse {
  const code = wasUpdate ? "updated" : "created";
  return NextResponse.json({ ok: true, code }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = normalizeDemoEngagementPayload(body);
    const validationError = validateDemoEngagementPayload(payload);
    if (validationError) {
      return validationError;
    }

    const sql = getSqlClient();
    const ipAddress = getClientIp(request);

    await ensureSchemas(sql);
    await pruneRateLimitRows(sql);

    if (ipAddress !== "unknown") {
      const ipRateLimit = await hitRateLimit(sql, `ip:${ipAddress}`, RATE_LIMIT_MAX_REQUESTS_PER_IP);
      if (ipRateLimit.limited) {
        return buildRateLimitedResponse(ipRateLimit.retryAfterSeconds);
      }
    }

    const sessionRateLimit = await hitRateLimit(
      sql,
      `demo-session:${payload.sessionId}`,
      RATE_LIMIT_MAX_REQUESTS_PER_SESSION,
    );
    if (sessionRateLimit.limited) {
      return buildRateLimitedResponse(sessionRateLimit.retryAfterSeconds);
    }

    const [existingRow] = await sql<DemoEngagementRow[]>`
      SELECT
        scenario,
        demo_completed,
        replayed,
        cta_clicked
      FROM demo_engagements
      WHERE session_id = ${payload.sessionId}
      LIMIT 1
    `;

    const nextScenario = getNextScenario(existingRow?.scenario, payload.scenario);
    const nextDemoCompleted = Boolean(existingRow?.demo_completed || payload.demoCompleted);
    const nextReplayed = Boolean(existingRow?.replayed || payload.replayed);
    const nextCtaClicked = payload.ctaClicked || existingRow?.cta_clicked || null;

    if (existingRow) {
      await sql`
        UPDATE demo_engagements
        SET
          scenario = ${nextScenario},
          demo_completed = ${nextDemoCompleted},
          replayed = ${nextReplayed},
          cta_clicked = ${nextCtaClicked},
          updated_at = NOW()
        WHERE session_id = ${payload.sessionId}
      `;
    } else {
      await sql`
        INSERT INTO demo_engagements (
          session_id,
          scenario,
          demo_completed,
          replayed,
          cta_clicked
        )
        VALUES (
          ${payload.sessionId},
          ${nextScenario},
          ${nextDemoCompleted},
          ${nextReplayed},
          ${nextCtaClicked}
        )
      `;
    }

    const analyticsEvents = buildDemoAnalyticsEvents(payload, nextScenario);
    const siteHost = getRequestSiteHost(request);

    await Promise.allSettled(
      analyticsEvents.map((analyticsEvent) =>
        captureServerAnalyticsEvent({
          distinctId: payload.sessionId,
          event: analyticsEvent.event,
          properties: analyticsEvent.properties,
          siteHost,
        }),
      ),
    );

    return buildSuccessResponse(Boolean(existingRow));
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not save demo engagement right now." },
      { status: 500 },
    );
  }
}
