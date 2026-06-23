export function calculateReadinessScore(
  crewReadiness: number,
  equipmentReady: number,
  weatherFactor: number, // 0-100, higher = better conditions
  progressFactor: number, // 0-100, % of route complete
): number {
  // Weight: crew 40%, equipment 20%, weather 20%, progress 20%
  const score =
    crewReadiness * 0.4 +
    equipmentReady * 0.2 +
    weatherFactor * 0.2 +
    progressFactor * 0.2;
  return Math.round(score);
}
