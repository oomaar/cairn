import type {
  LiveIncident,
  LiveParticipant,
} from "../types/live-expedition.types";

export function calculateRiskLevel(
  incidents: LiveIncident[],
  weather: { condition: string; windSpeed: number },
  participants: LiveParticipant[],
  injuredPct: number,
): "low" | "medium" | "high" {
  let riskScore = 0;

  // Incidents: critical = 40 points, warning = 15 points
  const criticalCount = incidents.filter(
    (i) => i.severity === "critical",
  ).length;
  const warningCount = incidents.filter((i) => i.severity === "warning").length;
  riskScore += criticalCount * 40 + warningCount * 15;

  // Weather: wind > 40 = 20 points, storm/snow = 30 points
  if (weather.condition === "storm" || weather.condition === "snow") {
    riskScore += 30;
  } else if (weather.windSpeed > 40) {
    riskScore += 20;
  }

  // Crew: injuries > 10% = 20 points, many exhausted = 15 points
  if (injuredPct > 0.1) riskScore += 20;
  const exhaustedCount = participants.filter((p) => p.heartRate > 140).length;
  if (exhaustedCount > participants.length * 0.3) riskScore += 15;

  // Return risk level based on score
  if (riskScore >= 60) return "high";
  if (riskScore >= 30) return "medium";
  return "low";
}
