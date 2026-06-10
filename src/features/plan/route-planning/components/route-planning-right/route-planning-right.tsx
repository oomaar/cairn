import { Dispatch, SetStateAction } from "react";
import type { PlanStation } from "../../types/route.types";
import { CheckpointList } from "./checkpoint-list";
import { StationDetail } from "./station-detail";

interface RoutePlanningRightProps {
  stations: PlanStation[];
  selected: PlanStation;
  setSelectedId: Dispatch<SetStateAction<string>>;
  canEdit: boolean;
  addCheckpoint: () => void;
  removeCheckpoint: (id: string) => void;
  moveCheckpoint: (fromIndex: number, toIndex: number) => void;
  updateCheckpoint: (id: string, patch: Partial<PlanStation>) => void;
}

export function RoutePlanningRight({
  stations,
  selected,
  setSelectedId,
  canEdit,
  addCheckpoint,
  removeCheckpoint,
  moveCheckpoint,
  updateCheckpoint,
}: RoutePlanningRightProps) {
  return (
    <aside className="order-3 flex w-full flex-none flex-col border-t border-border bg-surface lg:w-72 lg:border-l lg:border-t-0 mb-">
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
          canEdit ? (patch) => updateCheckpoint(selected.id, patch) : undefined
        }
      />
    </aside>
  );
}
