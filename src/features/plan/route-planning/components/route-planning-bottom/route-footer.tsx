import { Text } from "@/components/ui";
import type { AlternateRoute } from "../../utils/route.utils";
import type { PlanStation, RoutePlan } from "../../types/route.types";
import { ElevationProfile } from "./elevation-profile";
import { SummaryRow } from "./summary-row";
import { RouteComparison, type RouteChoice } from "./route-comparison";

interface RouteFooterProps {
  plan: RoutePlan;
  stations: PlanStation[];
  selectedId: string;
  onSelect: (id: string) => void;
  alternate: AlternateRoute | null;
  partyT: number;
  activeRoute: RouteChoice;
  onSelectRoute?: (choice: RouteChoice) => void;
  committed: boolean;
  onCommitRoute?: () => void;
  onRevertRoute?: () => void;
  hazardName?: string;
}

/** Footer: elevation cross-section (left) + route summary (right). */
export function RouteFooter({
  plan,
  stations,
  selectedId,
  onSelect,
  alternate,
  partyT,
  activeRoute,
  onSelectRoute,
  committed,
  onCommitRoute,
  onRevertRoute,
  hazardName,
}: RouteFooterProps) {
  const hazardStation = stations.find((s) => s.hazard);
  return (
    <div className="flex flex-none flex-col border-t border-border bg-raised lg:flex-row">
      <div className="min-w-0 flex-1 p-4">
        <div className="flex items-center">
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="font-mono uppercase tracking-widest"
          >
            Elevation cross-section · {plan.chartDistanceKm} km · ▲
            {plan.peakElevationM} m
          </Text>
          {hazardStation && (
            <Text
              variant="caption"
              as="span"
              className="ml-auto font-mono uppercase tracking-[0.04em] text-(--plan-signal)"
            >
              ▼ {hazardStation.name} — wind hold
            </Text>
          )}
        </div>
        <div className="mt-2">
          <ElevationProfile
            profile={plan.elevationProfile}
            stations={stations}
            chartDistanceKm={plan.chartDistanceKm}
            selectedId={selectedId}
            onSelect={onSelect}
            partyT={partyT}
          />
        </div>
      </div>

      <div className="w-full flex-none border-t border-border p-4 lg:w-64 lg:border-l lg:border-t-0">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Route summary
        </Text>
        <div className="mt-3 flex flex-col gap-2">
          <SummaryRow label="Distance" value={`${plan.chartDistanceKm} km`} />
          <SummaryRow
            label="Total gain"
            value={`▲${plan.totalGainM.toLocaleString()} m`}
          />
          <SummaryRow label="Checkpoints" value={String(stations.length)} />
          <SummaryRow label="Duration" value={`${plan.dayTotal} days`} />
          <SummaryRow
            label="Hazards"
            value={String(stations.filter((s) => s.hazard).length)}
          />
        </div>

        <RouteComparison
          plan={plan}
          alternate={alternate}
          active={activeRoute}
          committed={committed}
          onSelect={onSelectRoute}
          onCommit={onCommitRoute}
          onRevert={onRevertRoute}
          hazardName={hazardName ?? hazardStation?.name}
        />
      </div>
    </div>
  );
}
