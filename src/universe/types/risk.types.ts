import type { Id, RiskLevel, Tone } from "./common.types";

export type RiskCategory =
  | "Environmental"
  | "Route"
  | "Compliance"
  | "Medical"
  | "Logistics";

/** An assessed risk. Tied to an expedition, or org-wide when expeditionId is
 *  null. Owned by a Person who is accountable for the mitigating action. */
export interface Risk {
  id: Id;
  expeditionId: Id | null;
  level: RiskLevel;
  tone: Tone;
  category: RiskCategory;
  title: string;
  detail: string;
  action: string;
  ownerId: Id;
  updatedAgo: string;
}
