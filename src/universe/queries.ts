import type {
  Announcement,
  Assignment,
  Checkpoint,
  CommMessage,
  Expedition,
  GearAllocation,
  GearItem,
  Id,
  Incident,
  LogEntry,
  Operator,
  Person,
  Risk,
  Route,
  WeatherAlert,
} from "./types";
import { getUniverse } from "./universe";
import { groupBy, indexBy } from "./utils";

/** Lazily-built lookup indexes over the singleton universe. */
interface Indexes {
  personById: Map<Id, Person>;
  expeditionById: Map<Id, Expedition>;
  checkpointById: Map<Id, Checkpoint>;
  gearById: Map<Id, GearItem>;
  routeByExpedition: Map<Id, Route>;
  assignmentsByExpedition: Map<Id, Assignment[]>;
  assignmentsByPerson: Map<Id, Assignment[]>;
  checkpointsByRoute: Map<Id, Checkpoint[]>;
  gearByExpedition: Map<Id, GearAllocation[]>;
  weatherByExpedition: Map<Id, WeatherAlert[]>;
  incidentsByExpedition: Map<Id, Incident[]>;
  commsByExpedition: Map<Id | null, CommMessage[]>;
  logsByExpedition: Map<Id, LogEntry[]>;
}

let cachedIndexes: Indexes | null = null;

function indexes(): Indexes {
  if (cachedIndexes) return cachedIndexes;
  const u = getUniverse();
  cachedIndexes = {
    personById: indexBy(u.people, "id"),
    expeditionById: indexBy(u.expeditions, "id"),
    checkpointById: indexBy(u.checkpoints, "id"),
    gearById: indexBy(u.gear, "id"),
    routeByExpedition: indexBy(u.routes, "expeditionId"),
    assignmentsByExpedition: groupBy(u.assignments, (a) => a.expeditionId),
    assignmentsByPerson: groupBy(u.assignments, (a) => a.personId),
    checkpointsByRoute: groupBy(u.checkpoints, (c) => c.routeId),
    gearByExpedition: groupBy(u.gearAllocations, (g) => g.expeditionId),
    weatherByExpedition: groupBy(u.weather, (w) => w.expeditionId),
    incidentsByExpedition: groupBy(u.incidents, (i) => i.expeditionId),
    commsByExpedition: groupBy(u.comms, (c) => c.expeditionId),
    logsByExpedition: groupBy(u.logs, (l) => l.expeditionId),
  };
  return cachedIndexes;
}

// ── Joined shapes ──────────────────────────────────────────────────────────

export interface RosterEntry {
  assignment: Assignment;
  person: Person;
}

export interface GearManifestEntry {
  allocation: GearAllocation;
  item: GearItem;
}

// ── Core entities ────────────────────────────────────────────────────────────

export function getOperator(): Operator {
  return getUniverse().operator;
}

export function listExpeditions(): Expedition[] {
  return getUniverse().expeditions;
}

export function getExpedition(id: Id): Expedition | undefined {
  return indexes().expeditionById.get(id);
}

export function getPerson(id: Id): Person | undefined {
  return indexes().personById.get(id);
}

export function listPeople(): Person[] {
  return getUniverse().people;
}

export function listGear(): GearItem[] {
  return getUniverse().gear;
}

// ── Relationships ──────────────────────────────────────────────────────────

export function getLeader(expeditionId: Id): Person | undefined {
  const expedition = getExpedition(expeditionId);
  return expedition ? getPerson(expedition.leaderId) : undefined;
}

/** The manifest for an expedition — assignments joined to their people. */
export function getRoster(expeditionId: Id): RosterEntry[] {
  const idx = indexes();
  return (idx.assignmentsByExpedition.get(expeditionId) ?? [])
    .map((assignment) => {
      const person = idx.personById.get(assignment.personId);
      return person ? { assignment, person } : null;
    })
    .filter((entry): entry is RosterEntry => entry !== null);
}

/** Reverse relation — every expedition a person is assigned to. */
export function getExpeditionsForPerson(personId: Id): Expedition[] {
  const idx = indexes();
  return (idx.assignmentsByPerson.get(personId) ?? [])
    .map((a) => idx.expeditionById.get(a.expeditionId))
    .filter((e): e is Expedition => e !== undefined);
}

export function getRoute(expeditionId: Id): Route | undefined {
  return indexes().routeByExpedition.get(expeditionId);
}

export function getCheckpoints(expeditionId: Id): Checkpoint[] {
  const route = getRoute(expeditionId);
  return route ? (indexes().checkpointsByRoute.get(route.id) ?? []) : [];
}

/** The gear manifest for an expedition — allocations joined to catalog items. */
export function getGearManifest(expeditionId: Id): GearManifestEntry[] {
  const idx = indexes();
  return (idx.gearByExpedition.get(expeditionId) ?? [])
    .map((allocation) => {
      const item = idx.gearById.get(allocation.gearItemId);
      return item ? { allocation, item } : null;
    })
    .filter((entry): entry is GearManifestEntry => entry !== null);
}

export function getWeather(expeditionId: Id): WeatherAlert[] {
  return indexes().weatherByExpedition.get(expeditionId) ?? [];
}

export function getIncidents(expeditionId: Id): Incident[] {
  return indexes().incidentsByExpedition.get(expeditionId) ?? [];
}

/** Comms for an expedition, or org-wide comms when expeditionId is null. */
export function getComms(expeditionId: Id | null): CommMessage[] {
  return indexes().commsByExpedition.get(expeditionId) ?? [];
}

export function getLogbook(expeditionId: Id): LogEntry[] {
  return indexes().logsByExpedition.get(expeditionId) ?? [];
}

/** List risks. Omit the filter for all; pass an id for one expedition; pass
 *  null for org-wide risks. */
export function listRisks(filter?: { expeditionId: Id | null }): Risk[] {
  const all = getUniverse().risks;
  if (!filter) return all;
  return all.filter((r) => r.expeditionId === filter.expeditionId);
}

export function listAnnouncements(): Announcement[] {
  return getUniverse().announcements;
}

// ── Derived metrics (the universe behaving like a backend) ───────────────────

export interface OperationsKpis {
  activeExpeditions: number;
  participantsInField: number;
  openRisks: { total: number; high: number; moderate: number; low: number };
  equipment: { readyPct: number; ready: number; total: number };
}

export function computeKpis(): OperationsKpis {
  const u = getUniverse();
  const inFieldIds = new Set(
    u.expeditions.filter((e) => e.status === "in-field").map((e) => e.id),
  );

  const ready = u.gear.reduce((sum, g) => sum + g.ready, 0);
  const total = u.gear.reduce((sum, g) => sum + g.total, 0);

  return {
    activeExpeditions: u.expeditions.filter(
      (e) => e.status === "in-field" || e.status === "departing",
    ).length,
    participantsInField: u.assignments.filter((a) =>
      inFieldIds.has(a.expeditionId),
    ).length,
    openRisks: {
      total: u.risks.length,
      high: u.risks.filter((r) => r.level === "high").length,
      moderate: u.risks.filter((r) => r.level === "moderate").length,
      low: u.risks.filter((r) => r.level === "low").length,
    },
    equipment: {
      ready,
      total,
      readyPct: total === 0 ? 0 : Math.round((ready / total) * 100),
    },
  };
}
