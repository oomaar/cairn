import type { CellVariant } from "../types/live-expedition.types";

export const DOT_CLASSES: Record<CellVariant, string> = {
  danger: "bg-danger",
  warn: "bg-warn",
  ok: "bg-(--plan-sage)",
  inactive: "bg-fg-4",
};
