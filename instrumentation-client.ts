import posthog, { type PostHogInterface } from "posthog-js";
import {
  getAnalyticsEnabled,
  getAnalyticsHost,
  getAnalyticsToken,
  isSensitiveAnalyticsPath,
} from "@/lib/analytics/shared";
import {
  onPostHogLoaded,
  setSharedAnalyticsClient,
} from "@/lib/analytics/client";

function getInitialPathname(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

function handlePostHogLoaded(client: PostHogInterface): void {
  setSharedAnalyticsClient(client);
  onPostHogLoaded(client);
}

function initializePostHog(): void {
  if (typeof window === "undefined" || !getAnalyticsEnabled()) {
    return;
  }

  const token = getAnalyticsToken();
  if (!token) {
    return;
  }

  const pathname = getInitialPathname();
  const isSensitivePath = isSensitiveAnalyticsPath(pathname);

  posthog.init(token, {
    api_host: getAnalyticsHost(),
    autocapture: !isSensitivePath,
    capture_pageview: "history_change",
    defaults: "2026-01-30",
    disable_session_recording: isSensitivePath,
    disable_surveys: true,
    loaded: handlePostHogLoaded,
    mask_all_element_attributes: true,
    mask_all_text: true,
    person_profiles: "identified_only",
  });

  setSharedAnalyticsClient(posthog);
}

initializePostHog();
