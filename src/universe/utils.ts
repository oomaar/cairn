/** Small pure helpers used while assembling the universe. */

/** Initials from a person's name, e.g. "Mara Restrepo" → "MR". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** URL/id-safe slug, e.g. "Kenji Yu" → "kenji-yu". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Zero-padded sequence id, e.g. ("p", 7) → "p-007". */
export function seqId(prefix: string, n: number, width = 3): string {
  return `${prefix}-${String(n).padStart(width, "0")}`;
}

/** Index an array of records by a key field for O(1) relational lookups. */
export function indexBy<T, K extends keyof T>(
  rows: readonly T[],
  key: K,
): Map<T[K], T> {
  const map = new Map<T[K], T>();
  for (const row of rows) map.set(row[key], row);
  return map;
}

/** Group an array of records by a derived key. */
export function groupBy<T, K>(
  rows: readonly T[],
  keyOf: (row: T) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const key = keyOf(row);
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return map;
}
