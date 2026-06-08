"use client";

import { useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CheckpointStatus, CheckpointType } from "@/universe";
import { ElevationCrossSection } from "./elevation-cross-section";

export interface PlanCheckpoint {
  id: string;
  name: string;
  km: number;
  elevationM: number;
  eta: string;
  type: CheckpointType;
  status: CheckpointStatus;
  hazard: boolean;
  segmentKm: number;
  gradientPct: number;
  alert: { title: string; detail: string } | null;
}

export interface PlanSnapshot {
  expeditionName: string;
  grade: string;
  chartDistanceKm: number;
  peakElevationM: number;
  elevationProfile: number[];
  checkpoints: PlanCheckpoint[];
}

const STATUS_DOT: Record<CheckpointStatus, string> = {
  done: "bg-fg-4",
  current: "bg-accent",
  ahead: "border border-border-strong",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="font-mono text-3xs uppercase tracking-[0.08em]"
      >
        {label}
      </Text>
      <Text variant="body-sm" as="p" className="mt-0.5 font-medium">
        {value}
      </Text>
    </div>
  );
}

/** Interactive route planning: pick a checkpoint on the profile or in the
 *  list to inspect its station detail; hazards surface their linked weather. */
export function RoutePlanningPanel({ snapshot }: { snapshot: PlanSnapshot }) {
  const initial =
    snapshot.checkpoints.find((c) => c.status === "current") ??
    snapshot.checkpoints.find((c) => c.hazard) ??
    snapshot.checkpoints[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const selected =
    snapshot.checkpoints.find((c) => c.id === selectedId) ?? initial;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Text variant="body-sm" as="p" className="font-medium">
          {snapshot.expeditionName}
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {snapshot.chartDistanceKm} km · ▲{snapshot.peakElevationM} m ·{" "}
          {snapshot.grade}
        </Text>
      </div>

      {/* Elevation cross-section */}
      <div className="rounded-md border border-border-soft bg-inset p-3">
        <ElevationCrossSection
          profile={snapshot.elevationProfile}
          distanceKm={snapshot.chartDistanceKm}
          markers={snapshot.checkpoints.map((c) => ({
            id: c.id,
            km: c.km,
            hazard: c.hazard,
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Checkpoint list */}
        <ul className="flex flex-col gap-0.5">
          {snapshot.checkpoints.map((cp) => {
            const on = cp.id === selectedId;
            return (
              <li key={cp.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(cp.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md border-l-2 px-2.5 py-2 text-left transition-colors",
                    on
                      ? "border-accent bg-raised"
                      : "border-transparent hover:bg-raised/60",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 flex-none rounded-full",
                      STATUS_DOT[cp.status],
                    )}
                  />
                  <Text
                    variant="caption"
                    as="span"
                    className="flex-1 truncate text-fg-1"
                  >
                    {cp.name}
                  </Text>
                  {cp.hazard && (
                    <Icon
                      name="alert"
                      size={12}
                      className="flex-none text-danger-bright"
                    />
                  )}
                  <Text
                    variant="caption"
                    as="span"
                    tone="tertiary"
                    className="font-mono"
                  >
                    {cp.km} km
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Station detail */}
        {selected && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <Text
              variant="caption"
              as="p"
              tone="tertiary"
              className="font-mono text-3xs uppercase tracking-widest"
            >
              {selected.type} · selected
            </Text>
            <Text as="p" variant="title" className="mt-1 text-lg">
              {selected.name}
            </Text>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-soft pt-4">
              <Stat label="Elevation" value={`${selected.elevationM} m`} />
              <Stat
                label="Gradient"
                value={`${selected.gradientPct >= 0 ? "+" : ""}${selected.gradientPct}%`}
              />
              <Stat label="Segment" value={`${selected.segmentKm} km`} />
              <Stat label="ETA" value={selected.eta} />
            </div>

            {selected.alert ? (
              <div className="mt-4 rounded-md border border-danger-line bg-danger-tint p-2.5">
                <Text
                  variant="caption"
                  as="p"
                  className="font-mono text-3xs uppercase tracking-[0.06em] text-danger-bright"
                >
                  ⚠ Hazard · {selected.alert.title}
                </Text>
                <Text
                  variant="caption"
                  as="p"
                  tone="secondary"
                  className="mt-1"
                >
                  {selected.alert.detail}
                </Text>
              </div>
            ) : (
              selected.hazard && (
                <div className="mt-4 rounded-md border border-warn-line bg-warn-tint p-2.5">
                  <Text
                    variant="caption"
                    as="p"
                    className="font-mono text-3xs uppercase tracking-[0.06em] text-warn"
                  >
                    ⚠ Exposed checkpoint
                  </Text>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
