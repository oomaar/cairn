import type { Grade } from "@/universe";

export type BuilderState = {
  name: string;
  region: string;
  country: string;
  grade: Grade;
  distanceKm: number;
  gainM: number;
  dayTotal: number;
  leaderId: string;
  gear: string[];
};
