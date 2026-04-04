"use client";

import type { JSX } from "react";
import { Card } from "@/components/Card";
import { InteractiveDemoLoader } from "@/components/demo/InteractiveDemoLoader";
import { WaitlistFlow } from "@/components/WaitlistFlow";

type HomeInteractiveSectionsProps = {
  useCases: string[];
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeInteractiveSections({
  useCases,
}: HomeInteractiveSectionsProps): JSX.Element {
  function scrollToWaitlist(): void {
    const waitlistSection = document.getElementById("waitlist");
    if (!waitlistSection) {
      return;
    }

    waitlistSection.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <div className="mt-10 min-w-0 md:mt-14">
        <InteractiveDemoLoader onJoinWaitlist={scrollToWaitlist} />
      </div>

      <section className="mt-24 md:mt-28">
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Built for everyday relationships</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((useCase) => (
            <Card key={useCase}>
              <p className="text-base font-medium text-[var(--color-ink)]">{useCase}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="waitlist" className="mt-24 min-w-0 scroll-mt-6 md:mt-28">
        <h2 className="mb-4 font-serif text-3xl text-[var(--color-ink)]">Join early users shaping Relora</h2>
        <WaitlistFlow />
      </section>
    </>
  );
}
