"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_WORLD,
  WORLD_BY_KEY,
  WORLDS,
  type WorldKey,
} from "@/features/theme";
import type { Id } from "@/universe";

type ModuleByWorld = Record<WorldKey, string>;

const DEFAULT_MODULES: ModuleByWorld = Object.fromEntries(
  WORLDS.map((world) => [world.key, world.defaultModule]),
) as ModuleByWorld;

/** The headline expedition the app opens focused on. */
const DEFAULT_FOCUS: Id = "tdp";

function isWorldKey(value: string | undefined): value is WorldKey {
  return value !== undefined && value in WORLD_BY_KEY;
}

/** Derive the active world + module from the current pathname (/world/module),
 *  falling back to sensible defaults for unknown or partial paths. */
function parsePath(pathname: string): { world: WorldKey; module: string } {
  const [worldSeg, moduleSeg] = pathname.split("/").filter(Boolean);
  const world = isWorldKey(worldSeg) ? worldSeg : DEFAULT_WORLD;
  const def = WORLD_BY_KEY[world];
  const moduleKey = def.modules.some((m) => m.key === moduleSeg)
    ? (moduleSeg as string)
    : def.defaultModule;
  return { world, module: moduleKey };
}

interface NavigationValue {
  world: WorldKey;
  module: string;
  focusedExpeditionId: Id;
  setWorld: (world: WorldKey) => void;
  setModule: (module: string) => void;
  /** Jump to a world, optionally selecting a module — the palette's verb. */
  goTo: (world: WorldKey, module?: string) => void;
  focusExpedition: (id: Id) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

/**
 * URL-driven navigation. The active world + module come from the route, and
 * the setters push routes — so the spine, command palette, module tabs, and
 * the browser's back/forward all stay in sync with one source of truth: the
 * URL. Per-world "last open module" is remembered so switching worlds returns
 * you to where you were.
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { world, module } = parsePath(pathname);

  const [lastModule, setLastModule] = useState<ModuleByWorld>(DEFAULT_MODULES);
  const [focusedExpeditionId, setFocusedExpeditionId] =
    useState<Id>(DEFAULT_FOCUS);

  const value = useMemo<NavigationValue>(() => {
    const navigate = (nextWorld: WorldKey, nextModule?: string) => {
      const target = nextModule ?? lastModule[nextWorld];
      setLastModule((prev) => ({ ...prev, [nextWorld]: target }));
      router.push(`/${nextWorld}/${target}`);
    };
    return {
      world,
      module,
      focusedExpeditionId,
      setWorld: (nextWorld) => navigate(nextWorld),
      setModule: (nextModule) => navigate(world, nextModule),
      goTo: navigate,
      focusExpedition: setFocusedExpeditionId,
    };
  }, [world, module, focusedExpeditionId, lastModule, router]);

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
