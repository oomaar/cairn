"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { LiveParticipant } from "../types/live-expedition.types";

interface ParticipantTelemetryProps {
  participants: LiveParticipant[];
  limit?: number;
}

export function ParticipantTelemetry({
  participants,
  limit = 5,
}: ParticipantTelemetryProps) {
  if (participants.length === 0) return null;

  const displayed = participants.slice(0, limit);
  const maxHR = 160;
  const minHR = 80;

  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-3">
        Participant Telemetry
      </Text>
      <div className="space-y-2">
        {displayed.map((participant) => {
          const hrPercent =
            ((participant.heartRate - minHR) / (maxHR - minHR)) * 100;
          const isElevated = participant.heartRate > 125;
          const hrColor = isElevated ? "text-warn" : "text-(--plan-sage)";
          const barColor = isElevated ? "bg-warn" : "bg-(--plan-sage)";

          return (
            <div
              key={participant.id}
              className="flex items-center gap-2 text-sm"
            >
              {/* Initials */}
              <div className="w-10 flex-none font-mono font-semibold text-2xs">
                {participant.initials}
              </div>

              {/* Heart Rate Bar */}
              <div className="flex-1 flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-border-strong">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      barColor,
                    )}
                    style={{ width: `${Math.min(100, hrPercent)}%` }}
                  />
                </div>
                <Text
                  variant="caption"
                  className={cn("w-12 text-right font-mono text-2xs", hrColor)}
                >
                  {Math.round(participant.heartRate)} bpm
                </Text>
              </div>

              {/* Pace / Position */}
              <div className="w-16 flex-none text-right">
                <Text variant="caption" tone="tertiary" className="text-2xs">
                  {participant.pace}
                </Text>
              </div>

              {/* Battery */}
              <div className="w-12 flex-none text-right">
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="font-mono text-2xs"
                >
                  {Math.round(participant.battery)}%
                </Text>
              </div>

              {/* Flag */}
              {participant.flag && (
                <div className="w-8 flex-none text-center">
                  <span className="text-xs">⚠️</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
