"use client";

import type { JSX } from "react";
import { motion } from "motion/react";
import type { DemoScenario, DemoScenarioSlug } from "@/lib/demoScenarios";

type DemoScenarioPickerProps = {
  scenarios: DemoScenario[];
  selectedSlug: DemoScenarioSlug | null;
  isBusy: boolean;
  onSelect: (slug: DemoScenarioSlug) => void;
};

function getPickerAnimation(
  index: number,
  isSelected: boolean,
): { y: number | number[] } {
  if (isSelected) {
    return { y: -2 };
  }

  if (index === 1) {
    return { y: [0, -3, 0] };
  }

  return { y: [0, -2, 0] };
}

function getPickerTransition(
  index: number,
  isSelected: boolean,
): {
  duration: number;
  ease: "easeInOut";
  repeat?: number;
} {
  if (isSelected) {
    return { duration: 0.18, ease: "easeInOut" };
  }

  return {
    duration: 3.2 + index * 0.3,
    repeat: Infinity,
    ease: "easeInOut",
  };
}

function getPickerClassName(isSelected: boolean, isBusy: boolean): string {
  const baseClassName =
    "paper-card min-h-11 w-full min-w-0 rounded-[var(--radius-card)] p-4 text-left transition-[transform,box-shadow,border-color,background-color,opacity] duration-200 ease-out";
  const selectedClassName =
    "border-[var(--color-primary)] bg-[var(--color-primary-tint)] shadow-[0_18px_36px_rgba(16,20,24,0.12)]";
  const idleClassName =
    "border-[var(--color-border-warm)] bg-[var(--color-surface)] shadow-[0_10px_22px_rgba(16,20,24,0.05)]";
  const hoverClassName =
    "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-tint)]/30 hover:shadow-[0_18px_36px_rgba(16,20,24,0.10)]";

  let stateClassName = idleClassName;
  if (isSelected) {
    stateClassName = selectedClassName;
  } else if (!isBusy) {
    stateClassName = `${idleClassName} ${hoverClassName}`;
  }

  const interactionClassName = isBusy
    ? "cursor-not-allowed opacity-75"
    : "cursor-pointer active:scale-[0.985]";

  return `${baseClassName} ${stateClassName} ${interactionClassName}`;
}

export function DemoScenarioPicker({
  scenarios,
  selectedSlug,
  isBusy,
  onSelect,
}: DemoScenarioPickerProps): JSX.Element {
  return (
    <div className="min-w-0">
      <p className="mb-4 text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Pick a scenario</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {scenarios.map((scenario, index) => {
          const isSelected = selectedSlug === scenario.slug;

          return (
            <motion.button
              key={scenario.slug}
              type="button"
              aria-pressed={isSelected}
              whileHover={isBusy ? undefined : { y: -4, scale: 1.01 }}
              whileTap={isBusy ? undefined : { y: -1, scale: 0.985 }}
              animate={getPickerAnimation(index, isSelected)}
              transition={getPickerTransition(index, isSelected)}
              disabled={isBusy}
              onClick={() => onSelect(scenario.slug)}
              className={getPickerClassName(isSelected, isBusy)}
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">{scenario.label}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
