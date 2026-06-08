"use client";

import { useState } from "react";
import {
  WORLDS,
  WORLD_BY_KEY,
  DEFAULT_WORLD,
  type WorldKey,
} from "@/features/theme";
import { SessionProvider, useSession } from "@/features/session";
import { Spine } from "./spine";
import { WorldCanvas } from "./world-canvas";

/** Per-world module selection, so switching worlds preserves each world's
 *  last-open workspace. Seeded from each world's default module. */
type ModuleByWorld = Record<WorldKey, string>;

const INITIAL_MODULES: ModuleByWorld = Object.fromEntries(
  WORLDS.map((world) => [world.key, world.defaultModule]),
) as ModuleByWorld;

/**
 * The shell frame — the persistent layout. Owns world/module navigation state
 * and reads the active role from the session, composing the constant spine
 * with the active world's canvas.
 */
function ShellFrame() {
  const { role, setRole } = useSession();
  const [world, setWorld] = useState<WorldKey>(DEFAULT_WORLD);
  const [moduleByWorld, setModuleByWorld] =
    useState<ModuleByWorld>(INITIAL_MODULES);

  const setModule = (next: string) =>
    setModuleByWorld((prev) => ({ ...prev, [world]: next }));

  return (
    <div className="flex flex-1 overflow-hidden bg-spine">
      <Spine
        world={world}
        role={role}
        onWorldChange={setWorld}
        onRoleChange={setRole}
      />
      <WorldCanvas
        world={WORLD_BY_KEY[world]}
        module={moduleByWorld[world]}
        onModuleChange={setModule}
        expedition="Torres del Paine"
      />
    </div>
  );
}

/**
 * AppShell — the application root. Establishes the session (active role +
 * capabilities) for the whole app, then renders the shell frame.
 */
export function AppShell() {
  return (
    <SessionProvider>
      <ShellFrame />
    </SessionProvider>
  );
}
