import {
  getCheckpoints,
  getWeather,
  listExpeditions,
  listRisks,
} from "@/universe";
import type { AnnunciatorFlag } from "../types/AnnunciatorFlag";

export function deriveFlags(): AnnunciatorFlag[] {
  const expeditions = listExpeditions().filter((e) => e.status === "in-field");

  const allWeatherAlerts = expeditions.flatMap((e) => getWeather(e.id));
  const hasWeatherDanger = allWeatherAlerts.some((a) => a.tone === "danger");
  const hasWeatherWarn = allWeatherAlerts.some((a) => a.tone === "warn");

  const allCheckpoints = expeditions.flatMap((e) => getCheckpoints(e.id));
  const hasHazardPass = allCheckpoints.some((cp) => cp.hazard);

  const risks = listRisks();
  const hasComplianceRisk = risks.some(
    (r) => r.category === "Compliance" && r.level !== "low",
  );

  const hasHighRisk = risks.some((r) => r.level === "high");

  const allHaveBeacons = expeditions.every((e) => e.filled > 0);

  const hasSos = expeditions.some(
    (e) => e.status === "in-field" && (e as { emergency?: boolean }).emergency,
  );

  return [
    {
      label: "WEATHER",
      active: hasWeatherDanger || hasWeatherWarn,
      tone: hasWeatherDanger ? "danger" : hasWeatherWarn ? "warn" : "idle",
    },
    {
      label: "EXPOSURE",
      active: hasHazardPass,
      tone: hasHazardPass ? "warn" : "idle",
    },
    {
      label: "CERTS",
      active: hasComplianceRisk,
      tone: hasComplianceRisk ? "warn" : "idle",
    },
    {
      label: "ROLL CALL",
      active: !hasHighRisk,
      tone: hasHighRisk ? "warn" : "ok",
    },
    {
      label: "BEACONS",
      active: allHaveBeacons,
      tone: allHaveBeacons ? "ok" : "warn",
    },
    {
      label: "SOS",
      active: hasSos,
      tone: hasSos ? "danger" : "idle",
    },
  ];
}
