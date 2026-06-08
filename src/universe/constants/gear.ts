import type { GearItem } from "../types";

/** The operator's equipment catalog (org-level inventory). Allocations to
 *  expeditions are generated against each item's deployed count. */
export const GEAR_CATALOG: readonly GearItem[] = [
  { id: "TNT-04", name: "4-season expedition tent", category: "Shelter", total: 24, ready: 21, maintenance: 2, deployed: 14, status: "ok" },
  { id: "PLB-11", name: "Personal locator beacon", category: "Safety", total: 60, ready: 58, maintenance: 0, deployed: 48, status: "ok" },
  { id: "RPE-07", name: "Dynamic climbing rope 60m", category: "Technical", total: 18, ready: 15, maintenance: 3, deployed: 8, status: "warn" },
  { id: "STV-02", name: "Liquid-fuel expedition stove", category: "Cooking", total: 40, ready: 38, maintenance: 1, deployed: 22, status: "ok" },
  { id: "AVL-09", name: "Avalanche transceiver", category: "Safety", total: 50, ready: 44, maintenance: 6, deployed: 30, status: "warn" },
  { id: "SAT-03", name: "Satellite messenger (2-way)", category: "Comms", total: 30, ready: 30, maintenance: 0, deployed: 24, status: "ok" },
  { id: "CRP-01", name: "Crampons (steel, 12-pt)", category: "Technical", total: 64, ready: 60, maintenance: 4, deployed: 36, status: "ok" },
  { id: "MED-05", name: "Expedition trauma kit", category: "Medical", total: 16, ready: 14, maintenance: 0, deployed: 11, status: "warn" },
] as const;
