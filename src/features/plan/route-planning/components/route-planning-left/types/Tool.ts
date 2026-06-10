import type { ChartLayers } from "../../../types/route.types";

export interface Tool {
  key: keyof ChartLayers;
  label: string;
}
