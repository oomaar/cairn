import { LegendItem } from "../types/LegendItem";

export const LEGEND: LegendItem[] = [
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
