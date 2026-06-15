"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { LiveParticipant } from "../types/live-expedition.types";

interface ParticipantRosterProps {
  participants: LiveParticipant[];
}

export function ParticipantRoster({ participants }: ParticipantRosterProps) {
  if (participants.length === 0) return null;

  const sorted = [...participants].sort((a, b) => {
    if (a.role === "field-leader") return -1;
    if (b.role === "field-leader") return 1;
    return 0;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "field-leader":
        return "bg-accent/10 text-accent border-accent/20";
      case "assistant-lead":
        return "bg-accent/5 text-accent border-accent/10";
      default:
        return "bg-border text-fg border-border";
    }
  };

  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-2">
        Expedition Roster
      </Text>
      <div className="space-y-1">
        {sorted.map((participant) => {
          const isElevated = participant.heartRate > 125;
          const hrColor = isElevated ? "text-warn" : "text-(--plan-sage)";

          return (
            <div
              key={participant.id}
              className="flex items-center gap-2 text-2xs p-1.5 rounded border border-border-soft hover:bg-raised transition-colors"
            >
              {/* Name */}
              <div className="flex-1 min-w-0">
                <Text variant="caption" className="font-semibold truncate">
                  {participant.name}
                </Text>
              </div>

              {/* Role */}
              <div
                className={cn(
                  "flex-none px-1.5 py-0.5 rounded border text-xs font-semibold",
                  getRoleColor(participant.role),
                )}
              >
                {participant.role === "field-leader"
                  ? "Lead"
                  : participant.role === "assistant-lead"
                    ? "Asst"
                    : "Participant"}
              </div>

              {/* Heart Rate */}
              <div
                className={cn("flex-none w-12 text-right font-mono", hrColor)}
              >
                {Math.round(participant.heartRate)} bpm
              </div>

              {/* Pace */}
              <div className="flex-none w-14 text-right">
                <Text variant="caption" tone="tertiary">
                  {participant.pace}
                </Text>
              </div>

              {/* Position */}
              <div className="flex-none w-16 text-right">
                <Text variant="caption" tone="tertiary">
                  {participant.relativePosition}
                </Text>
              </div>

              {/* Battery */}
              <div className="flex-none w-10 text-right font-mono">
                {Math.round(participant.battery)}%
              </div>

              {/* Flag */}
              {participant.flag && (
                <div className="flex-none">
                  <span className="text-xs" title={participant.flag}>
                    ⚠️
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
