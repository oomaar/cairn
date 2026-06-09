"use client";

import { useState } from "react";
import { Avatar, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useNavigation } from "@/features/navigation";
import {
  getLeader,
  getPerson,
  listExpeditions,
  type Expedition,
  type Tone,
} from "@/universe";
import { contourRing } from "../route.utils";
import {
  useExpeditionDrafts,
  type ExpeditionDraft,
} from "../expedition-drafts";
import { ExpeditionDetail } from "./expedition-detail";
import { DraftDetail } from "./draft-detail";

const STATUS_DOT: Record<Tone, string> = {
  danger: "bg-danger",
  ok: "bg-ok",
  warn: "bg-warn",
  slate: "bg-slate",
  idle: "bg-fg-4",
  amber: "bg-amber",
  olive: "bg-olive",
  quiet: "bg-fg-4",
};

type AvatarTone = "amber" | "olive" | "slate" | "quiet";
const avatarTone = (tone?: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A chart-on-file thumbnail — concentric contours + a dashed plotted line. */
function SheetThumb({ seed }: { seed: number }) {
  return (
    <svg
      viewBox="0 0 210 96"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect width={210} height={96} className="fill-inset" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={contourRing(105, 48, 16 + i * 14, seed + i * 0.5, 0.7, 0.18)}
          fill="none"
          strokeWidth={i % 2 ? 1 : 0.7}
          className={
            i % 2 ? "stroke-(--plan-contour-index)" : "stroke-(--plan-contour)"
          }
        />
      ))}
      <path
        d="M10 82 C 60 56, 120 72, 200 36"
        fill="none"
        strokeWidth={1.6}
        strokeDasharray="3 3"
        className="stroke-accent"
      />
    </svg>
  );
}

function ExpeditionSheet({
  expedition,
  index,
  focused,
  onOpen,
}: {
  expedition: Expedition;
  index: number;
  focused: boolean;
  onOpen: () => void;
}) {
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

/** A filed-this-session draft card. Opens a summary dossier. */
function DraftSheet({
  draft,
  index,
  onOpen,
}: {
  draft: ExpeditionDraft;
  index: number;
  onOpen: () => void;
}) {
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

/** Plan → Expeditions: the sheet index. Open a card for its dossier, then into
 *  Route Planning. */
export function PlanExpeditions() {
  const nav = useNavigation();
  const expeditions = listExpeditions();
  const { drafts } = useExpeditionDrafts();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const openDraft = drafts.find((d) => d.id === draftId);

  const openRoute = (id: string) => {
    nav.focusExpedition(id);
    nav.goTo("plan", "route");
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-app">
      <div className="flex h-9 flex-none items-center gap-4 border-b border-border bg-surface px-5 font-mono">
        <Text
          variant="caption"
          as="span"
          tone="secondary"
          className="uppercase tracking-[0.08em]"
        >
          Sheet index
        </Text>
        <Text
          variant="caption"
          as="span"
          tone="tertiary"
          className="uppercase tracking-[0.06em]"
        >
          {expeditions.length + drafts.length} charts on file
        </Text>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expeditions.map((expedition, i) => (
            <ExpeditionSheet
              key={expedition.id}
              expedition={expedition}
              index={i}
              focused={expedition.id === nav.focusedExpeditionId}
              onOpen={() => setDetailId(expedition.id)}
            />
          ))}
          {drafts.map((draft, i) => (
            <DraftSheet
              key={draft.id}
              draft={draft}
              index={expeditions.length + i}
              onOpen={() => setDraftId(draft.id)}
            />
          ))}
        </div>
      </div>

      {detailId && (
        <ExpeditionDetail
          expeditionId={detailId}
          onClose={() => setDetailId(null)}
          onOpenRoute={openRoute}
        />
      )}

      {openDraft && (
        <DraftDetail draft={openDraft} onClose={() => setDraftId(null)} />
      )}
    </div>
  );
}
