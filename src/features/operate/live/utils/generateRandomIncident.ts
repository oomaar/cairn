import type { LiveIncident } from "../../live";
import { INCIDENT_TYPES } from "../../live/data/INCIDENT_TYPES";

export function generateRandomIncident(): LiveIncident | null {
  if (Math.random() > 0.15) return null; // 15% chance of incident

  const severity =
    Math.random() > 0.8 ? "critical" : Math.random() > 0.5 ? "warning" : "info";
  const type =
    INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];

  const incidents: Record<string, Record<string, string>> = {
    weather: {
      title: "Weather window closing",
      description: "Wind speeds increasing, consider early camp",
    },
    crew: {
      title: "Porter fatigue",
      description: "One porter showing signs of altitude fatigue",
    },
    equipment: {
      title: "Equipment issue",
      description: "Rope showing wear, may need precautions",
    },
    route: {
      title: "Route hazard detected",
      description: "Loose rock reported on approach",
    },
    decision: {
      title: "Decision point ahead",
      description: "Route divergence - choosing bypass in 2 hours",
    },
  };

  const incident = incidents[type];
  return {
    id: `incident-${Date.now()}`,
    timestamp: new Date(),
    severity: severity as "info" | "warning" | "critical",
    type: type as "weather" | "crew" | "equipment" | "route" | "decision",
    title: incident.title,
    description: incident.description,
    actionRequired: severity === "critical",
  };
}
