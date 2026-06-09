"use client";

import { useMemo, useRef, useState } from "react";
import { Text } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { buildAlternateRoute, buildRoutePlan } from "../route.utils";
import { usePartyProgress } from "../use-party-progress";
import type { ChartLayers } from "../route.types";
import { SheetMeta } from "./sheet-meta";
import { StationSearch } from "./station-search";
import { PlottingTools } from "./plotting-tools";
import { ChartCanvas, type ChartHandle } from "./chart-canvas";
import { StationDetail } from "./station-detail";
import { RouteTimeline } from "./route-timeline";
import { RouteFooter } from "./route-footer";

const INITIAL_LAYERS: ChartLayers = {
  terrain: true,
  water: true,
  weather: false,
  risk: true,
  alternate: false,
};

/**
 * Route Planning — the Plan world's chart table. Plots the focused
 * expedition's route from the universe; pan/zoom the sheet, select stations,
 * search and jump-zoom, toggle layers, and compare a weather alternate.
 */
export function RoutePlanningWorkspace() {
  const { focusedExpeditionId } = useNavigation();
  const plan = useMemo(
    () => buildRoutePlan(focusedExpeditionId),
    [focusedExpeditionId],
  );
  const alternate = useMemo(
    () => (plan ? buildAlternateRoute(plan) : null),
    [plan],
  );

  const initialId = useMemo(() => {
    if (!plan) return "";
    const station =
      plan.stations.find((s) => s.status === "current") ??
      plan.stations.find((s) => s.hazard) ??
      plan.stations[0];
    return station?.id ?? "";
  }, [plan]);

  const [selectedId, setSelectedId] = useState(initialId);
  const [layers, setLayers] = useState<ChartLayers>(INITIAL_LAYERS);
  const chartRef = useRef<ChartHandle>(null);
  const partyT = usePartyProgress(plan?.stations ?? []);

  const toggleLayer = (key: keyof ChartLayers) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!plan) {
    return (
      <div className="grid flex-1 place-items-center">
        <Text variant="body" tone="tertiary">
          No route on file for this expedition.
        </Text>
      </div>
    );
  }

  const selected =
    plan.stations.find((s) => s.id === selectedId) ??
    plan.stations.find((s) => s.id === initialId) ??
    plan.stations[0];

  const pickStation = (id: string) => {
    const station = plan.stations.find((s) => s.id === id);
    if (!station) return;
    setSelectedId(id);
    chartRef.current?.focusOn(station.x, station.y);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SheetMeta plan={plan} />

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-44 flex-none flex-col overflow-y-auto border-r border-border bg-surface">
          <StationSearch stations={plan.stations} onPick={pickStation} />
          <PlottingTools layers={layers} onToggle={toggleLayer} />
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <ChartCanvas
            ref={chartRef}
            stations={plan.stations}
            selectedId={selected.id}
            onSelect={setSelectedId}
            layers={layers}
            distanceKm={plan.chartDistanceKm}
            originLat={plan.originLat}
            originLng={plan.originLng}
            alternate={layers.alternate ? alternate : null}
            partyT={partyT}
          />
        </div>

        <StationDetail station={selected} />
      </div>

      <RouteTimeline
        stations={plan.stations}
        selectedId={selected.id}
        onSelect={setSelectedId}
      />

      <RouteFooter
        plan={plan}
        selectedId={selected.id}
        onSelect={setSelectedId}
        alternate={layers.alternate ? alternate : null}
        partyT={partyT}
      />
    </div>
  );
}
