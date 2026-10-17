"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { appStoreLink } from "@/lib/site";

const HERO_END_ID = "hero-end";

export function StickyAppStoreBar(): JSX.Element | null {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(HERO_END_ID);
    if (!sentinel || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      // Show once the sentinel has scrolled above the viewport.
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!pastHero) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <a
        href={appStoreLink("site_sticky")}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackAnalyticsEvent("hero_cta_clicked", { cta_id: "sticky_app_store" })}
        className="flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:brightness-110"
      >
        Get Relora on the App Store
      </a>
    </div>
  );
}
