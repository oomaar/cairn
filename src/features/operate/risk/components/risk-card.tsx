"use client";

import { Icon, Text } from "@/components/ui";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Risk } from "@/universe/types";
import type { MitigationStatus } from "../hooks/useMitigationTracking";
import { RISK_BORDER } from "../data/RISK_BORDER";
import { RISK_LEVEL_BADGE } from "../data/RISK_LEVEL_BADGE";

interface RiskCardProps {
  risk: Risk;
  expeditionLabel?: string;
  mitigationStatus: MitigationStatus;
  onAdvance: () => void;
}

const STATUS_BADGE: Record<MitigationStatus, string> = {
  pending: "border-fg-3 text-fg-3",
  "in-progress": "border-warn text-warn",
  done: "border-accent text-accent",
};

const STATUS_LABEL: Record<MitigationStatus, string> = {
  pending: "PENDING",
  "in-progress": "IN PROGRESS",
  done: "DONE",
};

const STATUS_ICON: Record<MitigationStatus, IconName> = {
  pending: "arrowR",
  "in-progress": "arrowR",
  done: "check",
};

const ADVANCE_LABEL: Record<MitigationStatus, string> = {
  pending: "START →",
  "in-progress": "MARK DONE",
  done: "REOPEN",
};

export function RiskCard({
  risk,
  expeditionLabel,
  mitigationStatus,
  onAdvance,
}: RiskCardProps) {
  const sub =
    expeditionLabel ??
    (risk.expeditionId !== null ? risk.expeditionId.toUpperCase() : "ORG");

  const isDone = mitigationStatus === "done";

  return (
    <div
      className={cn(
        "rounded-lg border border-border border-l-[3px] bg-surface p-4",
        RISK_BORDER[risk.tone] ?? "border-l-fg-3",
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
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
        className={cn(
          "mb-3 block text-sm leading-relaxed",
          isDone && "opacity-50",
        )}
      >
        {risk.detail}
      </Text>

      {/* Mitigation box */}
      <div
        className={cn(
          "rounded border bg-inset px-3 py-2.5 transition-colors",
          isDone ? "border-accent/30 bg-accent/5" : "border-border",
        )}
      >
        {/* Mitigation header row */}
        <div className="mb-2 flex items-center gap-2">
          <Icon
            name={STATUS_ICON[mitigationStatus]}
            size={13}
            className={cn(
              "flex-none transition-colors",
              isDone ? "text-accent" : "text-fg-3",
            )}
          />
          <span className="font-mono text-2xs font-bold tracking-wider text-accent">
            MITIGATION
          </span>
          <span
            className={cn(
              "ml-auto rounded border px-1.5 py-0.5 font-mono text-2xs font-bold tracking-wider transition-colors",
              STATUS_BADGE[mitigationStatus],
            )}
          >
            {STATUS_LABEL[mitigationStatus]}
          </span>
        </div>

        {/* Action text */}
        <Text
          variant="caption"
          tone="secondary"
          className={cn(
            "mb-3 block text-sm",
            isDone && "opacity-50 line-through",
          )}
        >
          {risk.action}
        </Text>

        {/* Advance button */}
        <button
          onClick={onAdvance}
          className={cn(
            "w-full rounded border py-1.5 font-mono text-2xs font-bold tracking-wider transition-colors",
            isDone
              ? "border-border text-fg-3 hover:border-fg-3 hover:text-fg-2"
              : mitigationStatus === "in-progress"
                ? "border-accent text-accent hover:bg-accent/10"
                : "border-border text-fg-2 hover:border-accent-line hover:text-accent",
          )}
        >
          {ADVANCE_LABEL[mitigationStatus]}
        </button>
      </div>
    </div>
  );
}
