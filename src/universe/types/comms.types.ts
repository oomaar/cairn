import type { Id, Tone } from "./common.types";

export type CommKind = "message" | "alert";

/** A message on the operations bridge. Authored by a Person (including the
 *  automated system author) and scoped to an expedition, or org-wide when
 *  expeditionId is null. */
export interface CommMessage {
  id: Id;
  expeditionId: Id | null;
  fromPersonId: Id;
  time: string;
  text: string;
  kind: CommKind;
}

/** A broadcast announcement. Optionally scoped to one expedition. */
export interface Announcement {
  id: Id;
  title: string;
  tone: Tone;
  audience: string;
  timeAgo: string;
  body: string;
  expeditionId: Id | null;
}
