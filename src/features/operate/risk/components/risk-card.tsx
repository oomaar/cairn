"use client";

import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Risk } from "@/universe/types";
import { RISK_BORDER } from "../data/RISK_BORDER";
import { RISK_LEVEL_BADGE } from "../data/RISK_LEVEL_BADGE";

interface RiskCardProps {
  risk: Risk;
  expeditionLabel?: string;
}

export function RiskCard({ risk, expeditionLabel }: RiskCardProps) {
  const sub =
    expeditionLabel ??
    (risk.expeditionId !== null ? risk.expeditionId.toUpperCase() : "ORG");

  return (
    <div
      className={cn(
        "rounded-lg border border-border border-l-[3px] bg-surface p-4",
        RISK_BORDER[risk.tone] ?? "border-l-fg-3",
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center gap-2.5 flex-wrap">
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-2xs font-bold tracking-wider",
            RISK_LEVEL_BADGE[risk.level] ?? "border-fg-3 text-fg-3",
          )}
        >
          {risk.level.toUpperCase()}
        </span>
        <Text
          variant="caption"
          tone="tertiary"
          className="font-mono text-2xs uppercase tracking-wider"
        >
          {risk.category} · {sub}
        </Text>
        <Text
          variant="caption"
          tone="tertiary"
          className="ml-auto font-mono text-2xs"
        >
          UPD {risk.updatedAgo}
        </Text>
      </div>

      {/* Title */}
      <Text className="mb-2 block text-sm font-semibold leading-snug">
        {risk.title}
      </Text>

      {/* Detail */}
      <Text
        variant="caption"
        tone="secondary"
        className="mb-3 block text-sm leading-relaxed"
      >
        {risk.detail}
      </Text>

      {/* Mitigation action */}
      <div className="flex items-start gap-2.5 rounded border border-border bg-inset px-3 py-2.5">
        <Icon
          name="arrowR"
          size={14}
          className="mt-0.5 flex-none text-accent"
        />
        <div className="min-w-0">
          <Text className="font-mono text-2xs font-bold tracking-wider text-accent">
            MITIGATION
          </Text>
          <Text
            variant="caption"
            tone="secondary"
            className="mt-0.5 block text-sm"
          >
            {risk.action}
          </Text>
        </div>
      </div>
    </div>
  );
}
