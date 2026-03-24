import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { DataRequestForm } from "@/components/DataRequestForm";

export const metadata: Metadata = {
  title: "Data Request — Relora",
  description:
    "Exercise your privacy rights. Request access to, correction of, deletion of, or opt-out from processing of your personal data.",
};

export default function RequestDataPage() {
  return (
    <div className="min-h-screen">
      <SiteNav current="home" />
      <main className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Request Your Data</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">We respond within 45 days.</p>
        <p className="mt-6 leading-7 text-[var(--color-ink)]">
          Under the California Consumer Privacy Act (CCPA), US state privacy laws, and Canadian
          privacy law (PIPEDA), you have the right to access, correct, delete, or opt out of the
          processing of your personal data. Submit your request below, or email us directly at{" "}
          <a
            href="mailto:contact@immform.com"
            className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
          >
            contact@immform.com
          </a>
          .
        </p>
        <DataRequestForm />
      </main>
    </div>
  );
}
