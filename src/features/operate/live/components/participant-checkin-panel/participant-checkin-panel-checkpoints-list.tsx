import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Checkpoint } from "@/universe";

interface ParticipantCheckinPanelCheckpointsListProps {
  checkpoints: Checkpoint[];
}

export function ParticipantCheckinPanelCheckpointsList({
  checkpoints,
}: ParticipantCheckinPanelCheckpointsListProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {checkpoints.length === 0 ? (
        <div className="flex h-24 items-center justify-center">
          <Text variant="caption" tone="tertiary" className="text-2xs">
            No checkpoints on this route
          </Text>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {checkpoints.map((cp) => {
            const isDone = cp.status === "done";
            const isCurrent = cp.status === "current";
            const isAhead = cp.status === "ahead";
            return (
              <div
                key={cp.id}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 transition-colors",
                  isCurrent && "bg-accent/5",
                  isDone && "opacity-50",
                )}
              >
                {/* Status indicator */}
                <div className="flex w-5 flex-none items-center justify-center">
                  {isDone && (
                    <Icon name="check" size={13} className="text-ok" />
                  )}
                  {isCurrent && (
                    <span className="size-2 animate-pulse rounded-full bg-accent" />
                  )}
                  {isAhead && (
                    <span className="size-1.5 rounded-full bg-border-strong" />
                  )}
                </div>

                {/* Connector line hint */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold leading-snug",
                          isCurrent
                            ? "text-accent"
                            : isDone
                              ? "text-fg-3"
                              : "text-fg-2",
                        )}
                      >
                        {cp.name}
                      </span>
                      {cp.hazard && (
                        <Icon
                          name="alert"
                          size={11}
                          className="flex-none text-warn"
                        />
                      )}
                      {isCurrent && (
                        <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-3xs font-bold tracking-wider text-accent">
                          HERE
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 font-mono text-2xs text-fg-4">
                      <span>{cp.km.toFixed(1)} km</span>
                      <span>{cp.elevationM.toLocaleString()} m</span>
                      {!isDone && <span>ETA {cp.eta}</span>}
                    </div>
                  </div>

                  {/* Type badge */}
                  <span className="flex-none rounded border border-border px-1.5 py-0.5 font-mono text-3xs text-fg-4">
                    {cp.type.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
