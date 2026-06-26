"use client";

import { useEffect, useState } from "react";
import { Icon, Text } from "@/components/ui";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { getLogbook, getComms } from "@/universe";
import { getLocalCheckins, subscribeCheckins } from "../../store/checkin-store";

interface EventEntry {
  id: string;
  time: string;
  kind: string;
  icon: IconName;
  tone: string;
  title: string;
  detail?: string;
}

const KIND_ICON: Record<string, IconName> = {
  movement: "activity",
  checkin: "check",
  incident: "alert",
  weather: "cloud",
  comms: "radio",
  note: "pen",
  alert: "bell",
  message: "radio",
};

const KIND_TONE: Record<string, string> = {
  movement: "ok",
  checkin: "slate",
  incident: "warn",
  weather: "danger",
  comms: "slate",
  note: "slate",
  alert: "warn",
  message: "slate",
};

const KIND_LABEL: Record<string, string> = {
  movement: "MOVE",
  checkin: "CHECK-IN",
  incident: "INCIDENT",
  weather: "WX",
  comms: "COMMS",
  note: "NOTE",
  alert: "ALERT",
  message: "MSG",
};

const TONE_ICON_COLOR: Record<string, string> = {
  ok: "text-accent",
  warn: "text-warn",
  danger: "text-danger",
  slate: "text-fg-3",
};

const TONE_LABEL_COLOR: Record<string, string> = {
  ok: "text-accent",
  warn: "text-warn",
  danger: "text-danger",
  slate: "text-fg-4",
};

interface LiveExpeditionDetailExpeditionEventsProps {
  expeditionId: string;
}

export function LiveExpeditionDetailExpeditionEvents({
  expeditionId,
}: LiveExpeditionDetailExpeditionEventsProps) {
  // Re-render whenever a participant submits a new check-in.
  const [, setTick] = useState(0);
  useEffect(() => subscribeCheckins(() => setTick((n) => n + 1)), []);

  const logs = [...getLogbook(expeditionId), ...getLocalCheckins(expeditionId)];
  const comms = getComms(expeditionId);

  const entries: EventEntry[] = [
    ...logs.map((log) => ({
      id: log.id,
      time: log.time,
      kind: log.kind,
      icon: KIND_ICON[log.kind] ?? "activity",
      tone: KIND_TONE[log.kind] ?? "slate",
      title: log.title,
      detail: log.detail || undefined,
    })),
    ...comms.map((msg) => ({
      id: msg.id,
      time: msg.time,
      kind: msg.kind,
      icon: KIND_ICON[msg.kind] ?? "radio",
      tone: KIND_TONE[msg.kind] ?? "slate",
      title: msg.text,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  if (entries.length === 0) return null;

  return (
    <div className="rounded-lg border border-border p-3">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-3 block font-mono tracking-widest text-2xs uppercase"
      >
        Expedition Events
      </Text>

      <div className="space-y-0">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-start gap-2.5 py-2",
              idx < entries.length - 1 && "border-b border-border-soft",
            )}
          >
            {/* Kind icon */}
            <Icon
              name={entry.icon}
              size={12}
              className={cn(
                "mt-0.5 flex-none",
                TONE_ICON_COLOR[entry.tone] ?? "text-fg-3",
              )}
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={cn(
                    "font-mono text-2xs font-bold tracking-wider",
                    TONE_LABEL_COLOR[entry.tone] ?? "text-fg-4",
                  )}
                >
                  {KIND_LABEL[entry.kind] ?? entry.kind.toUpperCase()}
                </span>
                <span className="font-mono text-2xs text-fg-3">
                  {entry.time}
                </span>
              </div>
              <Text variant="caption" className="block text-xs leading-snug">
                {entry.title}
              </Text>
              {entry.detail && (
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="mt-0.5 block text-xs leading-snug"
                >
                  {entry.detail}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
