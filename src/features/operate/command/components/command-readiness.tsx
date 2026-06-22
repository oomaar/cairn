"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { computeKpis, listExpeditions, getIncidents } from "@/universe";
import { computeBaseScore } from "../utils/computeBaseScore";

interface ReadinessState {
  score: number;
  prevScore: number;
  gearPct: number;
  incidentsPerExp: string;
  openRisks: number;
  highRisks: number;
  activeExp: number;
  inField: number;
  tick: number;
}

export function CommandReadiness() {
  const [live, setLive] = useState<ReadinessState | null>(null);

  useEffect(() => {
    function compute(): ReadinessState {
      const kpis = computeKpis();
      const expeditions = listExpeditions().filter(
        (e) => e.status === "in-field",
      );
      const totalIncidents = expeditions.flatMap((e) =>
        getIncidents(e.id),
      ).length;
      const base = computeBaseScore(kpis);
      // Simulate small live drift ±2
      const drift = Math.round((Math.random() - 0.5) * 4);

      return {
        score: Math.min(100, Math.max(0, base + drift)),
        prevScore: base,
        gearPct: Math.round(kpis.equipment.readyPct),
        incidentsPerExp:
          expeditions.length > 0
            ? (totalIncidents / expeditions.length).toFixed(1)
            : "0.0",
        openRisks: kpis.openRisks.total,
        highRisks: kpis.openRisks.high,
        activeExp: kpis.activeExpeditions,
        inField: kpis.participantsInField,
        tick: Date.now(),
      };
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(compute());
    const id = setInterval(() => setLive(compute()), 3000);
    return () => clearInterval(id);
  }, []);

  if (!live) return null;

  const trend =
    live.score > live.prevScore ? "↑" : live.score < live.prevScore ? "↓" : "→";
  const trendColor =
    live.score > live.prevScore
      ? "text-accent"
      : live.score < live.prevScore
        ? "text-warn"
        : "text-fg-3";

  const filledBlocks = Math.round((live.score / 100) * 20);
  const scanBlock = Math.floor((live.tick / 300) % 20);

  const stats = [
    {
      label: "GEAR READY",
      value: `${live.gearPct}%`,
      tone: live.gearPct >= 90 ? "ok" : live.gearPct >= 75 ? "warn" : "danger",
    },
    {
      label: "INC / EXP",
      value: live.incidentsPerExp,
      tone:
        parseFloat(live.incidentsPerExp) <= 0.5
          ? "ok"
          : parseFloat(live.incidentsPerExp) <= 1.5
            ? "warn"
            : "danger",
    },
    {
      label: "OPEN RISKS",
      value: String(live.openRisks),
      sub: live.highRisks > 0 ? `${live.highRisks} HIGH` : undefined,
      tone: live.highRisks > 0 ? "danger" : live.openRisks > 3 ? "warn" : "ok",
    },
  ];

  const statColor: Record<string, string> = {
    ok: "text-accent",
    warn: "text-warn",
    danger: "text-danger",
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <Text
          variant="caption"
          tone="tertiary"
          className="block font-mono tracking-widest text-2xs uppercase"
        >
          Operational Readiness
        </Text>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-accent animate-pulse" />
          <Text
            variant="caption"
            tone="tertiary"
            className="font-mono text-2xs"
          >
            LIVE
          </Text>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className={cn(
            "font-mono text-4xl font-bold transition-all duration-500",
            live.score >= 80
              ? "text-accent"
              : live.score >= 60
                ? "text-warn"
                : "text-danger",
          )}
        >
          {live.score}
        </span>
        <span className="font-mono text-sm text-fg-3">/100</span>
        <span className={cn("font-mono text-sm font-bold ml-1", trendColor)}>
          {trend}
        </span>
        <span className="ml-auto font-mono text-2xs text-fg-3">
          {live.activeExp} ACTIVE · {live.inField} IN FIELD
        </span>
      </div>

      {/* Animated block gauge */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 flex-1 rounded-sm border transition-all duration-300",
              i < filledBlocks
                ? i === scanBlock
                  ? "bg-accent border-accent brightness-150"
                  : "bg-accent/40 border-accent/30"
                : "bg-inset border-border",
            )}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <Text
              variant="caption"
              tone="tertiary"
              className="block font-mono text-2xs uppercase tracking-wider"
            >
              {stat.label}
            </Text>
            <Text
              className={cn(
                "mt-1 block font-mono text-lg font-bold transition-colors duration-500",
                statColor[stat.tone],
              )}
            >
              {stat.value}
            </Text>
            {stat.sub && (
              <Text className="block font-mono text-2xs text-danger">
                {stat.sub}
              </Text>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
