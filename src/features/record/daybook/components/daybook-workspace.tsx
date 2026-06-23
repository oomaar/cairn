"use client";

import { Text } from "@/components/ui";
import { getOperator } from "@/universe";
import { aggregateLogs } from "../utils/aggregateLogs";
import { DaybookEntryList } from "./daybook-entry-list";
import { DaybookRegister } from "./daybook-register";

export function DaybookWorkspace() {
  const entries = aggregateLogs();
  const operator = getOperator();

  const folioNum = 400 + entries.length;
  const dayLabel = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Masthead */}
      <div className="flex-none border-b-2 border-border px-6 py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Text
              variant="caption"
              tone="tertiary"
              className="block font-mono text-2xs uppercase tracking-widest"
            >
              {operator.name} · The Record
            </Text>
            <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight text-fg-1">
              Expedition Daybook
            </h1>
          </div>
          <div className="flex-none text-right">
            <Text
              variant="caption"
              tone="tertiary"
              className="block font-mono text-2xs uppercase tracking-wider"
            >
              Folio {folioNum} · {dayLabel}
            </Text>
            <Text
              variant="caption"
              tone="tertiary"
              className="mt-0.5 font-mono text-2xs"
            >
              {entries.length} entries
            </Text>
          </div>
        </div>
      </div>

      {/* Body: entry list + register sidebar */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_300px]">
        {/* Left: scrollable log entries */}
        <div className="flex min-h-0 flex-col overflow-hidden border-b border-border lg:border-b-0 lg:border-r bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
          <DaybookEntryList entries={entries} />
        </div>

        {/* Right: operations register */}
        <div className="min-h-0 overflow-hidden">
          <DaybookRegister />
        </div>
      </div>
    </div>
  );
}
