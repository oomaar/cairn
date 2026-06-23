import type { Grade } from "@/universe";

export const EQUIPMENT_BY_GRADE: Record<Grade, string> = {
  moderate:
    "Standard moderate kit. PLB per participant. Satellite messenger with field leader.",
  strenuous:
    "Full technical kit. Rope, harness, and crampons as appropriate. PLB mandatory per participant.",
  expert:
    "Full expedition kit including rope, harness, and glacier gear where indicated. PLB mandatory. Satellite comms per group of four.",
};
