import { Text } from "@/components/ui";
import React from "react";

interface StepPanelProps {
  step: number;
  steps: string[];
}

export function StepPanel({ step, steps }: StepPanelProps) {
  return (
    <div className="flex h-9 flex-none items-center gap-3 border-b border-border bg-surface px-5 font-mono">
      <Text
        variant="caption"
        as="span"
        tone="secondary"
        className="uppercase tracking-[0.08em]"
      >
        New expedition
      </Text>
      <Text
        variant="caption"
        as="span"
        tone="tertiary"
        className="uppercase tracking-[0.06em]"
      >
        Step {step + 1} / {steps.length} · {steps[step]}
      </Text>
    </div>
  );
}
