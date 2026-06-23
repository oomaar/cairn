import { cn } from "@/lib/cn";
import { EXPEDITION_COLORS } from "../data/EXPEDITION_COLORS";
import { DaybookLogStamp } from "./daybook-log-stamp";
import type { EnrichedLogEntry } from "../types/daybook.types";

interface DaybookEntryRowProps {
  entry: EnrichedLogEntry;
  rowIndex: number;
}

export function DaybookEntryRow({ entry, rowIndex }: DaybookEntryRowProps) {
  const color = EXPEDITION_COLORS[entry.colorIndex % EXPEDITION_COLORS.length]!;
  const isIncident = entry.kind === "incident";
  const bodyText = entry.detail ?? entry.title;
  const rotate = rowIndex % 2 ? "-rotate-2" : "rotate-3";

  return (
    <div className="flex items-start gap-4 pl-19 pr-5 py-2.75 transition-colors hover:bg-raised/50">
      {/* Time — uses expedition color for incidents, ink for all others */}
      <div
        className={cn(
          "w-11.5 flex-none pt-px font-mono text-[13px] font-semibold tabular-nums",
          isIncident ? color.text : "text-fg-1",
        )}
      >
        {entry.time}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-sm leading-[1.4] text-fg-1">{bodyText}</div>
        <div className="mt-0.75 font-mono text-[10.5px] text-fg-3">
          {entry.expeditionName.toUpperCase()}
          {entry.authorShortName ? ` · ${entry.authorShortName}` : ""}
        </div>
      </div>

      {/* Stamp */}
      <div className="flex-none pt-0.5">
        <DaybookLogStamp kind={entry.kind} colorIndex={entry.colorIndex} rotate={rotate} />
      </div>
    </div>
  );
}
