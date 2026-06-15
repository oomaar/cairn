"use client";

import { useEffect, useState } from "react";
import type { LiveExpeditionState } from "../types/live-expedition.types";
import { WEATHER_CONDITIONS } from "../data/WEATHER_CONDITIONS";
import { generateRandomIncident } from "../utils/generateRandomIncident";

export function useLiveExpeditionUpdates(
  expeditionId: string,
  initialState: LiveExpeditionState,
) {
  const [state, setState] = useState<LiveExpeditionState>(initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const newIncidents = [...prev.incidents];
        const incident = generateRandomIncident();
        if (incident) {
          newIncidents.unshift(incident);
          if (newIncidents.length > 20) newIncidents.pop();
        }

        // Simulate progress along the route
        const progressStep = Math.random() * 2;
        const newProgress = Math.min(100, prev.progressPct + progressStep);

        // Simulate weather change
        const weatherChance = Math.random();
        let weather = prev.weather;
        if (weatherChance > 0.7) {
          const newCondition =
            WEATHER_CONDITIONS[
              Math.floor(Math.random() * WEATHER_CONDITIONS.length)
            ];
          weather = {
            ...prev.weather,
            condition: newCondition,
            temperature: prev.weather.temperature + (Math.random() - 0.5) * 3,
            windSpeed: prev.weather.windSpeed + (Math.random() - 0.4) * 5,
          };
        }

        // Simulate party fatigue/status changes
        const partyVariation = Math.random() * 0.1;
        const partyStatus = {
          healthy: Math.max(0, prev.partyStatus.healthy - partyVariation),
          fatigued: Math.min(
            1,
            prev.partyStatus.fatigued + partyVariation * 0.7,
          ),
          injured: prev.partyStatus.injured + (Math.random() > 0.98 ? 0.05 : 0),
        };

        return {
          ...prev,
          progressPct: newProgress,
          incidents: newIncidents,
          weather,
          partyStatus: {
            healthy: Math.round(partyStatus.healthy * 100) / 100,
            fatigued: Math.round(partyStatus.fatigued * 100) / 100,
            injured: Math.round(Math.min(1, partyStatus.injured) * 100) / 100,
          },
          lastUpdate: new Date(),
        };
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [expeditionId]);

  return state;
}
