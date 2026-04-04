"use client";

import type { JSX } from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/Card";
import type { DemoPhase, VisibleCards } from "@/components/demo/demoTypes";
import type { DemoScenario } from "@/lib/demoScenarios";

type ExtractionCardsProps = {
  scenario: DemoScenario;
  phase: DemoPhase;
  visibleCards: VisibleCards;
  isExiting: boolean;
  reminderEnabled: boolean;
  onReminderToggle: () => void;
};

type SkeletonCardProps = {
  lines?: number;
};

type KeyThingsCardProps = {
  scenario: DemoScenario;
  visibleCount: number;
};

function getKeyThingClassName(isSelected: boolean): string {
  if (isSelected) {
    return "min-h-11 max-w-full rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-tint)] px-4 py-2 text-left text-sm font-medium text-[var(--color-ink)] transition";
  }

  return "min-h-11 max-w-full rounded-full border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-2 text-left text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-primary)]";
}

function getReminderTrackClassName(reminderEnabled: boolean): string {
  if (reminderEnabled) {
    return "flex min-h-11 min-w-20 items-center rounded-full border border-[var(--color-secondary)] bg-[var(--color-secondary)] px-2 transition";
  }

  return "flex min-h-11 min-w-20 items-center rounded-full border border-[var(--color-border-warm)] bg-[var(--color-surface)] px-2 transition";
}

function getReminderThumbClassName(reminderEnabled: boolean): string {
  if (reminderEnabled) {
    return "h-7 w-7 rounded-full bg-[var(--color-paper)] transition-transform translate-x-9";
  }

  return "h-7 w-7 rounded-full bg-[var(--color-paper)] transition-transform translate-x-0";
}

function getPlaceholderCardCopy(
  phase: DemoPhase,
): {
  eyebrow: string;
  title: string;
  body: string;
} | null {
  if (phase === "idle") {
    return {
      eyebrow: "Extraction preview",
      title: "The structured notes land here",
      body:
        "Once the transcript finishes, Relora turns it into a subject card, a clean memory draft, key details, and a suggested follow-up reminder.",
    };
  }

  if (phase === "recording") {
    return {
      eyebrow: "Extraction pending",
      title: "Listening for signal",
      body:
        "The transcript is still arriving. As soon as the note is complete, the structured cards will materialize in this column.",
    };
  }

  return null;
}

function SkeletonCard({ lines = 3 }: SkeletonCardProps): JSX.Element {
  return (
    <div className="paper-card min-w-0 p-5">
      <div className="demo-shimmer h-4 w-24 rounded-full bg-[var(--color-border-warm)]/70" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`demo-shimmer h-3 rounded-full bg-[var(--color-border-warm)]/70 ${
              index === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function getFormattedTodayDate(): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function KeyThingsCard({
  scenario,
  visibleCount,
}: KeyThingsCardProps): JSX.Element {
  const [activeKeyThingId, setActiveKeyThingId] = useState<string | null>(null);

  function toggleKeyThing(keyThingId: string): void {
    setActiveKeyThingId((currentValue) => {
      if (currentValue === keyThingId) {
        return null;
      }

      return keyThingId;
    });
  }

  return (
    <Card>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Key things to remember</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {scenario.keyThings.slice(0, visibleCount).map((item, index) => {
            const isSelected = activeKeyThingId === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => toggleKeyThing(item.id)}
                aria-pressed={isSelected}
                className={getKeyThingClassName(isSelected)}
              >
                {item.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function ExtractionCards({
  scenario,
  phase,
  visibleCards,
  isExiting,
  reminderEnabled,
  onReminderToggle,
}: ExtractionCardsProps): JSX.Element {
  const placeholderCardCopy = getPlaceholderCardCopy(phase);
  const memoryDate = getFormattedTodayDate();

  if (placeholderCardCopy) {
    return (
      <Card className="min-w-0 p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">{placeholderCardCopy.eyebrow}</p>
        <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{placeholderCardCopy.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{placeholderCardCopy.body}</p>
      </Card>
    );
  }

  if (phase === "processing") {
    return (
      <div className="grid grid-cols-1 gap-4">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>
    );
  }

  return (
    <motion.div
      animate={isExiting ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="grid grid-cols-1 gap-4"
    >
      {visibleCards.subject ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <Card fold>
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-tint)] text-sm font-semibold text-[var(--color-secondary)]">
                {scenario.contact.initials}
              </div>
              <div className="min-w-0">
                <p className="break-words text-lg font-semibold text-[var(--color-ink)]">{scenario.contact.name}</p>
                <p className="break-words text-sm text-[var(--color-muted)]">{scenario.contact.title}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {visibleCards.memory ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <Card className="bg-[var(--color-primary-tint)]/45">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Memory</p>
            <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{memoryDate}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">{scenario.memory.context}</p>
          </Card>
        </motion.div>
      ) : null}

      {visibleCards.keyThings > 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <KeyThingsCard scenario={scenario} visibleCount={visibleCards.keyThings} />
        </motion.div>
      ) : null}

      {visibleCards.reminder ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <Card className="bg-[var(--color-secondary-tint)]/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Suggested reminder</p>
                <p className="mt-2 break-words text-base leading-7 text-[var(--color-ink)]">{scenario.reminder}</p>
              </div>
              <button
                type="button"
                onClick={onReminderToggle}
                className={getReminderTrackClassName(reminderEnabled)}
                aria-pressed={reminderEnabled}
                aria-label={reminderEnabled ? "Reminder enabled" : "Reminder disabled"}
              >
                <span className={getReminderThumbClassName(reminderEnabled)} />
              </button>
            </div>
          </Card>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
