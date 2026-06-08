import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLD_BY_KEY } from "@/features/theme";
import { getCheckpoints, getExpedition, getRoute } from "@/universe";
import type { CheckpointStatus } from "@/universe";
import { ElevationProfile } from "./elevation-profile";
import { PreviewFrame } from "./preview-frame";

const STATUS_DOT: Record<CheckpointStatus, string> = {
  done: "bg-fg-4",
  current: "bg-accent",
  ahead: "border border-border-strong",
};

/** Plan preview — the headline expedition's route as elevation + checkpoints. */
export function PlanPreview() {
  const expedition = getExpedition("tdp");
  const route = getRoute("tdp");
  const checkpoints = getCheckpoints("tdp");
  if (!expedition || !route) return null;

  return (
    <PreviewFrame world={WORLD_BY_KEY.plan} title="Plan · Route Planning">
      <div className="flex items-baseline justify-between">
        <Text variant="body-sm" as="p" className="font-medium">
          {expedition.name}
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {expedition.distanceKm} km · ▲{expedition.gainM} m
        </Text>
      </div>

      <div className="mt-3 rounded-md border border-border-soft bg-inset p-2">
        <ElevationProfile points={route.elevationProfile} />
      </div>

      <ul className="mt-3 flex flex-col gap-px">
        {checkpoints.map((cp) => (
          <li key={cp.id} className="flex items-center gap-2.5 py-1">
            <span
              className={cn(
                "size-2 flex-none rounded-full",
                STATUS_DOT[cp.status],
              )}
            />
            <Text
              variant="caption"
              as="span"
              className="flex-1 truncate text-fg-2"
            >
              {cp.name}
            </Text>
            <Text
              variant="caption"
              as="span"
              tone="tertiary"
              className="font-mono"
            >
              {cp.km} km
            </Text>
            {cp.hazard && (
              <Text
                variant="caption"
                as="span"
                className="font-mono text-danger-bright"
              >
                ⚠
              </Text>
            )}
          </li>
        ))}
      </ul>
    </PreviewFrame>
  );
}
