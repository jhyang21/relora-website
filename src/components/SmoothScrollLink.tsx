"use client";

import type { ComponentPropsWithoutRef, JSX, MouseEvent } from "react";
import {
  type AnalyticsPayload,
  type ClientAnalyticsEvent,
} from "@/lib/analytics/shared";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

type SmoothScrollLinkProps = ComponentPropsWithoutRef<"a"> & {
  analyticsEvent?: ClientAnalyticsEvent;
  analyticsProperties?: AnalyticsPayload;
  href: string;
};

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

function readUtmProperties(): AnalyticsPayload {
  const params = new URLSearchParams(window.location.search);
  const utm: AnalyticsPayload = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key] = value;
    }
  }
  return utm;
}

function syncLocationHash(rawHash: string): void {
  if (typeof history === "undefined" || typeof history.pushState !== "function") {
    return;
  }

  history.pushState(null, "", `#${rawHash}`);
}

export function SmoothScrollLink({
  href,
  onClick,
  analyticsEvent,
  analyticsProperties,
  ...props
}: SmoothScrollLinkProps): JSX.Element {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (analyticsEvent) {
      trackAnalyticsEvent(analyticsEvent, {
        ...analyticsProperties,
        ...readUtmProperties(),
      });
    }

    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      return;
    }

    const rawHash = href.slice(hashIndex + 1);
    if (!rawHash) {
      return;
    }

    const targetId = decodeURIComponent(rawHash);
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });

    syncLocationHash(rawHash);
  }

  return <a href={href} onClick={handleClick} {...props} />;
}
