"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { ExpeditionStatus } from "../types/live-expedition.types";

interface ExpeditionAnnunciatorProps {
  status: ExpeditionStatus;
}

export function ExpeditionAnnunciator({ status }: ExpeditionAnnunciatorProps) {
  const alerts = status.alerts;

  const flagConfig = [
    {
      label: "WEATHER",
      active: alerts.weatherAlert,
      description: "Critical weather condition",
    },
    {
      label: "EXPOSURE",
      active: alerts.navigationAlert,
      description: "Route hazard or exposure",
    },
    {
      label: "BEACONS",
      active: !alerts.communicationAlert,
      description: "Beacon tracking status",
    },
    {
      label: "CREW",
      active: !alerts.crewAlert,
      description: "Crew status nominal",
    },
    {
      label: "EQUIPMENT",
      active: !alerts.equipmentAlert,
      description: "Equipment status nominal",
    },
    {
      label: "COMMS",
      active: status.commsStatus === "ok",
      description: "Communications status",
    },
  ];

  const getColor = (active: boolean) => {
    return active
      ? "bg-ok/10 border-ok/20 text-ok"
      : "bg-danger/10 border-danger/20 text-danger";
  };

  const getDotColor = (active: boolean) => {
    return active ? "bg-(--plan-sage)" : "bg-danger";
  };

  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-2">
        Annunciator
      </Text>
      <div className="grid grid-cols-2 gap-1.5">
        {flagConfig.map((flag) => (
          <div
            key={flag.label}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded border transition-all",
              getColor(flag.active),
            )}
            title={flag.description}
          >
            <div
              className={cn(
                "size-2 rounded-full flex-none",
                getDotColor(flag.active),
              )}
            />
            <Text variant="caption" className="text-2xs font-semibold truncate">
              {flag.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
