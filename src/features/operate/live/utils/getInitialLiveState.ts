import { getCheckpoints, getRoster, getWeather } from "@/universe";
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

export function getInitialLiveState(expeditionId: string): LiveExpeditionState {
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

  // Simulate initial progress at 32%
  const progressPct = 32;

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

  // Initial weather and party status
  const weather: {
    condition: "clear" | "cloudy" | "rain" | "snow" | "wind" | "storm";
    temperature: number;
    windSpeed: number;
    visibility: number;
  } = {
    condition: "cloudy",
    temperature: 8,
    windSpeed: 22,
    visibility: 1.5,
  };
  const partyStatus = {
    healthy: 0.7,
    fatigued: 0.25,
    injured: 0.05,
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

  // Fetch weather alerts and generate forecast
  const weatherAlerts = getWeather(expeditionId);
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
    currentLocation: {
      lat: -50.95,
      lng: -73.15,
      elevation: 1240,
    },
    partyStatus,
    weather,
    incidents: [],
    lastUpdate: new Date(),
    nextCheckpoint,
  };
}
