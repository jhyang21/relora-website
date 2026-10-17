import type { Metadata } from "next";
import type { JSX } from "react";
import { Card } from "@/components/Card";
import { HomeInteractiveSections } from "@/components/HomeInteractiveSections";
import { MemoryCardStack } from "@/components/MemoryCardStack";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";
import { StickyAppStoreBar } from "@/components/StickyAppStoreBar";
import { appStoreLink, buildPageMetadata } from "@/lib/site";

const howItWorks = [
  {
    title: "Capture",
    body: "Record a quick voice note after any client interaction — a call, a coffee, or a chance run-in.",
  },
  {
    title: "Organize",
    body: "Relora turns it into clean memories, tags, and reminders tied to contacts.",
  },
  {
    title: "Surface",
    body: "Open their name before you call and see what they told you last time.",
  },
];

const useCases = [
  "Real estate agents and brokers",
  "Financial advisors",
  "Sales teams and founders",
  "Lawyers and legal professionals",
];

export const metadata: Metadata = buildPageMetadata();

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <SiteNav current="home" />
      <main className="mx-auto w-full max-w-6xl px-6 pb-28 md:px-10 md:pb-20">
        <section className="grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:py-16">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
              Now on the App Store
            </p>
            <h1 className="mt-4 max-w-full font-serif text-4xl leading-[1.05] text-[var(--color-ink)] sm:max-w-[14ch] sm:text-5xl md:text-6xl">
              Remember the details that win client relationships.
            </h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-8 text-[var(--color-muted)]">
              Talk for 30 seconds after a call. Relora saves the note, the key facts, and the follow-up on that contact.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SmoothScrollLink
                href={appStoreLink("site_hero")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center transition hover:opacity-85"
                analyticsEvent="hero_cta_clicked"
                analyticsProperties={{ cta_id: "hero_app_store" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Apple's official badge SVG, shown unmodified. */}
                <img
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={132}
                  height={44}
                  className="block h-11 w-auto md:h-12"
                />
              </SmoothScrollLink>
              <SmoothScrollLink
                href="#demo"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-primary-tint)]"
                analyticsEvent="hero_cta_clicked"
                analyticsProperties={{ cta_id: "hero_see_demo" }}
              >
                See it in action
              </SmoothScrollLink>
            </div>
            <div className="mt-4 space-y-1 text-sm text-[var(--color-muted)]">
              <p>Free for 7 days, then $19.99 a month. iPhone, iOS 17 or later.</p>
              <p>Voice notes are sent to OpenAI for transcription and note extraction. OpenAI does not use them to train its models.</p>
            </div>
          </div>
          <MemoryCardStack />
        </section>
        <div id="hero-end" aria-hidden="true" />

        <section id="how-it-works" className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <Card
              key={item.title}
              className={
                index === 1
                  ? "md:-translate-y-3 bg-[var(--color-primary-tint)] border-[var(--color-primary)] shadow-[0_14px_34px_rgba(16,20,24,0.10)]"
                  : ""
              }
              fold={index === 1}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                Step {index + 1}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{item.body}</p>
            </Card>
          ))}
        </section>

        <section id="demo" className="mt-20 scroll-mt-6">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Interactive demo</p>
            <h2 id="demo-heading" className="mt-2 font-serif text-3xl text-[var(--color-ink)]">
              Hear a 15-second note. See what Relora saves.
            </h2>
          </div>
        </section>

        <HomeInteractiveSections useCases={useCases} />

        <footer className="mt-20 border-t border-[var(--color-border-warm)] py-8 text-sm text-[var(--color-muted)]">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-1">
              <p>Built by Andrew Yang in Orange County. I read every email.</p>
              <p className="break-words">Contact: andrew@immform.com</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex min-h-11 items-center hover:text-[var(--color-ink)]" href="https://www.linkedin.com/in/junhyeok-andrew-yang/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="inline-flex min-h-11 items-center hover:text-[var(--color-ink)]" href="/privacy">
                Privacy
              </a>
              <a className="inline-flex min-h-11 items-center hover:text-[var(--color-ink)]" href="/terms">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </main>
      <StickyAppStoreBar />
    </div>
  );
}
