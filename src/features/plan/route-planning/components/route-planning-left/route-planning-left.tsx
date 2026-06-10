import type { PlanningNote } from "../../types/planning-notes.types";
import type { ChartLayers, PlanStation } from "../../types/route.types";
import { PlanningNotes } from "./planning-notes";
import { PlottingTools } from "./plotting-tools";
import { StationSearch } from "./station-search";

interface RoutePlanningLeftProps {
  stations: PlanStation[];
  pickStation: (id: string) => void;
  layers: ChartLayers;
  toggleLayer: (key: keyof ChartLayers) => void;
  notes: PlanningNote[];
  selected: PlanStation;
  canEdit: boolean;
  addNote: (body: string, checkpointId: string | null) => void;
}

export function RoutePlanningLeft({
  stations,
  pickStation,
  layers,
  toggleLayer,
  notes,
  selected,
  canEdit,
  addNote,
}: RoutePlanningLeftProps) {
  return (
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
  );
}
