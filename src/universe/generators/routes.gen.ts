import { TDP_CHECKPOINTS, TDP_ELEVATION } from "../constants";
import type {
  Checkpoint,
  CheckpointStatus,
  CheckpointType,
  Expedition,
  Route,
} from "../types";
import type { Rng } from "../rng";

const NAME_POOL: Record<
  Exclude<CheckpointType, "trailhead" | "summit">,
  string[]
> = {
  camp: [
    "Lower Camp",
    "High Camp",
    "Glacier Camp",
    "Col Camp",
    "Tarn Camp",
    "Forest Camp",
  ],
  viewpoint: [
    "North Lookout",
    "Ridge Vista",
    "Saddle Overlook",
    "Cirque Viewpoint",
  ],
  crossing: [
    "River Ford",
    "Meltwater Crossing",
    "Boulder Ford",
    "Gorge Bridge",
  ],
  pass: ["The Saddle", "North Col", "Wind Gap", "High Pass", "Storm Col"],
};

/** Minutes-since-06:00 → "HH:MM" clock label. */
function clockLabel(minutesFromStart: number): string {
  const total = 6 * 60 + minutesFromStart;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** A smooth, peaked elevation profile scaled to the expedition's total gain. */
function generateProfile(rng: Rng, baseElev: number, gainM: number): number[] {
  const samples = 16;
  const peak = baseElev + gainM * 0.16;
  return Array.from({ length: samples }, (_, k) => {
    const t = k / (samples - 1);
    const shape = Math.sin(t * Math.PI); // rises then falls
    const wobble = rng.float(-0.06, 0.06);
    return Math.round(baseElev + (peak - baseElev) * (shape + wobble));
  });
}

function statusFor(progress: number, kmFraction: number): CheckpointStatus {
  if (kmFraction < progress - 0.08) return "done";
  if (Math.abs(kmFraction - progress) <= 0.08) return "current";
  return "ahead";
}

function buildGeneratedRoute(
  rng: Rng,
  expedition: Expedition,
): {
  route: Route;
  checkpoints: Checkpoint[];
} {
  const count = Math.min(
    7,
    Math.max(4, Math.round(expedition.distanceKm / 22)),
  );
  const baseElev = rng.int(120, 520);
  const profile = generateProfile(rng, baseElev, expedition.gainM);

  // How far through the route the party is, by status.
  const progress =
    expedition.status === "complete"
      ? 1.1
      : expedition.status === "in-field"
        ? expedition.dayCurrent / expedition.dayTotal
        : 0;

  const passIndex = Math.round((count - 1) * 0.66);
  const middleTypes: CheckpointType[] = [
    "camp",
    "viewpoint",
    "crossing",
    "pass",
  ];

  const checkpoints: Checkpoint[] = Array.from({ length: count }, (_, i) => {
    const kmFraction = i / (count - 1);
    const km = Math.round(expedition.distanceKm * kmFraction * 10) / 10;

    let type: CheckpointType;
    if (i === 0) type = "trailhead";
    else if (i === count - 1) type = "camp";
    else if (i === passIndex) type = "pass";
    else type = rng.pick(middleTypes);

    const name =
      type === "trailhead"
        ? `${expedition.region} Trailhead`
        : rng.pick(NAME_POOL[type as keyof typeof NAME_POOL]);

    const profileIdx = Math.round(kmFraction * (profile.length - 1));
    const hazard =
      type === "pass" &&
      (expedition.grade === "expert" || expedition.grade === "strenuous");

    return {
      id: `cp-${expedition.id}-${i + 1}`,
      routeId: expedition.routeId,
      name,
      km,
      elevationM: profile[profileIdx],
      eta: clockLabel(Math.round(kmFraction * 600)),
      status: statusFor(progress, kmFraction),
      type,
      hazard,
    };
  });

  return {
    route: {
      id: expedition.routeId,
      expeditionId: expedition.id,
      checkpointIds: checkpoints.map((c) => c.id),
      elevationProfile: profile,
    },
    checkpoints,
  };
}

function buildTdpRoute(expedition: Expedition): {
  route: Route;
  checkpoints: Checkpoint[];
} {
  const checkpoints: Checkpoint[] = TDP_CHECKPOINTS.map((seed, i) => ({
    id: `cp-${expedition.id}-${i + 1}`,
    routeId: expedition.routeId,
    ...seed,
  }));
  return {
    route: {
      id: expedition.routeId,
      expeditionId: expedition.id,
      checkpointIds: checkpoints.map((c) => c.id),
      elevationProfile: [...TDP_ELEVATION],
    },
    checkpoints,
  };
}

/** Build a route + checkpoints for every expedition. The headline expedition
 *  uses its authored segment; the rest are generated deterministically. */
export function generateRoutes(
  rng: Rng,
  expeditions: readonly Expedition[],
): { routes: Route[]; checkpoints: Checkpoint[] } {
  const routes: Route[] = [];
  const checkpoints: Checkpoint[] = [];

  for (const expedition of expeditions) {
    const built =
      expedition.id === "tdp"
        ? buildTdpRoute(expedition)
        : buildGeneratedRoute(rng.child(expedition.id), expedition);
    routes.push(built.route);
    checkpoints.push(...built.checkpoints);
  }

  return { routes, checkpoints };
}
