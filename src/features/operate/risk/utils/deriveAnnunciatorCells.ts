import type { Risk } from "@/universe/types";

export interface AnnunciatorCell {
  label: string;
  active: boolean;
  tone: string;
  sub?: string;
}

type CellDef = {
  label: string;
  derive: (risks: Risk[]) => Risk | undefined;
};

const CELL_DEFS: CellDef[] = [
  {
    label: "EXPOSURE",
    derive: (risks) =>
      risks.find((r) => r.category === "Environmental" && r.level === "high"),
  },
  {
    label: "SNOWPACK",
    derive: (risks) =>
      risks.find((r) => r.category === "Environmental" && r.level !== "high"),
  },
  {
    label: "RIVER",
    derive: (risks) => risks.find((r) => r.category === "Route"),
  },
  {
    label: "CERTS",
    derive: (risks) => risks.find((r) => r.category === "Compliance"),
  },
  {
    label: "MEDICAL",
    derive: (risks) => risks.find((r) => r.category === "Medical"),
  },
  {
    label: "EQUIP FAIL",
    derive: (risks) => risks.find((r) => r.category === "Logistics"),
  },
  { label: "COMMS LOSS", derive: () => undefined },
  { label: "OVERDUE", derive: () => undefined },
];

export function deriveAnnunciatorCells(risks: Risk[]): AnnunciatorCell[] {
  return CELL_DEFS.map((def) => {
    const match = def.derive(risks);
    if (!match) return { label: def.label, active: false, tone: "idle" };
    const sub =
      match.expeditionId !== null ? match.expeditionId.toUpperCase() : "ORG";
    return { label: def.label, active: true, tone: match.tone, sub };
  });
}
