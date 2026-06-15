"use client";

import { useState } from "react";
import { Text } from "@/components/ui";
import { listExpeditions } from "@/universe";
import { LiveExpeditionDetail } from "./live-expedition-detail";

export function LiveOperations() {
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<
    string | null
  >(null);
  const expeditions = listExpeditions();
  const activeExpeditions = expeditions.slice(0, 3); // Show first 3 as active for demo

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex-none border-b border-border px-5 py-4">
        <Text variant="title" className="text-lg">
          Live Operations
        </Text>
        <Text variant="caption" tone="tertiary" className="mt-1">
          {activeExpeditions.length} active expeditions
        </Text>
      </div>

      {/* Expeditions Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="space-y-3">
          {activeExpeditions.map((expedition) => (
            <button
              key={expedition.id}
              onClick={() => setSelectedExpeditionId(expedition.id)}
              className="w-full rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-accent-line hover:bg-raised"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Text variant="body-sm" className="font-semibold">
                    {expedition.name}
                  </Text>
                  <Text variant="caption" tone="tertiary" className="mt-0.5">
                    {expedition.region}, {expedition.country}
                  </Text>
                </div>
                <div className="ml-2 flex-none">
                  <div className="flex items-center gap-1 rounded bg-accent/10 px-2 py-1">
                    <div className="size-2 rounded-full bg-accent animate-pulse" />
                    <Text
                      variant="caption"
                      className="text-accent-bright font-semibold"
                    >
                      Live
                    </Text>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-4">
                <div>
                  <Text variant="caption" tone="tertiary" className="text-2xs">
                    Distance
                  </Text>
                  <Text className="font-mono text-sm">
                    {expedition.distanceKm} km
                  </Text>
                </div>
                <div>
                  <Text variant="caption" tone="tertiary" className="text-2xs">
                    Elevation
                  </Text>
                  <Text className="font-mono text-sm">
                    ▲{expedition.gainM.toLocaleString()} m
                  </Text>
                </div>
                <div>
                  <Text variant="caption" tone="tertiary" className="text-2xs">
                    Days
                  </Text>
                  <Text className="font-mono text-sm">
                    {expedition.dayTotal}
                  </Text>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Detail Modal */}
      {selectedExpeditionId && (
        <LiveExpeditionDetail
          expeditionId={selectedExpeditionId}
          onClose={() => setSelectedExpeditionId(null)}
        />
      )}
    </div>
  );
}
