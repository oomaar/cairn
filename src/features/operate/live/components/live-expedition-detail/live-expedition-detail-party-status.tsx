import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { STATUS_COLOR } from "../../data/STATUS_COLOR";
import type { LiveExpeditionState } from "../../types/live-expedition.types";

interface LiveExpeditionDetailPartyStatusProps {
  state: LiveExpeditionState;
}

export function LiveExpeditionDetailPartyStatus({
  state,
}: LiveExpeditionDetailPartyStatusProps) {
  return (
    <div className="rounded-lg border border-border p-3">
      <Text variant="caption" tone="tertiary" className="mb-2">
        Party Status
      </Text>
      <div className="space-y-2">
        {Object.entries(state.partyStatus).map(([status, pct]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="h-1.5 rounded-full bg-border-strong">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    STATUS_COLOR[status],
                  )}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
            </div>
            <Text
              variant="caption"
              tone="tertiary"
              className="w-12 text-right font-mono text-2xs"
            >
              {(pct * 100).toFixed(0)}%
            </Text>
            <Text variant="caption" tone="tertiary" className="w-12 capitalize">
              {status}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
