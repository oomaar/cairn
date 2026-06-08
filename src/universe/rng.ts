/**
 * Deterministic pseudo-random number generator.
 *
 * The whole universe is built from these streams, so the same seed always
 * yields the same world. Use `createRng(seed)` for a root stream and
 * `rng.child("part")` to fork an independent, stable sub-stream — forking by
 * name means adding a new generator never shifts the output of existing ones.
 */

/** Hash a string into a 32-bit seed (cyrb128, first lane). */
function hashSeed(str: string): number {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

/** mulberry32 — small, fast, well-distributed 32-bit PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  /** Next float in [0, 1). */
  next(): number;
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number;
  /** Float in [min, max). */
  float(min: number, max: number): number;
  /** True with probability p (default 0.5). */
  chance(p?: number): boolean;
  /** One element of arr. */
  pick<T>(arr: readonly T[]): T;
  /** A new array with arr's elements in a shuffled order. */
  shuffle<T>(arr: readonly T[]): T[];
  /** n distinct elements of arr (capped at arr.length). */
  sample<T>(arr: readonly T[], n: number): T[];
  /** Fork a stable, independent sub-stream identified by `part`. */
  child(part: string): Rng;
}

export function createRng(seed: string): Rng {
  const next = mulberry32(hashSeed(seed));

  const shuffle = <T>(arr: readonly T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    float: (min, max) => next() * (max - min) + min,
    chance: (p = 0.5) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle,
    sample: (arr, n) =>
      shuffle(arr).slice(0, Math.max(0, Math.min(n, arr.length))),
    child: (part) => createRng(`${seed}:${part}`),
  };
}
