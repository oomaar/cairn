import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { AlternateRoute } from "../route.utils";
import type { RoutePlan } from "../route.types";

export type RouteChoice = "primary" | "alternate";

function RouteRow({
  badge,
  title,
  subtitle,
  distanceKm,
  gainM,
  gainTone,
  selected,
  onSelect,
}: {
  badge: string;
  title: string;
  subtitle: string;
  distanceKm: number;
  gainM: number;
  gainTone?: boolean;
  selected: boolean;
  onSelect?: () => void;
}) {
  const Wrapper = onSelect ? "button" : "div";
  return (
    <Wrapper
      {...(onSelect ? { type: "button" as const, onClick: onSelect } : {})}
      className={cn(
        "flex w-full items-center gap-2.5 py-2 text-left",
        onSelect && "transition-opacity hover:opacity-80",
      )}
      aria-pressed={onSelect ? selected : undefined}
    >
      <span
        className={cn(
          "grid size-5 flex-none place-items-center rounded-full border font-mono text-3xs",
          selected
            ? "border-accent text-accent-bright"
            : "border-border-strong text-fg-3",
        )}
      >
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <Text
          as="span"
          variant="caption"
          className={cn(
            "block truncate font-semibold",
            selected ? "text-fg-1" : "text-fg-2",
          )}
        >
          {title}
        </Text>
        <Text
          as="span"
          variant="caption"
          tone="tertiary"
          className="block truncate text-3xs"
        >
          {subtitle}
        </Text>
      </span>
      <span className="flex-none text-right font-mono text-2xs leading-tight">
        <span className="block text-fg-2">{distanceKm} km</span>
        <span
          className={cn("block", gainTone ? "text-(--plan-sage)" : "text-fg-3")}
        >
          ▲{gainM.toLocaleString()}
        </span>
      </span>
    </Wrapper>
  );
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
}: {
  plan: RoutePlan;
  alternate: AlternateRoute | null;
  active: RouteChoice;
  committed: boolean;
  onSelect?: (choice: RouteChoice) => void;
  onCommit?: () => void;
  onRevert?: () => void;
  hazardName?: string;
}) {
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

function ActionButton({
  onClick,
  tone,
  children,
}: {
  onClick: () => void;
  tone: "commit" | "ghost";
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mt-2 w-full rounded-md border py-1.5 text-center font-mono text-2xs uppercase tracking-[0.06em] transition-colors",
        tone === "commit"
          ? "border-(--plan-sage) bg-olive-tint text-(--plan-sage) hover:bg-olive-tint/70"
          : "border-border-strong text-fg-2 hover:bg-raised",
      )}
    >
      {children}
    </button>
  );
}

function Delta({
  plan,
  alternate,
  active,
  committed,
}: {
  plan: RoutePlan;
  alternate: AlternateRoute;
  active: RouteChoice;
  committed: boolean;
}) {
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
