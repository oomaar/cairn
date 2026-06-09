"use client";

import { useMemo, useRef, useState } from "react";
import { Text } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { useCan } from "@/features/session";
import {
  buildAlternateRoute,
  buildRoutePlan,
  insertCheckpoint,
  reindexStations,
  reorderStations,
} from "../route.utils";
import { usePartyProgress } from "../use-party-progress";
import type { ChartLayers, PlanStation, RoutePlan } from "../route.types";
import { SheetMeta } from "./sheet-meta";
import { StationSearch } from "./station-search";
import { PlottingTools } from "./plotting-tools";
import { ChartCanvas, type ChartHandle } from "./chart-canvas";
import { CheckpointList } from "./checkpoint-list";
import { StationDetail } from "./station-detail";
import { RouteTimeline } from "./route-timeline";
import { RouteFooter } from "./route-footer";

const INITIAL_LAYERS: ChartLayers = {
  terrain: true,
  water: true,
  weather: true,
  risk: true,
  alternate: false,
};

function initialStationId(stations: PlanStation[]): string {
  const s =
    stations.find((x) => x.status === "current") ??
    stations.find((x) => x.hazard) ??
    stations[0];
  return s?.id ?? "";
}

/**
 * The editable chart table for one route. `plan` carries the immutable terrain
 * (elevation, sheet, distance); the checkpoint set is a local working copy so
 * planners can add and remove stations. Keyed on expedition, so switching
 * expeditions re-seeds a fresh working copy.
 */
function RoutePlanningInner({ plan }: { plan: RoutePlan }) {
  const canEdit = useCan("routes:edit");
  const [stations, setStations] = useState<PlanStation[]>(plan.stations);
  const [selectedId, setSelectedId] = useState(() =>
    initialStationId(plan.stations),
  );
  const [layers, setLayers] = useState<ChartLayers>(INITIAL_LAYERS);
  const chartRef = useRef<ChartHandle>(null);
  const partyT = usePartyProgress(stations);

  const alternate = useMemo(() => buildAlternateRoute(plan), [plan]);
  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];

  const toggleLayer = (key: keyof ChartLayers) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const pickStation = (id: string) => {
    const station = stations.find((s) => s.id === id);
    if (!station) return;
    setSelectedId(id);
    chartRef.current?.focusOn(station.x, station.y);
  };

  const addCheckpoint = () => {
    const afterIndex = stations.findIndex((s) => s.id === selectedId);
    const next = insertCheckpoint(
      stations,
      afterIndex < 0 ? 0 : afterIndex,
      plan.elevationProfile,
      plan.chartDistanceKm,
      plan.originLat,
      plan.originLng,
    );
    setStations(next);
    const created = next.find((s) => !stations.some((p) => p.id === s.id));
    if (created) setSelectedId(created.id);
  };

  const removeCheckpoint = (id: string) => {
    if (stations.length <= 2) return;
    const next = reindexStations(
      stations.filter((s) => s.id !== id),
      plan.originLat,
      plan.originLng,
    );
    setStations(next);
    if (selectedId === id) setSelectedId(initialStationId(next));
  };

  const updateCheckpoint = (id: string, patch: Partial<PlanStation>) =>
    setStations((prev) =>
      reindexStations(
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        plan.originLat,
        plan.originLng,
      ),
    );

  const moveCheckpoint = (fromIndex: number, toIndex: number) =>
    setStations((prev) =>
      reorderStations(
        prev,
        fromIndex,
        toIndex,
        plan.chartDistanceKm,
        plan.originLat,
        plan.originLng,
      ),
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SheetMeta plan={plan} />

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-44 flex-none flex-col overflow-y-auto border-r border-border bg-surface">
          <StationSearch stations={stations} onPick={pickStation} />
          <PlottingTools layers={layers} onToggle={toggleLayer} />
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <ChartCanvas
            ref={chartRef}
            stations={stations}
            selectedId={selected.id}
            onSelect={setSelectedId}
            layers={layers}
            distanceKm={plan.chartDistanceKm}
            originLat={plan.originLat}
            originLng={plan.originLng}
            alternate={layers.alternate ? alternate : null}
            weather={plan.weather}
            partyT={partyT}
          />
        </div>

        <aside className="flex w-72 flex-none flex-col border-l border-border bg-surface">
          <CheckpointList
            stations={stations}
            selectedId={selected.id}
            onSelect={setSelectedId}
            onAdd={canEdit ? addCheckpoint : undefined}
            onRemove={canEdit ? removeCheckpoint : undefined}
            onMove={canEdit ? moveCheckpoint : undefined}
          />
          <StationDetail
            station={selected}
            onChange={
              canEdit
                ? (patch) => updateCheckpoint(selected.id, patch)
                : undefined
            }
          />
        </aside>
      </div>

      <RouteTimeline
        stations={stations}
        selectedId={selected.id}
        onSelect={setSelectedId}
      />

      <RouteFooter
        plan={plan}
        stations={stations}
        selectedId={selected.id}
        onSelect={setSelectedId}
        alternate={layers.alternate ? alternate : null}
        partyT={partyT}
      />
    </div>
  );
}

/**
 * Route Planning — the Plan world's chart table. Resolves the focused
 * expedition's route, then hands an editable working copy to the inner
 * workspace (keyed so it resets when the expedition changes).
 */
export function RoutePlanningWorkspace() {
  const { focusedExpeditionId } = useNavigation();
  const plan = useMemo(
    () => buildRoutePlan(focusedExpeditionId),
    [focusedExpeditionId],
  );

  if (!plan) {
    return (
      <div className="grid flex-1 place-items-center">
        <Text variant="body" tone="tertiary">
          No route on file for this expedition.
        </Text>
      </div>
    );
  }

  return <RoutePlanningInner key={plan.expeditionId} plan={plan} />;
}
