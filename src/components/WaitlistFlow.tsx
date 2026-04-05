"use client";

import type { FormEvent, JSX } from "react";
import { useEffect, useState } from "react";
import {
  getAnalyticsDistinctId,
  trackAnalyticsEvent,
} from "@/lib/analytics/client";
import {
  commitmentOptions,
  emotionalHookOptions,
  featureSignalOptions,
  identityOptions,
} from "@/lib/waitlistOptions";
import { siteConfig } from "@/lib/site";

type WaitlistFlowProps = {
  compact?: boolean;
};

type SubmitState = "idle" | "submitting" | "success" | "error";
type SuccessCode = "created" | "updated";
type WaitlistSubmitResponse = {
  code?: SuccessCode;
  message?: string;
};

const TOTAL_STEPS = 6;
const OTHER_IDENTITY_OPTION = "Other";
const MAX_IDENTITY_OTHER_LENGTH = 120;
const shareIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(
  `I just joined the Relora waitlist for better personal relationship memory, developed by @andrewyang_X. Join the waitlist with me at ${siteConfig.url}`,
)}`;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getProgress(step: number, submitState: SubmitState): number {
  if (submitState === "success") {
    return 100;
  }

  return Math.round((step / TOTAL_STEPS) * 100);
}

async function readWaitlistSubmitResponse(
  response: Response,
): Promise<WaitlistSubmitResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as { code?: string; message?: string };

      return {
        code:
          payload.code === "created" || payload.code === "updated"
            ? payload.code
            : undefined,
        message: payload.message,
      };
    }

    return {
      message: (await response.text()).trim() || undefined,
    };
  } catch {
    return {};
  }
}

export function WaitlistFlow({
  compact = false,
}: WaitlistFlowProps): JSX.Element {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [identity, setIdentity] = useState("");
  const [identityOther, setIdentityOther] = useState("");
  const [emotionalHook, setEmotionalHook] = useState("");
  const [goldInsight, setGoldInsight] = useState("");
  const [featureSignals, setFeatureSignals] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [successCode, setSuccessCode] = useState<SuccessCode>("created");
  const [errorMessage, setErrorMessage] = useState("");
  const [company, setCompany] = useState("");

  const progress = getProgress(step, submitState);
  const featureSignalCount = featureSignals.length;
  const isOtherIdentity = identity === OTHER_IDENTITY_OPTION;

  useEffect(() => {
    trackAnalyticsEvent("waitlist_step_viewed", { step });
  }, [step]);

  async function submitWaitlist(selectedCommitment: string): Promise<void> {
    setSubmitState("submitting");
    setErrorMessage("");

    const analyticsDistinctId = getAnalyticsDistinctId();

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyticsDistinctId,
          commitment: selectedCommitment,
          company,
          email,
          emotionalHook,
          featureSignal: featureSignals,
          goldInsight,
          identity,
          identityOther: isOtherIdentity ? identityOther.trim() : "",
        }),
      });

      const { code, message } = await readWaitlistSubmitResponse(response);

      if (!response.ok) {
        throw new Error(message ?? "Could not submit your waitlist request.");
      }

      setSuccessCode(code ?? "created");
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Submission failed.");
    }
  }

  function handleEmailContinue(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setErrorMessage("");
    trackAnalyticsEvent("waitlist_step_completed", { step: 1 });
    setStep(2);
  }

  function handleGoldInsightContinue(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!goldInsight.trim()) {
      setErrorMessage("Please share one detail you forgot recently.");
      return;
    }

    setErrorMessage("");
    trackAnalyticsEvent("waitlist_step_completed", { step: 4 });
    setStep(5);
  }

  function handleIdentitySelect(option: string): void {
    setIdentity(option);
    if (option !== OTHER_IDENTITY_OPTION) {
      setIdentityOther("");
    }

    setErrorMessage("");
  }

  function handleIdentityContinue(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!identity) {
      setErrorMessage("Please choose what best describes you.");
      return;
    }

    if (isOtherIdentity && !identityOther.trim()) {
      setErrorMessage("Please share what best describes you.");
      return;
    }

    setErrorMessage("");
    trackAnalyticsEvent("waitlist_step_completed", {
      step: 2,
      identity,
    });
    setStep(3);
  }

  function toggleFeatureSignal(option: string): void {
    setErrorMessage("");
    setFeatureSignals((previous) => {
      if (previous.includes(option)) {
        return previous.filter((item) => item !== option);
      }

      if (previous.length >= 2) {
        return previous;
      }

      return [...previous, option];
    });
  }

  async function handleCommitmentSelect(option: string): Promise<void> {
    if (submitState === "submitting") {
      return;
    }

    trackAnalyticsEvent("waitlist_submit_started", {
      step: 6,
      commitment: option,
      feature_signal_count: featureSignalCount,
      identity,
    });
    await submitWaitlist(option);
  }

  if (submitState === "success") {
    return (
      <div className="paper-card card-fold max-w-2xl min-w-0 p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          saved note
        </p>
        <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
          {successCode === "updated" ? "You are already on the list." : "You are on the list."}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {successCode === "updated"
            ? "We found your existing signup and updated your responses."
            : "Thanks for sharing this with us. Your answers help shape Relora."}
        </p>
        <a
          href={shareIntentUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-secondary)] underline-offset-4 hover:underline"
        >
          Share with a friend
        </a>
      </div>
    );
  }

  return (
    <div className="paper-card max-w-2xl min-w-0 p-4 md:p-5">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          <span>
            Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border-warm)]/60">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="hidden ph-ignore-input"
        aria-hidden="true"
      />

      {step === 1 ? (
        <form onSubmit={handleEmailContinue} className="space-y-3">
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            Enter your email to get early access.
          </h3>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="email"
              required
              name="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="ph-ignore-input w-full rounded-full border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)]"
            >
              Continue
            </button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={handleIdentityContinue}>
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            What best describes you?
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3" role="radiogroup" aria-label="Identity options">
            {identityOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={identity === option}
                onClick={() => handleIdentitySelect(option)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                  identity === option
                    ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-ink)]"
                    : "border-[var(--color-border-warm)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-secondary)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {isOtherIdentity ? (
            <div className="mt-4 space-y-2">
              <label
                className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]"
                htmlFor="identity-other"
              >
                Tell us your role
              </label>
              <input
                id="identity-other"
                type="text"
                autoFocus
                value={identityOther}
                maxLength={MAX_IDENTITY_OTHER_LENGTH}
                onChange={(event) => {
                  setIdentityOther(event.target.value);
                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                placeholder="e.g. Student, Creator, Consultant"
                className="ph-ignore-input w-full rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
              />
              <p className="text-xs text-[var(--color-muted)]">
                {identityOther.length}/{MAX_IDENTITY_OTHER_LENGTH}
              </p>
            </div>
          ) : null}

          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)]"
            >
              Continue
            </button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <section>
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            Be honest, how often do you forget small details about people?
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {emotionalHookOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setEmotionalHook(option);
                  trackAnalyticsEvent("waitlist_step_completed", { step: 3 });
                  setStep(4);
                }}
                className="rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-4 text-left text-sm font-medium text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:border-[var(--color-secondary)]"
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <form onSubmit={handleGoldInsightContinue} className="space-y-3">
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            What&apos;s one detail you forgot recently that you wish you had remembered?
          </h3>
          <textarea
            name="goldInsight"
            rows={compact ? 3 : 4}
            value={goldInsight}
            onChange={(event) => setGoldInsight(event.target.value)}
            placeholder="Example: I forgot they were on vacation when I gave them a call."
            className="ph-ignore-input w-full rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)]"
          >
            Continue
          </button>
        </form>
      ) : null}

      {step === 5 ? (
        <section>
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            What would make this valuable for you? (Pick up to 2)
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {featureSignalOptions.map((option) => {
              const selected = featureSignals.includes(option);
              const disableOption = !selected && featureSignalCount >= 2;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleFeatureSignal(option)}
                  disabled={disableOption}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                    selected
                      ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-ink)]"
                      : "border-[var(--color-border-warm)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-secondary)]"
                  } ${disableOption ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-muted)]">{featureSignalCount}/2 selected</p>
            <button
              type="button"
              onClick={() => {
                trackAnalyticsEvent("waitlist_step_completed", {
                  step: 5,
                  feature_signal_count: featureSignalCount,
                });
                setStep(6);
              }}
              disabled={featureSignalCount === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-80"
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 6 ? (
        <section>
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">Want early beta access?</h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {commitmentOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => void handleCommitmentSelect(option)}
                disabled={submitState === "submitting"}
                className="rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-4 text-left text-sm font-medium text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:border-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {option}
              </button>
            ))}
          </div>
          {submitState === "submitting" ? (
            <p className="mt-3 text-sm text-[var(--color-muted)]">Saving...</p>
          ) : null}
        </section>
      ) : null}

      {submitState === "error" ? (
        <p className="mt-3 text-sm text-[var(--color-primary-hover)]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
