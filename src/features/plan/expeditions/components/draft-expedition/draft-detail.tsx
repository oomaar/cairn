"use client";

import { Avatar, Icon, Text } from "@/components/ui";
import { getPerson } from "@/universe";
import type { ExpeditionDraft } from "../../utils/expedition-drafts";
import { capitalize } from "@/utils/capitalize";
import { avatarTone } from "../../utils/avatarTone";
import { Stat } from "../stat";

interface DraftDetailProps {
  draft: ExpeditionDraft;
  onClose: () => void;
}

/** Dossier for a session-filed draft — summary only (no route/crew/record yet). */
export function DraftDetail({ draft, onClose }: DraftDetailProps) {
  const leader = draft.leaderId ? getPerson(draft.leaderId) : undefined;

  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <aside className="relative flex w-105 max-w-[92vw] flex-col border-l border-border bg-surface shadow-lg">
        <header className="flex flex-none items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-pill bg-accent-tint px-2 py-0.5 font-mono text-3xs uppercase tracking-[0.06em] text-accent-bright">
              Draft
            </span>
            <Text as="h2" variant="h3" className="mt-1.5 text-xl">
              {draft.name}
            </Text>
            <Text variant="caption" as="p" tone="secondary">
              {draft.region}, {draft.country}
            </Text>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            className="grid size-7 flex-none place-items-center rounded-md text-fg-3 transition-colors hover:bg-raised hover:text-fg-1"
          >
            <Icon name="x" size={15} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-5 py-4">
            <Stat label="Distance" value={`${draft.distanceKm} km`} />
            <Stat label="Ascent" value={`▲${draft.gainM.toLocaleString()} m`} />
            <Stat label="Duration" value={`${draft.dayTotal} days`} />
            <Stat label="Grade" value={capitalize(draft.grade)} />
            <Stat label="Equipment" value={`${draft.gearCount} items`} />
            <Stat label="Status" value="Draft" />
          </div>

          <section className="border-t border-border-soft px-5 py-4">
            <Text
              variant="caption"
              as="h3"
              tone="tertiary"
              className="mb-2.5 font-mono uppercase tracking-widest"
            >
              Field leader
            </Text>
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={leader?.initials ?? "—"}
                size="md"
                tone={avatarTone(leader?.tone)}
              />
              <div className="min-w-0">
                <Text variant="body-sm" as="p" className="truncate">
                  {leader?.name ?? "Unassigned"}
                </Text>
                <Text variant="caption" as="p" tone="tertiary">
                  Expedition lead
                </Text>
              </div>
            </div>
          </section>

          <section className="border-t border-border-soft px-5 py-4">
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-inset p-3">
              <Icon
                name="pen"
                size={14}
                className="mt-px flex-none text-fg-3"
              />
              <Text variant="caption" as="p" tone="secondary">
                Filed this session. The route, crew manifest, risks and schedule
                are set once the expedition is committed to operations.
              </Text>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
