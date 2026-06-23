import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { DaybookEntryRow } from "./daybook-entry-row";
import type { EnrichedLogEntry } from "../types/daybook.types";

interface DaybookEntryListProps {
  entries: EnrichedLogEntry[];
}

export function DaybookEntryList({ entries }: DaybookEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Text variant="caption" tone="tertiary" className="font-mono text-2xs">
          No log entries — expeditions in-field will populate the daybook.
        </Text>
      </div>
    );
  }

  // Group by day
  const byDay = new Map<number, EnrichedLogEntry[]>();
  for (const entry of entries) {
    const group = byDay.get(entry.day) ?? [];
    group.push(entry);
    byDay.set(entry.day, group);
  }

  const days = Array.from(byDay.entries()).sort(([a], [b]) => a - b);
  const lastEntry = entries.at(-1);
  const lastTime = lastEntry?.time ?? "—";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {/* Margin rule */}
      <div className="pointer-events-none absolute inset-y-0 left-13.5 z-10 w-[1.5px] bg-(--record-margin) opacity-60" />

      <div className="h-full min-h-0 overflow-y-auto">
        {/* Log sub-header */}
        <div className="flex items-baseline gap-3 pl-19 pr-5 pb-3 pt-4">
          <span className="font-sans text-base font-bold tracking-tight text-fg-1">
            Day log — entries
          </span>
          <span className="font-mono text-[10.5px] text-fg-3">
            {entries.length} entries · last {lastTime}
          </span>
          <span className="ml-auto font-mono text-[10.5px] text-fg-3">
            TIME (GMT)
          </span>
        </div>

        {days.map(([day, dayEntries], dayIdx) => {
          const globalOffset = days
            .slice(0, dayIdx)
            .reduce((acc, [, e]) => acc + e.length, 0);
          return (
            <div key={day}>
              {/* Day annotation */}
              <div
                className={cn(
                  "flex items-center gap-3 pl-19 pr-5 py-2",
                  dayIdx > 0 && "mt-1 border-t-2 border-dashed border-border/60",
                )}
              >
                <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-(--record-margin) opacity-70">
                  Day {String(day).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-border/40" />
              </div>

              {/* Entries */}
              <div className="divide-y divide-border/40">
                {dayEntries.map((entry, entryIdx) => (
                  <DaybookEntryRow
                    key={entry.id}
                    entry={entry}
                    rowIndex={globalOffset + entryIdx}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
