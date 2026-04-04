"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/Card";

type InteractiveDemoLoaderProps = {
  onJoinWaitlist: () => void;
};

function LoadingCard(): JSX.Element {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Loading demo</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        Pulling in the interactive simulation as the section comes into view.
      </p>
    </Card>
  );
}

function PlaceholderCard(): JSX.Element {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-secondary)]">Interactive demo</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        Scroll here and pick an example to start.
      </p>
    </Card>
  );
}

const InteractiveDemo = dynamic(
  () => import("@/components/demo/InteractiveDemo").then((module) => module.InteractiveDemo),
  {
    ssr: false,
    loading: LoadingCard,
  },
);

export function InteractiveDemoLoader({
  onJoinWaitlist,
}: InteractiveDemoLoaderProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const target = rootRef.current;
    if (!target || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "260px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={rootRef}>
      {shouldLoad ? (
        <InteractiveDemo onJoinWaitlist={onJoinWaitlist} />
      ) : (
        <PlaceholderCard />
      )}
    </div>
  );
}
