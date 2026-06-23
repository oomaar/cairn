"use client";

import { useEffect, useState } from "react";
import type {
  WeatherAlertsDashboardState,
  WeatherAlertFilter,
} from "../types/weather-alert.types";
import { aggregateWeatherAlerts } from "../utils/aggregateWeatherAlerts";
import { filterAndSortAlerts } from "../utils/filterAndSortAlerts";

export function useWeatherAlerts() {
  const [state, setState] = useState<WeatherAlertsDashboardState>({
    allAlerts: [],
    filter: {},
    sortBy: "severity",
    lastUpdate: new Date(),
  });

  useEffect(() => {
    const updateAlerts = () => {
      const allAlerts = aggregateWeatherAlerts();
      setState((prev) => ({
        ...prev,
        allAlerts,
        lastUpdate: new Date(),
      }));
    };

    updateAlerts();
    const interval = setInterval(updateAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayedAlerts = filterAndSortAlerts(
    state.allAlerts,
    state.filter,
    state.sortBy,
  );

  const setFilter = (filter: WeatherAlertFilter) => {
    setState((prev) => ({ ...prev, filter }));
  };

  const setSortBy = (sortBy: "severity" | "time" | "expeditionName") => {
    setState((prev) => ({ ...prev, sortBy }));
  };

  const acknowledgeAlert = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      allAlerts: prev.allAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "acknowledged",
              acknowledgedAt: new Date(),
              acknowledgedBy: "User",
            }
          : alert,
      ),
    }));
  };

  const respondToAlert = (
    alertId: string,
    responseType: "delay" | "reroute" | "camp" | "accelerate" | "monitor",
    notes?: string,
  ) => {
    setState((prev) => ({
      ...prev,
      allAlerts: prev.allAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "acknowledged",
              responses: [
                ...alert.responses,
                {
                  type: responseType,
                  notes,
                  recordedAt: new Date(),
                  recordedBy: "User",
                },
              ],
            }
          : alert,
      ),
    }));
  };

  const resolveAlert = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      allAlerts: prev.allAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert,
      ),
    }));
  };

  return {
    state,
    displayedAlerts,
    setFilter,
    setSortBy,
    acknowledgeAlert,
    respondToAlert,
    resolveAlert,
  };
}
