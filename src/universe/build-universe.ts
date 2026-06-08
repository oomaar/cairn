import {
  ANNOUNCEMENTS,
  COMMS,
  EXPEDITIONS,
  GEAR_CATALOG,
  INCIDENTS,
  NAMED_PEOPLE,
  OPERATOR,
  RISKS,
  WEATHER_ALERTS,
} from "./constants";
import {
  countPoolSeats,
  generateAssignments,
  generateGearAllocations,
  generateLogs,
  generatePoolPeople,
  generateRoutes,
} from "./generators";
import { createRng } from "./rng";
import { UNIVERSE_SEED } from "./seed";
import type { Universe, WeatherAlert } from "./types";

/**
 * Assemble the entire relational universe from a single seed. Pure and
 * deterministic: same seed → same world. Authored content is linked by id;
 * breadth (rosters, routes, gear manifests, logs) is generated.
 */
export function buildUniverse(seed: string = UNIVERSE_SEED): Universe {
  const rng = createRng(seed);
  const expeditions = [...EXPEDITIONS];

  // People: named + a generated pool sized to fill every roster (with slack).
  const pool = generatePoolPeople(
    rng.child("people"),
    countPoolSeats(expeditions) + 12,
  );
  const people = [...NAMED_PEOPLE, ...pool];

  // Routes + checkpoints for every expedition.
  const { routes, checkpoints } = generateRoutes(
    rng.child("routes"),
    expeditions,
  );

  // Manifests and gear allocations.
  const assignments = generateAssignments(
    rng.child("assignments"),
    expeditions,
    pool,
  );
  const gear = [...GEAR_CATALOG];
  const gearAllocations = generateGearAllocations(gear, expeditions);

  // Authored records, linked relationally. Resolve weather → checkpoint by
  // matching the alert's place to a checkpoint on the same expedition.
  const weather: WeatherAlert[] = WEATHER_ALERTS.map((alert) => {
    const route = routes.find((r) => r.expeditionId === alert.expeditionId);
    const match = route
      ? checkpoints.find(
          (c) => c.routeId === route.id && c.name === alert.place,
        )
      : undefined;
    return { ...alert, checkpointId: match?.id ?? null };
  });

  const risks = [...RISKS];
  const incidents = [...INCIDENTS];
  const comms = [...COMMS];
  const announcements = [...ANNOUNCEMENTS];

  // Daybook woven from movement, weather, incidents and comms.
  const logs = generateLogs({
    expeditions,
    checkpoints,
    incidents,
    weather,
    comms,
  });

  return {
    operator: OPERATOR,
    people,
    expeditions,
    routes,
    checkpoints,
    assignments,
    gear,
    gearAllocations,
    weather,
    risks,
    incidents,
    comms,
    announcements,
    logs,
  };
}
