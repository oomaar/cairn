import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ChartLayers } from "../route.types";

interface Tool {
  key: keyof ChartLayers;
  label: string;
}

const TOOLS: Tool[] = [
  { key: "terrain", label: "Terrain" },
  { key: "water", label: "Watercourses" },
  { key: "weather", label: "Weather" },
  { key: "risk", label: "Risk overlay" },
  { key: "alternate", label: "Alternate route" },
];

interface LegendItem {
  label: string;
  className: string;
  kind: "line" | "hatch" | "dot";
}

const LEGEND: LegendItem[] = [
  {
    label: "Index contour",
    className: "bg-(--plan-contour-index)",
    kind: "line",
  },
  { label: "Watercourse", className: "bg-(--plan-water-light)", kind: "line" },
  { label: "Plotted route", className: "bg-accent", kind: "line" },
  { label: "Hazard zone", className: "bg-(--plan-signal)", kind: "hatch" },
  { label: "Checkpoint", className: "border-(--plan-sage)", kind: "dot" },
];

interface PlottingToolsProps {
  layers: ChartLayers;
  onToggle: (key: keyof ChartLayers) => void;
}

/** Left rail: toggleable chart layers + the sheet legend. */
export function PlottingTools({ layers, onToggle }: PlottingToolsProps) {
  return (
    <div className="flex flex-col py-4">
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="px-4 font-mono uppercase tracking-widest"
      >
        Plotting tools
      </Text>
      <div className="mt-2.5 flex flex-col">
        {TOOLS.map((tool) => {
          const on = layers[tool.key];
          return (
            <button
              key={tool.key}
              type="button"
              onClick={() => onToggle(tool.key)}
              aria-pressed={on}
              className="flex items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-raised"
            >
              <span
                className={cn(
                  "grid size-3.5 flex-none place-items-center rounded-sm border",
                  on
                    ? "border-accent bg-accent text-fg-on-accent"
                    : "border-border-strong",
                )}
              >
                {on && <Icon name="check" size={10} strokeWidth={3} />}
              </span>
              <Text
                variant="body-sm"
                as="span"
                className={on ? "text-fg-1" : "text-fg-3"}
              >
                {tool.label}
              </Text>
            </button>
          );
        })}
      </div>

      <span className="mx-4 my-3.5 h-px bg-border" />

      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="px-4 font-mono uppercase tracking-widest"
      >
        Legend
      </Text>
      <div className="mt-2.5 flex flex-col gap-1.5 px-4">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            {item.kind === "dot" ? (
              <span
                className={cn(
                  "size-3 flex-none rounded-full border-2",
                  item.className,
                )}
              />
            ) : (
              <span
                className={cn(
                  "h-2.5 w-4 flex-none",
                  item.kind === "line" ? "h-0.5 self-center" : "opacity-50",
                  item.className,
                )}
              />
            )}
            <Text variant="caption" as="span" tone="secondary">
              {item.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
