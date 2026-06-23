"use client";

import { Text } from "@/components/ui";
import { aggregateLogs } from "../utils/aggregateLogs";
import { DaybookEntryList } from "./daybook-entry-list";
import { DaybookRegister } from "./daybook-register";

export function DaybookWorkspace() {
  const entries = aggregateLogs();

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-none items-center justify-between border-b border-border px-5 py-4">
        <div>
          <Text variant="title" className="text-lg">
            Expedition Daybook
          </Text>
          <Text variant="caption" tone="tertiary" className="mt-0.5 font-mono">
            {entries.length} entries · {today}
          </Text>
        </div>
        <Text
          variant="caption"
          tone="tertiary"
          className="font-mono text-2xs uppercase tracking-widest"
        >
          The Record
        </Text>
      </div>

      {/* Body: entry list + register sidebar */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_300px]">
        {/* Left: scrollable log entries */}
        <div className="flex min-h-0 flex-col overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
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
