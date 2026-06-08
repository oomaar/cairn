import type { Id } from "@/universe";

/** The role a user is operating as. Drives both identity and capabilities. */
export type RoleKey = "director" | "lead" | "participant";

export interface Role {
  readonly key: RoleKey;
  /** Full label, used as a tooltip / menu label. */
  readonly label: string;
  /** Single-glyph marker shown in the spine role selector. */
  readonly glyph: string;
  /** Initials shown on the identity avatar for this role. */
  readonly initials: string;
  /** The person in the universe this role signs you in as. */
  readonly personId: Id;
}
