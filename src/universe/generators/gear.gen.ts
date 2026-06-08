import type { Expedition, GearAllocation, GearItem } from "../types";

/**
 * Distribute each catalog item's deployed count across the expeditions that
 * are currently out (in-field or departing), weighted by party size. Uses
 * largest-remainder rounding so the allocations sum exactly to `deployed` —
 * the manifest stays consistent with the catalog. Deterministic; no RNG.
 */
export function generateGearAllocations(
  gear: readonly GearItem[],
  expeditions: readonly Expedition[],
): GearAllocation[] {
  const active = expeditions.filter(
    (e) => e.status === "in-field" || e.status === "departing",
  );
  const totalWeight = active.reduce((sum, e) => sum + e.filled, 0);
  if (active.length === 0 || totalWeight === 0) return [];

  const allocations: GearAllocation[] = [];

  for (const item of gear) {
    if (item.deployed <= 0) continue;

    const rows = active.map((e) => {
      const exact = (item.deployed * e.filled) / totalWeight;
      const base = Math.floor(exact);
      return { expeditionId: e.id, quantity: base, remainder: exact - base };
    });

    let leftover = item.deployed - rows.reduce((sum, r) => sum + r.quantity, 0);
    // Hand out the leftover to the largest fractional parts (stable tiebreak).
    [...rows]
      .sort(
        (a, b) =>
          b.remainder - a.remainder ||
          a.expeditionId.localeCompare(b.expeditionId),
      )
      .forEach((row) => {
        if (leftover > 0) {
          row.quantity += 1;
          leftover -= 1;
        }
      });

    for (const row of rows) {
      if (row.quantity > 0) {
        allocations.push({
          id: `alloc-${item.id}-${row.expeditionId}`,
          gearItemId: item.id,
          expeditionId: row.expeditionId,
          quantity: row.quantity,
        });
      }
    }
  }

  return allocations;
}
