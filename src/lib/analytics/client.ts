"use client";

import posthog, { type PostHogInterface } from "posthog-js";
import {
  type ClientAnalyticsEvent,
  type AnalyticsPayload,
  buildBrowserAnalyticsProperties,
  getAnalyticsEnabled,
  isSensitiveAnalyticsPath,
  normalizeAnalyticsDistinctId,
  sanitizeAnalyticsPayload,
} from "@/lib/analytics/shared";

export type BrowserAnalyticsClient = PostHogInterface;

declare global {
  interface Window {
    __reloraPostHogClient?: BrowserAnalyticsClient;
  }
}

function getSharedAnalyticsClient(): BrowserAnalyticsClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.__reloraPostHogClient ?? null;
}

export function setSharedAnalyticsClient(client: BrowserAnalyticsClient): void {
  if (typeof window === "undefined") {
    return;
  }

  window.__reloraPostHogClient = client;
}

function getAnalyticsClient(): BrowserAnalyticsClient | null {
  if (!getAnalyticsEnabled()) {
    return null;
  }

  const sharedClient = getSharedAnalyticsClient();
  if (sharedClient?.__loaded) {
    return sharedClient;
  }

  if (posthog.__loaded) {
    setSharedAnalyticsClient(posthog);
    return posthog;
  }

  return null;
}

function registerBrowserAnalyticsProperties(client: BrowserAnalyticsClient): void {
  client.register(buildBrowserAnalyticsProperties());
}

export function onPostHogLoaded(client?: BrowserAnalyticsClient): void {
  if (typeof window === "undefined" || !getAnalyticsEnabled()) {
    return;
  }

  if (client) {
    setSharedAnalyticsClient(client);
  }

  const analyticsClient = getAnalyticsClient();
  if (!analyticsClient) {
    return;
  }

  registerBrowserAnalyticsProperties(analyticsClient);
  syncRouteAnalytics(window.location.pathname || "/");
}

export function syncRouteAnalytics(pathname: string): void {
  const analyticsClient = getAnalyticsClient();
  if (!analyticsClient) {
    return;
  }

  const isSensitivePath = isSensitiveAnalyticsPath(pathname);

  registerBrowserAnalyticsProperties(analyticsClient);
  analyticsClient.set_config({
    autocapture: !isSensitivePath,
    disable_session_recording: isSensitivePath,
  });

  if (isSensitivePath) {
    analyticsClient.stopSessionRecording();
    return;
  }

  analyticsClient.startSessionRecording();
}

export function trackAnalyticsEvent(
  event: ClientAnalyticsEvent,
  payload?: AnalyticsPayload,
): void {
  const analyticsClient = getAnalyticsClient();
  if (!analyticsClient) {
    return;
  }

  analyticsClient.capture(event, sanitizeAnalyticsPayload(payload));
}

export function getAnalyticsDistinctId(): string | null {
  const analyticsClient = getAnalyticsClient();
  if (!analyticsClient) {
    return null;
  }

  return normalizeAnalyticsDistinctId(analyticsClient.get_distinct_id());
}
