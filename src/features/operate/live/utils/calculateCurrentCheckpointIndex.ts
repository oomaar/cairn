import type { LiveCheckpoint } from "../types/live-expedition.types";

export function calculateCurrentCheckpointIndex(
  checkpoints: LiveCheckpoint[],
): number {
  const currentIdx = checkpoints.findIndex((cp) => cp.status === "current");
  return currentIdx >= 0 ? currentIdx : 0;
}
