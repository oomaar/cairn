import type {
  TrackedWeatherAlert,
  WeatherAlertFilter,
} from "../types/weather-alert.types";

export function filterAlerts(
  alerts: TrackedWeatherAlert[],
  filter: WeatherAlertFilter,
): TrackedWeatherAlert[] {
  return alerts.filter((alert) => {
    if (filter.severity && alert.severity !== filter.severity) return false;

    if (filter.expeditionId && alert.expeditionId !== filter.expeditionId)
      return false;

    if (filter.status && alert.status !== filter.status) return false;
    return true;
  });
}

export function sortAlerts(
  alerts: TrackedWeatherAlert[],
  sortBy: "severity" | "time" | "expeditionName",
): TrackedWeatherAlert[] {
  const sorted = [...alerts];

  if (sortBy === "severity") {
    const severityOrder = { danger: 0, warn: 1, info: 2 };
    sorted.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
    );
  } else if (sortBy === "time") {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sortBy === "expeditionName") {
    sorted.sort((a, b) => a.expeditionId.localeCompare(b.expeditionId));
  }

  return sorted;
}

export function filterAndSortAlerts(
  alerts: TrackedWeatherAlert[],
  filter: WeatherAlertFilter,
  sortBy: "severity" | "time" | "expeditionName",
): TrackedWeatherAlert[] {
  const filtered = filterAlerts(alerts, filter);
  return sortAlerts(filtered, sortBy);
}
