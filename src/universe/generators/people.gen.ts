import { FIRST_NAMES, LAST_NAMES } from "../constants";
import type { Person } from "../types";
import type { Rng } from "../rng";
import { initialsOf, seqId } from "../utils";

/**
 * Deterministically generate the wider participant roster that fills out every
 * expedition beyond the named people. Draws unique names from the pools, so
 * the same seed always yields the same roster.
 */
export function generatePoolPeople(rng: Rng, count: number): Person[] {
  const combos: string[] = [];
  for (const first of FIRST_NAMES) {
    for (const last of LAST_NAMES) combos.push(`${first} ${last}`);
  }
  const chosen = rng.sample(combos, count);

  return chosen.map((name, i) => ({
    id: seqId("p", i + 1),
    name,
    initials: initialsOf(name),
    baseRole: "participant",
    tone: "olive",
  }));
}
