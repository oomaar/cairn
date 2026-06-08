import { Avatar, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Expedition, Person } from "@/universe";
import { ContourBackdrop } from "./contour-backdrop";
import { TONE_DOT } from "../marketing.constants";

type AvatarTone = "amber" | "olive" | "slate" | "quiet";
const avatarTone = (tone?: Person["tone"]): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function progressLabel(e: Expedition): string {
  switch (e.status) {
    case "in-field":
      return `Day ${e.dayCurrent} of ${e.dayTotal}`;
    case "complete":
      return "Completed";
    default:
      return `Departs ${e.departLabel}`;
  }
}

/** Expedition teaser card — a chart-on-file tile (after the wireframe Plan
 *  expeditions index): contour thumbnail, status, crew, progress and the
 *  vital stats, drawn from the universe. Display only (a teaser). */
export function ExpeditionCard({
  expedition,
  leader,
  index,
}: {
  expedition: Expedition;
  leader: Person | undefined;
  index: number;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      {/* Contour thumbnail header */}
      <div className="relative h-20 overflow-hidden border-b border-border-soft bg-inset">
        <ContourBackdrop seed={index + 1} className="text-fg-4 opacity-40" />
        <span className="absolute left-3 top-2.5 font-mono text-3xs uppercase tracking-[0.08em] text-fg-3">
          Sheet {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-3 top-2.5 flex items-center gap-1.5 font-mono text-3xs uppercase tracking-[0.06em] text-fg-2">
          <span
            className={cn(
              "size-1.5 rounded-full",
              TONE_DOT[expedition.statusTone],
            )}
          />
          {expedition.statusLabel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <Text as="h3" variant="title" className="text-base">
          {expedition.name}
        </Text>
        <Text variant="caption" as="p" tone="tertiary">
          {expedition.region}, {expedition.country}
        </Text>

        <div className="mt-3 flex items-center gap-2">
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
            className="ml-auto whitespace-nowrap"
          >
            {expedition.filled}/{expedition.capacity}
          </Text>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-soft pt-3 font-mono text-2xs text-fg-3">
          <span>{expedition.distanceKm} km</span>
          <span>▲{expedition.gainM.toLocaleString()}</span>
          <span>{expedition.dayTotal}d</span>
          <span className="text-accent-bright">
            {capitalize(expedition.grade)}
          </span>
          <span className="ml-auto text-fg-2">{progressLabel(expedition)}</span>
        </div>
      </div>
    </article>
  );
}
