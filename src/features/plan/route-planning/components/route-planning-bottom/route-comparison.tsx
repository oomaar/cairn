import { Text } from "@/components/ui";
import type { AlternateRoute } from "../../utils/route.utils";
import type { RoutePlan } from "../../types/route.types";
import { RouteRow } from "./route-row";
import { Delta } from "./delta";
import { ActionButton } from "./action-button";

export type RouteChoice = "primary" | "alternate";

interface RouteComaprisonProps {
  plan: RoutePlan;
  alternate: AlternateRoute | null;
  active: RouteChoice;
  committed: boolean;
  onSelect?: (choice: RouteChoice) => void;
  onCommit?: () => void;
  onRevert?: () => void;
  hazardName?: string;
}

/**
 * Route comparison — the chart table's commit decision. Lays the primary line
 * against the plotted weather alternate with their distance/ascent deltas, and
 * (for planners) lets you choose which line the sheet commits to.
 */
export function RouteComparison({
  plan,
  alternate,
  active,
  committed,
  onSelect,
  onCommit,
  onRevert,
  hazardName,
}: RouteComaprisonProps) {
  const pass = hazardName ?? "the exposed pass";

  return (
    <div className="mt-4 border-t border-border pt-3">
      <div className="flex items-center justify-between">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Route comparison
        </Text>
        {committed && (
          <span className="rounded-pill bg-olive-tint px-1.5 py-0.5 font-mono text-3xs uppercase tracking-[0.06em] text-(--plan-sage)">
            B adopted
          </span>
        )}
      </div>

      <div className="mt-1.5 divide-y divide-border-soft">
        <RouteRow
          badge="A"
          title="Primary line"
          subtitle={
            !alternate
              ? "single line on file"
              : committed
                ? "original — superseded"
                : `via ${pass}`
          }
          distanceKm={plan.chartDistanceKm}
          gainM={plan.totalGainM}
          selected={!committed && active === "primary"}
          onSelect={
            !committed && onSelect ? () => onSelect("primary") : undefined
          }
        />
        {alternate && (
          <RouteRow
            badge={committed ? "✓" : "B"}
            title="Weather alternate"
            subtitle={committed ? `bypasses ${pass}` : `avoids ${pass}`}
            distanceKm={alternate.distanceKm}
            gainM={alternate.gainM}
            gainTone
            selected={committed || active === "alternate"}
            onSelect={
              !committed && onSelect ? () => onSelect("alternate") : undefined
            }
          />
        )}
      </div>

      {!alternate ? (
        <Text variant="caption" as="p" tone="tertiary" className="mt-2">
          No alternate plotted for this sheet.
        </Text>
      ) : (
        <>
          <Delta
            plan={plan}
            alternate={alternate}
            active={active}
            committed={committed}
          />
          {committed
            ? onRevert && (
                <ActionButton onClick={onRevert} tone="ghost">
                  Revert to primary line
                </ActionButton>
              )
            : active === "alternate" &&
              onCommit && (
                <ActionButton onClick={onCommit} tone="commit">
                  Commit alternate to sheet
                </ActionButton>
              )}
        </>
      )}
    </div>
  );
}
