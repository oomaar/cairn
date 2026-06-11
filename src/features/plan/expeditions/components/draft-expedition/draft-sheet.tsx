import { getPerson } from "@/universe";
import type { ExpeditionDraft } from "../../utils/expedition-drafts";
import { SheetThumb } from "../sheet-thumb";
import { Avatar, Text } from "@/components/ui";
import { avatarTone } from "../../utils/avatarTone";
import { capitalize } from "@/utils/capitalize";

interface DraftSheetProps {
  draft: ExpeditionDraft;
  index: number;
  onOpen: () => void;
}

export function DraftSheet({ draft, index, onOpen }: DraftSheetProps) {
  const leader = draft.leaderId ? getPerson(draft.leaderId) : undefined;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-lg border border-accent-line bg-surface text-left transition-colors hover:border-accent"
    >
      <div className="relative h-24 border-b border-border-soft">
        <SheetThumb seed={index + 1} />
        <span className="absolute left-2.5 top-2 font-mono text-3xs uppercase tracking-[0.08em] text-fg-3">
          Sheet {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-2.5 top-2 rounded-pill bg-accent-tint px-2 py-0.5 font-mono text-3xs uppercase tracking-[0.06em] text-accent-bright">
          Draft
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <Text as="h3" variant="title" className="truncate text-base">
          {draft.name}
        </Text>
        <Text variant="caption" as="p" tone="tertiary">
          {draft.region}, {draft.country}
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
            {draft.gearCount} kit
          </Text>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-soft pt-2.5 font-mono text-2xs text-fg-3">
          <span>{draft.distanceKm} km</span>
          <span>▲{draft.gainM.toLocaleString()}</span>
          <span>{draft.dayTotal}d</span>
          <span className="capitalize text-accent-bright">
            {capitalize(draft.grade)}
          </span>
        </div>
      </div>
    </button>
  );
}
