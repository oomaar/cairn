import type { ExpeditionRole } from "@/universe";

export const ROLES: { key: ExpeditionRole; label: string }[] = [
  { key: "field-leader", label: "Lead" },
  { key: "assistant-lead", label: "Assist" },
  { key: "participant", label: "Member" },
];
