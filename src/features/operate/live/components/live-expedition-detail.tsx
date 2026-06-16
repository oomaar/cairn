import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { STATUS_COLOR } from "../data/STATUS_COLOR";
import { getInitialLiveState } from "../utils/getInitialLiveState";
import { useLiveExpeditionUpdates } from "../hooks/use-live-expedition-updates";
import { listExpeditions } from "@/universe";
import { CONDITION_EMOJI } from "../data/CONDITION_EMOJI";
import { CheckpointTimeline } from "./checkpoint-timeline";
import { ParticipantTelemetry } from "./participant-telemetry";
import { ExpeditionHealth } from "./expedition-health";
import { ExpeditionAnnunciator } from "./expedition-annunciator";
import { Anemometer } from "./anemometer";
import { WeatherAlerts } from "./weather-alerts";

interface LiveExpeditionModalProps {
  expeditionId: string;
  onClose: () => void;
}

export function LiveExpeditionDetail({
  expeditionId,
  onClose,
}: LiveExpeditionModalProps) {
  const initialState = getInitialLiveState(expeditionId);
  const state = useLiveExpeditionUpdates(expeditionId, initialState);
  const expedition = listExpeditions().find((e) => e.id === expeditionId);

  if (!expedition) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm lg:items-center"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="flex max-h-[90vh] w-full flex-col bg-surface lg:max-w-2xl lg:rounded-lg lg:w-auto lg:min-w-124">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="min-w-0 flex-1">
            <Text variant="title" className="text-lg">
              {expedition.name}
            </Text>
            <Text variant="caption" tone="tertiary" className="font-mono">
              {expedition.region}, {expedition.country}
            </Text>
          </div>
          <button
            onClick={onClose}
            className="flex-none rounded p-1 transition-colors hover:bg-raised"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Live Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {/* Status Bar */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-inset p-3">
              <div
                className={cn(
                  "grid size-3 rounded-full",
                  state.status === "in-transit"
                    ? "bg-accent animate-pulse"
                    : "bg-fg-3",
                )}
              />
              <Text variant="body-sm" className="flex-1 capitalize">
                {state.status.replace("-", " ")}
              </Text>
              <Text variant="caption" tone="tertiary" className="font-mono">
                {state.progressPct.toFixed(0)}% progress
              </Text>
            </div>

            {/* Expedition Health */}
            <ExpeditionHealth status={state.expeditionStatus} />

            {/* Annunciator */}
            <ExpeditionAnnunciator status={state.expeditionStatus} />

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <Text variant="caption" tone="tertiary">
                  Route Progress
                </Text>
                <Text variant="caption" tone="tertiary" className="font-mono">
                  {state.currentCheckpointIndex + 1} of{" "}
                  {state.checkpoints.length} checkpoints
                </Text>
              </div>
              <div className="h-2 rounded-full bg-border-strong">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${state.progressPct}%` }}
                />
              </div>
            </div>

            {/* Checkpoint Timeline */}
            <CheckpointTimeline
              checkpoints={state.checkpoints}
              currentIndex={state.currentCheckpointIndex}
            />

            {/* Anemometer */}
            <Anemometer
              windSpeed={state.weather.windSpeed}
              windThreshold={40}
            />

            {/* Weather Alerts */}
            <WeatherAlerts alerts={state.weatherAlerts} />

            {/* Participant Telemetry */}
            <ParticipantTelemetry participants={state.participants} />

            {/* Location & Weather */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <Text variant="caption" tone="tertiary" className="block">
                  Current Location
                </Text>
                <Text className="mt-1 font-mono text-sm">
                  {state.currentLocation.elevation} m
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="mt-1 font-mono text-2xs"
                >
                  {state.currentLocation.lat.toFixed(2)}°,{" "}
                  {state.currentLocation.lng.toFixed(2)}°
                </Text>
              </div>

              <div className="rounded-lg border border-border p-3">
                <Text variant="caption" tone="tertiary" className="block">
                  Weather
                </Text>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg">
                    {CONDITION_EMOJI[state.weather.condition]}
                  </span>
                  <div>
                    <Text className="font-mono text-sm">
                      {state.weather.temperature.toFixed(1)}°C
                    </Text>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="font-mono text-2xs"
                    >
                      {state.weather.windSpeed.toFixed(0)} km/h wind
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Party Status */}
            <div className="rounded-lg border border-border p-3">
              <Text variant="caption" tone="tertiary" className="mb-2">
                Party Status
              </Text>
              <div className="space-y-2">
                {Object.entries(state.partyStatus).map(([status, pct]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="h-1.5 rounded-full bg-border-strong">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            STATUS_COLOR[status],
                          )}
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                    </div>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="w-12 text-right font-mono text-2xs"
                    >
                      {(pct * 100).toFixed(0)}%
                    </Text>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="w-12 capitalize"
                    >
                      {status}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Checkpoint */}
            <div className="rounded-lg border border-accent-line bg-accent/5 p-3">
              <Text variant="caption" tone="tertiary" className="block">
                Next Checkpoint
              </Text>
              <Text className="mt-1 font-semibold">
                {state.nextCheckpoint.name}
              </Text>
              <div className="mt-2 flex gap-4 font-mono text-sm">
                <span>ETA: {state.nextCheckpoint.eta}</span>
                <span>{state.nextCheckpoint.distanceKm} km</span>
              </div>
            </div>

            {/* Incidents */}
            {state.incidents.length > 0 && (
              <div className="space-y-2">
                <Text variant="caption" tone="tertiary">
                  Recent Updates
                </Text>
                <div className="space-y-1">
                  {state.incidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className={cn(
                        "rounded px-2.5 py-1.5 border",
                        incident.severity === "critical"
                          ? "border-danger bg-danger/5"
                          : incident.severity === "warning"
                            ? "border-warn bg-warn/5"
                            : "border-border-soft bg-surface",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon
                          name={
                            incident.severity === "critical"
                              ? "alert"
                              : "activity"
                          }
                          size={12}
                          className={cn(
                            "mt-0.5 flex-none",
                            incident.severity === "critical" && "text-danger",
                            incident.severity === "warning" && "text-warn",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <Text
                            variant="caption"
                            className="block font-semibold"
                          >
                            {incident.title}
                          </Text>
                          <Text
                            variant="caption"
                            tone="tertiary"
                            className="block text-2xs"
                          >
                            {incident.description}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
