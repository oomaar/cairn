export function getCommsStatus(
  communicationAlert: boolean,
): "ok" | "degraded" | "lost" {
  if (Math.random() < 0.02) return "lost"; // 2% chance of total loss
  if (communicationAlert) return "degraded";
  return "ok";
}
