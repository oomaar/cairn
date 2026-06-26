"use client";

import { useState } from "react";
import { listExpeditions, getExpeditionsForPerson } from "@/universe";
import { useSession } from "@/features/session";
import { HistoryExpeditionList } from "./history-expedition-list";
import { ExpeditionDetailPanel } from "./expedition-detail-panel";

export function HistoryWorkspace() {
  const { can, currentUser } = useSession();

  const allExpeditions = listExpeditions();
  const expeditions = can("expeditions:view-all")
    ? allExpeditions
    : getExpeditionsForPerson(currentUser?.id ?? "");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = expeditions.find((e) => e.id === selectedId);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
      {/* Left — expedition list */}
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <HistoryExpeditionList
          expeditions={expeditions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Right — detail panel */}
      <div className="min-h-0 overflow-hidden border-t border-border lg:border-t-0">
        <ExpeditionDetailPanel expedition={selected} />
      </div>
    </div>
  );
}
