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

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {days.map(([day, dayEntries]) => (
        <div key={day}>
          {/* Day header */}
          <div className="sticky top-0 z-10 border-b border-border bg-surface px-5 py-2">
            <Text
              variant="caption"
              tone="tertiary"
              className="font-mono text-2xs uppercase tracking-widest"
            >
              Day {String(day).padStart(2, "0")}
            </Text>
          </div>

          {/* Entries for this day */}
          <div className="divide-y divide-border/50">
            {dayEntries.map((entry) => (
              <DaybookEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
