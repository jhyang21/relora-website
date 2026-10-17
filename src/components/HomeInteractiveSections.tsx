"use client";

import type { JSX } from "react";
import { Card } from "@/components/Card";
import { InteractiveDemoLoader } from "@/components/demo/InteractiveDemoLoader";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";
import { WaitlistFlow } from "@/components/WaitlistFlow";
import { appStoreLink } from "@/lib/site";

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
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Made for real estate agents. Useful for anyone who lives on follow-ups.</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((useCase) => (
            <Card key={useCase}>
              <p className="text-base font-medium text-[var(--color-ink)]">{useCase}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <SmoothScrollLink
            href={appStoreLink("site_usecases")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center transition hover:opacity-85"
            analyticsEvent="hero_cta_clicked"
            analyticsProperties={{ cta_id: "usecases_app_store" }}
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
