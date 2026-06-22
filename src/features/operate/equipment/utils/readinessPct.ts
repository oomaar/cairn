import type { GearItem } from "@/universe";

export function readinessPct(item: GearItem): number {
  return item.total === 0 ? 0 : Math.round((item.ready / item.total) * 100);
}
