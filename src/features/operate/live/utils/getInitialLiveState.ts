import { getCheckpoints, getExpedition, getRoster, getWeather } from "@/universe";
import type {
  LiveExpeditionState,
  LiveParticipant,
  ForecastPeriod,
} from "../types/live-expedition.types";
import { updateCheckpointStatuses } from "./updateCheckpointStatuses";
import { calculateCurrentCheckpointIndex } from "./calculateCurrentCheckpointIndex";
import { calculateNextCheckpoint } from "./calculateNextCheckpoint";
import { createMockParticipant } from "./createMockParticipant";
import { getCommsStatus } from "./getCommsStatus";
import { calculateCrewReadiness } from "./calculateCrewReadiness";
import { calculateRiskLevel } from "./calculateRiskLevel";
import { calculateReadinessScore } from "./calculateReadinessScore";
import { generateStatusAlerts } from "./generateStatusAlerts";

function idHash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619) >>> 0;
  }
  return h;
}

export function getInitialLiveState(expeditionId: string): LiveExpeditionState {
  const expedition = getExpedition(expeditionId);
  const universalCheckpoints = getCheckpoints(expeditionId);
  const roster = getRoster(expeditionId);

  // Map universe checkpoints to live checkpoints
  const checkpoints = universalCheckpoints.map((cp, idx) => ({
    id: cp.id,
    name: cp.name,
    index: idx,
    km: cp.km,
    elevationM: cp.elevationM,
    eta: cp.eta,
    type: cp.type,
    hazard: cp.hazard,
    status: "ahead" as const,
  }));

  // Map roster to participants with telemetry
  const participants: LiveParticipant[] = roster.map((entry, idx) => {
    const { assignment, person } = entry;
    const telemetry = assignment.telemetry;

    return {
      id: person.id,
      name: person.name,
      initials: person.initials,
      role: assignment.role,
      tone: person.tone,
      heartRate: telemetry?.heartRate ?? 95 + Math.random() * 35,
      pace: telemetry?.pace ?? (idx === 0 ? "on pace" : "-5%"),
      relativePosition:
        telemetry?.relativePosition ?? (idx === 0 ? "lead" : "rear"),
      battery: telemetry?.battery ?? 75,
      flag: telemetry?.flag,
    };
  });

  // Fallback mock participants if roster is empty
  const finalParticipants =
    participants.length > 0
      ? participants
      : [
          createMockParticipant(0, "Maya Rodriguez", "MR", "field-leader"),
          createMockParticipant(1, "Kenji Yu", "KY", "participant"),
          createMockParticipant(2, "Priya Nambiar", "PN", "participant"),
          createMockParticipant(3, "Thomas Hayes", "TH", "participant"),
          createMockParticipant(4, "Sam Martinez", "SM", "participant"),
        ];

  // Deterministic per-expedition values derived from the expedition ID
  const h = idHash(expeditionId);

  // Progress: spread expeditions across 15–65% of route completion
  const progressPct = 15 + (h % 51);

  // Wind speed: base 8–57 km/h, boosted by danger weather alerts
  const weatherAlerts = getWeather(expeditionId);
  const dangerCount = weatherAlerts.filter((a) => a.tone === "danger").length;
  const windSpeed = Math.min(95, 8 + (h % 50) + dangerCount * 10);

  // Condition: worse when there are active danger alerts
  const CONDITIONS = [
    "clear",
    "cloudy",
    "rain",
    "snow",
    "wind",
    "storm",
  ] as const;
  const conditionIdx = dangerCount > 0 ? 3 + ((h >> 2) % 3) : (h >> 2) % 3;
  const condition = CONDITIONS[conditionIdx]!;

  // Temperature: cooler at higher elevation (~3°C per 500 m)
  const maxElev = Math.max(...universalCheckpoints.map((c) => c.elevationM), 500);
  const temperature = Math.round(18 - maxElev / 500 + ((h >> 6) % 9) - 4);

  // Update checkpoint statuses based on progress
  const statusedCheckpoints = updateCheckpointStatuses(
    checkpoints,
    progressPct,
  );
  const currentCheckpointIndex =
    calculateCurrentCheckpointIndex(statusedCheckpoints);
  const nextCheckpoint = calculateNextCheckpoint(
    statusedCheckpoints,
    currentCheckpointIndex,
  );

  const weather: {
    condition: "clear" | "cloudy" | "rain" | "snow" | "wind" | "storm";
    temperature: number;
    windSpeed: number;
    visibility: number;
  } = {
    condition,
    temperature,
    windSpeed,
    visibility: Math.max(0.4, 8 - dangerCount * 2 - ((h >> 8) % 4)),
  };
  const partyStatus = {
    healthy: 0.7,
    fatigued: 0.25,
    injured: 0.05,
  };

  // Current location: use the actual checkpoint's coordinates/elevation
  const curCheckpoint = statusedCheckpoints[currentCheckpointIndex];
  const currentLocation = {
    lat: expedition?.coordinates.lat ?? -50.95,
    lng: expedition?.coordinates.lng ?? -73.15,
    elevation: curCheckpoint?.elevationM ?? 1240,
  };

  // Calculate expedition status
  const crewReadiness = calculateCrewReadiness(finalParticipants);
  const weatherFactor =
    100 -
    (weather.windSpeed > 40 ? 20 : 0) -
    (weather.condition === "storm" || weather.condition === "snow" ? 30 : 0);
  const riskLevel = calculateRiskLevel(
    [],
    weather,
    finalParticipants,
    partyStatus.injured,
  );
  const readinessScore = calculateReadinessScore(
    crewReadiness,
    100,
    weatherFactor,
    progressPct,
  );
  const hazardCheckpoints = statusedCheckpoints.some((cp) => cp.hazard);
  const alerts = generateStatusAlerts(
    [],
    finalParticipants,
    weather,
    hazardCheckpoints,
    partyStatus.injured,
  );
  const commsStatus = getCommsStatus(alerts.communicationAlert);

  // Fetch weather alerts and generate forecast (weatherAlerts already fetched above)
  const weatherForecast: ForecastPeriod[] = [];
  for (let i = 0; i < 6; i++) {
    const forecastTime = new Date(Date.now() + i * 60 * 60 * 1000); // Every hour
    const windTrend = -5 + Math.random() * 10; // Simulate trend
    const tempTrend = -2 + Math.random() * 4;
    weatherForecast.push({
      timestamp: forecastTime,
      condition: weather.condition,
      windSpeed: Math.max(0, weather.windSpeed + windTrend * (i + 1)),
      temperature: weather.temperature + tempTrend * (i + 1),
      visibility: Math.min(20, weather.visibility + (Math.random() - 0.3)),
    });
  }

  return {
    expeditionId,
    status: "in-transit",
    checkpoints: statusedCheckpoints,
    participants: finalParticipants,
    expeditionStatus: {
      readinessScore,
      riskLevel,
      crewReadiness: Math.round(crewReadiness),
      equipmentReady: 100,
      commsStatus,
      alerts,
    },
    weatherAlerts,
    weatherForecast,
    currentCheckpointIndex,
    progressPct,
    currentLocation,
    partyStatus,
    weather,
    incidents: [],
    lastUpdate: new Date(),
    nextCheckpoint,
  };
}
