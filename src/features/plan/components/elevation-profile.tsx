"use client";

import { useState } from "react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlanStation } from "../route.types";

const W = 760;
const H = 150;

interface ElevationProfileProps {
  profile: number[];
  stations: PlanStation[];
  chartDistanceKm: number;
  selectedId: string;
  onSelect: (id: string) => void;
  /** Live party position as a fraction of total distance (0..1). */
  partyT: number;
}

/**
 * Interactive elevation cross-section: hypsometric fill, a hover scrubber that
 * reads distance + elevation anywhere on the line, clickable station markers
 * synced with the chart, and the live party position.
 */
export function ElevationProfile({
  profile,
  stations,
  chartDistanceKm,
  selectedId,
  onSelect,
  partyT,
}: ElevationProfileProps) {
  const [hoverF, setHoverF] = useState<number | null>(null);

  const max = Math.max(...profile);
  const min = Math.min(...profile);
  const span = Math.max(1, max - min);
  const toY = (v: number) => H - 12 - ((v - min) / span) * (H - 30);
  const xy = profile.map(
    (p, i) => [(i / (profile.length - 1)) * W, toY(p)] as const,
  );
  const line = `M${xy.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}`;
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  const elevAt = (f: number) => {
    const idx = f * (profile.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return profile[lo] + (profile[hi] - profile[lo]) * (idx - lo);
  };
  const yAtF = (f: number) => toY(elevAt(f));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverF(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  const readF = hoverF;
  const selected = stations.find((s) => s.id === selectedId);
  const readKm = readF != null ? readF * chartDistanceKm : (selected?.km ?? 0);
  const readElev = readF != null ? elevAt(readF) : (selected?.elevationM ?? 0);
  const partyX = partyT * W;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-36 w-full"
        onPointerMove={onMove}
        onPointerLeave={() => setHoverF(null)}
      >
        <defs>
          <linearGradient id="hyps" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#13211c" />
            <stop offset="0.5" stopColor="#274536" />
            <stop offset="0.85" stopColor="#5d6b46" />
            <stop offset="1" stopColor="#97a35c" />
          </linearGradient>
        </defs>

        <path d={area} fill="url(#hyps)" opacity={0.8} />
        <path d={line} fill="none" strokeWidth={2} className="stroke-accent" />

        {/* Station markers */}
        {stations.map((s) => {
          const f =
            chartDistanceKm > 0 ? Math.min(1, s.km / chartDistanceKm) : 0;
          const x = f * W;
          const y = yAtF(f);
          const sel = s.id === selectedId;
          return (
            <g
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="cursor-pointer"
            >
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={H}
                strokeWidth={1}
                strokeDasharray="2 3"
                className={
                  s.hazard
                    ? "stroke-(--plan-signal)"
                    : sel
                      ? "stroke-accent"
                      : "stroke-fg-4"
                }
              />
              <circle
                cx={x}
                cy={y}
                r={sel ? 4.5 : 3}
                strokeWidth={2}
                className={cn(
                  "fill-app",
                  s.hazard ? "stroke-(--plan-signal)" : "stroke-accent",
                )}
              />
            </g>
          );
        })}

        {/* Live party */}
        <g pointerEvents="none">
          <circle
            cx={partyX}
            cy={yAtF(partyT)}
            r={8}
            className="fill-accent"
            opacity={0.18}
          />
          <circle
            cx={partyX}
            cy={yAtF(partyT)}
            r={3.5}
            className="fill-accent stroke-app"
            strokeWidth={1.5}
          />
        </g>

        {/* Hover scrubber */}
        {hoverF != null && (
          <g pointerEvents="none">
            <line
              x1={hoverF * W}
              y1={0}
              x2={hoverF * W}
              y2={H}
              strokeWidth={1}
              strokeDasharray="3 3"
              className="stroke-accent"
              opacity={0.6}
            />
            <circle
              cx={hoverF * W}
              cy={yAtF(hoverF)}
              r={3.5}
              className="fill-accent-bright stroke-app"
              strokeWidth={1.5}
            />
          </g>
        )}
      </svg>

      {/* Elevation axis labels */}
      <span className="pointer-events-none absolute left-1 top-1 font-mono text-3xs text-fg-3">
        ▲{max} m
      </span>
      <span className="pointer-events-none absolute bottom-1 left-1 font-mono text-3xs text-fg-3">
        {min} m
      </span>

      {/* Readout (hover, else selected) */}
      <div className="pointer-events-none absolute right-1 top-1 rounded border border-border bg-app/80 px-2 py-1 text-right font-mono text-3xs text-fg-2 backdrop-blur-sm">
        <Text variant="caption" as="span" className="font-mono text-fg-1">
          {readKm.toFixed(1)} km · {Math.round(readElev)} m
        </Text>
      </div>
    </div>
  );
}
