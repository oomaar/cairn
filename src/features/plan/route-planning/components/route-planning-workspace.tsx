"use client";

import { useMemo, useRef, useState } from "react";
import { Text } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { useCan, useSession } from "@/features/session";
import { getExpeditionsForPerson } from "@/universe";
import {
  buildAlternateRoute,
  buildRoutePlan,
  commitAlternateRoute,
  insertCheckpoint,
  reindexStations,
  reorderStations,
} from "../utils/route.utils";
import { usePartyProgress } from "../hooks/use-party-progress";
import type { ChartLayers, PlanStation, RoutePlan } from "../types/route.types";
import { SheetMeta } from "./sheet-meta";
import { ChartCanvas, type ChartHandle } from "./chart-canvas";
import { buildPlanningNotes, makeNote } from "../utils/planning-notes.utils";
import type { PlanningNote } from "../types/planning-notes.types";
import { RoutePlanningLeft } from "./route-planning-left/route-planning-left";
import { RoutePlanningRight } from "./route-planning-right/route-planning-right";
import { RoutePlanningBottom } from "./route-planning-bottom/route-planning-bottom";
import type { RouteChoice } from "./route-planning-bottom/route-comparison";

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
          <RoutePlanningLeft
            stations={stations}
            pickStation={pickStation}
            layers={layers}
            toggleLayer={toggleLayer}
            notes={notes}
            selected={selected}
            canEdit={canEdit}
            addNote={addNote}
          />
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
          <RoutePlanningRight
            stations={stations}
            selected={selected}
            setSelectedId={setSelectedId}
            canEdit={canEdit}
            addCheckpoint={addCheckpoint}
            removeCheckpoint={removeCheckpoint}
            moveCheckpoint={moveCheckpoint}
            updateCheckpoint={updateCheckpoint}
          />
        )}
      </div>

      {!focus && (
        <RoutePlanningBottom
          stations={stations}
          selected={selected}
          setSelectedId={setSelectedId}
          plan={plan}
          alternate={alternate}
          partyT={partyT}
          activeRoute={activeRoute}
          canEdit={canEdit}
          selectRoute={selectRoute}
          committed={committed}
          commitRoute={commitRoute}
          revertRoute={revertRoute}
          hazardName={hazardName}
        />
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
  const { can, currentUser } = useSession();

  // When the role cannot view all expeditions, clamp the focused expedition to
  // one the current user is actually assigned to.
  const resolvedId = useMemo(() => {
    if (can("expeditions:view-all") || !currentUser) return focusedExpeditionId;
    const allowed = getExpeditionsForPerson(currentUser.id);
    if (allowed.some((e) => e.id === focusedExpeditionId))
      return focusedExpeditionId;
    return allowed[0]?.id ?? focusedExpeditionId;
  }, [focusedExpeditionId, can, currentUser]);

  const plan = useMemo(() => buildRoutePlan(resolvedId), [resolvedId]);

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
