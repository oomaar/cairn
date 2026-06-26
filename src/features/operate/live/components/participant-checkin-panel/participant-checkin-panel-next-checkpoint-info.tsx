import { Icon, Text } from "@/components/ui";
import type { Checkpoint } from "@/universe";

interface ParticipantCheckinPanelNextCheckpointInfoProps {
  nextCheckpoint?: Checkpoint;
}

export function ParticipantCheckinPanelNextCheckpointInfo({
  nextCheckpoint,
}: ParticipantCheckinPanelNextCheckpointInfoProps) {
  return (
    <>
      {nextCheckpoint && (
        <div className="mt-5 rounded-lg border border-border p-3">
          <Text
            variant="caption"
            tone="tertiary"
            className="mb-2 block font-mono text-3xs uppercase tracking-widest"
          >
            Next Checkpoint
          </Text>
          <div className="flex items-center gap-2">
            <Icon name="flag" size={12} className="flex-none text-fg-3" />
            <span className="text-sm font-semibold">{nextCheckpoint.name}</span>
            {nextCheckpoint.hazard && (
              <Icon name="alert" size={11} className="flex-none text-warn" />
            )}
          </div>
          <div className="mt-1 flex gap-3 font-mono text-2xs text-fg-4">
            <span>{nextCheckpoint.km.toFixed(1)} km</span>
            <span>{nextCheckpoint.elevationM.toLocaleString()} m elev</span>
            <span>ETA {nextCheckpoint.eta}</span>
          </div>
        </div>
      )}
    </>
  );
}
