import type { CheckpointType, WeatherAlert } from "@/universe";

export interface LiveCheckpoint {
  id: string;
  name: string;
  index: number;
  km: number;
  elevationM: number;
  eta: string;
  type: CheckpointType;
  hazard: boolean;
  status: "done" | "current" | "ahead";
}

export interface LiveParticipant {
  id: string;
  name: string;
  initials: string;
  role: "field-leader" | "assistant-lead" | "participant";
  tone: string;
  heartRate: number;
  pace: string;
  relativePosition: string;
  battery: number;
  flag?: string;
}

export interface ForecastPeriod {
  timestamp: Date;
  condition: "clear" | "cloudy" | "rain" | "snow" | "wind" | "storm";
  windSpeed: number;
  temperature: number;
  visibility: number;
}

export interface ExpeditionStatus {
  readinessScore: number;
  riskLevel: "low" | "medium" | "high";
  crewReadiness: number;
  equipmentReady: number;
  commsStatus: "ok" | "degraded" | "lost";
  alerts: {
    weatherAlert: boolean;
    crewAlert: boolean;
    equipmentAlert: boolean;
    navigationAlert: boolean;
    communicationAlert: boolean;
  };
}

export interface LiveExpeditionState {
  expeditionId: string;
  status: "pre-departure" | "in-transit" | "camped" | "emergency" | "complete";
  checkpoints: LiveCheckpoint[];
  participants: LiveParticipant[];
  expeditionStatus: ExpeditionStatus;
  weatherAlerts: WeatherAlert[];
  weatherForecast: ForecastPeriod[];
  currentCheckpointIndex: number;
  progressPct: number;
  currentLocation: {
    lat: number;
    lng: number;
    elevation: number;
  };
  partyStatus: {
    healthy: number;
    fatigued: number;
    injured: number;
  };
  weather: {
    condition: "clear" | "cloudy" | "rain" | "snow" | "wind" | "storm";
    temperature: number;
    windSpeed: number;
    visibility: number;
    alert?: string;
  };
  incidents: LiveIncident[];
  lastUpdate: Date;
  nextCheckpoint: {
    name: string;
    eta: string;
    distanceKm: number;
  };
}

export interface LiveIncident {
  id: string;
  timestamp: Date;
  severity: "info" | "warning" | "critical";
  type: "weather" | "crew" | "equipment" | "route" | "decision";
  title: string;
  description: string;
  actionRequired?: boolean;
}

export interface ExpeditionUpdate {
  expeditionId: string;
  timestamp: Date;
  type: "position" | "weather" | "incident" | "status" | "crew";
  data: Record<string, unknown>;
}

export type CellVariant = "danger" | "warn" | "ok" | "inactive";
