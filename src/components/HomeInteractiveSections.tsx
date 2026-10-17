"use client";

import type { JSX } from "react";
import { Card } from "@/components/Card";
import { InteractiveDemoLoader } from "@/components/demo/InteractiveDemoLoader";
import { WaitlistFlow } from "@/components/WaitlistFlow";

type HomeInteractiveSectionsProps = {
  useCases: string[];
};

export function HomeInteractiveSections({
  useCases,
}: HomeInteractiveSectionsProps): JSX.Element {
  return (
    <>
      <div className="mt-10 min-w-0 md:mt-14">
        <InteractiveDemoLoader />
      </div>

      <section className="mt-24 md:mt-28">
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Built for work that runs on relationships</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((useCase) => (
            <Card key={useCase}>
              <p className="text-base font-medium text-[var(--color-ink)]">{useCase}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="waitlist" className="mt-24 min-w-0 scroll-mt-6 md:mt-28">
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Not on iPhone yet? Join the Android list</h2>
        <p className="mt-2 mb-4 text-base text-[var(--color-muted)]">
          Relora is iPhone-only today. Leave your email and you&apos;ll hear first when Android ships.
        </p>
        <WaitlistFlow />
      </section>
    </>
  );
}
