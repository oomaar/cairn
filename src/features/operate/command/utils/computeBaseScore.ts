import { computeKpis } from "@/universe";

export function computeBaseScore(kpis: ReturnType<typeof computeKpis>): number {
  return Math.round(
    kpis.equipment.readyPct * 0.4 +
      (kpis.openRisks.high === 0 ? 100 : kpis.openRisks.high <= 2 ? 70 : 40) *
        0.3 +
      100 * 0.3,
  );
}
