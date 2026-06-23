import { getInitialLiveState } from "../../utils/getInitialLiveState";
import { useLiveExpeditionUpdates } from "../../hooks/use-live-expedition-updates";
import { listExpeditions } from "@/universe";
import { LiveExpeditionDetailCheckpointTimeline } from "./live-expedition-detail-checkpoint-timeline";
import { LiveExpeditionDetailExpeditionHealth } from "./live-expedition-detail-expedition-health";
import { LiveExpeditionDetailWeatherAlerts } from "./live-expedition-detail-weather-alerts";
import { LiveExpeditionDetailWeatherForecast } from "./live-expedition-detail-weather-forecast";
import { LiveExpeditionDetailHeader } from "./live-expedition-detail-header";
import { LiveExpeditionDetailStatusBar } from "./live-expedition-detail-status-bar";
import { LiveExpeditionDetailProgressBar } from "./live-expedition-detail-progress-bar";
import { LiveExpeditionDetailLocationAndWeather } from "./live-expedition-detail-location-and-weather";
import { LiveExpeditionDetailPartyStatus } from "./live-expedition-detail-party-status";
import { LiveExpeditionDetailNextCheckpoints } from "./live-expedition-detail-next-checkpoints";
import { LiveExpeditionDetailExpeditionEvents } from "./live-expedition-detail-expedition-events";

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
        <LiveExpeditionDetailHeader expedition={expedition} onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <LiveExpeditionDetailStatusBar state={state} />
            <LiveExpeditionDetailExpeditionHealth
              status={state.expeditionStatus}
            />
            <LiveExpeditionDetailProgressBar state={state} />
            <LiveExpeditionDetailCheckpointTimeline
              checkpoints={state.checkpoints}
              currentIndex={state.currentCheckpointIndex}
            />
            <LiveExpeditionDetailWeatherAlerts
              alerts={state.weatherAlerts}
              expeditionId={expeditionId}
            />
            <LiveExpeditionDetailWeatherForecast
              forecast={state.weatherForecast}
              windThreshold={40}
            />
            <LiveExpeditionDetailLocationAndWeather state={state} />
            <LiveExpeditionDetailPartyStatus state={state} />
            <LiveExpeditionDetailNextCheckpoints state={state} />
            <LiveExpeditionDetailExpeditionEvents expeditionId={expeditionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
