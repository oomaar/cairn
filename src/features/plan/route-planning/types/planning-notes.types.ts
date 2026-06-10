/** Avatar accent families a note's author can take. */
export type NoteTone = "amber" | "olive" | "slate" | "quiet";

/** A planner's note on the working sheet — part of the route's planning log.
 *  Distinct from a checkpoint's terrain note: these record decisions, holds and
 *  reminders for the route as a whole, and may anchor to one checkpoint. */
export interface PlanningNote {
  id: string;
  body: string;
  authorName: string;
  authorInitials: string;
  authorTone: NoteTone;
  /** Human label for when it was filed ("2d ago", "just now"). */
  timeLabel: string;
  /** Higher is more recent — used to keep the log newest-first. */
  order: number;
  /** Checkpoint this note is pinned to, or null for a sheet-level note. */
  checkpointId: string | null;
}
