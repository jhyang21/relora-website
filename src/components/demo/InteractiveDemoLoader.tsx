"use client";

import type { JSX } from "react";
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
  return <InteractiveDemo onJoinWaitlist={onJoinWaitlist} />;
}
