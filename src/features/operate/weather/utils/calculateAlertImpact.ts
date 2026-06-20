import { getCheckpoints } from "@/universe";
import type { TrackedWeatherAlert } from "../types/weather-alert.types";

export interface AlertImpact {
  expeditionCount: number;
  checkpointCount: number;
  affectedExpeditions: string[];
  affectedCheckpoints: string[];
  estimatedDelayHours: number;
  recommendation: "delay" | "reroute" | "camp" | "accelerate" | "monitor";
}

export function calculateAlertImpact(
  alert: TrackedWeatherAlert,
  expeditionId: string,
): AlertImpact {
  const checkpoints = getCheckpoints(expeditionId);
  const affectedCheckpoints = checkpoints
    .filter((cp) => {
      const distance = Math.abs(cp.km - (alert.place ? 0 : 0));
      return distance < 15;
    })
    .map((cp) => cp.name);

  let recommendation: "delay" | "reroute" | "camp" | "accelerate" | "monitor" =
    "monitor";

  if (alert.severity === "danger") {
    recommendation = "camp";
  } else if (alert.severity === "warn") {
    recommendation = "accelerate";
  }

  const estimatedDelay =
    alert.severity === "danger" ? 4 : alert.severity === "warn" ? 2 : 0;

  return {
    expeditionCount: 1,
    checkpointCount: affectedCheckpoints.length,
    affectedExpeditions: [expeditionId],
    affectedCheckpoints,
    estimatedDelayHours: estimatedDelay,
    recommendation,
  };
}
