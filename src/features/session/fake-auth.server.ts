import { cookies } from "next/headers";
import { DEMO_ROLE_COOKIE, isRoleKey } from "./fake-auth";
import type { RoleKey } from "./role.types";

/**
 * Server-side reader for the persisted demo identity. Imported only by server
 * components (the shell layout) — never via the client-safe session barrel, so
 * `next/headers` stays out of the client bundle.
 */
export async function readDemoRole(): Promise<RoleKey | undefined> {
  const store = await cookies();
  const value = store.get(DEMO_ROLE_COOKIE)?.value;
  return isRoleKey(value) ? value : undefined;
}
