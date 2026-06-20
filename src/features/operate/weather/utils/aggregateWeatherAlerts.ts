import { listExpeditions, getWeather } from "@/universe";
import type { TrackedWeatherAlert } from "../types/weather-alert.types";

export function aggregateWeatherAlerts(): TrackedWeatherAlert[] {
  const expeditions = listExpeditions();
  const allAlerts: TrackedWeatherAlert[] = [];

  for (const expedition of expeditions) {
    const weatherAlerts = getWeather(expedition.id);

    for (const alert of weatherAlerts) {
      const trackedAlert: TrackedWeatherAlert = {
        ...alert,
        expeditionId: expedition.id,
        responses: [],
        status: "active",
        createdAt: new Date(),
        severity: (alert.tone === "danger"
          ? "danger"
          : alert.tone === "warn"
            ? "warn"
            : "info") as "danger" | "warn" | "info",
      };
      allAlerts.push(trackedAlert);
    }
  }

  return allAlerts;
}
