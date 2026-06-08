import type {
  Coordinates,
  ExpeditionStatus,
  Grade,
  Id,
  MapPosition,
  Tone,
} from "./common.types";

/** The operating company that runs the expeditions. */
export interface Operator {
  id: Id;
  name: string;
  hq: string;
}

/** A single expedition. References its leader (Person) and route by id. */
export interface Expedition {
  id: Id;
  name: string;
  region: string;
  country: string;
  coordinates: Coordinates;
  coordsLabel: string;
  leaderId: Id;
  status: ExpeditionStatus;
  statusLabel: string;
  statusTone: Tone;
  capacity: number;
  filled: number;
  dayCurrent: number;
  dayTotal: number;
  departLabel: string;
  readiness: number;
  grade: Grade;
  distanceKm: number;
  gainM: number;
  map: MapPosition;
  routeId: Id;
}

/** Role a person holds on a specific expedition. */
export type ExpeditionRole = "field-leader" | "assistant-lead" | "participant";

/** Live field telemetry, present only for active expeditions. */
export interface AssignmentTelemetry {
  pace: string;
  relativePosition: string;
  battery: number;
  heartRate: number;
  flag?: string;
}

/** Join between a Person and an Expedition — the manifest row. */
export interface Assignment {
  id: Id;
  expeditionId: Id;
  personId: Id;
  role: ExpeditionRole;
  telemetry?: AssignmentTelemetry;
}
