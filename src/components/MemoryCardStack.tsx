import type { JSX } from "react";
import { Card } from "@/components/Card";

const memoryItems = [
  "met at community service event in Jan 2026",
  "was interested in buying a new house",
  "has 2 children: Zach (6) and Anna (3)",
  "loves to play board games, esp Catan",
  "follow up: next friday",
];

export function MemoryCardStack(): JSX.Element {
  return (
    <div className="grid min-w-0 gap-4 md:relative md:block md:min-h-[340px]">
      <Card className="w-full p-4 md:absolute md:left-4 md:top-5 md:w-[84%] md:rotate-[-3deg]" fold>
        <p className="text-sm text-[var(--color-muted)]">upcoming</p>
        <p className="mt-2 font-medium text-[var(--color-ink)]">Call with Maya tomorrow, 10:00 AM</p>
      </Card>
      <Card className="w-full p-5 md:absolute md:right-0 md:top-14 md:w-[86%] md:rotate-[2deg]">
        <div className="mb-3 flex items-center gap-2">
          <div className="size-9 rounded-full bg-[var(--color-secondary-tint)]" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-ink)]">Maya Smith</p>
            <p className="break-words text-xs text-[var(--color-muted)]">Doctor at Mayo Clinic, Volunteer at Local Food Bank</p>
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
