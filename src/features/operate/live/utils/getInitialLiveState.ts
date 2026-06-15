import { getCheckpoints } from "@/universe";
import type { LiveExpeditionState } from "../types/live-expedition.types";
import { updateCheckpointStatuses } from "./updateCheckpointStatuses";
import { calculateCurrentCheckpointIndex } from "./calculateCurrentCheckpointIndex";
import { calculateNextCheckpoint } from "./calculateNextCheckpoint";

export function getInitialLiveState(expeditionId: string): LiveExpeditionState {
  const universalCheckpoints = getCheckpoints(expeditionId);

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

  return {
    expeditionId,
    status: "in-transit",
    checkpoints: statusedCheckpoints,
    currentCheckpointIndex,
    progressPct,
    currentLocation: {
      lat: -50.95,
      lng: -73.15,
      elevation: 1240,
    },
    partyStatus: {
      healthy: 0.7,
      fatigued: 0.25,
      injured: 0.05,
    },
    weather: {
      condition: "cloudy",
      temperature: 8,
      windSpeed: 22,
      visibility: 1.5,
    },
    incidents: [],
    lastUpdate: new Date(),
    nextCheckpoint,
  };
}
