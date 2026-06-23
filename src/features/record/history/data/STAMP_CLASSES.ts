import type { Tone } from "@/universe";

export const STAMP_CLASSES: Partial<Record<Tone, string>> = {
  danger: "border-danger text-danger",
  warn: "border-warn text-warn",
  ok: "border-ok text-ok",
  idle: "border-border text-fg-3",
  slate: "border-border text-fg-3",
};
