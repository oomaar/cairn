import { TDP_ROSTER } from "../constants";
import type {
  Assignment,
  AssignmentTelemetry,
  Expedition,
  ExpeditionRole,
  Person,
} from "../types";
import type { Rng } from "../rng";

const PACE_OPTIONS = ["on pace", "on pace", "on pace", "−10%", "+5%", "sweep"];

function generateTelemetry(
  rng: Rng,
  role: ExpeditionRole,
): AssignmentTelemetry {
  const pace = role === "field-leader" ? "on pace" : rng.pick(PACE_OPTIONS);
  const relativePosition =
    role === "field-leader"
      ? "lead"
      : pace === "sweep"
        ? "rear"
        : `${rng.int(5, 60)}m back`;
  return {
    pace,
    relativePosition,
    battery: rng.int(55, 98),
    heartRate: rng.int(95, 135),
  };
}

/**
 * Build the manifest (assignments) for every expedition. The headline
 * expedition starts from its authored roster and is topped up to capacity;
 * the rest are generated. Pool participants are consumed uniquely across
 * expeditions, so nobody is double-booked.
 */
export function generateAssignments(
  rng: Rng,
  expeditions: readonly Expedition[],
  pool: readonly Person[],
): Assignment[] {
  const assignments: Assignment[] = [];
  let cursor = 0;
  const live = (status: Expedition["status"]) => status === "in-field";

  for (const expedition of expeditions) {
    const expRng = rng.child(expedition.id);
    const seen = new Set<string>();

    const push = (
      personId: string,
      role: ExpeditionRole,
      telemetry?: AssignmentTelemetry,
    ) => {
      if (seen.has(personId)) return;
      seen.add(personId);
      assignments.push({
        id: `asg-${expedition.id}-${personId}`,
        expeditionId: expedition.id,
        personId,
        role,
        telemetry,
      });
    };

    if (expedition.id === "tdp") {
      for (const seed of TDP_ROSTER)
        push(seed.personId, seed.role, seed.telemetry);
    } else {
      push(
        expedition.leaderId,
        "field-leader",
        live(expedition.status)
          ? generateTelemetry(expRng, "field-leader")
          : undefined,
      );
    }

    // Fill remaining seats from the shared pool.
    let assistantPlaced = expedition.id === "tdp";
    while (seen.size < expedition.filled && cursor < pool.length) {
      const person = pool[cursor++];
      const role: ExpeditionRole =
        !assistantPlaced && expRng.chance(0.5)
          ? "assistant-lead"
          : "participant";
      if (role === "assistant-lead") assistantPlaced = true;
      push(
        person.id,
        role,
        live(expedition.status) ? generateTelemetry(expRng, role) : undefined,
      );
    }
  }

  return assignments;
}

/** Total pool participants needed across all expeditions (named seats are
 *  excluded), used to size the generated pool. */
export function countPoolSeats(expeditions: readonly Expedition[]): number {
  return expeditions.reduce((sum, e) => {
    const named = e.id === "tdp" ? TDP_ROSTER.length : 1; // leader
    return sum + Math.max(0, e.filled - named);
  }, 0);
}
