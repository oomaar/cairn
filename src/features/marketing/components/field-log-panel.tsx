"use client";

import { useMemo, useState } from "react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LogKind } from "@/universe";

export interface FieldLogEntry {
  id: string;
  time: string;
  kind: LogKind;
  title: string;
  detail: string;
  authorInitials: string;
}

export interface FieldLogSnapshot {
  expeditionName: string;
  day: number;
  entries: FieldLogEntry[];
}

const KIND_LABEL: Record<LogKind, string> = {
  movement: "Move",
  checkin: "Check-in",
  incident: "Incident",
  weather: "Weather",
  comms: "Comms",
  note: "Note",
};

/** Kind colors keyed to the Record world's notebook palette (legible on paper). */
const KIND_COLOR: Record<LogKind, string> = {
  movement: "text-fg-3",
  checkin: "text-[var(--record-olive)]",
  incident: "text-[var(--record-oxblood)]",
  weather: "text-[var(--record-blue)]",
  comms: "text-[var(--record-brown)]",
  note: "text-fg-3",
};

/** Canonical filter order; only kinds present in the log are shown. */
const KIND_ORDER: LogKind[] = [
  "movement",
  "checkin",
  "weather",
  "incident",
  "comms",
  "note",
];

type Filter = LogKind | "all";

/** Interactive daybook: filter the field record by entry kind. */
export function FieldLogPanel({ snapshot }: { snapshot: FieldLogSnapshot }) {
  const [filter, setFilter] = useState<Filter>("all");

  const presentKinds = useMemo(
    () => KIND_ORDER.filter((k) => snapshot.entries.some((e) => e.kind === k)),
    [snapshot.entries],
  );
  const filters: Filter[] = ["all", ...presentKinds];

  const entries =
    filter === "all"
      ? snapshot.entries
      : snapshot.entries.filter((e) => e.kind === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Text variant="body-sm" as="p" className="font-medium">
          {snapshot.expeditionName}
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          Daybook · Day {snapshot.day} · {entries.length} entries
        </Text>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className={cn(
                "rounded-pill border px-3 py-1 font-mono text-3xs uppercase tracking-[0.06em] transition-colors",
                on
                  ? "border-accent-line bg-accent-tint text-accent-bright"
                  : "border-border text-fg-3 hover:text-fg-2",
              )}
            >
              {f === "all" ? "All" : KIND_LABEL[f]}
            </button>
          );
        })}
      </div>

      {/* Ruled daybook */}
      <ul className="max-h-80 overflow-y-auto border-l-2 border-(--record-margin) pl-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex gap-3 border-b border-(--record-rule-faint) py-2.5 last:border-0"
          >
            <Text
              variant="caption"
              as="span"
              tone="tertiary"
              className="w-12 flex-none font-mono"
            >
              {entry.time}
            </Text>
            <div className="min-w-0 flex-1">
              <Text
                variant="caption"
                as="span"
                className={cn(
                  "font-mono text-3xs uppercase tracking-[0.08em]",
                  KIND_COLOR[entry.kind],
                )}
              >
                {KIND_LABEL[entry.kind]}
              </Text>
              <Text variant="body-sm" as="p" className="text-fg-1">
                {entry.title}
              </Text>
              {entry.detail && (
                <Text
                  variant="caption"
                  as="p"
                  tone="tertiary"
                  className="mt-0.5"
                >
                  {entry.detail}
                </Text>
              )}
            </div>
            <Text
              variant="caption"
              as="span"
              tone="tertiary"
              className="flex-none font-mono"
            >
              {entry.authorInitials}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
