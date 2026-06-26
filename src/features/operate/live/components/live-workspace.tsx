import { useLiveExpeditionUpdates } from "../hooks/use-live-expedition-updates";
import { getInitialLiveState } from "../utils/getInitialLiveState";
import { LiveAnnunciatorPanel } from "./live-annunciator-panel";
import { LiveCommsPanel } from "./live-comms-panel";
import { LiveSituationPanel } from "./live-situation-panel";
import { LiveWindPanel } from "./live-wind-panel";
import { ParticipantTelemetry } from "./participant-telemetry";

interface LiveWorkspaceProps {
  expeditionId: string;
  expeditionName: string;
  distanceKm: number;
}

// Separate component so `key` can force a full remount (fresh hook state)
// whenever the focused expedition changes.
export function LiveWorkspace({
  expeditionId,
  expeditionName,
  distanceKm,
}: LiveWorkspaceProps) {
  const state = useLiveExpeditionUpdates(
    expeditionId,
    getInitialLiveState(expeditionId),
  );

  return (
    // 60/40 vertical split — top instruments dominant, bottom panels supporting
    <div className="grid min-h-0 flex-1 grid-rows-[3fr_2fr] overflow-hidden">
      {/* Top row: Situation schematic + Wind dial */}
      <div className="grid min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 overflow-hidden border-b border-border p-4 lg:border-b-0 lg:border-r">
          <LiveSituationPanel
            state={state}
            expeditionName={expeditionName}
            distanceKm={distanceKm}
          />
        </div>
        {/* Dial is centered and capped so it reads as an instrument, not a stretch */}
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b border-border p-4 lg:border-b-0">
          <div className="w-full max-w-75">
            <LiveWindPanel windSpeed={state.weather.windSpeed} />
          </div>
        </div>
      </div>

      {/* Bottom row: Annunciator + Comms | Participant Telemetry */}
      <div className="grid min-h-0 grid-cols-1 overflow-hidden border-t border-border lg:grid-cols-2">
        {/* Left column: annunciator fixed, comms scrolls remaining space */}
        <div className="grid min-h-0 grid-rows-[auto_1fr] overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-4">
            <LiveAnnunciatorPanel state={state} />
          </div>
          <div className="min-h-0 overflow-y-auto p-4">
            <LiveCommsPanel expeditionId={expeditionId} />
          </div>
        </div>
        {/* Right column: telemetry scrolls */}
        <div className="min-h-0 overflow-y-auto p-4">
          <ParticipantTelemetry participants={state.participants} />
        </div>
      </div>
    </div>
  );
}
