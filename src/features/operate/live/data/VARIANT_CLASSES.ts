import type { CellVariant } from "../types/live-expedition.types";

export const VARIANT_CLASSES: Record<CellVariant, string> = {
  danger: "border-danger/40 bg-danger/10 text-danger",
  warn: "border-warn/40 bg-warn/10 text-warn",
  ok: "border-ok/40 bg-ok/10 text-ok",
  inactive: "border-border bg-transparent text-fg-4 opacity-40",
};
