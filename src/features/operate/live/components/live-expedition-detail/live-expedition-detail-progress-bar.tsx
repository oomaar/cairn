import { Text } from "@/components/ui";
import type { LiveExpeditionState } from "../../types/live-expedition.types";

interface LiveExpeditionDetailProgressBarProps {
  state: LiveExpeditionState;
}

export function LiveExpeditionDetailProgressBar({
  state,
}: LiveExpeditionDetailProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Text variant="caption" tone="tertiary">
          Route Progress
        </Text>
        <Text variant="caption" tone="tertiary" className="font-mono">
          {state.currentCheckpointIndex + 1} of {state.checkpoints.length}{" "}
          checkpoints
        </Text>
      </div>
      <div className="h-2 rounded-full bg-border-strong">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${state.progressPct}%` }}
        />
      </div>
    </div>
  );
}
