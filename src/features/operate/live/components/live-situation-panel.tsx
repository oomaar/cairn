"use client";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { LiveExpeditionState } from "../types/live-expedition.types";

interface LiveSituationPanelProps {
  state: LiveExpeditionState;
  expeditionName: string;
  distanceKm: number;
}

const W = 560,
  H = 200;
const X0 = 40,
  X1 = 520;
const Y_TOP = 45,
  Y_BOT = 165;

export function LiveSituationPanel({
  state,
  expeditionName,
  distanceKm,
}: LiveSituationPanelProps) {
  const {
    checkpoints,
    currentCheckpointIndex,
    progressPct,
    nextCheckpoint,
    currentLocation,
    participants,
    status,
  } = state;

  if (checkpoints.length === 0) return null;

  const n = checkpoints.length;

  // Map each checkpoint to SVG x/y
  const elevs = checkpoints.map((c) => c.elevationM);
  const minE = Math.min(...elevs);
  const maxE = Math.max(...elevs);
  const eRange = Math.max(maxE - minE, 80);

  const nodes = checkpoints.map((cp, i) => ({
    cp,
    x: X0 + (i / Math.max(n - 1, 1)) * (X1 - X0),
    y: Y_BOT - ((cp.elevationM - minE) / eRange) * (Y_BOT - Y_TOP),
  }));

  const cur = nodes[currentCheckpointIndex] ?? nodes[0]!;
  const routePts = nodes.map((n) => `${n.x},${n.y}`).join(" ");

  const travelledKm = ((progressPct / 100) * distanceKm).toFixed(1);
  const statusLabel =
    status === "in-transit"
      ? "MOVING"
      : status === "camped"
        ? "CAMPED"
        : status === "emergency"
          ? "EMERGENCY"
          : "HOLDING";

  const footerStats = [
    ["POSITION", checkpoints[currentCheckpointIndex]?.name ?? "—"] as const,
    [
      "NEXT",
      `${nextCheckpoint.name} · ${nextCheckpoint.distanceKm} km`,
    ] as const,
    ["DISTANCE", `${travelledKm} / ${distanceKm} km`] as const,
    ["ELEV", `${currentLocation.elevation.toLocaleString()} m`] as const,
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border">
      {/* Bezel label */}
      <div className="flex-none border-b border-border px-4 py-2">
        <Text
          variant="caption"
          tone="tertiary"
          className="font-mono text-2xs uppercase tracking-widest"
        >
          Situation · {expeditionName}
        </Text>
      </div>

      {/* Route schematic */}
      <div className="min-h-0 flex-1 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Etched grid */}
          <g stroke="var(--border-base)" strokeWidth="0.6" opacity="0.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * (H / 4)}
                x2={W}
                y2={i * (H / 4)}
              />
            ))}
          </g>

          {/* Route: thick background track */}
          <polyline
            points={routePts}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Route: thin accent overlay */}
          <polyline
            points={routePts}
            fill="none"
            stroke="var(--operate-sage-dim, var(--ok))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />

          {/* Checkpoint nodes + labels */}
          {nodes.map(({ cp, x, y }) => {
            const isCur = cp.status === "current";
            const r = isCur ? 7 : 5;
            const sw = isCur ? 3 : 2;
            const stroke =
              cp.status === "done"
                ? "var(--ok)"
                : cp.status === "current"
                  ? "var(--accent)"
                  : cp.hazard
                    ? "var(--danger)"
                    : "var(--fg-4)";
            const labelFill =
              cp.status === "current"
                ? "var(--accent)"
                : cp.hazard
                  ? "var(--danger)"
                  : "var(--fg-4)";
            const label = cp.name.toUpperCase().slice(0, 7);

            return (
              <g key={cp.id}>
                <text
                  x={x}
                  y={y - 13}
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                  fill={labelFill}
                >
                  {label}
                </text>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="var(--bg-surface)"
                  stroke={stroke}
                  strokeWidth={sw}
                />
              </g>
            );
          })}

          {/* Group glow at current position */}
          <circle cx={cur.x} cy={cur.y} r="16" fill="var(--ok)" opacity="0.1" />

          {/* Participant scatter */}
          {(
            [
              [0, 0],
              [10, 7],
              [-9, 8],
              [7, -9],
            ] as [number, number][]
          ).map(([dx, dy], i) => (
            <circle
              key={i}
              cx={cur.x + dx}
              cy={cur.y + dy}
              r="3"
              fill={i === 1 ? "var(--warn)" : "var(--ok)"}
            />
          ))}

          {/* Group status label */}
          <text
            x={cur.x}
            y={cur.y + 30}
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            fill="var(--fg-3)"
          >
            GROUP · {participants.length} · {statusLabel}
          </text>
        </svg>
      </div>

      {/* Footer stats bar */}
      <div className="flex flex-none border-t border-border">
        {footerStats.map(([label, value], i) => (
          <div
            key={label}
            className={cn(
              "min-w-0 flex-1 px-3 py-2.5",
              i > 0 && "border-l border-border",
            )}
          >
            <Text
              variant="caption"
              tone="tertiary"
              className="block font-mono text-2xs uppercase tracking-wider"
            >
              {label}
            </Text>
            <Text className="mt-0.5 block truncate text-sm font-semibold">
              {value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
