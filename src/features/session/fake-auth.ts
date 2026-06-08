import type { RoleKey } from "./role.types";

/**
 * Fake auth — there is no real authentication. The demo "identity" is just the
 * chosen role, persisted in a cookie so it survives reloads and can be read on
 * the server to seed the session without a flash. Client-safe helpers only;
 * the server reader lives in fake-auth.server.ts.
 */
export const DEMO_ROLE_COOKIE = "cairn-demo-role";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function isRoleKey(value: string | undefined | null): value is RoleKey {
  return value === "director" || value === "lead" || value === "participant";
}

/** Persist the demo identity (client-side). */
export function persistDemoRole(role: RoleKey): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

/** Forget the demo identity (client-side). */
export function clearDemoRole(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
