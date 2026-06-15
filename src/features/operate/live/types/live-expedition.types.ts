export interface LiveExpeditionState {
  expeditionId: string;
  status: "pre-departure" | "in-transit" | "camped" | "emergency" | "complete";
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
