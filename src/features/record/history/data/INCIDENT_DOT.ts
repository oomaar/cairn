import type { Tone } from "@/universe";

export const INCIDENT_DOT: Partial<Record<Tone, string>> = {
  danger: "bg-danger",
  warn: "bg-warn",
  ok: "bg-ok",
  slate: "bg-fg-4",
};
