"use client";

import { useMemo, useRef, useState } from "react";
import { Text } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { useCan, useSession } from "@/features/session";
import {
  buildAlternateRoute,
  buildRoutePlan,
  commitAlternateRoute,
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
import type { RouteChoice } from "./route-comparison";
import { PlanningNotes } from "./planning-notes";
import { buildPlanningNotes, makeNote } from "../planning-notes.utils";
import type { PlanningNote } from "../planning-notes.types";

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
  const { currentUser } = useSession();
  const [stations, setStations] = useState<PlanStation[]>(plan.stations);
  const [selectedId, setSelectedId] = useState(() =>
    initialStationId(plan.stations),
  );
  const [layers, setLayers] = useState<ChartLayers>(INITIAL_LAYERS);
  const [activeRoute, setActiveRoute] = useState<RouteChoice>("primary");
  // Chart layout: collapse either rail, or focus the chart on its own. The
  // rails stack above/below the chart on small screens and sit inline on wide.
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [focus, setFocus] = useState(false);
  // When the alternate is adopted, the working set follows it; we snapshot the
  // pre-commit checkpoints so the planner can revert.
  const [preCommit, setPreCommit] = useState<PlanStation[] | null>(null);
  // The route's planning log — seeded history plus anything filed this session.
  const [notes, setNotes] = useState<PlanningNote[]>(() =>
    buildPlanningNotes(plan.expeditionId, plan.stations),
  );
  const noteSeq = useRef(0);
  const chartRef = useRef<ChartHandle>(null);
  const partyT = usePartyProgress(stations);

  const alternate = useMemo(() => buildAlternateRoute(plan), [plan]);
  const hazardName = useMemo(
    () => plan.stations.find((s) => s.hazard)?.name,
    [plan],
  );
  const committed = preCommit !== null;
  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];

  const toggleLayer = (key: keyof ChartLayers) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // Previewing a line surfaces it on the chart and makes sure the alternate is
  // actually drawn.
  const selectRoute = (choice: RouteChoice) => {
    setActiveRoute(choice);
    if (choice === "alternate")
      setLayers((prev) => ({ ...prev, alternate: true }));
  };

  // Adopt the alternate into the working checkpoint set. From here the route,
  // profile and timeline all follow the bypass until reverted.
  const commitRoute = () => {
    setPreCommit(stations);
    setStations(commitAlternateRoute(stations, plan.originLat, plan.originLng));
    setActiveRoute("primary");
    setLayers((prev) => ({ ...prev, alternate: false }));
  };

  const revertRoute = () => {
    if (preCommit) setStations(preCommit);
    setPreCommit(null);
  };

  // The alternate overlay shows when explicitly toggled or when it is the
  // previewed line; the comparison panel lists it regardless.
  const showAlternate =
    !committed && (layers.alternate || activeRoute === "alternate");

  const pickStation = (id: string) => {
    const station = stations.find((s) => s.id === id);
    if (!station) return;
    setSelectedId(id);
    chartRef.current?.focusOn(station.x, station.y);
  };

  const addNote = (body: string, checkpointId: string | null) => {
    noteSeq.current += 1;
    const topOrder = notes.reduce((max, n) => Math.max(max, n.order), 0);
    setNotes((prev) => [
      makeNote(currentUser, body, checkpointId, topOrder, noteSeq.current),
      ...prev,
    ]);
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

  const showLeft = leftOpen && !focus;
  const showRight = rightOpen && !focus;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <SheetMeta
        plan={plan}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        focus={focus}
        onToggleLeft={() => setLeftOpen((v) => !v)}
        onToggleRight={() => setRightOpen((v) => !v)}
        onToggleFocus={() => setFocus((v) => !v)}
      />

      <div className="flex flex-col lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden">
        {showLeft && (
          <aside className="order-2 flex w-full flex-none flex-col border-t border-border bg-surface lg:order-1 lg:w-52 lg:overflow-y-auto lg:border-r lg:border-t-0">
            <StationSearch stations={stations} onPick={pickStation} />
            <PlottingTools layers={layers} onToggle={toggleLayer} />
            <span className="mx-4 my-1 h-px bg-border" />
            <PlanningNotes
              notes={notes}
              stations={stations}
              selectedId={selected.id}
              onSelectCheckpoint={pickStation}
              onAdd={canEdit ? addNote : undefined}
            />
          </aside>
        )}

        <div className="relative order-1 min-h-[55vh] w-full min-w-0 overflow-hidden lg:order-2 lg:min-h-0 lg:flex-1">
          <ChartCanvas
            ref={chartRef}
            stations={stations}
            selectedId={selected.id}
            onSelect={setSelectedId}
            layers={layers}
            distanceKm={plan.chartDistanceKm}
            originLat={plan.originLat}
            originLng={plan.originLng}
            alternate={showAlternate ? alternate : null}
            activeRoute={activeRoute}
            weather={plan.weather}
            risks={plan.risks}
            partyT={partyT}
          />
        </div>

        {showRight && (
          <aside className="order-3 flex w-full flex-none flex-col border-t border-border bg-surface lg:w-72 lg:border-l lg:border-t-0">
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
        )}
      </div>

      {!focus && (
        <>
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
            alternate={alternate}
            partyT={partyT}
            activeRoute={activeRoute}
            onSelectRoute={canEdit ? selectRoute : undefined}
            committed={committed}
            onCommitRoute={canEdit ? commitRoute : undefined}
            onRevertRoute={canEdit ? revertRoute : undefined}
            hazardName={hazardName}
          />
        </>
      )}
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
