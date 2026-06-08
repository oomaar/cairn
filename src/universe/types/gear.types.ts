import type { Id, Tone } from "./common.types";

export type GearCategory =
  | "Shelter"
  | "Safety"
  | "Technical"
  | "Cooking"
  | "Comms"
  | "Medical";

/** A line in the operator's equipment catalog (org-level inventory). */
export interface GearItem {
  id: Id;
  name: string;
  category: GearCategory;
  total: number;
  ready: number;
  maintenance: number;
  deployed: number;
  status: Tone;
}

/** How much of a gear item is allocated to a given expedition (the manifest
 *  join between GearItem and Expedition). */
export interface GearAllocation {
  id: Id;
  gearItemId: Id;
  expeditionId: Id;
  quantity: number;
}
