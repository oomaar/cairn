"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_WORLD, WORLDS, type WorldKey } from "@/features/theme";
import type { Id } from "@/universe";

type ModuleByWorld = Record<WorldKey, string>;

const INITIAL_MODULES: ModuleByWorld = Object.fromEntries(
  WORLDS.map((world) => [world.key, world.defaultModule]),
) as ModuleByWorld;

/** The headline expedition the app opens focused on. */
const DEFAULT_FOCUS: Id = "tdp";

interface NavigationValue {
  /** Active world. */
  world: WorldKey;
  /** Active module within the active world. */
  module: string;
  /** Last-open module per world (preserved when switching worlds). */
  modules: ModuleByWorld;
  /** Expedition the workspace is currently focused on. */
  focusedExpeditionId: Id;
  setWorld: (world: WorldKey) => void;
  setModule: (module: string) => void;
  /** Jump to a world, optionally selecting a module — the palette's verb. */
  goTo: (world: WorldKey, module?: string) => void;
  focusExpedition: (id: Id) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

/**
 * Owns cross-cutting navigation state — active world, per-world module, and
 * the focused expedition. Lives in one place so the spine, the canvas, and the
 * command palette all drive and reflect the same navigation. (When URL routing
 * lands, this provider becomes the place that syncs to the router.)
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [world, setWorld] = useState<WorldKey>(DEFAULT_WORLD);
  const [modules, setModules] = useState<ModuleByWorld>(INITIAL_MODULES);
  const [focusedExpeditionId, setFocusedExpeditionId] =
    useState<Id>(DEFAULT_FOCUS);

  const value = useMemo<NavigationValue>(
    () => ({
      world,
      module: modules[world],
      modules,
      focusedExpeditionId,
      setWorld,
      setModule: (module) =>
        setModules((prev) => ({ ...prev, [world]: module })),
      goTo: (nextWorld, module) => {
        setWorld(nextWorld);
        if (module) setModules((prev) => ({ ...prev, [nextWorld]: module }));
      },
      focusExpedition: setFocusedExpeditionId,
    }),
    [world, modules, focusedExpeditionId],
  );

  return <NavigationContext value={value}>{children}</NavigationContext>;
}

/** Read navigation state. Throws if used outside a NavigationProvider. */
export function useNavigation(): NavigationValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
}
