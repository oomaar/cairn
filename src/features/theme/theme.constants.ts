import type { World, WorldKey } from "./theme.types";

/**
 * The three worlds, in spine order. Source of truth for the world switcher
 * and any navigation that fans out across Plan / Operate / Record.
 *
 * Palette values live in globals.css (`.world-*` scopes); the spine accents
 * mirror `--spine-{world}` so the JS-driven shell and the CSS stay in step.
 */
export const WORLDS: readonly World[] = [
  {
    key: "plan",
    label: "Plan",
    description: "Terrain & route planning",
    icon: "map",
    scopeClass: "world-plan",
    spineAccent: "var(--spine-plan)",
    defaultModule: "route",
    modules: [
      { key: "route", label: "Route Planning" },
      { key: "expeditions", label: "Expeditions" },
      { key: "builder", label: "New Expedition", requiredCapability: "expeditions:create" },
    ],
  },
  {
    key: "operate",
    label: "Operate",
    description: "Live operations & monitoring",
    icon: "gauge",
    scopeClass: "world-operate",
    spineAccent: "var(--spine-operate)",
    defaultModule: "command",
    modules: [
      { key: "command", label: "Command" },
      { key: "live", label: "Live" },
      { key: "weather", label: "Weather" },
      { key: "risk", label: "Risk" },
      { key: "equipment", label: "Equipment" },
      { key: "comms", label: "Comms" },
    ],
  },
  {
    key: "record",
    label: "Record",
    description: "Logs, reports & history",
    icon: "book",
    scopeClass: "world-record",
    spineAccent: "var(--spine-record)",
    defaultModule: "daybook",
    modules: [
      { key: "daybook", label: "Daybook" },
      { key: "incidents", label: "Incident Reports" },
      { key: "briefings", label: "Briefings" },
      { key: "history", label: "Archive" },
      { key: "metrics", label: "Metrics" },
    ],
  },
] as const;

/** Worlds keyed by id for O(1) lookup. */
export const WORLD_BY_KEY: Readonly<Record<WorldKey, World>> =
  Object.fromEntries(WORLDS.map((world) => [world.key, world])) as Record<
    WorldKey,
    World
  >;

/** The world the app opens on. */
export const DEFAULT_WORLD: WorldKey = "plan";
