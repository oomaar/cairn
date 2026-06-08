/** Shared scalar and enum types used across the universe. */

export type Id = string;

/** Accent/status tones — mirror the design-system color families. */
export type Tone =
  | "amber"
  | "olive"
  | "slate"
  | "danger"
  | "warn"
  | "ok"
  | "idle"
  | "quiet";

export interface Coordinates {
  lat: number;
  lng: number;
}

/** Position on the world map, as 0–100 percentages. */
export interface MapPosition {
  x: number;
  y: number;
}

export type ExpeditionStatus =
  | "planning"
  | "departing"
  | "in-field"
  | "complete";

export type Grade = "moderate" | "strenuous" | "expert";

export type RiskLevel = "low" | "moderate" | "high";
