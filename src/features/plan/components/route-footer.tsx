import { Text } from "@/components/ui";
import type { AlternateRoute } from "../route.utils";
import type { PlanStation, RoutePlan } from "../route.types";
import { ElevationProfile } from "./elevation-profile";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <Text
        variant="caption"
        as="span"
        tone="tertiary"
        className="font-mono uppercase tracking-[0.06em]"
      >
        {label}
      </Text>
      <Text variant="caption" as="span" className="font-mono text-fg-1">
        {value}
      </Text>
    </div>
  );
}

/** Footer: elevation cross-section (left) + route summary (right). */
export function RouteFooter({
  plan,
  stations,
  selectedId,
  onSelect,
  alternate,
  partyT,
}: {
  plan: RoutePlan;
  stations: PlanStation[];
  selectedId: string;
  onSelect: (id: string) => void;
  alternate: AlternateRoute | null;
  partyT: number;
}) {
  const hazardStation = stations.find((s) => s.hazard);
  return (
    <div className="flex flex-none border-t border-border bg-raised">
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

      <div className="w-64 flex-none border-l border-border p-4">
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

        {alternate && (
          <div className="mt-3 rounded-md border border-(--plan-sage) bg-olive-tint p-2.5">
            <Text
              variant="caption"
              as="p"
              className="font-mono uppercase tracking-[0.06em] text-(--plan-sage)"
            >
              Alternate · {alternate.distanceKm} km · ▲
              {alternate.gainM.toLocaleString()} m
            </Text>
            <Text variant="caption" as="p" tone="secondary" className="mt-1">
              {alternate.note}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
