"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { getExpeditionsForPerson, listExpeditions } from "@/universe";
import { useSession } from "@/features/session";
import { ParticipantCheckinPanel } from "./participant-checkin-panel/participant-checkin-panel";
import { LiveExpeditionDetail } from "./live-expedition-detail/live-expedition-detail";
import { LiveWorkspace } from "./live-workspace";

export function LiveOperations() {
  const { can, currentUser } = useSession();
  const allExpeditions = listExpeditions();

  // Participants only see their own expeditions; others see all active ones.
  const activeExpeditions = can("expeditions:view-all")
    ? allExpeditions.filter((e) => e.status === "in-field").slice(0, 3)
    : currentUser
      ? getExpeditionsForPerson(currentUser.id).filter(
          (e) => e.status === "in-field",
        )
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
        isParticipant ? (
          <ParticipantCheckinPanel
            key={focusedId}
            expedition={focusedExpedition}
            personId={currentUser?.id ?? ""}
          />
        ) : (
          <LiveWorkspace
            key={focusedId}
            expeditionId={focusedId}
            expeditionName={focusedExpedition.name}
            distanceKm={focusedExpedition.distanceKm}
          />
        )
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
