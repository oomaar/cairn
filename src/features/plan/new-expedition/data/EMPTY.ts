import type { BuilderState } from "../types/BuilderState";

export const EMPTY: BuilderState = {
  name: "",
  region: "",
  country: "",
  grade: "moderate",
  distanceKm: 0,
  gainM: 0,
  dayTotal: 0,
  leaderId: "",
  gear: [],
};
