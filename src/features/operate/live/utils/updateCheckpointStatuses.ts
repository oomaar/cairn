import type { LiveCheckpoint } from "../types/live-expedition.types";

export function updateCheckpointStatuses(
  checkpoints: LiveCheckpoint[],
  progressPct: number,
): LiveCheckpoint[] {
  if (checkpoints.length === 0) return checkpoints;

  const totalKm = checkpoints[checkpoints.length - 1]?.km ?? 1;
  const progressKm = (progressPct / 100) * totalKm;

  return checkpoints.map((cp, idx) => {
    let status: "done" | "current" | "ahead";
    if (progressKm >= cp.km) {
      status = "done";
    } else if (idx === 0 || progressKm >= checkpoints[idx - 1]!.km) {
      status = "current";
    } else {
      status = "ahead";
    }
    return { ...cp, status };
  });
}
