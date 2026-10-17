import type { JSX } from "react";
import { Card } from "@/components/Card";

const memoryItems = [
  "loved the open kitchen at Oak Avenue",
  "budget: $650K to $700K",
  "daughter Lily starts kindergarten this fall",
  "husband Mike works from home 3 days a week",
  "follow up: send two school-zone comps",
];

export function MemoryCardStack(): JSX.Element {
  return (
    <div className="grid min-w-0 gap-4 md:relative md:block md:min-h-[340px]">
      <Card className="w-full p-4 md:absolute md:left-4 md:top-5 md:w-[84%] md:rotate-[-3deg]" fold>
        <p className="text-sm text-[var(--color-muted)]">upcoming</p>
        <p className="mt-2 font-medium text-[var(--color-ink)]">Showing with Sarah, Saturday 11:00 AM</p>
      </Card>
      <Card className="w-full p-5 md:absolute md:right-0 md:top-14 md:w-[86%] md:rotate-[2deg]">
        <div className="mb-3 flex items-center gap-2">
          <div className="size-9 rounded-full bg-[var(--color-secondary-tint)]" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-ink)]">Sarah Chen</p>
            <p className="break-words text-xs text-[var(--color-muted)]">Buyer with a growing family</p>
          </div>
        </div>
        <ul className="space-y-2">
          {memoryItems.map((item) => (
            <li key={item} className="break-words rounded-xl bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]">
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
