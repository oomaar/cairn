import type { Id } from "./common.types";

export type LogKind =
  | "movement"
  | "checkin"
  | "incident"
  | "weather"
  | "comms"
  | "note";

/** A daybook entry — the chronological operational record for an expedition.
 *  Generated from the expedition's movement, incidents, weather and comms, so
 *  the Record world reflects what actually happened across the universe. */
export interface LogEntry {
  id: Id;
  expeditionId: Id;
  day: number;
  time: string;
  kind: LogKind;
  title: string;
  detail: string;
  authorId: Id | null;
  /** Links back to the source entity (incident, weather, checkpoint, …). */
  refId: Id | null;
}
