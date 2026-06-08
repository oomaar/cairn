export type { Role, RoleKey } from "./role.types";
export { ROLES, ROLE_BY_KEY, DEFAULT_ROLE } from "./role.constants";
export { ROLE_CAPABILITIES, roleCan, type Capability } from "./capabilities";
export {
  SessionProvider,
  useSession,
  useRole,
  useCan,
} from "./session-context";
export { persistDemoRole, clearDemoRole, DEMO_ROLE_COOKIE } from "./fake-auth";
