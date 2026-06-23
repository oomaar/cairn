import { Text } from "@/components/ui";
import type { LiveExpeditionState } from "../../types/live-expedition.types";

interface LiveExpeditionDetailNextCheckpointsProps {
  state: LiveExpeditionState;
}

export function LiveExpeditionDetailNextCheckpoints({
  state,
}: LiveExpeditionDetailNextCheckpointsProps) {
  return (
    <div className="rounded-lg border border-accent-line bg-accent/5 p-3">
      <Text variant="caption" tone="tertiary" className="block">
        Next Checkpoint
      </Text>
      <Text className="mt-1 font-semibold">{state.nextCheckpoint.name}</Text>
      <div className="mt-2 flex gap-4 font-mono text-sm">
        <span>ETA: {state.nextCheckpoint.eta}</span>
        <span>{state.nextCheckpoint.distanceKm} km</span>
      </div>
    </div>
  );
}
