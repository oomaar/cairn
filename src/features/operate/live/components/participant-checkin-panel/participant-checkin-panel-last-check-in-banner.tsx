import { Icon, Text } from "@/components/ui";
import type { CheckinRecord } from "../../types/live-expedition.types";
import type { Dispatch, SetStateAction } from "react";

interface ParticipantCheckinPanelLastCheckInBannerProps {
  lastCheckin: CheckinRecord | null;
  confirmed: boolean;
  setConfirmed: Dispatch<SetStateAction<boolean>>;
}

export function ParticipantCheckinPanelLastCheckInBanner({
  lastCheckin,
  confirmed,
  setConfirmed,
}: ParticipantCheckinPanelLastCheckInBannerProps) {
  return (
    <>
      {lastCheckin && confirmed && (
        <div className="mb-4 rounded-lg border border-ok/30 bg-ok/5 p-3">
          <div className="mb-0.5 flex items-center gap-2">
            <Icon name="check" size={13} className="flex-none text-ok" />
            <span className="font-mono text-2xs font-bold tracking-wider text-ok">
              CHECK-IN RECORDED
            </span>
            <span className="ml-auto font-mono text-2xs text-fg-4">
              {lastCheckin.time}
            </span>
          </div>
          <Text
            variant="caption"
            tone="tertiary"
            className="mt-1 block text-2xs"
          >
            {lastCheckin.checkpointName} ·{" "}
            <span className="font-semibold uppercase">
              {lastCheckin.status.replace("-", " ")}
            </span>
          </Text>
          {lastCheckin.note && (
            <Text
              variant="caption"
              tone="tertiary"
              className="mt-0.5 block text-2xs italic"
            >
              {`"${lastCheckin.note}"`}
            </Text>
          )}
          <button
            onClick={() => setConfirmed(false)}
            className="mt-2 font-mono text-3xs text-fg-4 underline underline-offset-2 hover:text-fg-3"
          >
            Submit update
          </button>
        </div>
      )}
    </>
  );
}
