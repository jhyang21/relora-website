"use client";

import type { JSX } from "react";
import { motion } from "motion/react";
import type { DemoPhase } from "@/components/demo/demoTypes";

type VoiceOrbProps = {
  phase: DemoPhase;
  audioLevels: number[];
  recordingElapsedMs: number;
  recordingMs: number;
};

function getLevelIndex(
  phase: VoiceOrbProps["phase"],
  audioLevels: number[],
  recordingElapsedMs: number,
  recordingMs: number,
): number {
  if (phase !== "recording" || recordingMs <= 0) {
    return 0;
  }

  return Math.min(
    audioLevels.length - 1,
    Math.floor((recordingElapsedMs / recordingMs) * audioLevels.length),
  );
}

function getOrbSizeClassName(isActive: boolean): string {
  if (isActive) {
    return "h-24 w-24 md:h-36 md:w-36";
  }

  return "h-20 w-20 md:h-32 md:w-32";
}

function getOuterScale(phase: VoiceOrbProps["phase"], level: number): number {
  if (phase === "recording") {
    return 1 + level * 0.35;
  }

  if (phase === "processing") {
    return 1.08;
  }

  return 1;
}

function getSecondaryScale(phase: VoiceOrbProps["phase"], level: number): number {
  if (phase === "recording") {
    return 1 + level * 0.18;
  }

  return 1;
}

function getCoreScale(
  phase: VoiceOrbProps["phase"],
  level: number,
  isComplete: boolean,
): number {
  if (phase === "recording") {
    return 1 + level * 0.1;
  }

  if (phase === "processing") {
    return 1.05;
  }

  if (isComplete) {
    return 0.96;
  }

  return 1;
}

function getVoiceStatusLabel(phase: VoiceOrbProps["phase"]): string | null {
  switch (phase) {
    case "idle":
      return "Ready to simulate";
    case "recording":
      return "Listening";
    case "processing":
      return "Extracting details";
    default:
      return null;
  }
}

export function VoiceOrb({
  phase,
  audioLevels,
  recordingElapsedMs,
  recordingMs,
}: VoiceOrbProps): JSX.Element {
  const levelIndex = getLevelIndex(phase, audioLevels, recordingElapsedMs, recordingMs);
  const level = phase === "recording" ? audioLevels[levelIndex] ?? 0.2 : 0.22;
  const isActive = phase === "recording" || phase === "processing";
  const isComplete = phase === "cards" || phase === "complete";
  const statusLabel = getVoiceStatusLabel(phase);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative mx-auto flex items-center justify-center rounded-full transition-[width,height] duration-300 ${getOrbSizeClassName(isActive)}`}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--color-primary)]/35"
          animate={{
            scale: getOuterScale(phase, level),
            opacity: phase === "idle" ? 0.5 : 0.8,
          }}
          transition={{
            duration: phase === "recording" ? 0.45 : 1,
            repeat: phase === "recording" ? Infinity : 0,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-[10%] rounded-full border border-[var(--color-primary)]/20"
          animate={{
            scale: getSecondaryScale(phase, level),
            opacity: phase === "processing" ? 0.7 : 0.5,
          }}
          transition={{
            duration: phase === "recording" ? 0.4 : 0.8,
            repeat: phase === "recording" ? Infinity : 0,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-[20%] rounded-full bg-[var(--color-primary)] shadow-[0_18px_40px_rgba(240,90,59,0.25)]"
          animate={{
            scale: getCoreScale(phase, level, isComplete),
            rotate: phase === "processing" ? 360 : 0,
            boxShadow:
              phase === "recording"
                ? "0 18px 40px rgba(240,90,59,0.32)"
                : "0 14px 28px rgba(240,90,59,0.22)",
          }}
          transition={{
            rotate: {
              duration: 1.25,
              repeat: phase === "processing" ? Infinity : 0,
              ease: "linear",
            },
            default: {
              duration: 0.35,
              ease: "easeInOut",
            },
          }}
        />
      </div>
      {statusLabel ? (
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          {statusLabel}
        </p>
      ) : null}
    </div>
  );
}
