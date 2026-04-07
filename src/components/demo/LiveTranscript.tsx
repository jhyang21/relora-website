"use client";

import type { CSSProperties, JSX } from "react";
import { useMemo } from "react";
import { motion } from "motion/react";
import type { DemoPhase } from "@/components/demo/demoTypes";

type LiveTranscriptProps = {
  transcript: string;
  transcriptHighlights: string[];
  scenarioLabel: string;
  phase: DemoPhase;
  recordingElapsedMs: number;
  recordingMs: number;
  highlightsReady: boolean;
  showSoundToggle: boolean;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isExiting: boolean;
};

type TranscriptWord = {
  id: string;
  text: string;
  revealAtMs: number;
};

type TranscriptSegment = {
  id: string;
  text: string;
  isHighlighted: boolean;
  highlightOrder: number | null;
};

const HIGHLIGHT_STAGGER_MS = 220;

function getWordWeight(word: string): number {
  const punctuationWeight = /[,.!?]$/.test(word) ? 2 : 1;
  let shortWordWeight = 1;
  if (word.length <= 3) {
    shortWordWeight = 0.7;
  } else if (word.length >= 8) {
    shortWordWeight = 1.2;
  }

  return punctuationWeight * shortWordWeight;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeHighlight(value: string): string {
  return value.trim().toLowerCase();
}

function buildTranscriptWords(
  transcript: string,
  totalMs: number,
): TranscriptWord[] {
  const words = transcript
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const totalWeight = words.reduce((sum, word) => sum + getWordWeight(word), 0);
  let elapsed = 0;

  return words.map((word, index) => {
    elapsed += (getWordWeight(word) / totalWeight) * totalMs;
    return {
      id: `${index}-${word.replace(/[^\w]/g, "") || "word"}`,
      text: word,
      revealAtMs: Math.round(elapsed),
    };
  });
}

function buildTranscriptSegments(
  transcript: string,
  transcriptHighlights: string[],
): TranscriptSegment[] {
  if (transcriptHighlights.length === 0) {
    return [
      {
        id: "segment-0",
        text: transcript,
        isHighlighted: false,
        highlightOrder: null,
      },
    ];
  }

  const sortedHighlights = [...transcriptHighlights].sort((left, right) => right.length - left.length);
  const highlightPattern = new RegExp(`(${sortedHighlights.map((item) => escapeRegex(item)).join("|")})`, "gi");
  const highlightSet = new Set(sortedHighlights.map(normalizeHighlight));
  const parts = transcript.split(highlightPattern).filter(Boolean);
  let highlightOrder = 0;

  return parts.map((part, index) => {
    const isHighlighted = highlightSet.has(normalizeHighlight(part));

    if (!isHighlighted) {
      return {
        id: `segment-${index}`,
        text: part,
        isHighlighted: false,
        highlightOrder: null,
      };
    }

    const segment = {
      id: `segment-${index}`,
      text: part,
      isHighlighted: true,
      highlightOrder,
    };
    highlightOrder += 1;
    return segment;
  });
}

function getVisibleWords(
  phase: LiveTranscriptProps["phase"],
  transcriptWords: TranscriptWord[],
  recordingElapsedMs: number,
): TranscriptWord[] {
  if (phase === "idle") {
    return [];
  }

  if (phase === "recording") {
    return transcriptWords.filter((word) => word.revealAtMs <= recordingElapsedMs);
  }

  return transcriptWords;
}

function shouldShowTranscriptHighlights(
  phase: DemoPhase,
  highlightsReady: boolean,
): boolean {
  return phase !== "idle" && highlightsReady;
}

function getTranscriptTokenClassName(isHighlighted: boolean): string {
  if (isHighlighted) {
    return "demo-highlight-sweep demo-transcript-token";
  }

  return "demo-transcript-token";
}

function getSoundToggleClassName(isSoundEnabled: boolean): string {
  if (isSoundEnabled) {
    return "min-h-11 rounded-full border border-[var(--color-secondary)] bg-[var(--color-secondary-tint)] px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-secondary)] transition hover:border-[var(--color-secondary)]/80 hover:bg-[var(--color-secondary-tint)]/80";
  }

  return "min-h-11 rounded-full border border-[var(--color-border-warm)] bg-[var(--color-surface)] px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-ink)]";
}

function renderTranscriptBody(
  visibleWords: TranscriptWord[],
  transcriptSegments: TranscriptSegment[],
  phase: DemoPhase,
  showHighlights: boolean,
): JSX.Element {
  if (visibleWords.length === 0) {
    return (
      <p className="break-words text-[var(--color-muted)]">
        Pick a scenario to watch the sample note appear word by word.
      </p>
    );
  }

  if (showHighlights) {
    return (
      <>
        {transcriptSegments.map((segment) => {
          if (!segment.isHighlighted) {
            return (
              <span key={segment.id} className={getTranscriptTokenClassName(false)}>
                {segment.text}
              </span>
            );
          }

          return (
            <span
              key={segment.id}
              className={getTranscriptTokenClassName(true)}
              style={
                {
                  "--highlight-delay": `${(segment.highlightOrder ?? 0) * HIGHLIGHT_STAGGER_MS}ms`,
                } as CSSProperties
              }
            >
              {segment.text}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <>
      {visibleWords.map((word) => (
        <motion.span
          key={word.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="demo-transcript-token inline-block whitespace-pre"
        >
          {`${word.text} `}
        </motion.span>
      ))}
      {phase === "recording" ? (
        <motion.span
          className="inline-block text-[var(--color-primary)]"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          |
        </motion.span>
      ) : null}
    </>
  );
}

export function LiveTranscript({
  transcript,
  transcriptHighlights,
  scenarioLabel,
  phase,
  recordingElapsedMs,
  recordingMs,
  highlightsReady,
  showSoundToggle,
  isSoundEnabled,
  onToggleSound,
  isExiting,
}: LiveTranscriptProps): JSX.Element {
  const transcriptWords = useMemo(
    () => buildTranscriptWords(transcript, recordingMs),
    [recordingMs, transcript],
  );
  const transcriptSegments = useMemo(
    () => buildTranscriptSegments(transcript, transcriptHighlights),
    [transcript, transcriptHighlights],
  );
  const showHighlights = shouldShowTranscriptHighlights(phase, highlightsReady);

  const visibleWords = useMemo(
    () => getVisibleWords(phase, transcriptWords, recordingElapsedMs),
    [phase, recordingElapsedMs, transcriptWords],
  );

  return (
    <motion.div
      animate={isExiting ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="paper-card flex h-full min-w-0 flex-col border-l-4 border-l-[var(--color-secondary)] p-5"
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Live transcript</p>
          <p className="mt-1 break-words text-sm font-medium text-[var(--color-ink)]">{scenarioLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {showSoundToggle ? (
            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={isSoundEnabled}
              className={getSoundToggleClassName(isSoundEnabled)}
            >
              {isSoundEnabled ? "Sound on" : "Sound off"}
            </button>
          ) : null}
          {showHighlights ? (
            <span className="rounded-full bg-[var(--color-secondary-tint)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-secondary)]">
              Captured
            </span>
          ) : null}
        </div>
      </div>

      <div
        className="min-h-[5.25rem] min-w-0 flex-1 break-words pr-2 text-sm leading-7 text-[var(--color-ink)] md:min-h-[7rem]"
        aria-live="polite"
      >
        {renderTranscriptBody(visibleWords, transcriptSegments, phase, showHighlights)}
      </div>
    </motion.div>
  );
}
