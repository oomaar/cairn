import { getCheckpoints, getRoster } from "@/universe";
import type {
  LiveExpeditionState,
  LiveParticipant,
} from "../types/live-expedition.types";
import { updateCheckpointStatuses } from "./updateCheckpointStatuses";
import { calculateCurrentCheckpointIndex } from "./calculateCurrentCheckpointIndex";
import { calculateNextCheckpoint } from "./calculateNextCheckpoint";
import { createMockParticipant } from "./createMockParticipant";

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

  return {
    expeditionId,
    status: "in-transit",
    checkpoints: statusedCheckpoints,
    participants: finalParticipants,
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
