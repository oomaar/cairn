"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { ExpeditionStatus } from "../types/live-expedition.types";

interface ExpeditionHealthProps {
  status: ExpeditionStatus;
}

export function ExpeditionHealth({ status }: ExpeditionHealthProps) {
  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-danger/10 text-danger border-danger/20";
      case "medium":
        return "bg-warn/10 text-warn border-warn/20";
      default:
        return "bg-(--plan-sage)/10 text-(--plan-sage) border-(--plan-sage)/20";
    }
  };

  const getCommsColor = (comms: "ok" | "degraded" | "lost") => {
    switch (comms) {
      case "lost":
        return "text-danger";
      case "degraded":
        return "text-warn";
      default:
        return "text-(--plan-sage)";
    }
  };

  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-3">
        Expedition Health
      </Text>

      <div className="grid grid-cols-2 gap-2">
        {/* Readiness Score */}
        <div className="rounded border border-border-soft p-2">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Readiness
          </Text>
          <Text className="mt-1 font-mono font-semibold text-lg">
            {status.readinessScore}
          </Text>
          <div className="mt-1 h-1 rounded-full bg-border-strong">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${status.readinessScore}%` }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="rounded border border-border-soft p-2">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Risk Level
          </Text>
          <div
            className={cn(
              "mt-1 inline-block px-2 py-1 rounded border font-semibold text-sm",
              getRiskColor(status.riskLevel),
            )}
          >
            {status.riskLevel.toUpperCase()}
          </div>
        </div>

        {/* Crew Readiness */}
        <div className="rounded border border-border-soft p-2">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Crew Ready
          </Text>
          <Text className="mt-1 font-mono font-semibold">
            {status.crewReadiness}%
          </Text>
        </div>

        {/* Equipment Ready */}
        <div className="rounded border border-border-soft p-2">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Equipment
          </Text>
          <Text className="mt-1 font-mono font-semibold">
            {status.equipmentReady}%
          </Text>
        </div>

        {/* Comms Status */}
        <div className="col-span-2 rounded border border-border-soft p-2">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Communications
          </Text>
          <Text
            className={cn(
              "mt-1 font-semibold capitalize",
              getCommsColor(status.commsStatus),
            )}
          >
            {status.commsStatus}
          </Text>
        </div>
      </div>
    </div>
  );
}
