import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type {
  CellVariant,
  LiveExpeditionState,
} from "../types/live-expedition.types";
import { VARIANT_CLASSES } from "../data/VARIANT_CLASSES";
import { DOT_CLASSES } from "../data/DOT_CLASSES";

interface LiveAnnunciatorPanelProps {
  state: LiveExpeditionState;
}

export function LiveAnnunciatorPanel({ state }: LiveAnnunciatorPanelProps) {
  const { alerts, commsStatus } = state.expeditionStatus;
  const isSOS = state.status === "emergency";

  const cells: { label: string; sub?: string; variant: CellVariant }[] = [
    {
      label: "WEATHER",
      sub: alerts.weatherAlert ? "HOLD" : "CLEAR",
      variant: alerts.weatherAlert ? "danger" : "inactive",
    },
    {
      label: "EXPOSURE",
      sub: alerts.navigationAlert ? "PASS" : "CLEAR",
      variant: alerts.navigationAlert ? "warn" : "inactive",
    },
    {
      label: "CREW",
      sub: alerts.crewAlert ? "MONITOR" : "NOMINAL",
      variant: alerts.crewAlert ? "warn" : "ok",
    },
    {
      label: "ROLL CALL",
      sub: alerts.crewAlert ? "INCOMPLETE" : "OK",
      variant: alerts.crewAlert ? "inactive" : "ok",
    },
    {
      label: "BEACONS",
      sub: alerts.communicationAlert ? "FAULT" : "OK",
      variant: alerts.communicationAlert ? "danger" : "ok",
    },
    {
      label: "COMMS",
      sub: commsStatus.toUpperCase(),
      variant:
        commsStatus === "ok"
          ? "ok"
          : commsStatus === "degraded"
            ? "warn"
            : "danger",
    },
    {
      label: "SOS",
      sub: isSOS ? "ACTIVE" : "STANDBY",
      variant: isSOS ? "danger" : "inactive",
    },
    {
      label: "EQUIP",
      sub: alerts.equipmentAlert ? "ATTENTION" : "OK",
      variant: alerts.equipmentAlert ? "warn" : "ok",
    },
  ];

  return (
    <div>
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-2 block font-mono text-2xs uppercase tracking-widest"
      >
        Annunciator
      </Text>
      <div className="grid grid-cols-4 gap-1.5">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={cn(
              "flex flex-col items-center justify-center rounded border px-2 py-2 transition-all",
              VARIANT_CLASSES[cell.variant],
            )}
          >
            <div
              className={cn(
                "mb-1 size-1.5 rounded-full",
                DOT_CLASSES[cell.variant],
              )}
            />
            <Text
              variant="caption"
              className="block text-center font-mono text-2xs font-bold leading-none"
            >
              {cell.label}
            </Text>
            {cell.sub && (
              <Text
                variant="caption"
                className="mt-0.5 block text-center font-mono text-2xs leading-none opacity-80"
              >
                {cell.sub}
              </Text>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
