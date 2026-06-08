"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";

export type AvatarTone = "amber" | "olive" | "slate" | "quiet";

export interface LiveMember {
  id: string;
  name: string;
  initials: string;
  avatarTone: AvatarTone;
  roleLabel: string;
  pace: string;
  battery: number;
  heartRate: number;
  flag?: string;
}

export interface LiveSnapshot {
  expeditionName: string;
  dayCurrent: number;
  dayTotal: number;
  weather: { title: string; place: string; detail: string } | null;
  members: LiveMember[];
  positionLabel: string;
  nextLabel: string;
}

/** Sim clock starts at 10:30:00 — a fixed seed so SSR and first client render
 *  match; it advances only after mount. */
const START_SECONDS = 10 * 3600 + 30 * 60;
const HISTORY = 18;
const TELEMETRY_MS = 2400;

const pad = (n: number) => String(n).padStart(2, "0");
const formatClock = (total: number) =>
  `${pad(Math.floor(total / 3600) % 24)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

function Sparkline({ points }: { points: number[] }) {
  const w = 56;
  const h = 16;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(1, max - min);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 1 - ((p - min) / span) * (h - 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className="block text-accent-bright"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BatteryMeter({ level }: { level: number }) {
  const filled = Math.max(1, Math.round(level / 20));
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-1 rounded-[1px]",
              i < filled
                ? level <= 40
                  ? "bg-warn"
                  : "bg-accent"
                : "bg-border-strong",
            )}
          />
        ))}
      </span>
      <span className="w-8 text-right font-mono text-2xs text-fg-3">
        {level}%
      </span>
    </span>
  );
}

/**
 * The live command panel. Initial render uses the seeded snapshot (so SSR and
 * hydration match); after mount it advances a sim clock and walks each
 * member's vitals to make the operation feel alive. Respects reduced motion.
 */
export function LiveOperationPanel({ snapshot }: { snapshot: LiveSnapshot }) {
  const [clock, setClock] = useState(START_SECONDS);
  const bases = useRef(snapshot.members.map((m) => m.heartRate));
  const [live, setLive] = useState(() => ({
    members: snapshot.members,
    history: snapshot.members.map((m) =>
      Array<number>(HISTORY).fill(m.heartRate),
    ),
  }));

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const clockId = window.setInterval(() => setClock((c) => c + 1), 1000);
    const teleId = window.setInterval(() => {
      setLive((prev) => {
        const members = prev.members.map((m, i) => {
          const base = bases.current[i];
          const drift = Math.round((Math.random() - 0.5) * 6);
          const heartRate = clamp(m.heartRate + drift, base - 9, base + 12);
          const battery =
            Math.random() < 0.22 ? Math.max(38, m.battery - 1) : m.battery;
          return { ...m, heartRate, battery };
        });
        const history = prev.history.map((h, i) => [
          ...h.slice(1),
          members[i].heartRate,
        ]);
        return { members, history };
      });
    }, TELEMETRY_MS);

    return () => {
      window.clearInterval(clockId);
      window.clearInterval(teleId);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <Text variant="body-sm" as="p" className="font-medium">
            {snapshot.expeditionName}
          </Text>
          <Text variant="caption" as="p" tone="tertiary" className="font-mono">
            Day {snapshot.dayCurrent}/{snapshot.dayTotal}
          </Text>
        </div>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          AS OF {formatClock(clock)}
        </Text>
      </div>

      {/* Weather */}
      {snapshot.weather && (
        <div className="flex items-start gap-2.5 rounded-md border border-danger-line bg-danger-tint p-2.5">
          <Icon name="wind" size={16} className="mt-px text-danger-bright" />
          <div className="min-w-0">
            <Text
              variant="caption"
              as="p"
              className="font-semibold text-danger-bright"
            >
              {snapshot.weather.title} · {snapshot.weather.place}
            </Text>
            <Text variant="caption" as="p" tone="secondary">
              {snapshot.weather.detail}
            </Text>
          </div>
        </div>
      )}

      {/* Roster telemetry */}
      <ul className="flex flex-col divide-y divide-border-soft">
        {live.members.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 py-2.5">
            <Avatar initials={m.initials} size="sm" tone={m.avatarTone} />
            <div className="min-w-0 flex-1">
              <Text variant="caption" as="p" className="truncate text-fg-1">
                {m.name}
              </Text>
              <Text
                variant="caption"
                as="p"
                tone="tertiary"
                className="font-mono uppercase tracking-[0.04em]"
              >
                {m.roleLabel}
                {m.flag ? ` · ${m.flag}` : ""}
              </Text>
            </div>
            <Text
              variant="caption"
              as="span"
              className={cn(
                "hidden w-16 text-right font-mono sm:block",
                m.flag ? "text-warn" : "text-fg-3",
              )}
            >
              {m.pace}
            </Text>
            <div className="flex items-center gap-1.5">
              <Sparkline points={live.history[i]} />
              <Text
                variant="caption"
                as="span"
                className="w-12 text-right font-mono text-fg-2"
              >
                {m.heartRate} bpm
              </Text>
            </div>
            <div className="hidden md:block">
              <BatteryMeter level={m.battery} />
            </div>
          </li>
        ))}
      </ul>

      {/* Position footer */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-3 font-mono text-2xs text-fg-3">
        <span className="text-fg-2">{snapshot.positionLabel}</span>
        <span className="flex items-center gap-1.5">
          <Icon name="arrowR" size={12} />
          Next: {snapshot.nextLabel}
        </span>
      </div>
    </div>
  );
}
