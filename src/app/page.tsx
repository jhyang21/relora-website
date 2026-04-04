import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { HomeInteractiveSections } from "@/components/HomeInteractiveSections";
import { MemoryCardStack } from "@/components/MemoryCardStack";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";

const howItWorks = [
  {
    title: "Capture",
    body: "Record a quick voice note after meeting or talking to someone.",
  },
  {
    title: "Organize",
    body: "Relora turns it into clean memories, tags, and reminders tied to contacts.",
  },
  {
    title: "Surface",
    body: "Get context before calls, meetings, or events so you are prepared.",
  },
];

const useCases = [
  "Real estate agents and brokers",
  "Lawyers and legal professionals",
  "Financial advisors",
  "Friends and family",
];

export const metadata: Metadata = {
  title: "Relora",
  description: "Remember the small details that build relationships.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteNav current="home" />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <section className="grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:py-16">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
              Relora waitlist
            </p>
            <h1 className="mt-4 max-w-full font-serif text-4xl leading-[1.05] text-[var(--color-ink)] sm:max-w-[14ch] sm:text-5xl md:text-6xl">
              Remember the small details that build relationships.
            </h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-8 text-[var(--color-muted)]">
              Relora turns quick voice notes into structured context tied to contacts, so you are ready for every conversation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SmoothScrollLink
                href="#waitlist"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)]"
              >
                Join the waitlist
              </SmoothScrollLink>
              <SmoothScrollLink
                href="#demo"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-primary-tint)]"
              >
                See it in action
              </SmoothScrollLink>
            </div>
          </div>
          <MemoryCardStack />
        </section>

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
              See a voice note become relationship-ready context
            </h2>
          </div>
        </section>

        <HomeInteractiveSections useCases={useCases} />

        <footer className="mt-20 border-t border-[var(--color-border-warm)] py-8 text-sm text-[var(--color-muted)]">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="break-words">Contact: andrew@immform.com</p>
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
    </div>
  );
}
