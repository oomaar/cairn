import type { Id } from "./common.types";

export interface Debrief {
  expeditionId: Id;
  /** One-paragraph outcome summary filed after expedition close. */
  outcome: string;
  /** Field leader's retrospective notes — informal, first-person. */
  leaderNotes: string;
  /** Actionable learnings for future expeditions. */
  lessonsLearned: string[];
}
