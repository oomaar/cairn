import type { Tone } from "@/universe";

export const SEVERITY: Partial<Record<Tone, string>> = {
  danger: "Critical — Category 3",
  warn: "Minor — Category 1",
  ok: "Nominal",
  slate: "Administrative",
};
