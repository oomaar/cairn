import { buildUniverse } from "./build-universe";
import type { Universe } from "./types";

let cached: Universe | null = null;

/**
 * The singleton universe. Built once, lazily, and memoized — every caller sees
 * the same deterministic world for the life of the process.
 */
export function getUniverse(): Universe {
  if (!cached) cached = buildUniverse();
  return cached;
}
