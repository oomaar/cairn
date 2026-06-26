"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { getExpeditionsForPerson, listExpeditions } from "@/universe";
import { useSession } from "@/features/session";
import { getInitialLiveState } from "../utils/getInitialLiveState";
import { useLiveExpeditionUpdates } from "../hooks/use-live-expedition-updates";
import { LiveSituationPanel } from "./live-situation-panel";
import { LiveWindPanel } from "./live-wind-panel";
import { LiveAnnunciatorPanel } from "./live-annunciator-panel";
import { LiveCommsPanel } from "./live-comms-panel";
import { ParticipantTelemetry } from "./participant-telemetry";
import { LiveExpeditionDetail } from "./live-expedition-detail/live-expedition-detail";

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
    // 60/40 vertical split — top instruments dominant, bottom panels supporting
    <div className="grid min-h-0 flex-1 grid-rows-[3fr_2fr] overflow-hidden">
      {/* Top row: Situation schematic + Wind dial */}
      <div className="grid min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 overflow-hidden border-b border-border p-4 lg:border-b-0 lg:border-r">
          <LiveSituationPanel
            state={state}
            expeditionName={expeditionName}
            distanceKm={distanceKm}
          />
        </div>
        {/* Dial is centered and capped so it reads as an instrument, not a stretch */}
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b border-border p-4 lg:border-b-0">
          <div className="w-full max-w-75">
            <LiveWindPanel windSpeed={state.weather.windSpeed} />
          </div>
        </div>
      </div>

      {/* Bottom row: Annunciator + Comms | Participant Telemetry */}
      <div className="grid min-h-0 grid-cols-1 overflow-hidden border-t border-border lg:grid-cols-2">
        {/* Left column: annunciator fixed, comms scrolls remaining space */}
        <div className="grid min-h-0 grid-rows-[auto_1fr] overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-4">
            <LiveAnnunciatorPanel state={state} />
          </div>
          <div className="min-h-0 overflow-y-auto p-4">
            <LiveCommsPanel expeditionId={expeditionId} />
          </div>
        </div>
        {/* Right column: telemetry scrolls */}
        <div className="min-h-0 overflow-y-auto p-4">
          <ParticipantTelemetry participants={state.participants} />
        </div>
      </div>
    </div>
  );
}

export function LiveOperations() {
  const { can, currentUser } = useSession();
  const allExpeditions = listExpeditions();

  // Participants only see their own expeditions; others see all active ones.
  const activeExpeditions = can("expeditions:view-all")
    ? allExpeditions.filter((e) => e.status === "in-field").slice(0, 3)
    : currentUser
      ? getExpeditionsForPerson(currentUser.id).filter((e) => e.status === "in-field")
      : [];

  const isParticipant = !can("expeditions:view-all");

  const [focusedId, setFocusedId] = useState(activeExpeditions[0]?.id ?? "");
  const [detailId, setDetailId] = useState<string | null>(null);

  const focusedExpedition = activeExpeditions.find((e) => e.id === focusedId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Expedition selector — hidden for participants (single expedition) */}
      {!isParticipant && (
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
      )}

      {/* Participant view — single expedition header with detail link */}
      {isParticipant && focusedExpedition && (
        <div className="flex flex-none items-center border-b border-border px-5 py-3">
          <span className="flex items-center gap-2 font-mono text-2xs font-bold tracking-wider text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            {focusedExpedition.name.toUpperCase()}
          </span>
          <button
            onClick={() => setDetailId(focusedId)}
            className="ml-auto flex-none font-mono text-2xs text-fg-3 transition-colors hover:text-fg-2"
          >
            DETAIL →
          </button>
        </div>
      )}

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
