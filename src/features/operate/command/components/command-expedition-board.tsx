"use client";

import { useState } from "react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listExpeditions } from "@/universe";
import { LiveExpeditionDetail } from "../../live/components/live-expedition-detail/live-expedition-detail";
import { TONE_DOT } from "../data/TONE_DOT";
import { TONE_BAR } from "../data/TONE_BAR";

export function CommandExpeditionBoard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const expeditions = listExpeditions().filter((e) => e.status !== "complete");

  return (
    <>
      <div className="rounded-lg border border-border p-4">
        <Text
          variant="caption"
          tone="tertiary"
          className="mb-3 block font-mono tracking-widest text-2xs uppercase"
        >
          Expedition Status Board
        </Text>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expeditions.map((expedition) => {
            const progressPct =
              expedition.status === "in-field"
                ? Math.round(
                    (expedition.dayCurrent / expedition.dayTotal) * 100,
                  )
                : expedition.readiness;

            return (
              <button
                key={expedition.id}
                onClick={() => setSelectedId(expedition.id)}
                className="rounded border border-border bg-inset p-3 text-left transition-colors hover:border-accent-line hover:bg-raised cursor-pointer w-full"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={cn(
                      "size-2 flex-none rounded-full",
                      TONE_DOT[expedition.statusTone] ?? "bg-fg-4",
                    )}
                  />
                  <Text
                    variant="caption"
                    tone="tertiary"
                    className="font-mono text-2xs uppercase tracking-wider"
                  >
                    {expedition.statusLabel}
                  </Text>
                </div>

                <Text className="block font-semibold leading-tight text-sm">
                  {expedition.name}
                </Text>

                <div className="mt-2 flex items-center justify-between">
                  <Text
                    variant="caption"
                    tone="tertiary"
                    className="font-mono text-2xs"
                  >
                    {expedition.filled}/{expedition.capacity} pax
                  </Text>
                  <Text
                    variant="caption"
                    className={cn(
                      "font-mono text-2xs",
                      expedition.status === "in-field"
                        ? TONE_DOT[expedition.statusTone]
                          ? "text-accent"
                          : "text-fg-3"
                        : "text-fg-3",
                    )}
                  >
                    {expedition.status === "in-field"
                      ? `DAY ${expedition.dayCurrent}/${expedition.dayTotal}`
                      : expedition.departLabel}
                  </Text>
                </div>

                <div className="mt-2 h-1 rounded-full bg-border-strong overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      TONE_BAR[expedition.statusTone] ?? "bg-fg-3",
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedId && (
        <LiveExpeditionDetail
          expeditionId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
