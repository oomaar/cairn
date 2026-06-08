import type {
  AssignmentTelemetry,
  Checkpoint,
  ExpeditionRole,
  Id,
} from "../types";

/**
 * Authored specifics for the headline expedition — Torres del Paine, today's
 * active segment. These are the values shown in Live mode; the rest of the
 * universe (other expeditions' routes and rosters) is generated.
 */

export type CheckpointSeed = Omit<Checkpoint, "id" | "routeId">;

/** Today's segment: Camp Italiano → Camp Grey, over Paso John Gardner. */
export const TDP_CHECKPOINTS: readonly CheckpointSeed[] = [
  { name: "Camp Italiano", km: 0, elevationM: 280, eta: "06:00", status: "done", type: "camp", hazard: false },
  { name: "Británico Lookout", km: 5.5, elevationM: 640, eta: "08:10", status: "done", type: "viewpoint", hazard: false },
  { name: "Río de los Franceses", km: 11.2, elevationM: 410, eta: "10:30", status: "current", type: "crossing", hazard: false },
  { name: "Paso John Gardner", km: 18.4, elevationM: 1241, eta: "13:45", status: "ahead", type: "pass", hazard: true },
  { name: "Camp Grey", km: 25.0, elevationM: 60, eta: "16:30", status: "ahead", type: "camp", hazard: false },
] as const;

export const TDP_ELEVATION: readonly number[] = [
  280, 360, 520, 640, 560, 470, 410, 480, 620, 820, 1040, 1241, 1180, 920, 640,
  420, 240, 120, 60,
];

/** Named roster with live telemetry. Generated participants top this up to
 *  the expedition's capacity (14). */
export interface RosterSeed {
  personId: Id;
  role: ExpeditionRole;
  telemetry: AssignmentTelemetry;
}

export const TDP_ROSTER: readonly RosterSeed[] = [
  { personId: "mara-restrepo", role: "field-leader", telemetry: { pace: "on pace", relativePosition: "lead", battery: 88, heartRate: 112 } },
  { personId: "tomas-holt", role: "assistant-lead", telemetry: { pace: "sweep", relativePosition: "rear", battery: 77, heartRate: 99 } },
  { personId: "kenji-yu", role: "participant", telemetry: { pace: "−15%", relativePosition: "40m back", battery: 64, heartRate: 128, flag: "ankle" } },
  { personId: "priya-nair", role: "participant", telemetry: { pace: "on pace", relativePosition: "12m back", battery: 91, heartRate: 104 } },
  { personId: "sofia-marchetti", role: "participant", telemetry: { pace: "on pace", relativePosition: "20m back", battery: 82, heartRate: 118 } },
] as const;
