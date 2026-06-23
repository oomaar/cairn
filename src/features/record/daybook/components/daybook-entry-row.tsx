import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { EXPEDITION_COLORS } from "../data/EXPEDITION_COLORS";
import { DaybookLogStamp } from "./daybook-log-stamp";
import type { EnrichedLogEntry } from "../types/daybook.types";

interface DaybookEntryRowProps {
  entry: EnrichedLogEntry;
}

export function DaybookEntryRow({ entry }: DaybookEntryRowProps) {
  const color = EXPEDITION_COLORS[entry.colorIndex % EXPEDITION_COLORS.length]!;

  return (
    <div className="flex items-start gap-3 px-5 py-2.5 transition-colors hover:bg-raised">
      {/* Time */}
      <Text
        variant="caption"
        tone="tertiary"
        className="w-14 flex-none pt-0.5 font-mono text-2xs tabular-nums"
      >
        {entry.time}
      </Text>

      {/* Expedition color bar */}
      <div
        className={cn(
          "mt-1 w-0.5 self-stretch flex-none rounded-full",
          color.bar,
        )}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Text className="block truncate text-sm font-semibold leading-snug">
          {entry.title}
        </Text>
        {entry.detail && (
          <Text
            variant="caption"
            tone="tertiary"
            className="mt-0.5 line-clamp-2 font-mono text-2xs leading-snug"
          >
            {entry.detail}
          </Text>
        )}
        <Text
          variant="caption"
          tone="tertiary"
          className={cn("mt-1 font-mono text-2xs", color.text)}
        >
          {entry.expeditionName}
        </Text>
      </div>

      {/* Author badge */}
      {entry.authorInitials ? (
        <div
          className={cn(
            "flex size-6 flex-none items-center justify-center rounded-full text-2xs font-bold",
            color.bg,
            color.text,
          )}
        >
          {entry.authorInitials}
        </div>
      ) : (
        <div className="size-6 flex-none" />
      )}

      {/* Log stamp */}
      <DaybookLogStamp kind={entry.kind} />
    </div>
  );
}
