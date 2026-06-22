"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listExpeditions, getComms, getLogbook } from "@/universe";

interface FeedEntry {
  id: string;
  time: string;
  tone: string;
  text: string;
  expeditionCode: string;
}

const LOG_KIND_TONE: Record<string, string> = {
  weather: "danger",
  incident: "warn",
  movement: "ok",
  checkin: "slate",
  comms: "slate",
  note: "slate",
};

const TONE_DOT: Record<string, string> = {
  danger: "bg-danger",
  warn: "bg-warn",
  ok: "bg-accent",
  slate: "bg-fg-3",
};

const TONE_TEXT: Record<string, string> = {
  danger: "text-danger",
  warn: "text-warn",
  ok: "text-accent",
  slate: "text-fg-2",
};

function buildFeed(): FeedEntry[] {
  const expeditions = listExpeditions().filter((e) => e.status === "in-field");
  const entries: FeedEntry[] = [];

  for (const exp of expeditions) {
    const code = exp.id.toUpperCase();

    for (const msg of getComms(exp.id)) {
      entries.push({
        id: msg.id,
        time: msg.time,
        tone: msg.kind === "alert" ? "warn" : "slate",
        text: msg.text,
        expeditionCode: code,
      });
    }

    for (const log of getLogbook(exp.id)) {
      entries.push({
        id: log.id,
        time: log.time,
        tone: LOG_KIND_TONE[log.kind] ?? "slate",
        text: log.title,
        expeditionCode: code,
      });
    }
  }

  return entries.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 24);
}

export function CommandOperationsFeed() {
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeed(buildFeed());
    const id = setInterval(() => {
      setFeed(buildFeed());
      setTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <Text
          variant="caption"
          tone="tertiary"
          className="block font-mono tracking-widest text-2xs uppercase"
        >
          Operations Feed
        </Text>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-accent animate-pulse" />
          <Text
            variant="caption"
            tone="tertiary"
            className="font-mono text-2xs"
          >
            LIVE
          </Text>
        </div>
      </div>

      {feed.length === 0 ? (
        <Text
          variant="caption"
          tone="tertiary"
          className="block py-3 text-center text-2xs"
        >
          No active transmissions
        </Text>
      ) : (
        <div className="space-y-0">
          {feed.map((entry, idx) => (
            <div
              key={`${entry.id}-${tick}`}
              className={cn(
                "flex items-start gap-2.5 py-2",
                idx < feed.length - 1 && "border-b border-border-soft",
              )}
            >
              {/* Time */}
              <span className="w-10 flex-none font-mono text-2xs text-fg-3 pt-0.5">
                {entry.time}
              </span>

              {/* Tone dot */}
              <div
                className={cn(
                  "mt-1.5 size-1.5 flex-none rounded-full",
                  TONE_DOT[entry.tone] ?? "bg-fg-3",
                )}
              />

              {/* Message */}
              <Text
                className={cn(
                  "min-w-0 flex-1 font-mono text-xs leading-snug",
                  TONE_TEXT[entry.tone] ?? "text-fg-2",
                )}
              >
                {entry.text}
              </Text>

              {/* Expedition code */}
              <span className="flex-none font-mono text-2xs text-fg-4 pt-0.5">
                {entry.expeditionCode}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
