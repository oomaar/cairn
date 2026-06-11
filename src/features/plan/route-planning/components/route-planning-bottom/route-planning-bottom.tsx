import { Dispatch, SetStateAction } from "react";
import type { PlanStation, RoutePlan } from "../../types/route.types";
import type { AlternateRoute } from "../../utils/route.utils";
import type { RouteChoice } from "./route-comparison";
import { RouteTimeline } from "./route-timeline";
import { RouteFooter } from "./route-footer";

interface RoutePlanningBottomProps {
  stations: PlanStation[];
  selected: PlanStation;
  setSelectedId: Dispatch<SetStateAction<string>>;
  plan: RoutePlan;
  alternate: AlternateRoute | null;
  partyT: number;
  activeRoute: RouteChoice;
  canEdit: boolean;
  selectRoute: (choice: RouteChoice) => void;
  committed: boolean;
  commitRoute: () => void;
  revertRoute: () => void;
  hazardName?: string;
}

export function RoutePlanningBottom({
  stations,
  selected,
  setSelectedId,
  plan,
  alternate,
  partyT,
  activeRoute,
  canEdit,
  selectRoute,
  committed,
  commitRoute,
  revertRoute,
  hazardName,
}: RoutePlanningBottomProps) {
  return (
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
  );
}
