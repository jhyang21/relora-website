"use client";

import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { showUnderConstructionPages } from "@/lib/underConstruction";

type SiteNavProps = {
  current?: "home" | "about";
};

export function SiteNav({ current = "home" }: SiteNavProps): JSX.Element {
  const linkClass =
    "inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]";
  const showPages = showUnderConstructionPages();

  function handleNavClick(target: "home" | "about"): void {
    trackAnalyticsEvent("site_nav_clicked", {
      location: "header",
      target,
    });
  }

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center"
        aria-label="Relora home"
        onClick={() => handleNavClick("home")}
      >
        <Image src="/relora-wordmark.svg" alt="Relora" width={140} height={40} priority />
      </Link>
      {showPages ? (
        <nav className="flex flex-wrap items-center gap-3 sm:gap-6">
          <Link
            href="/about"
            className={`${linkClass} ${current === "about" ? "text-[var(--color-ink)]" : ""}`}
            onClick={() => handleNavClick("about")}
          >
            About Andrew
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
