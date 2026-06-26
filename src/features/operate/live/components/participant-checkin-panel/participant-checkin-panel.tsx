"use client";

import { useState } from "react";
import { getCheckpoints } from "@/universe";
import type { Expedition } from "@/universe";
import type { CheckinRecord } from "../../types/live-expedition.types";
import { ParticipantCheckinPanelProgressHeader } from "./participant-checkin-panel-progress-header";
import { ParticipantCheckinPanelCheckpointsList } from "./participant-checkin-panel-checkpoints-list";
import { ParticipantCheckinPanelLastCheckInBanner } from "./participant-checkin-panel-last-check-in-banner";
import { ParticipantCheckinPanelForm } from "./participant-checkin-panel-form";
import { ParticipantCheckinPanelNextCheckpointInfo } from "./participant-checkin-panel-next-checkpoint-info";

interface ParticipantCheckinPanelProps {
  expedition: Expedition;
  personId: string;
}

export function ParticipantCheckinPanel({
  expedition,
  personId,
}: ParticipantCheckinPanelProps) {
  const checkpoints = getCheckpoints(expedition.id);

  const [lastCheckin, setLastCheckin] = useState<CheckinRecord | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const nextCheckpoint = checkpoints.find((c) => c.status === "ahead");

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_340px]">
      {/* ── Left: Route progress ─────────────────────────────── */}
      <div className="flex min-h-0 flex-col overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
        <ParticipantCheckinPanelProgressHeader
          checkpoints={checkpoints}
          expedition={expedition}
        />
        <ParticipantCheckinPanelCheckpointsList checkpoints={checkpoints} />
      </div>

      {/* ── Right: Check-in panel ───────────────────────────── */}
      <div className="flex min-h-0 flex-col overflow-y-auto bg-surface p-5">
        <ParticipantCheckinPanelLastCheckInBanner
          lastCheckin={lastCheckin}
          confirmed={confirmed}
          setConfirmed={setConfirmed}
        />
        <ParticipantCheckinPanelForm
          personId={personId}
          checkpoints={checkpoints}
          expedition={expedition}
          lastCheckin={lastCheckin}
          setLastCheckin={setLastCheckin}
          confirmed={confirmed}
          setConfirmed={setConfirmed}
        />
        <ParticipantCheckinPanelNextCheckpointInfo
          nextCheckpoint={nextCheckpoint}
        />
      </div>
    </div>
  );
}
