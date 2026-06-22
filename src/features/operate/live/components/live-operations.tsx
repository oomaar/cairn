"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { listExpeditions } from "@/universe";
import { getInitialLiveState } from "../utils/getInitialLiveState";
import { useLiveExpeditionUpdates } from "../hooks/use-live-expedition-updates";
import { LiveSituationPanel } from "./live-situation-panel";
import { LiveWindPanel } from "./live-wind-panel";
import { LiveExpeditionDetail } from "./live-expedition-detail";

interface LiveWorkspaceProps {
  expeditionId: string;
  expeditionName: string;
  distanceKm: number;
}

// Separate component so `key` can force a full remount (fresh hook state)
// whenever the focused expedition changes.
function LiveWorkspace({
  expeditionId,
  expeditionName,
  distanceKm,
}: LiveWorkspaceProps) {
  const state = useLiveExpeditionUpdates(
    expeditionId,
    getInitialLiveState(expeditionId),
  );

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="flex min-h-0 overflow-hidden border-b border-border p-4 lg:border-b-0 lg:border-r">
        <LiveSituationPanel
          state={state}
          expeditionName={expeditionName}
          distanceKm={distanceKm}
        />
      </div>
      <div className="overflow-y-auto p-4">
        <LiveWindPanel windSpeed={state.weather.windSpeed} />
      </div>
    </div>
  );
}

export function LiveOperations() {
  const expeditions = listExpeditions();
  const activeExpeditions = expeditions.slice(0, 3);

  const [focusedId, setFocusedId] = useState(activeExpeditions[0]?.id ?? "");
  const [detailId, setDetailId] = useState<string | null>(null);

  const focusedExpedition = activeExpeditions.find((e) => e.id === focusedId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Expedition selector tabs */}
      <div className="flex flex-none items-center border-b border-border">
        <div className="flex items-center gap-3 overflow-x-auto px-5 py-3">
          <Text
            variant="caption"
            tone="tertiary"
            className="flex-none font-mono text-2xs uppercase tracking-widest"
          >
            Active
          </Text>
          {activeExpeditions.map((expedition) => (
            <button
              key={expedition.id}
              onClick={() => setFocusedId(expedition.id)}
              className={cn(
                "flex flex-none items-center gap-2 rounded border px-3 py-1.5 font-mono text-2xs font-bold tracking-wider transition-colors",
                focusedId === expedition.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-fg-3 hover:border-fg-3 hover:text-fg-2",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  focusedId === expedition.id
                    ? "animate-pulse bg-accent"
                    : "bg-fg-4",
                )}
              />
              {expedition.name.toUpperCase().slice(0, 22)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDetailId(focusedId)}
          className="ml-auto flex-none border-l border-border px-4 py-3 font-mono text-2xs text-fg-3 transition-colors hover:bg-raised hover:text-fg-2"
        >
          DETAIL →
        </button>
      </div>

      {/* Workspace — key forces remount on expedition switch */}
      {focusedExpedition ? (
        <LiveWorkspace
          key={focusedId}
          expeditionId={focusedId}
          expeditionName={focusedExpedition.name}
          distanceKm={focusedExpedition.distanceKm}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            No active expeditions
          </Text>
        </div>
      )}

      {detailId && (
        <LiveExpeditionDetail
          expeditionId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
