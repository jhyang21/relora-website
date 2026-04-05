export type AnalyticsScalar = string | number | boolean | null;
export type AnalyticsPayload = Record<string, AnalyticsScalar>;

export const CLIENT_ANALYTICS_EVENTS = [
  "site_nav_clicked",
  "hero_cta_clicked",
  "waitlist_step_viewed",
  "waitlist_step_completed",
  "waitlist_submit_started",
  "demo_scenario_started",
  "demo_replayed",
  "demo_completed",
  "demo_cta_clicked",
  "data_request_submit_started",
] as const;

export const SERVER_ANALYTICS_EVENTS = [
  "waitlist_submit_succeeded",
  "waitlist_submit_failed",
  "data_request_submit_succeeded",
  "data_request_submit_failed",
  "demo_scenario_started",
  "demo_replayed",
  "demo_completed",
  "demo_cta_clicked",
] as const;

export type ClientAnalyticsEvent = (typeof CLIENT_ANALYTICS_EVENTS)[number];
export type ServerAnalyticsEvent = (typeof SERVER_ANALYTICS_EVENTS)[number];

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";
const MAX_ANALYTICS_DISTINCT_ID_LENGTH = 200;
const MAX_ANALYTICS_SESSION_ID_LENGTH = 200;
const MAX_ANALYTICS_URL_LENGTH = 2048;
const SENSITIVE_ANALYTICS_PATHS: readonly string[] = ["/request-data"];

function isAnalyticsScalar(value: unknown): value is AnalyticsScalar {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return true;
  }

  return typeof value === "number" && Number.isFinite(value);
}

export function sanitizeAnalyticsPayload(
  payload: Record<string, unknown> | undefined,
): AnalyticsPayload {
  if (!payload) {
    return {};
  }

  const sanitized: AnalyticsPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    if (isAnalyticsScalar(value)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function getAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true";
}

export function getAnalyticsToken(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_TOKEN?.trim() ?? "";
}

export function getAnalyticsHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || DEFAULT_POSTHOG_HOST;
}

export function getSiteEnvironment(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function buildBaseAnalyticsProperties(siteHost?: string): AnalyticsPayload {
  return sanitizeAnalyticsPayload({
    platform: "web",
    surface: "marketing_site",
    site_env: getSiteEnvironment(),
    site_host: siteHost ?? null,
  });
}

export function buildBrowserAnalyticsProperties(): AnalyticsPayload {
  if (typeof window === "undefined") {
    return buildBaseAnalyticsProperties();
  }

  return buildBaseAnalyticsProperties(window.location.host);
}

export function normalizeAnalyticsDistinctId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_ANALYTICS_DISTINCT_ID_LENGTH) {
    return null;
  }

  return normalized;
}

export function normalizeAnalyticsSessionId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_ANALYTICS_SESSION_ID_LENGTH) {
    return null;
  }

  return normalized;
}

export function normalizeAnalyticsCurrentUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_ANALYTICS_URL_LENGTH) {
    return null;
  }

  if (!URL.canParse(normalized)) {
    return null;
  }

  return normalized;
}

export function isSensitiveAnalyticsPath(pathname: string): boolean {
  return SENSITIVE_ANALYTICS_PATHS.includes(pathname);
}
