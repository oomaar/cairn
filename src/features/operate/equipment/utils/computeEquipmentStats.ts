import type { GearItem } from "@/universe";
import type { EquipmentStats } from "../types/EquipmentStats";

export function computeEquipmentStats(gear: GearItem[]): EquipmentStats {
  return gear.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      fieldReady: acc.fieldReady + item.ready,
      inService: acc.inService + item.maintenance,
      checkedOut: acc.checkedOut + item.deployed,
    }),
    { total: 0, fieldReady: 0, inService: 0, checkedOut: 0 },
  );
}
