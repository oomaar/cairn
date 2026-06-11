import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlanStation } from "../../types/route.types";

interface RouteTimelineProps {
  stations: PlanStation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const reached = (s: PlanStation) =>
  s.status === "done" || s.status === "current";

/**
 * Route timeline — the checkpoints as a time-ordered stepper. ETA above, name
 * below, status in the node; traversed segments fill toward the live current
 * position. Selecting a node syncs with the chart and elevation profile.
 */
export function RouteTimeline({
  stations,
  selectedId,
  onSelect,
}: RouteTimelineProps) {
  return (
    <div className="flex-none border-t border-border bg-surface px-5 py-3">
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="mb-2 font-mono uppercase tracking-widest"
      >
        Route timeline
      </Text>

      <ol className="flex items-stretch overflow-x-auto">
        {stations.map((s, i) => {
          const sel = s.id === selectedId;
          const cur = s.status === "current";
          const leftFilled = reached(s);
          const next = stations[i + 1];
          const rightFilled = next ? reached(next) : false;

          return (
            <li
              key={s.id}
              className="flex min-w-16 flex-1 flex-col items-center gap-1.5"
            >
              <Text
                variant="caption"
                as="span"
                className={cn(
                  "font-mono text-3xs",
                  cur ? "text-accent-bright" : "text-fg-3",
                )}
              >
                {s.eta}
              </Text>

              {/* connector + node */}
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    "h-0.5 flex-1",
                    i === 0 && "invisible",
                    leftFilled ? "bg-accent" : "bg-border",
                  )}
                />
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  aria-pressed={sel}
                  aria-label={`${s.name}, ${s.eta}`}
                  className={cn(
                    "grid size-3.5 flex-none place-items-center rounded-full border-2 transition-shadow",
                    cur && "animate-pulse-live",
                    sel &&
                      "ring-2 ring-accent-line ring-offset-2 ring-offset-surface",
                    s.hazard
                      ? "border-(--plan-signal) bg-(--plan-signal)"
                      : cur
                        ? "border-accent bg-accent"
                        : s.status === "done"
                          ? "border-(--plan-sage) bg-(--plan-sage)"
                          : "border-border-strong bg-transparent",
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 flex-1",
                    i === stations.length - 1 && "invisible",
                    rightFilled ? "bg-accent" : "bg-border",
                  )}
                />
              </div>

              <span className="flex max-w-full items-center gap-1 px-1">
                {s.hazard && (
                  <Icon
                    name="alert"
                    size={11}
                    className="flex-none text-(--plan-signal)"
                  />
                )}
                <Text
                  variant="caption"
                  as="span"
                  className={cn("truncate", sel ? "text-fg-1" : "text-fg-3")}
                >
                  {s.name}
                </Text>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
