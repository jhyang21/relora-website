"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { DemoPhase, VisibleCards } from "@/components/demo/demoTypes";
import { DemoScenarioPicker } from "@/components/demo/DemoScenarioPicker";
import { DemoTimeline } from "@/components/demo/DemoTimeline";
import { ExtractionCards } from "@/components/demo/ExtractionCards";
import { LiveTranscript } from "@/components/demo/LiveTranscript";
import { VoiceOrb } from "@/components/demo/VoiceOrb";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { demoAudioLevels } from "@/lib/demoAudioLevels";
import { getOrCreateDemoSessionId } from "@/lib/demoSession";
import {
  demoScenarioMap,
  demoScenarios,
  type DemoScenario,
  type DemoScenarioSlug,
} from "@/lib/demoScenarios";

type InteractiveDemoProps = {
  onJoinWaitlist: () => void;
};

type DemoEngagementPatch = {
  scenario?: DemoScenarioSlug;
  demoCompleted?: boolean;
  replayed?: boolean;
  ctaClicked?: string;
};

type ScenarioAudioMap = Partial<Record<DemoScenarioSlug, HTMLAudioElement>>;

type ScenarioTimeline = {
  recordingDurationMs: number;
  cardsBaseTimeMs: number;
  memoryRevealDelayMs: number;
  keyThingsRevealDelayMs: number;
  reminderRevealDelayMs: number;
};

const FALLBACK_SCENARIO_SLUG: DemoScenarioSlug = "real-estate";
const RECORDING_TICK_MS = 90;
const KEY_THING_STEP_DELAY_MS = 420;
const SOUND_ENABLED_STORAGE_KEY = "relora-demo-sound-enabled";

const DEFAULT_VISIBLE_CARDS: VisibleCards = {
  subject: false,
  memory: false,
  keyThings: 0,
  reminder: false,
};

const CARD_REVEAL_START_STATE: VisibleCards = {
  subject: true,
  memory: false,
  keyThings: 0,
  reminder: false,
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFullVisibleCards(scenario: DemoScenario): VisibleCards {
  return {
    subject: true,
    memory: true,
    keyThings: scenario.keyThings.length,
    reminder: true,
  };
}

function getEffectiveReducedMotionPreference(reduceMotion: boolean | null): boolean {
  if (typeof reduceMotion === "boolean") {
    return reduceMotion;
  }

  return prefersReducedMotion();
}

function isPlaybackPhase(phase: DemoPhase): boolean {
  return phase === "recording" || phase === "processing" || phase === "cards";
}

function isScenarioPickerDisabled(
  phase: DemoPhase,
  highlightsReady: boolean,
): boolean {
  if (phase === "complete" && !highlightsReady) {
    return true;
  }

  return isPlaybackPhase(phase);
}

function getRecordingDurationMs(scenario: DemoScenario): number {
  return scenario.audio.durationMs;
}

function getStoredSoundEnabled(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const storedValue = window.sessionStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
  if (storedValue === "false") {
    return false;
  }

  return true;
}

function storeSoundEnabled(value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(value));
}

function createScenarioAudioElement(
  scenario: DemoScenario,
  isSoundEnabled: boolean,
): HTMLAudioElement {
  const audioElement = new Audio(scenario.audio.src);
  audioElement.preload = "auto";
  audioElement.muted = !isSoundEnabled;
  audioElement.load();
  return audioElement;
}

function createScenarioAudioMap(
  scenarios: DemoScenario[],
  isSoundEnabled: boolean,
): ScenarioAudioMap {
  const audioMap: ScenarioAudioMap = {};

  for (const scenario of scenarios) {
    audioMap[scenario.slug] = createScenarioAudioElement(scenario, isSoundEnabled);
  }

  return audioMap;
}

function stopAudioElement(audioElement: HTMLAudioElement | null): void {
  if (!audioElement) {
    return;
  }

  audioElement.pause();
  audioElement.currentTime = 0;
}

function stopScenarioAudioMap(audioMap: ScenarioAudioMap): void {
  Object.values(audioMap).forEach((audioElement) => {
    stopAudioElement(audioElement ?? null);
  });
}

function syncScenarioAudioMuteState(
  audioMap: ScenarioAudioMap,
  isSoundEnabled: boolean,
): void {
  Object.values(audioMap).forEach((audioElement) => {
    if (!audioElement) {
      return;
    }

    audioElement.muted = !isSoundEnabled;
  });
}

function getOrCreateScenarioAudio(
  audioMap: ScenarioAudioMap,
  scenario: DemoScenario,
  isSoundEnabled: boolean,
): HTMLAudioElement {
  const existingAudio = audioMap[scenario.slug];
  if (existingAudio) {
    return existingAudio;
  }

  const audioElement = createScenarioAudioElement(scenario, isSoundEnabled);
  audioMap[scenario.slug] = audioElement;
  return audioElement;
}

function prepareScenarioAudioPlayback(
  audioElement: HTMLAudioElement,
  isSoundEnabled: boolean,
): void {
  audioElement.currentTime = 0;
  audioElement.muted = !isSoundEnabled;
}

function getScenarioTimeline(scenario: DemoScenario): ScenarioTimeline {
  const recordingDurationMs = getRecordingDurationMs(scenario);

  return {
    recordingDurationMs,
    cardsBaseTimeMs: recordingDurationMs + scenario.durations.processingMs,
    memoryRevealDelayMs: Math.round(scenario.durations.cardsMs * 0.18),
    keyThingsRevealDelayMs: Math.round(scenario.durations.cardsMs * 0.3),
    reminderRevealDelayMs: Math.round(scenario.durations.cardsMs * 0.74),
  };
}

function hasScenarioCompleted(
  completedScenarioSlugs: Set<DemoScenarioSlug>,
  slug: DemoScenarioSlug,
): boolean {
  return completedScenarioSlugs.has(slug);
}

function markScenarioCompleted(
  completedScenarioSlugs: Set<DemoScenarioSlug>,
  slug: DemoScenarioSlug,
): void {
  completedScenarioSlugs.add(slug);
}

export function InteractiveDemo({
  onJoinWaitlist,
}: InteractiveDemoProps): JSX.Element {
  const reduceMotion = useReducedMotion();
  const demoRootRef = useRef<HTMLDivElement | null>(null);
  const phaseTimeoutsRef = useRef<number[]>([]);
  const sessionIdRef = useRef("");
  const completedScenarioSlugsRef = useRef<Set<DemoScenarioSlug>>(new Set());
  const audioMapRef = useRef<ScenarioAudioMap>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [selectedSlug, setSelectedSlug] = useState<DemoScenarioSlug | null>(null);
  const [recordingElapsedMs, setRecordingElapsedMs] = useState(0);
  const [visibleCards, setVisibleCards] = useState<VisibleCards>(DEFAULT_VISIBLE_CARDS);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [highlightsReady, setHighlightsReady] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(getStoredSoundEnabled);
  const [isExiting, setIsExiting] = useState(false);

  const fallbackScenario = demoScenarioMap[FALLBACK_SCENARIO_SLUG];
  const selectedScenario = selectedSlug ? demoScenarioMap[selectedSlug] : null;
  const displayScenario = selectedScenario ?? fallbackScenario;
  const audioLevels = demoAudioLevels[displayScenario.slug];
  const recordingMs = getRecordingDurationMs(displayScenario);
  const isPickerDisabled = isScenarioPickerDisabled(phase, highlightsReady);

  const clearPhaseTimers = useCallback(function clearPhaseTimers(): void {
    phaseTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    phaseTimeoutsRef.current = [];
  }, []);

  const stopCurrentAudio = useCallback(function stopCurrentAudio(): void {
    stopAudioElement(currentAudioRef.current);
    currentAudioRef.current = null;
  }, []);

  const showCompletedScenario = useCallback(
    function showCompletedScenario(scenario: DemoScenario): void {
      clearPhaseTimers();
      stopCurrentAudio();
      setSelectedSlug(scenario.slug);
      setPhase("complete");
      setRecordingElapsedMs(getRecordingDurationMs(scenario));
      setVisibleCards(getFullVisibleCards(scenario));
      setReminderEnabled(true);
      setHighlightsReady(true);
      setIsExiting(false);
    },
    [clearPhaseTimers, stopCurrentAudio],
  );

  const postEngagement = useCallback(function postEngagement(
    patch: DemoEngagementPatch,
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    const sessionId = sessionIdRef.current || getOrCreateDemoSessionId();
    sessionIdRef.current = sessionId;

    void fetch("/api/demo-engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        ...patch,
      }),
    }).catch(() => undefined);
  }, []);

  const trackDemoReplay = useCallback(
    function trackDemoReplay(slug: DemoScenarioSlug): void {
      trackAnalyticsEvent("demo_replayed", { scenario: slug });
      postEngagement({ replayed: true });
    },
    [postEngagement],
  );

  const trackDemoCompletion = useCallback(
    function trackDemoCompletion(slug: DemoScenarioSlug): void {
      trackAnalyticsEvent("demo_completed", { scenario: slug });
      postEngagement({ demoCompleted: true });
    },
    [postEngagement],
  );

  useEffect(() => {
    sessionIdRef.current = getOrCreateDemoSessionId();
    const initialSoundEnabled = getStoredSoundEnabled();
    const audioMap = createScenarioAudioMap(demoScenarios, initialSoundEnabled);

    audioMapRef.current = audioMap;

    return () => {
      stopScenarioAudioMap(audioMap);
      currentAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    storeSoundEnabled(isSoundEnabled);
    syncScenarioAudioMuteState(audioMapRef.current, isSoundEnabled);
  }, [isSoundEnabled]);

  useEffect(() => {
    if (!selectedScenario || phase !== "recording") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRecordingElapsedMs((current) => {
        const nextValue = current + RECORDING_TICK_MS;
        return Math.min(nextValue, getRecordingDurationMs(selectedScenario));
      });
    }, RECORDING_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [phase, selectedScenario]);

  useEffect(() => {
    return () => {
      clearPhaseTimers();
      stopCurrentAudio();
    };
  }, [clearPhaseTimers, stopCurrentAudio]);

  const getScenarioAudio = useCallback(
    function getScenarioAudio(scenario: DemoScenario): HTMLAudioElement {
      return getOrCreateScenarioAudio(audioMapRef.current, scenario, isSoundEnabled);
    },
    [isSoundEnabled],
  );

  const playScenarioAudio = useCallback(
    function playScenarioAudio(scenario: DemoScenario): void {
      stopCurrentAudio();

      const audioElement = getScenarioAudio(scenario);
      prepareScenarioAudioPlayback(audioElement, isSoundEnabled);
      currentAudioRef.current = audioElement;

      const playback = audioElement.play();
      if (playback instanceof Promise) {
        void playback.catch(() => undefined);
      }
    },
    [getScenarioAudio, isSoundEnabled, stopCurrentAudio],
  );

  const startScenario = useCallback(
    function startScenario(slug: DemoScenarioSlug): void {
      const scenario = demoScenarioMap[slug];
      const timeline = getScenarioTimeline(scenario);
      const reducedMotionEnabled = getEffectiveReducedMotionPreference(reduceMotion);
      const hasReplayHistory = completedScenarioSlugsRef.current.size > 0;

      clearPhaseTimers();
      stopCurrentAudio();
      playScenarioAudio(scenario);
      setSelectedSlug(slug);
      setRecordingElapsedMs(0);
      setReminderEnabled(true);
      setHighlightsReady(false);
      setIsExiting(false);

      if (reducedMotionEnabled) {
        setPhase("complete");
        setVisibleCards(getFullVisibleCards(scenario));
      } else {
        setPhase("recording");
        setVisibleCards(DEFAULT_VISIBLE_CARDS);
      }

      trackAnalyticsEvent("demo_scenario_started", { scenario: slug });

      if (hasReplayHistory) {
        trackDemoReplay(slug);
      } else {
        postEngagement({ scenario: slug });
      }

      if (reducedMotionEnabled) {
        markScenarioCompleted(completedScenarioSlugsRef.current, slug);
        trackDemoCompletion(slug);

        const highlightTimeoutId = window.setTimeout(() => {
          setHighlightsReady(true);
        }, timeline.recordingDurationMs);

        phaseTimeoutsRef.current = [highlightTimeoutId];
        return;
      }

      const recordingTimeoutId = window.setTimeout(() => {
        setRecordingElapsedMs(timeline.recordingDurationMs);
        setHighlightsReady(true);
        setPhase("processing");
      }, timeline.recordingDurationMs);

      const processingTimeoutId = window.setTimeout(() => {
        setPhase("cards");
        setVisibleCards(CARD_REVEAL_START_STATE);
      }, timeline.cardsBaseTimeMs);

      const memoryTimeoutId = window.setTimeout(() => {
        setVisibleCards((current) => ({ ...current, memory: true }));
      }, timeline.cardsBaseTimeMs + timeline.memoryRevealDelayMs);

      const keyThingTimeoutIds = scenario.keyThings.map((_, index) =>
        window.setTimeout(() => {
          setVisibleCards((current) => ({
            ...current,
            keyThings: Math.max(current.keyThings, index + 1),
          }));
        }, timeline.cardsBaseTimeMs + timeline.keyThingsRevealDelayMs + index * KEY_THING_STEP_DELAY_MS),
      );

      const reminderTimeoutId = window.setTimeout(() => {
        setVisibleCards((current) => ({ ...current, reminder: true }));
      }, timeline.cardsBaseTimeMs + timeline.reminderRevealDelayMs);

      const completeTimeoutId = window.setTimeout(() => {
        setPhase("complete");
        markScenarioCompleted(completedScenarioSlugsRef.current, slug);
        trackDemoCompletion(slug);
      }, timeline.cardsBaseTimeMs + scenario.durations.cardsMs);

      phaseTimeoutsRef.current = [
        recordingTimeoutId,
        processingTimeoutId,
        memoryTimeoutId,
        reminderTimeoutId,
        completeTimeoutId,
        ...keyThingTimeoutIds,
      ];
    },
    [
      clearPhaseTimers,
      playScenarioAudio,
      postEngagement,
      reduceMotion,
      stopCurrentAudio,
      trackDemoCompletion,
      trackDemoReplay,
    ],
  );

  const handleJoinWaitlist = useCallback(function handleJoinWaitlist(): void {
    stopCurrentAudio();
    trackAnalyticsEvent("demo_cta_clicked", {
      cta_id: "waitlist-scroll",
      scenario: selectedSlug ?? FALLBACK_SCENARIO_SLUG,
    });
    postEngagement({ ctaClicked: "waitlist-scroll" });
    onJoinWaitlist();
  }, [onJoinWaitlist, postEngagement, selectedSlug, stopCurrentAudio]);

  const handleReminderToggle = useCallback(function handleReminderToggle(): void {
    setReminderEnabled((current) => !current);
  }, []);

  const handleSoundToggle = useCallback(function handleSoundToggle(): void {
    setIsSoundEnabled((current) => !current);
  }, []);

  const handleScenarioSelect = useCallback(
    function handleScenarioSelect(slug: DemoScenarioSlug): void {
      if (isPickerDisabled) {
        return;
      }

      if (hasScenarioCompleted(completedScenarioSlugsRef.current, slug)) {
        trackDemoReplay(slug);
        showCompletedScenario(demoScenarioMap[slug]);
        return;
      }

      startScenario(slug);
    },
    [isPickerDisabled, showCompletedScenario, startScenario, trackDemoReplay],
  );

  return (
    <div ref={demoRootRef} className="min-w-0 space-y-6" aria-labelledby="demo-heading">
      <DemoScenarioPicker
        scenarios={demoScenarios}
        selectedSlug={selectedSlug}
        isBusy={isPickerDisabled}
        onSelect={handleScenarioSelect}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex h-full min-w-0 flex-col gap-5">
          <VoiceOrb
            phase={phase}
            audioLevels={audioLevels}
            recordingElapsedMs={recordingElapsedMs}
            recordingMs={recordingMs}
          />
          <DemoTimeline phase={phase} />
          <LiveTranscript
            transcript={selectedScenario?.transcript ?? ""}
            transcriptHighlights={selectedScenario?.transcriptHighlights ?? []}
            scenarioLabel={selectedScenario?.label ?? "Choose a scenario"}
            phase={phase}
            recordingElapsedMs={recordingElapsedMs}
            recordingMs={recordingMs}
            highlightsReady={highlightsReady}
            isSoundEnabled={isSoundEnabled}
            onToggleSound={handleSoundToggle}
            isExiting={isExiting}
          />
        </div>

        <div className="min-w-0">
          <ExtractionCards
            scenario={displayScenario}
            phase={phase}
            visibleCards={visibleCards}
            isExiting={isExiting}
            reminderEnabled={reminderEnabled}
            onReminderToggle={handleReminderToggle}
          />
        </div>
      </div>

      {phase === "complete" ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleJoinWaitlist}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)]"
          >
            Join the waitlist
          </button>
        </div>
      ) : null}
    </div>
  );
}
