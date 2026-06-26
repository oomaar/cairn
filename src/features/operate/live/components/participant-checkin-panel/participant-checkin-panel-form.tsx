"use client";

import { Icon, Text } from "@/components/ui";
import { STATUS_OPTIONS } from "../../data/STATUS_OPTIONS";
import { cn } from "@/lib/cn";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import type {
  CheckinRecord,
  CheckinStatus,
} from "../../types/live-expedition.types";
import type { Checkpoint, Expedition } from "@/universe";
import { addLocalCheckin } from "../../store/checkin-store";

interface ParticipantCheckinPanelFormProps {
  personId: string;
  checkpoints: Checkpoint[];
  lastCheckin: CheckinRecord | null;
  setLastCheckin: Dispatch<SetStateAction<CheckinRecord | null>>;
  expedition: Expedition;
  confirmed: boolean;
  setConfirmed: Dispatch<SetStateAction<boolean>>;
}

export function ParticipantCheckinPanelForm({
  personId,
  checkpoints,
  lastCheckin,
  setLastCheckin,
  expedition,
  confirmed,
  setConfirmed,
}: ParticipantCheckinPanelFormProps) {
  const currentCheckpoint = checkpoints.find((c) => c.status === "current");

  const [selectedStatus, setSelectedStatus] = useState<CheckinStatus | null>(
    null,
  );
  const [note, setNote] = useState("");
  const checkinSeqRef = useRef(0);

  const canSubmit = selectedStatus !== null;

  const handleCheckin = () => {
    if (!canSubmit || !currentCheckpoint) return;
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const statusLabel =
      STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label ??
      selectedStatus ??
      "";
    const trimmedNote = note.trim();

    const record: CheckinRecord = {
      checkpointId: currentCheckpoint.id,
      checkpointName: currentCheckpoint.name,
      status: selectedStatus,
      note: trimmedNote,
      time,
    };

    // Persist to the shared store so the leader's events feed can see it.
    addLocalCheckin({
      id: `checkin-${expedition.id}-${++checkinSeqRef.current}`,
      expeditionId: expedition.id,
      day: expedition.dayCurrent,
      time,
      kind: "checkin",
      title: currentCheckpoint.name,
      detail: trimmedNote ? `${statusLabel} — ${trimmedNote}` : statusLabel,
      authorId: personId || null,
      refId: currentCheckpoint.id,
    });

    setLastCheckin(record);
    setConfirmed(true);
    setSelectedStatus(null);
    setNote("");
  };

  return (
    <>
      {(!confirmed || !lastCheckin) && (
        <>
          <div className="mb-4">
            <span className="font-mono text-2xs font-bold uppercase tracking-widest text-fg-3">
              Field Check-In
            </span>
            {currentCheckpoint ? (
              <div className="mt-1 flex items-baseline gap-2">
                <Icon name="pin" size={12} className="flex-none text-accent" />
                <Text className="text-sm font-semibold text-accent">
                  {currentCheckpoint.name}
                </Text>
              </div>
            ) : (
              <Text
                variant="caption"
                tone="tertiary"
                className="mt-1 block text-2xs"
              >
                No active checkpoint — check-in unavailable
              </Text>
            )}
          </div>

          {currentCheckpoint && (
            <>
              {/* Status selector */}
              <div className="mb-4 space-y-2">
                <span className="font-mono text-3xs uppercase tracking-widest text-fg-4">
                  Status
                </span>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded border px-3 py-2.5 text-left transition-colors",
                      selectedStatus === opt.value
                        ? opt.classes
                        : "border-border bg-inset text-fg-2 hover:border-border-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 flex-none rounded-full",
                        selectedStatus === opt.value
                          ? opt.activeDot
                          : "bg-border-strong",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-2xs font-bold tracking-wider">
                        {opt.label}
                      </div>
                      <div className="mt-0.5 text-2xs opacity-70">
                        {opt.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div className="mb-4 space-y-1.5">
                <span className="font-mono text-3xs uppercase tracking-widest text-fg-4">
                  Notes (optional)
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Conditions, observations, flags…"
                  rows={3}
                  className="w-full resize-none rounded border border-border bg-inset px-3 py-2 text-sm text-fg-1 placeholder:text-fg-4 focus:border-accent-line focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleCheckin}
                disabled={!canSubmit}
                className={cn(
                  "w-full rounded border py-2.5 font-mono text-2xs font-bold tracking-widest transition-colors",
                  canSubmit
                    ? "border-accent-line bg-accent/10 text-accent hover:bg-accent/20"
                    : "border-border text-fg-4 opacity-50",
                )}
              >
                CONFIRM CHECK-IN
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
