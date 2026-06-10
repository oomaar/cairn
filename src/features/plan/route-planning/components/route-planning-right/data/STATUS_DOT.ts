import type { CheckpointStatus } from "@/universe";

export const STATUS_DOT: Record<CheckpointStatus, string> = {
  done: "bg-(--plan-sage)",
  current: "bg-accent",
  ahead: "border border-border-strong",
};
