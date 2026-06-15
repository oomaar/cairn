import type {
  ExpeditionStatus,
  LiveIncident,
  LiveParticipant,
} from "../types/live-expedition.types";

export function generateStatusAlerts(
  incidents: LiveIncident[],
  participants: LiveParticipant[],
  weather: { condition: string; windSpeed: number; visibility: number },
  hazardCheckpoints: boolean,
  injuredPct: number,
): ExpeditionStatus["alerts"] {
  const criticalIncidents = incidents.filter((i) => i.severity === "critical");
  const injuredParticipants = participants.filter((p) => p.flag);

  return {
    weatherAlert:
      weather.condition === "storm" ||
      weather.condition === "snow" ||
      weather.windSpeed > 50 ||
      weather.visibility < 1,
    crewAlert:
      injuredPct > 0.15 ||
      injuredParticipants.length > 0 ||
      participants.some((p) => p.heartRate > 150),
    equipmentAlert: false, // Would check against equipment data if available
    navigationAlert: hazardCheckpoints || criticalIncidents.length > 0,
    communicationAlert: Math.random() < 0.05, // 5% chance of comms issues
  };
}
