import type { Id, Tone } from "./common.types";

/** A logged field incident. Tied to an expedition and, when a person is
 *  involved, to that participant. */
export interface Incident {
  id: Id;
  expeditionId: Id;
  subjectPersonId: Id | null;
  timeLabel: string;
  tone: Tone;
  title: string;
  status: string;
  detail: string;
}
