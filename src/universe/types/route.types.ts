import type { Id } from "./common.types";

export type CheckpointStatus = "done" | "current" | "ahead";

export type CheckpointType =
  | "trailhead"
  | "camp"
  | "viewpoint"
  | "crossing"
  | "pass"
  | "summit";

/** A waypoint along a route. Belongs to exactly one route. */
export interface Checkpoint {
  id: Id;
  routeId: Id;
  name: string;
  km: number;
  elevationM: number;
  eta: string;
  status: CheckpointStatus;
  type: CheckpointType;
  hazard: boolean;
}

/** The planned line for an expedition: an ordered set of checkpoints plus a
 *  sampled elevation profile for charting. */
export interface Route {
  id: Id;
  expeditionId: Id;
  checkpointIds: Id[];
  elevationProfile: number[];
}
