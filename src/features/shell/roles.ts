/** Operating roles a user can view the platform as (set in the spine). */
export type RoleKey = "director" | "lead" | "participant";

export interface Role {
  readonly key: RoleKey;
  /** Full label, used as a tooltip. */
  readonly label: string;
  /** Single-glyph marker shown in the role selector. */
  readonly glyph: string;
  /** Initials shown on the identity avatar for this role. */
  readonly initials: string;
}

/** Roles in spine order. */
export const ROLES: readonly Role[] = [
  { key: "director", label: "Expedition Director", glyph: "D", initials: "EV" },
  { key: "lead", label: "Field Lead", glyph: "F", initials: "MR" },
  { key: "participant", label: "Participant", glyph: "P", initials: "PN" },
] as const;

export const DEFAULT_ROLE: RoleKey = "director";
