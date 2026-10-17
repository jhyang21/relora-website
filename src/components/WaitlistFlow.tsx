"use client";

import type { FormEvent, JSX } from "react";
import { useEffect, useState } from "react";
import {
  getAnalyticsDistinctId,
  trackAnalyticsEvent,
} from "@/lib/analytics/client";
import { identityOptions } from "@/lib/waitlistOptions";
import { siteConfig } from "@/lib/site";

type SubmitState = "idle" | "submitting" | "success";
type WaitlistPayload = {
  email: string;
  identity?: string;
  identityOther?: string;
};

const TOTAL_STEPS = 2;
const OTHER_IDENTITY_OPTION = "Other";
const MAX_IDENTITY_OTHER_LENGTH = 120;
const SAVE_FAILED_MESSAGE = "We could not save that. Please try again.";
const PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const shareIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(
  `Relora is on the App Store: ${siteConfig.appStoreUrl}`,
)}`;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function readErrorMessage(response: Response): Promise<string | undefined> {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as { message?: string };
      return payload.message;
    }

    return (await response.text()).trim() || undefined;
  } catch {
    return undefined;
  }
}

export function WaitlistFlow(): JSX.Element {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [identity, setIdentity] = useState("");
  const [identityOther, setIdentityOther] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [company, setCompany] = useState("");

  const isSubmitting = submitState === "submitting";
  const isOtherIdentity = identity === OTHER_IDENTITY_OPTION;

  useEffect(() => {
    trackAnalyticsEvent("waitlist_step_viewed", { step });
  }, [step]);

  // Returns true when the server saved the payload.
  async function submitWaitlist(payload: WaitlistPayload): Promise<boolean> {
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          analyticsDistinctId: getAnalyticsDistinctId(),
          company,
        }),
      });

      if (!response.ok) {
        throw new Error((await readErrorMessage(response)) ?? SAVE_FAILED_MESSAGE);
      }

      setSubmitState("idle");
      return true;
    } catch (error) {
      setSubmitState("idle");
      setErrorMessage(error instanceof Error ? error.message : SAVE_FAILED_MESSAGE);
      return false;
    }
  }

  async function handleEmailContinue(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    trackAnalyticsEvent("waitlist_submit_started", { step: 1 });
    if (await submitWaitlist({ email })) {
      trackAnalyticsEvent("waitlist_step_completed", { step: 1 });
      setStep(2);
    }
  }

  function handleIdentitySelect(option: string): void {
    setIdentity(option);
    if (option !== OTHER_IDENTITY_OPTION) {
      setIdentityOther("");
    }

    setErrorMessage("");
  }

  async function handleRoleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!identity) {
      setErrorMessage("Pick one, or tap Skip.");
      return;
    }

    if (isOtherIdentity && !identityOther.trim()) {
      setErrorMessage("Tell us your role, or tap Skip.");
      return;
    }

    trackAnalyticsEvent("waitlist_submit_started", { step: 2, identity });
    const saved = await submitWaitlist({
      email,
      identity,
      identityOther: isOtherIdentity ? identityOther.trim() : "",
    });
    if (saved) {
      trackAnalyticsEvent("waitlist_step_completed", { step: 2, identity });
      setSubmitState("success");
    }
  }

  function handleSkip(): void {
    trackAnalyticsEvent("waitlist_step_completed", { step: 2, skipped: true });
    setErrorMessage("");
    setSubmitState("success");
  }

  if (submitState === "success") {
    return (
      <div className="paper-card card-fold max-w-2xl min-w-0 p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          saved note
        </p>
        <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
          You are on the Android list.
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          We will email you when Relora comes to Android.
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
      <p className="mb-4 text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
        Step {step} of {TOTAL_STEPS}
      </p>

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
        <form onSubmit={(event) => void handleEmailContinue(event)} className="space-y-3">
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            Enter your email for the Android list.
          </h3>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label htmlFor="waitlist-email" className="sr-only">
              Email
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              name="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage("");
              }}
              className="ph-ignore-input w-full rounded-full border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={PRIMARY_BUTTON_CLASS}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={(event) => void handleRoleSave(event)}>
          <h3 className="font-serif text-2xl text-[var(--color-ink)]">
            What best describes you?
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Your email is saved. This question is optional.
          </p>
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
                  setErrorMessage("");
                }}
                placeholder="e.g. Student, Creator, Consultant"
                className="ph-ignore-input w-full rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
              />
              <p className="text-xs text-[var(--color-muted)]">
                {identityOther.length}/{MAX_IDENTITY_OTHER_LENGTH}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={PRIMARY_BUTTON_CLASS}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-[var(--color-secondary)] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </form>
      ) : null}

      {errorMessage ? (
        <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
