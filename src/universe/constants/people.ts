import type { Person } from "../types";

/**
 * Named people with stable ids. These are the people the authored content
 * (expeditions, comms, risks, incidents) refers to directly. The wider
 * participant roster is generated deterministically (see generators/people).
 */
export const NAMED_PEOPLE: readonly Person[] = [
  // Headquarters
  { id: "elena-vasquez", name: "Elena Vásquez", initials: "EV", baseRole: "director", tone: "amber" },
  { id: "operations", name: "Operations", initials: "OPS", baseRole: "operations", tone: "slate" },
  { id: "cairn-system", name: "Cairn System", initials: "•", baseRole: "system", tone: "quiet" },

  // Field leaders (one per expedition)
  { id: "mara-restrepo", name: "Mara Restrepo", initials: "MR", baseRole: "field-leader", tone: "amber" },
  { id: "lhakpa-tamang", name: "Lhakpa Tamang", initials: "LT", baseRole: "field-leader", tone: "amber" },
  { id: "dele-okafor", name: "Dele Okafor", initials: "DO", baseRole: "field-leader", tone: "amber" },
  { id: "anja-lindqvist", name: "Anja Lindqvist", initials: "AL", baseRole: "field-leader", tone: "amber" },
  { id: "salvo-conti", name: "Salvo Conti", initials: "SC", baseRole: "field-leader", tone: "amber" },
  { id: "iona-mackay", name: "Iona Mackay", initials: "IM", baseRole: "field-leader", tone: "amber" },

  // Named Torres del Paine roster (today's live segment)
  { id: "tomas-holt", name: "Tomas Holt", initials: "TH", baseRole: "field-leader", tone: "slate" },
  { id: "kenji-yu", name: "Kenji Yu", initials: "KY", baseRole: "participant", tone: "olive" },
  { id: "priya-nair", name: "Priya Nair", initials: "PN", baseRole: "participant", tone: "olive" },
  { id: "sofia-marchetti", name: "Sofia Marchetti", initials: "SM", baseRole: "participant", tone: "olive" },
] as const;

export const DIRECTOR_ID = "elena-vasquez";
export const OPERATIONS_ID = "operations";
export const SYSTEM_ID = "cairn-system";
