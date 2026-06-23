import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LiveExpeditionState } from "../../types/live-expedition.types";

interface LiveExpeditionDetailStatusBarProps {
  state: LiveExpeditionState;
}

export function LiveExpeditionDetailStatusBar({
  state,
}: LiveExpeditionDetailStatusBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-inset p-3">
      <div
        className={cn(
          "grid size-3 rounded-full",
          state.status === "in-transit" ? "bg-accent animate-pulse" : "bg-fg-3",
        )}
      />
      <Text variant="body-sm" className="flex-1 capitalize">
        {state.status.replace("-", " ")}
      </Text>
      <Text variant="caption" tone="tertiary" className="font-mono">
        {state.progressPct.toFixed(0)}% progress
      </Text>
    </div>
  );
}
