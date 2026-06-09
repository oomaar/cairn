import type { CheckpointStatus, CheckpointType } from "@/universe";

/** A checkpoint resolved for the chart table: route metrics, a plotted chart
 *  position, derived coordinates, and any linked weather hazard. */
export interface PlanStation {
  id: string;
  index: number;
  name: string;
  km: number;
  elevationM: number;
  eta: string;
  type: CheckpointType;
  status: CheckpointStatus;
  hazard: boolean;
  segmentKm: number;
  gradientPct: number;
  coordsLabel: string;
  /** Chart-space position (within the 960×600 viewBox). */
  x: number;
  y: number;
  alert: { title: string; detail: string } | null;
}

/** The full route plan for an expedition — everything the workspace renders. */
export interface RoutePlan {
  expeditionId: string;
  expeditionName: string;
  sheetNo: string;
  grade: string;
  chartDistanceKm: number;
  peakElevationM: number;
  totalGainM: number;
  dayTotal: number;
  hazardCount: number;
  originLat: number;
  originLng: number;
  stations: PlanStation[];
  elevationProfile: number[];
}

/** Toggleable chart overlays driven by the plotting tools. */
export interface ChartLayers {
  terrain: boolean;
  water: boolean;
  weather: boolean;
  risk: boolean;
  alternate: boolean;
}
