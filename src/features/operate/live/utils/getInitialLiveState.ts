import type { LiveExpeditionState } from "../types/live-expedition.types";

// Seeded initial state for demo
export function getInitialLiveState(expeditionId: string): LiveExpeditionState {
  return {
    expeditionId,
    status: "in-transit",
    currentCheckpointIndex: 2,
    progressPct: 32,
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
    nextCheckpoint: {
      name: "Camp Refuge",
      eta: "16:30",
      distanceKm: 4.2,
    },
  };
}
