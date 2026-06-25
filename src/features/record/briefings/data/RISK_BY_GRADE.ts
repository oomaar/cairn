import type { Grade } from "@/universe";

export const RISK_BY_GRADE: Record<Grade, string> = {
  moderate:
    "Moderate exposure on higher sections. River crossings — assess conditions on approach. Full layering required at elevation.",
  strenuous:
    "Sustained physical demand with technical terrain in places. Navigation skills essential. High-altitude protocols apply above 3 500 m.",
  expert:
    "Demanding route with sustained exposure. Rope required for technical sections. Full emergency protocols in effect.",
};
