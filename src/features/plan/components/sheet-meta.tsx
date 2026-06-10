import { Icon, Text, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { RoutePlan } from "../route.types";

function MetaToggle({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors",
        active
          ? "bg-raised text-fg-1"
          : "text-fg-3 hover:bg-raised hover:text-fg-2",
      )}
    >
      <Icon name={icon} size={14} className="flex-none" />
      <Text
        variant="caption"
        as="span"
        className="hidden uppercase tracking-[0.06em] sm:inline"
      >
        {label}
      </Text>
    </button>
  );
}

interface SheetMetaProps {
  plan: RoutePlan;
  leftOpen: boolean;
  rightOpen: boolean;
  focus: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleFocus: () => void;
}

/** The survey-sheet meta strip beneath the world tabs. Also carries the chart
 *  layout controls — collapse either rail, or focus the chart on its own. */
export function SheetMeta({
  plan,
  leftOpen,
  rightOpen,
  focus,
  onToggleLeft,
  onToggleRight,
  onToggleFocus,
}: SheetMetaProps) {
  // Beyond the sheet number, the survey fields are progressive — they drop off
  // first as the strip narrows.
  const fields = [
    { label: `Sheet ${plan.sheetNo}`, className: "" },
    { label: "1:50 000", className: "hidden sm:flex" },
    { label: "Datum WGS84", className: "hidden lg:flex" },
    { label: "UTM 18S", className: "hidden lg:flex" },
  ];
  return (
    <div className="flex h-9 flex-none items-stretch border-b border-border bg-surface font-mono">
      {fields.map((field) => (
        <div
          key={field.label}
          className={cn(
            "flex items-center whitespace-nowrap border-r border-border px-4",
            field.className,
          )}
        >
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="uppercase tracking-[0.06em]"
          >
            {field.label}
          </Text>
        </div>
      ))}

      <div className="ml-auto flex items-center gap-0.5 px-2">
        {!focus && (
          <>
            <MetaToggle
              icon="layers"
              label="Tools"
              active={leftOpen}
              onClick={onToggleLeft}
            />
            <MetaToggle
              icon="flag"
              label="Checkpoints"
              active={rightOpen}
              onClick={onToggleRight}
            />
          </>
        )}
        <MetaToggle
          icon={focus ? "x" : "crosshair"}
          label={focus ? "Exit focus" : "Focus"}
          active={focus}
          onClick={onToggleFocus}
        />
      </div>
    </div>
  );
}
