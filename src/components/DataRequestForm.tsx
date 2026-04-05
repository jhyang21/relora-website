"use client";

import type { FormEvent, JSX } from "react";
import { useState } from "react";
import {
  getAnalyticsDistinctId,
  trackAnalyticsEvent,
} from "@/lib/analytics/client";

type SubmitState = "idle" | "submitting" | "success" | "error";

const REQUEST_TYPES = [
  { label: "Access my data", value: "access" },
  { label: "Correct my data", value: "correction" },
  { label: "Delete my data", value: "deletion" },
  { label: "Delete my account", value: "account_deletion" },
  { label: "Opt out of data processing", value: "opt_out" },
] as const;

const MAX_DETAILS_LENGTH = 500;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function readResponseMessage(response: Response): Promise<string | undefined> {
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

export function DataRequestForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [website, setWebsite] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  if (submitState === "success") {
    return (
      <div className="paper-card card-fold mt-8 max-w-2xl min-w-0 p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          request received
        </p>
        <h3 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
          We have received your request.
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          We will review your request and respond within 45 days. If you have
          questions in the meantime, email{" "}
          <a
            href="mailto:contact@immform.com"
            className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            contact@immform.com
          </a>
          .
        </p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!requestType) {
      setErrorMessage("Please select a request type.");
      return;
    }

    if (details.length > MAX_DETAILS_LENGTH) {
      setErrorMessage("Please keep your details under 500 characters.");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");
    trackAnalyticsEvent("data_request_submit_started", {
      request_type: requestType,
    });
    const analyticsDistinctId = getAnalyticsDistinctId();

    try {
      const response = await fetch("/api/request-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyticsDistinctId,
          details,
          email,
          name,
          requestType,
          website,
        }),
      });

      const payloadMessage = await readResponseMessage(response);

      if (!response.ok) {
        throw new Error(
          payloadMessage ??
            "Could not submit your request. Please email contact@immform.com.",
        );
      }

      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Submission failed.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ph-no-capture mt-8 min-w-0">
      <div className="paper-card max-w-2xl min-w-0 space-y-6 p-4 md:p-6">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden ph-ignore-input"
          aria-hidden="true"
        />

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="ph-ignore-input w-full rounded-full border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">
            Request type
          </p>
          <div
            className="grid grid-cols-1 gap-3"
            role="radiogroup"
            aria-label="Request type"
          >
            {REQUEST_TYPES.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={requestType === value}
                onClick={() => {
                  setRequestType(value);
                  setErrorMessage("");
                }}
                className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                  requestType === value
                    ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-ink)]"
                    : "border-[var(--color-border-warm)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-secondary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]"
          >
            Full name{" "}
            <span className="normal-case text-[var(--color-muted)]">
              (optional - helps verification)
            </span>
          </label>
          <input
            id="name"
            type="text"
            maxLength={120}
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="ph-ignore-input w-full rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="details"
            className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]"
          >
            Additional details{" "}
            <span className="normal-case text-[var(--color-muted)]">
              (optional)
            </span>
          </label>
          <textarea
            id="details"
            rows={4}
            maxLength={MAX_DETAILS_LENGTH}
            placeholder="e.g. I would like to correct my email address on file."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            className="ph-ignore-input w-full rounded-2xl border border-[var(--color-border-warm)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
          <p className="text-xs text-[var(--color-muted)]">
            {details.length}/{MAX_DETAILS_LENGTH}
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {submitState === "submitting" ? "Submitting..." : "Submit request"}
          </button>

          {errorMessage ? (
            <p
              className="mt-3 text-sm text-[var(--color-primary-hover)]"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
