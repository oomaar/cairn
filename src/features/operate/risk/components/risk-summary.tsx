"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listRisks } from "@/universe";
import type { Risk } from "@/universe/types";

function countByLevel(risks: Risk[]) {
  return {
    high: risks.filter((r) => r.level === "high").length,
    moderate: risks.filter((r) => r.level === "moderate").length,
    low: risks.filter((r) => r.level === "low").length,
    total: risks.length,
  };
}

export function RiskSummary() {
  const risks = listRisks();
  const counts = countByLevel(risks);

  const stats = [
    {
      label: "HIGH",
      value: counts.high,
      color: counts.high > 0 ? "text-danger" : "text-fg-3",
      bg:
        counts.high > 0
          ? "bg-danger/10 border-danger/30"
          : "bg-inset border-border",
    },
    {
      label: "MODERATE",
      value: counts.moderate,
      color: counts.moderate > 0 ? "text-warn" : "text-fg-3",
      bg:
        counts.moderate > 0
          ? "bg-warn/10 border-warn/30"
          : "bg-inset border-border",
    },
    {
      label: "LOW",
      value: counts.low,
      color: counts.low > 0 ? "text-fg-2" : "text-fg-3",
      bg: "bg-inset border-border",
    },
    {
      label: "TOTAL OPEN",
      value: counts.total,
      color: "text-fg-1",
      bg: "bg-inset border-border",
    },
  ];

  const condition =
    counts.high > 0
      ? `${counts.high} HIGH OPEN`
      : counts.moderate > 0
        ? `${counts.moderate} MODERATE OPEN`
        : "NOMINAL";

  const conditionColor =
    counts.high > 0
      ? "text-danger"
      : counts.moderate > 0
        ? "text-warn"
        : "text-accent";

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <Text
          variant="caption"
          tone="tertiary"
          className="block font-mono tracking-widest text-2xs uppercase"
        >
          Active Risks
        </Text>
        <Text
          className={cn(
            "font-mono text-xs font-bold tracking-wider",
            conditionColor,
          )}
        >
          {condition}
        </Text>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn("rounded border px-3 py-3 text-center", stat.bg)}
          >
            <Text
              className={cn(
                "block font-mono text-2xl font-bold leading-none",
                stat.color,
              )}
            >
              {stat.value}
            </Text>
            <Text
              variant="caption"
              tone="tertiary"
              className="mt-1.5 block font-mono text-2xs uppercase tracking-wider"
            >
              {stat.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
