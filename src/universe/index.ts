/**
 * The simulated operational universe — Cairn's fake backend.
 *
 * A single seed deterministically produces a relational world of expeditions,
 * people, routes, gear, weather, risks, incidents, comms and logs that all
 * reference one another. Consume it through the query layer rather than
 * touching the tables directly.
 */

// Types
export type * from "./types";

// Seed + build (escape hatches for tooling/tests)
export { UNIVERSE_SEED } from "./seed";
export { buildUniverse } from "./build-universe";
export { getUniverse } from "./universe";

// Relational query layer (the primary API)
export {
  getOperator,
  listExpeditions,
  getExpedition,
  getPerson,
  listPeople,
  getLeader,
  getRoster,
  getExpeditionsForPerson,
  getRoute,
  getCheckpoints,
  getGearManifest,
  getWeather,
  getIncidents,
  getComms,
  getLogbook,
  listRisks,
  listAnnouncements,
  computeKpis,
} from "./queries";
export type { RosterEntry, GearManifestEntry, OperationsKpis } from "./queries";
