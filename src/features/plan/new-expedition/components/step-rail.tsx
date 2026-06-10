import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Dispatch, SetStateAction } from "react";

interface StepRailProps {
  steps: string[];
  done: boolean[];
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  completed: number;
}

export function StepRail({
  steps,
  done,
  step,
  setStep,
  completed,
}: StepRailProps) {
  const meterSegments = Math.round((completed / steps.length) * 16);
  const readiness = Math.round((completed / steps.length) * 100);

  return (
    <div className="flex w-full flex-none flex-col border-b border-border bg-surface py-3 lg:w-72 lg:border-b-0 lg:border-r lg:py-5">
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="px-5 font-mono uppercase tracking-widest"
      >
        Mission preparation
      </Text>
      <ol className="mt-3 flex overflow-x-auto lg:flex-col lg:overflow-visible">
        {steps.map((title, i) => {
          const isDone = done[i];
          const current = i === step;
          return (
            <li key={title} className="flex-none lg:flex-auto">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "flex w-full items-center gap-3 border-l-2 px-5 py-2.5 text-left transition-colors",
                  current
                    ? "border-accent bg-raised"
                    : "border-transparent hover:bg-raised/60",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 flex-none place-items-center rounded-full border font-mono text-2xs",
                    isDone
                      ? "border-(--plan-sage) bg-[color-mix(in_srgb,var(--plan-sage)_18%,transparent)] text-(--plan-sage)"
                      : current
                        ? "border-accent text-accent-bright"
                        : "border-border text-fg-3",
                  )}
                >
                  {isDone ? (
                    <Icon name="check" size={12} strokeWidth={3} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span className="min-w-0">
                  <Text
                    variant="body-sm"
                    as="span"
                    className={cn(
                      "block truncate",
                      current ? "text-fg-1" : "text-fg-2",
                    )}
                  >
                    {title}
                  </Text>
                  <Text
                    variant="caption"
                    as="span"
                    tone="tertiary"
                    className="font-mono"
                  >
                    {isDone ? "Complete" : current ? "In progress" : "Pending"}
                  </Text>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-auto px-5 pt-5">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-[0.08em]"
        >
          Readiness to file
        </Text>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 flex-1 rounded-[1px]",
                i < meterSegments ? "bg-accent" : "bg-border-strong",
              )}
            />
          ))}
        </div>
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="mt-2 font-mono"
        >
          {completed} of {steps.length} steps · {readiness}%
        </Text>
      </div>
    </div>
  );
}
