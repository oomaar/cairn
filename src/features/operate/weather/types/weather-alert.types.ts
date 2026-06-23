import type { WeatherAlert } from "@/universe";

export type AlertResponseType =
  | "delay"
  | "reroute"
  | "camp"
  | "accelerate"
  | "monitor";

export interface AlertResponse {
  type: AlertResponseType;
  notes?: string;
  recordedAt: Date;
  recordedBy: string;
}

export interface TrackedWeatherAlert extends WeatherAlert {
  expeditionId: string;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  responses: AlertResponse[];
  status: "active" | "acknowledged" | "resolved";
  createdAt: Date;
  severity: "danger" | "warn" | "info";
}

export interface WeatherAlertFilter {
  severity?: "danger" | "warn" | "info";
  expeditionId?: string;
  status?: "active" | "acknowledged" | "resolved";
}

export interface WeatherAlertsDashboardState {
  allAlerts: TrackedWeatherAlert[];
  filter: WeatherAlertFilter;
  sortBy: "severity" | "time" | "expeditionName";
  lastUpdate: Date;
}
