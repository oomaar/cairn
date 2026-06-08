import type { Role, RoleKey } from "./role.types";

/**
 * Roles in spine order. Each role signs in as a real person from the seeded
 * universe, so screens can resolve "you" against the operational graph.
 */
export const ROLES: readonly Role[] = [
  {
    key: "director",
    label: "Expedition Director",
    glyph: "D",
    initials: "EV",
    personId: "elena-vasquez",
  },
  {
    key: "lead",
    label: "Field Lead",
    glyph: "F",
    initials: "MR",
    personId: "mara-restrepo",
  },
  {
    key: "participant",
    label: "Participant",
    glyph: "P",
    initials: "PN",
    personId: "priya-nair",
  },
] as const;

export const ROLE_BY_KEY: Readonly<Record<RoleKey, Role>> = Object.fromEntries(
  ROLES.map((role) => [role.key, role]),
) as Record<RoleKey, Role>;

export const DEFAULT_ROLE: RoleKey = "director";
