import { Text } from "@/components/ui";
import type { RoutePlan } from "../../types/route.types";
import type { AlternateRoute } from "../../utils/route.utils";
import type { RouteChoice } from "./route-comparison";

interface DeltaProps {
  plan: RoutePlan;
  alternate: AlternateRoute;
  active: RouteChoice;
  committed: boolean;
}
export function Delta({ plan, alternate, active, committed }: DeltaProps) {
  const dKm =
    Math.round((alternate.distanceKm - plan.chartDistanceKm) * 10) / 10;
  const dGain = alternate.gainM - plan.totalGainM;
  const fmtKm = `${dKm >= 0 ? "+" : "−"}${Math.abs(dKm)} km`;
  const fmtGain = `${dGain >= 0 ? "+" : "−"}${Math.abs(dGain).toLocaleString()} m`;

  return (
    <div className="mt-2 rounded-md border border-(--plan-sage) bg-olive-tint p-2.5">
      <Text variant="caption" as="p" tone="secondary">
        Route B {alternate.note} ({fmtKm}, {fmtGain}).
      </Text>
      <Text
        variant="caption"
        as="p"
        className="mt-1 font-mono text-3xs uppercase tracking-[0.06em] text-(--plan-sage)"
      >
        {committed
          ? "Working sheet follows the alternate"
          : active === "alternate"
            ? "B previewed on chart — not yet committed"
            : "A is the committed line"}
      </Text>
    </div>
  );
}
