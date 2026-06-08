import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLD_BY_KEY } from "@/features/theme";
import { getLogbook } from "@/universe";
import { PreviewFrame } from "./preview-frame";

/** Record preview — the daybook, woven from the expedition's field record. */
export function RecordPreview() {
  const entries = getLogbook("tdp").slice(0, 6);

  return (
    <PreviewFrame world={WORLD_BY_KEY.record} title="Record · Daybook">
      <ul className="flex flex-col">
        {entries.map((entry, i) => (
          <li
            key={entry.id}
            className={cn(
              "flex items-baseline gap-3 py-2",
              i > 0 && "border-t border-border-soft",
            )}
          >
            <Text
              variant="caption"
              as="span"
              tone="tertiary"
              className="w-12 flex-none font-mono"
            >
              {entry.time}
            </Text>
            <Text
              variant="caption"
              as="span"
              className={cn(
                "w-16 flex-none font-mono uppercase tracking-[0.06em]",
                entry.kind === "incident" ? "text-danger" : "text-fg-3",
              )}
            >
              {entry.kind}
            </Text>
            <Text
              variant="caption"
              as="span"
              className="min-w-0 flex-1 truncate text-fg-1"
            >
              {entry.title}
            </Text>
          </li>
        ))}
      </ul>
    </PreviewFrame>
  );
}
