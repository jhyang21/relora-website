import { PostHog } from "posthog-node";
import {
  type AnalyticsPayload,
  type ServerAnalyticsEvent,
  buildBaseAnalyticsProperties,
  getAnalyticsEnabled,
  getAnalyticsHost,
  getAnalyticsToken,
  sanitizeAnalyticsPayload,
} from "@/lib/analytics/shared";

let posthogClient: PostHog | null = null;

function buildServerAnalyticsProperties(
  siteHost: string | undefined,
  properties: AnalyticsPayload | undefined,
  sessionId: string | null | undefined,
  currentUrl: string | null | undefined,
): AnalyticsPayload {
  return {
    ...buildBaseAnalyticsProperties(siteHost),
    ...sanitizeAnalyticsPayload(properties),
    ...sanitizeAnalyticsPayload({
      $current_url: currentUrl ?? null,
      $session_id: sessionId ?? null,
    }),
  };
}

function getPostHogClient(): PostHog | null {
  if (!getAnalyticsEnabled()) {
    return null;
  }

  const token = getAnalyticsToken();
  if (!token) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      flushAt: 1,
      flushInterval: 0,
      host: getAnalyticsHost(),
    });
  }

  return posthogClient;
}

export function getRequestSiteHost(request: Request): string | undefined {
  return request.headers.get("x-forwarded-host")?.trim() || request.headers.get("host")?.trim() || undefined;
}

export async function captureServerAnalyticsEvent(params: {
  distinctId: string | null;
  event: ServerAnalyticsEvent;
  properties?: AnalyticsPayload;
  currentUrl?: string | null;
  sessionId?: string | null;
  siteHost?: string;
}): Promise<void> {
  if (!params.distinctId) {
    return;
  }

  const client = getPostHogClient();
  if (!client) {
    return;
  }

  await client.captureImmediate({
    distinctId: params.distinctId,
    event: params.event,
    properties: buildServerAnalyticsProperties(
      params.siteHost,
      params.properties,
      params.sessionId,
      params.currentUrl,
    ),
  });
}
