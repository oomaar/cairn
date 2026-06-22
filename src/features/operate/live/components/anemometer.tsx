"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CARDINAL_DIRECTIONS } from "../data/CARDINAL_DIRECTIONS";

interface AnemometerProps {
  windSpeed: number;
  windThreshold?: number;
}

export function Anemometer({ windSpeed, windThreshold = 40 }: AnemometerProps) {
  const maxKmh = 100;
  const pct = Math.min(windSpeed / maxKmh, 1) * 100;
  const threshPct = Math.min(windThreshold / maxKmh, 1) * 100;
  const isExceeded = windSpeed > windThreshold;

  const directionIndex = Math.floor(windSpeed % 16);
  const direction = CARDINAL_DIRECTIONS[directionIndex];

  // 270° sweep: start bottom-left (135°), clockwise to bottom-right (405° = 45°)
  const R = 78,
    cx = 100,
    cy = 100;
  const a0 = 135,
    a1 = 405;
  const r4 = (n: number) => Math.round(n * 1e4) / 1e4;
  const ang = (v: number) => ((a0 + (v / 100) * (a1 - a0)) * Math.PI) / 180;
  const pt = (v: number, r: number): [number, number] => [
    r4(cx + Math.cos(ang(v)) * r),
    r4(cy + Math.sin(ang(v)) * r),
  ];
  const arc = (v0: number, v1: number, r: number): string => {
    const [x0, y0] = pt(v0, r);
    const [x1, y1] = pt(v1, r);
    const large = ((v1 - v0) / 100) * 270 > 180 ? 1 : 0;
    return `M${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };

  const [npx, npy] = pt(pct, R - 12);
  const [tx0, ty0] = pt(threshPct, R - 10);
  const [tx1, ty1] = pt(threshPct, R + 10);

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        isExceeded ? "border-danger bg-danger/5" : "border-border bg-surface",
      )}
    >
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-2 block font-mono text-2xs uppercase tracking-widest"
      >
        Wind Conditions
      </Text>

      <svg viewBox="0 0 200 190" className="block w-full">
        {/* Gray track background */}
        <path
          d={arc(0, 100, R)}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="8"
        />
        {/* Safe zone */}
        <path
          d={arc(0, threshPct, R)}
          fill="none"
          stroke="var(--ok)"
          strokeWidth="8"
          opacity="0.5"
        />
        {/* Danger zone */}
        <path
          d={arc(threshPct, 100, R)}
          fill="none"
          stroke="var(--danger)"
          strokeWidth="8"
          opacity="0.55"
        />

        {/* Tick marks at 0 / 25 / 50 / 75 / 100 */}
        {[0, 25, 50, 75, 100].map((v) => {
          const [x0, y0] = pt(v, R - 6);
          const [x1, y1] = pt(v, R + 6);
          return (
            <line
              key={v}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke="var(--fg-4)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Scale labels at 0 / 50 / 100 */}
        {[0, 50, 100].map((v) => {
          const [x, y] = pt(v, R + 18);
          return (
            <text
              key={v}
              x={x}
              y={y + 3}
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
              fill={v >= threshPct ? "var(--danger)" : "var(--fg-4)"}
            >
              {v}
            </text>
          );
        })}

        {/* Threshold marker line */}
        <line
          x1={tx0}
          y1={ty0}
          x2={tx1}
          y2={ty1}
          stroke="var(--danger)"
          strokeWidth="2"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={npx}
          y2={npy}
          stroke={isExceeded ? "var(--danger)" : "var(--ok)"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Pivot circle */}
        <circle
          cx={cx}
          cy={cy}
          r="5"
          fill="var(--bg-surface)"
          stroke={isExceeded ? "var(--danger)" : "var(--ok)"}
          strokeWidth="2"
        />

        {/* Numeric readout */}
        <text
          x={cx}
          y={cy + 34}
          fontSize="30"
          fontWeight="700"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          fill={isExceeded ? "var(--danger)" : "var(--fg-1)"}
        >
          {String(Math.round(windSpeed)).padStart(3, "0")}
        </text>
        {/* Unit and direction sub-label */}
        <text
          x={cx}
          y={cy + 50}
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          fill="var(--fg-3)"
        >
          KM/H · {direction}
        </text>
      </svg>

      {isExceeded && (
        <div className="mt-1 rounded border border-danger bg-danger/5 px-3 py-2 text-center">
          <Text className="font-mono text-xs font-bold tracking-wide text-danger">
            THRESHOLD {windThreshold} KM/H — EXCEEDED
          </Text>
        </div>
      )}
    </div>
  );
}
