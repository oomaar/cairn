import type { ExpeditionStatus } from "@/universe";

export type Filter = ExpeditionStatus | "all";

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-field", label: "In field" },
  { key: "complete", label: "Complete" },
  { key: "planning", label: "Planning" },
];
