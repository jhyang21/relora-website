"use client";

import type { JSX } from "react";
import type { DemoPhase } from "@/components/demo/demoTypes";

type DemoTimelineProps = {
  phase: DemoPhase;
};

type TimelineStatus = "complete" | "active" | "upcoming";

const timelineSteps = ["Record", "Transcribe", "Extract", "Review"] as const;

function getStatuses(phase: DemoTimelineProps["phase"]): readonly TimelineStatus[] {
  switch (phase) {
    case "recording":
      return ["active", "upcoming", "upcoming", "upcoming"] as const;
    case "processing":
      return ["complete", "active", "upcoming", "upcoming"] as const;
    case "cards":
      return ["complete", "complete", "active", "upcoming"] as const;
    case "complete":
      return ["complete", "complete", "complete", "complete"] as const;
    case "resetting":
      return ["complete", "complete", "active", "upcoming"] as const;
    default:
      return ["upcoming", "upcoming", "upcoming", "upcoming"] as const;
  }
}

function getItemClassName(status: TimelineStatus): string {
  switch (status) {
    case "complete":
      return "rounded-2xl border px-3 py-3 text-sm transition border-[var(--color-secondary)] bg-[var(--color-secondary-tint)] text-[var(--color-ink)]";
    case "active":
      return "rounded-2xl border px-3 py-3 text-sm transition border-[var(--color-primary)] bg-[var(--color-primary-tint)] text-[var(--color-ink)]";
    default:
      return "rounded-2xl border px-3 py-3 text-sm transition border-[var(--color-border-warm)] bg-[var(--color-surface)] text-[var(--color-muted)]";
  }
}

function getBadgeClassName(status: TimelineStatus): string {
  switch (status) {
    case "complete":
      return "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-paper)]";
    case "active":
      return "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-paper)]";
    default:
      return "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold bg-[var(--color-border-warm)] text-[var(--color-muted)]";
  }
}

function getBadgeLabel(status: TimelineStatus, index: number): string {
  if (status === "complete") {
    return "\u2713";
  }

  return String(index + 1);
}

export function DemoTimeline({ phase }: DemoTimelineProps): JSX.Element {
  const statuses = getStatuses(phase);

  return (
    <ol className="flex flex-wrap gap-2">
      {timelineSteps.map((step, index) => {
        const status = statuses[index];

        return (
          <li key={step} className={`${getItemClassName(status)} shrink-0 w-max max-w-full`}>
            <span className="flex items-center gap-2">
              <span className={getBadgeClassName(status)}>{getBadgeLabel(status, index)}</span>
              <span className="font-medium">{step}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
