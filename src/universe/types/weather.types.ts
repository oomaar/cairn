import type { Id, Tone } from "./common.types";

/** Semantic weather condition (decoupled from any UI icon set). */
export type WeatherIcon = "wind" | "snow" | "sun" | "cloud" | "rain" | "thermo";

/** A weather observation/alert tied to an expedition, and optionally to the
 *  specific checkpoint it threatens. */
export interface WeatherAlert {
  id: Id;
  expeditionId: Id;
  checkpointId: Id | null;
  tone: Tone;
  icon: WeatherIcon;
  title: string;
  place: string;
  detail: string;
  observedAgo: string;
  window: string;
}
