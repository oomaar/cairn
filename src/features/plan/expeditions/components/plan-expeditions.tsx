"use client";

import { useState } from "react";
import { Text } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { useSession } from "@/features/session";
import { getExpeditionsForPerson, listExpeditions } from "@/universe";
import { useExpeditionDrafts } from "../utils/expedition-drafts";
import { ExpeditionSheet } from "./expedition-sheet";
import { DraftDetail } from "./draft-expedition/draft-detail";
import { DraftSheet } from "./draft-expedition/draft-sheet";
import { ExpeditionDetail } from "./expedition-detail/expedition-detail";

/** Plan → Expeditions: the sheet index. Open a card for its dossier, then into
 *  Route Planning. */
export function PlanExpeditions() {
  const nav = useNavigation();
  const { can, currentUser } = useSession();
  const expeditions = can("expeditions:view-all")
    ? listExpeditions()
    : currentUser
      ? getExpeditionsForPerson(currentUser.id)
      : [];
  const { drafts } = useExpeditionDrafts();
  const visibleDrafts = can("expeditions:create") ? drafts : [];
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
          {can("expeditions:view-all")
            ? `${expeditions.length + visibleDrafts.length} charts on file`
            : `${expeditions.length} assigned`}
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
          {visibleDrafts.map((draft, i) => (
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
