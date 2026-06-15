"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { LiveCheckpoint } from "../types/live-expedition.types";
import { STATUS_DOT } from "../data/STATUS_DOT";

interface CheckpointTimelineProps {
  checkpoints: LiveCheckpoint[];
  currentIndex: number;
}

export function CheckpointTimeline({
  checkpoints,
  currentIndex,
}: CheckpointTimelineProps) {
  if (checkpoints.length === 0) return null;

  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-3">
        Route Checkpoints
      </Text>
      <div className="flex overflow-x-auto gap-2 pb-2">
        {checkpoints.map((checkpoint, idx) => (
          <div
            key={checkpoint.id}
            className="flex-none flex flex-col items-center gap-1"
          >
            {/* Connector line before checkpoint */}
            {idx > 0 && (
              <div
                className={cn(
                  "w-8 h-0.5 mb-1",
                  idx <= currentIndex ? "bg-accent" : "bg-border-strong",
                )}
              />
            )}

            {/* Checkpoint dot */}
            <div
              className={cn(
                "rounded-full transition-all",
                STATUS_DOT[checkpoint.status],
              )}
            />

            {/* Checkpoint label */}
            <Text
              variant="caption"
              className={cn(
                "text-center text-2xs font-semibold max-w-16 truncate",
                checkpoint.status === "current" && "text-accent",
              )}
            >
              {checkpoint.name}
            </Text>

            {/* Distance and ETA */}
            <div className="text-2xs text-tertiary space-y-0.5">
              <div className="font-mono">{checkpoint.km.toFixed(1)} km</div>
              <div className="font-mono">{checkpoint.eta}</div>
            </div>

            {/* Hazard indicator */}
            {checkpoint.hazard && (
              <div className="mt-1 px-1.5 py-0.5 rounded bg-warn/10 border border-warn/20">
                <span className="text-xs">⚠️</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
