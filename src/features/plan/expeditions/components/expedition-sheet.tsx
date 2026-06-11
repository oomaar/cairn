import { cn } from "@/lib/cn";
import { getLeader, type Expedition } from "@/universe";
import { SheetThumb } from "./sheet-thumb";
import { STATUS_DOT } from "../data/STATUS_DOT";
import { Avatar, Text } from "@/components/ui";
import { avatarTone } from "../utils/avatarTone";
import { capitalize } from "@/utils/capitalize";

/** A chart-on-file thumbnail — concentric contours + a dashed plotted line. */
interface ExpeditionSheetProps {
  expedition: Expedition;
  index: number;
  focused: boolean;
  onOpen: () => void;
}

export function ExpeditionSheet({
  expedition,
  index,
  focused,
  onOpen,
}: ExpeditionSheetProps) {
  const leader = getLeader(expedition.id);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-colors",
        focused ? "border-accent" : "border-border hover:border-border-strong",
      )}
    >
      <div className="relative h-24 border-b border-border-soft">
        <SheetThumb seed={index + 1} />
        <span className="absolute left-2.5 top-2 font-mono text-3xs uppercase tracking-[0.08em] text-fg-3">
          Sheet {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-2.5 top-2 flex items-center gap-1.5 font-mono text-3xs uppercase tracking-[0.06em] text-fg-2">
          <span
            className={cn(
              "size-1.5 rounded-full",
              STATUS_DOT[expedition.statusTone],
            )}
          />
          {expedition.statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Text as="h3" variant="title" className="truncate text-base">
          {expedition.name}
        </Text>
        <Text variant="caption" as="p" tone="tertiary">
          {expedition.region}, {expedition.country}
        </Text>

        <div className="mt-2.5 flex items-center gap-2">
          <Avatar
            initials={leader?.initials ?? "—"}
            size="sm"
            tone={avatarTone(leader?.tone)}
          />
          <Text
            variant="caption"
            as="span"
            tone="secondary"
            className="truncate"
          >
            {leader?.name ?? "Unassigned"}
          </Text>
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="ml-auto whitespace-nowrap font-mono"
          >
            {expedition.filled}/{expedition.capacity}
          </Text>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-soft pt-2.5 font-mono text-2xs text-fg-3">
          <span>{expedition.distanceKm} km</span>
          <span>▲{expedition.gainM.toLocaleString()}</span>
          <span>{expedition.dayTotal}d</span>
          <span className="capitalize text-accent-bright">
            {capitalize(expedition.grade)}
          </span>
        </div>
      </div>
    </button>
  );
}
