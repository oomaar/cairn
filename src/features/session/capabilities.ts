import type { RoleKey } from "./role.types";

/**
 * Capabilities are the unit of authorization. Screens ask "can I do X?" rather
 * than checking the role directly, so permissions stay declarative and roles
 * can evolve without touching every consumer.
 */
export type Capability =
  | "expeditions:view-all"
  | "expeditions:create"
  | "routes:edit"
  | "operations:command"
  | "risk:manage"
  | "roster:manage"
  | "equipment:manage"
  | "comms:broadcast"
  | "comms:send"
  | "incident:log"
  | "checkin";

const ALL_CAPABILITIES: readonly Capability[] = [
  "expeditions:view-all",
  "expeditions:create",
  "routes:edit",
  "operations:command",
  "risk:manage",
  "roster:manage",
  "equipment:manage",
  "comms:broadcast",
  "comms:send",
  "incident:log",
  "checkin",
];

/** What each role is allowed to do. The director runs the operation; the field
 *  lead commands their expedition; participants check in. */
export const ROLE_CAPABILITIES: Readonly<
  Record<RoleKey, readonly Capability[]>
> = {
  director: ALL_CAPABILITIES,
  lead: [
    "routes:edit",
    "operations:command",
    "comms:send",
    "incident:log",
    "checkin",
  ],
  participant: ["checkin"],
};

export function roleCan(role: RoleKey, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}
