import { LiveCheckpoint } from "../types/live-expedition.types";

export function calculateNextCheckpoint(
  checkpoints: LiveCheckpoint[],
  currentIndex: number,
): { name: string; eta: string; distanceKm: number } {
  const nextCheckpoint = checkpoints.find((cp) => cp.status !== "done");

  if (!nextCheckpoint) {
    const lastCheckpoint = checkpoints[checkpoints.length - 1];
    return {
      name: lastCheckpoint?.name ?? "Expedition Complete",
      eta: lastCheckpoint?.eta ?? "—",
      distanceKm: 0,
    };
  }

  const currentCheckpoint = checkpoints[currentIndex];
  const distanceKm = currentCheckpoint
    ? nextCheckpoint.km - currentCheckpoint.km
    : nextCheckpoint.km;

  return {
    name: nextCheckpoint.name,
    eta: nextCheckpoint.eta,
    distanceKm: Math.max(0, distanceKm),
  };
}
