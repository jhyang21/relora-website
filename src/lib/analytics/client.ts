"use client";

import posthog from "posthog-js";
import {
  type ClientAnalyticsEvent,
  type AnalyticsPayload,
  buildBrowserAnalyticsProperties,
  getAnalyticsEnabled,
  isSensitiveAnalyticsPath,
  normalizeAnalyticsDistinctId,
  sanitizeAnalyticsPayload,
} from "@/lib/analytics/shared";

function isAnalyticsReady(): boolean {
  return getAnalyticsEnabled() && posthog.__loaded;
}

function registerBrowserAnalyticsProperties(): void {
  posthog.register(buildBrowserAnalyticsProperties());
}

export function onPostHogLoaded(): void {
  if (typeof window === "undefined" || !getAnalyticsEnabled()) {
    return;
  }

  registerBrowserAnalyticsProperties();
  syncRouteAnalytics(window.location.pathname || "/");
}

export function syncRouteAnalytics(pathname: string): void {
  if (!isAnalyticsReady()) {
    return;
  }

  const isSensitivePath = isSensitiveAnalyticsPath(pathname);

  registerBrowserAnalyticsProperties();
  posthog.set_config({
    autocapture: !isSensitivePath,
    disable_session_recording: isSensitivePath,
  });

  if (isSensitivePath) {
    posthog.stopSessionRecording();
    return;
  }

  posthog.startSessionRecording();
}

export function trackAnalyticsEvent(
  event: ClientAnalyticsEvent,
  payload?: AnalyticsPayload,
): void {
  if (!isAnalyticsReady()) {
    return;
  }

  posthog.capture(event, sanitizeAnalyticsPayload(payload));
}

export function getAnalyticsDistinctId(): string | null {
  if (!isAnalyticsReady()) {
    return null;
  }

  return normalizeAnalyticsDistinctId(posthog.get_distinct_id());
}
