"use client";

import { useState } from "react";
import {
  DEFAULT_WORLD,
  WORLD_BY_KEY,
  WORLDS,
  type WorldKey,
} from "@/features/theme";
import { DEFAULT_ROLE, type RoleKey } from "../roles";
import { Spine } from "./spine";
import { WorldCanvas } from "./world-canvas";

/** Per-world module selection, so switching worlds preserves each world's
 *  last-open workspace. Seeded from each world's default module. */
type ModuleByWorld = Record<WorldKey, string>;

const INITIAL_MODULES: ModuleByWorld = Object.fromEntries(
  WORLDS.map((world) => [world.key, world.defaultModule]),
) as ModuleByWorld;

/**
 * AppShell — the persistent application frame. Owns the cross-cutting
 * navigation state (active world, role, per-world module) and composes the
 * constant spine with the active world's canvas. Worlds take over the canvas
 * in their own visual language.
 */
export function AppShell() {
  const [world, setWorld] = useState<WorldKey>(DEFAULT_WORLD);
  const [role, setRole] = useState<RoleKey>(DEFAULT_ROLE);
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
