import {
  getCheckpoints,
  getExpedition,
  getRoute,
  getWeather,
  listExpeditions,
} from "@/universe";
import type { PlanStation, RoutePlan } from "./route.types";

/** Chart viewBox + plotting margins. */
export const CHART_W = 960;
export const CHART_H = 600;
const PAD_X = 110;
const PAD_TOP = 160;
const PAD_BOTTOM = 130;

/** Small deterministic hash → [0,1). Keeps chart layout stable across renders
 *  (and SSR/hydration) without any randomness. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/**
 * A wobbled closed ring (contour line). Deterministic from `seed`.
 * Ported from the wireframe chart table.
 */
export function contourRing(
  cx: number,
  cy: number,
  r: number,
  seed: number,
  squash = 0.76,
  wobble = 0.16,
): string {
  const steps = 46;
  const points: string[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = (k / steps) * Math.PI * 2;
    const rr =
      r * (1 + wobble * Math.sin(a * 3 + seed * 1.7) + wobble * 0.55 * Math.cos(a * 2 - seed));
    const x = cx + rr * Math.cos(a);
    const y = cy + rr * Math.sin(a) * squash;
    points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}Z`;
}

/** Plot stations across the sheet: x by distance, y a deterministic meander. */
function plotPositions(
  ids: string[],
  kms: number[],
  seed: number,
): { x: number; y: number }[] {
  const maxKm = Math.max(...kms, 1);
  const top = PAD_TOP;
  const bottom = CHART_H - PAD_BOTTOM;
  let y = (top + bottom) / 2;
  return ids.map((id, i) => {
    const x = PAD_X + (kms[i] / maxKm) * (CHART_W - 2 * PAD_X);
    const delta = (hash(`${id}:${seed}`) - 0.5) * 2 * 130;
    y = Math.min(bottom, Math.max(top, y + delta));
    return { x, y: Math.round(y) };
  });
}

/** Cumulative arc-length fraction (0..1) at each station along the route. */
export function stationFractions(points: { x: number; y: number }[]): number[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lengths[i] = lengths[i - 1] + Math.hypot(dx, dy);
  }
  const total = lengths[lengths.length - 1] || 1;
  return lengths.map((l) => l / total);
}

/** Position at fraction t (0..1) along the route polyline. */
export function pointAtFraction(
  points: { x: number; y: number }[],
  t: number,
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  const fr = stationFractions(points);
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 1; i < points.length; i++) {
    if (clamped <= fr[i]) {
      const span = fr[i] - fr[i - 1] || 1;
      const local = (clamped - fr[i - 1]) / span;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * local,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * local,
      };
    }
  }
  return points[points.length - 1];
}

/** Chart position at a given distance (km) along the route, interpolating
 *  between the stations that bracket it. */
export function chartPointAtKm(
  stations: { km: number; x: number; y: number }[],
  km: number,
): { x: number; y: number } {
  if (stations.length === 0) return { x: 0, y: 0 };
  if (km <= stations[0].km) return { x: stations[0].x, y: stations[0].y };
  for (let i = 1; i < stations.length; i++) {
    if (km <= stations[i].km) {
      const span = stations[i].km - stations[i - 1].km || 1;
      const local = (km - stations[i - 1].km) / span;
      return {
        x: stations[i - 1].x + (stations[i].x - stations[i - 1].x) * local,
        y: stations[i - 1].y + (stations[i].y - stations[i - 1].y) * local,
      };
    }
  }
  const last = stations[stations.length - 1];
  return { x: last.x, y: last.y };
}

export interface AlternateRoute {
  points: { x: number; y: number }[];
  distanceKm: number;
  gainM: number;
  note: string;
}

/** A deterministic weather alternate: detours below the exposed pass — longer,
 *  lower, hazard-avoiding. Derived from the primary plan, no randomness. */
export function buildAlternateRoute(plan: RoutePlan): AlternateRoute | null {
  const hazardIndex = plan.stations.findIndex((s) => s.hazard);
  if (hazardIndex === -1) return null;
  const points = plan.stations.map((s, i) => {
    const proximity = Math.max(0, 1 - Math.abs(i - hazardIndex) / 1.5);
    return { x: s.x, y: Math.round(s.y + proximity * 90) };
  });
  return {
    points,
    distanceKm: Math.round((plan.chartDistanceKm + 3.4) * 10) / 10,
    gainM: plan.peakElevationM - Math.round(plan.peakElevationM * 0.21),
    note: "Avoids the exposed pass — viable weather alternate.",
  };
}

/** Build the complete route plan for an expedition from the universe. Pure and
 *  deterministic. Returns null if the expedition/route can't be resolved. */
export function buildRoutePlan(expeditionId: string): RoutePlan | null {
  const expedition = getExpedition(expeditionId);
  const route = getRoute(expeditionId);
  const checkpoints = getCheckpoints(expeditionId);
  if (!expedition || !route || checkpoints.length === 0) return null;

  const alerts = getWeather(expeditionId);
  const seed = Math.floor(hash(expeditionId) * 1000);
  const positions = plotPositions(
    checkpoints.map((c) => c.id),
    checkpoints.map((c) => c.km),
    seed,
  );
  const { lat, lng } = expedition.coordinates;

  const stations: PlanStation[] = checkpoints.map((cp, i) => {
    const prev = checkpoints[i - 1];
    const segmentKm = prev ? Math.round((cp.km - prev.km) * 10) / 10 : 0;
    const gradientPct =
      prev && segmentKm > 0
        ? Math.round(((cp.elevationM - prev.elevationM) / (segmentKm * 1000)) * 100)
        : 0;
    const alert = alerts.find((a) => a.checkpointId === cp.id);
    return {
      id: cp.id,
      index: i,
      name: cp.name,
      km: cp.km,
      elevationM: cp.elevationM,
      eta: cp.eta,
      type: cp.type,
      status: cp.status,
      hazard: cp.hazard,
      segmentKm,
      gradientPct,
      coordsLabel: `${(lat + i * 0.012).toFixed(4)}°, ${(lng + i * 0.009).toFixed(4)}°`,
      x: positions[i].x,
      y: positions[i].y,
      alert: alert ? { title: alert.title, detail: alert.detail } : null,
    };
  });

  const sheetIndex = listExpeditions().findIndex((e) => e.id === expeditionId);

  return {
    expeditionId,
    expeditionName: expedition.name,
    sheetNo: String(sheetIndex + 1).padStart(2, "0"),
    grade: expedition.grade,
    chartDistanceKm: checkpoints[checkpoints.length - 1].km,
    peakElevationM: Math.max(...route.elevationProfile),
    totalGainM: expedition.gainM,
    dayTotal: expedition.dayTotal,
    hazardCount: stations.filter((s) => s.hazard).length,
    originLat: lat,
    originLng: lng,
    stations,
    elevationProfile: route.elevationProfile,
  };
}
