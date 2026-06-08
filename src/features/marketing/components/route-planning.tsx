import { Text } from "@/components/ui";
import { WORLD_BY_KEY } from "@/features/theme";
import {
  getCheckpoints,
  getExpedition,
  getRoute,
  getWeather,
} from "@/universe";
import { PreviewFrame } from "./preview-frame";
import {
  RoutePlanningPanel,
  type PlanCheckpoint,
  type PlanSnapshot,
} from "./route-planning-panel";

const GRADE_LABEL: Record<string, string> = {
  moderate: "Moderate",
  strenuous: "Strenuous",
  expert: "Expert",
};

const ScaleTag = () => (
  <span className="font-mono text-3xs uppercase tracking-widest text-fg-3">
    1:50 000
  </span>
);

/**
 * Route planning showcase — the headline expedition's segment as an
 * interactive elevation cross-section. Selecting a checkpoint inspects its
 * station detail; the exposed pass surfaces its linked weather hazard.
 */
export function RoutePlanning() {
  const expedition = getExpedition("tdp");
  const route = getRoute("tdp");
  const checkpoints = getCheckpoints("tdp");
  if (!expedition || !route || checkpoints.length === 0) return null;

  const alerts = getWeather("tdp");

  const planCheckpoints: PlanCheckpoint[] = checkpoints.map((cp, i) => {
    const prev = checkpoints[i - 1];
    const segmentKm = prev ? Math.round((cp.km - prev.km) * 10) / 10 : 0;
    const gradientPct =
      prev && segmentKm > 0
        ? Math.round(
            ((cp.elevationM - prev.elevationM) / (segmentKm * 1000)) * 100,
          )
        : 0;
    const alert = alerts.find((a) => a.checkpointId === cp.id);
    return {
      id: cp.id,
      name: cp.name,
      km: cp.km,
      elevationM: cp.elevationM,
      eta: cp.eta,
      type: cp.type,
      status: cp.status,
      hazard: cp.hazard,
      segmentKm,
      gradientPct,
      alert: alert ? { title: alert.title, detail: alert.detail } : null,
    };
  });

  const snapshot: PlanSnapshot = {
    expeditionName: expedition.name,
    grade: GRADE_LABEL[expedition.grade] ?? expedition.grade,
    chartDistanceKm: checkpoints[checkpoints.length - 1].km,
    peakElevationM: Math.max(...route.elevationProfile),
    elevationProfile: route.elevationProfile,
    checkpoints: planCheckpoints,
  };

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          Route planning
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          Read the terrain before you commit.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          Plot the line and every checkpoint resolves into elevation, gradient
          and timing. Select the exposed pass to see the hazard waiting there.
        </Text>

        <div className="mt-10">
          <PreviewFrame
            world={WORLD_BY_KEY.plan}
            title="Plan · Route Planning"
            status={<ScaleTag />}
          >
            <RoutePlanningPanel snapshot={snapshot} />
          </PreviewFrame>
        </div>
      </div>
    </section>
  );
}
