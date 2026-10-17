"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/Card";

// Close to the demo's idle height so the page does not jump when it swaps in.
const DEMO_PLACEHOLDER_HEIGHT_CLASS = "min-h-[994px] md:min-h-[622px]";
const LOAD_ROOT_MARGIN = "600px 0px";

function LoadingCard(): JSX.Element {
  return (
    <Card className={`p-5 ${DEMO_PLACEHOLDER_HEIGHT_CLASS}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Loading demo</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        The demo loads as you scroll near it.
      </p>
    </Card>
  );
}

const LazyDemo = dynamic(
  () => import("@/components/demo/InteractiveDemo").then((module) => module.InteractiveDemo),
  {
    ssr: false,
    loading: LoadingCard,
  },
);

export function InteractiveDemoLoader(): JSX.Element {
  // Browsers without IntersectionObserver load the demo at once.
  const [load, setLoad] = useState(
    () => typeof window !== "undefined" && typeof window.IntersectionObserver === "undefined",
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (load) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setLoad(true);
        }
      },
      { rootMargin: LOAD_ROOT_MARGIN },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [load]);

  if (load) {
    return <LazyDemo />;
  }

  return (
    <div ref={sentinelRef}>
      <LoadingCard />
    </div>
  );
}
