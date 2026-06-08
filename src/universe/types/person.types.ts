import type { Id, Tone } from "./common.types";

/** Organization-level role a person holds across the platform. */
export type PersonBaseRole =
  | "director"
  | "operations"
  | "field-leader"
  | "participant"
  | "system";

/** A person in the operator's world: staff, field leaders, participants, and
 *  the automated system author. People exist independently of expeditions and
 *  are linked in through assignments. */
export interface Person {
  id: Id;
  name: string;
  initials: string;
  baseRole: PersonBaseRole;
  tone: Tone;
}
