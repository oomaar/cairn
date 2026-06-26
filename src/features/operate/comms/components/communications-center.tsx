"use client";

import { useEffect, useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useSession } from "@/features/session";
import { getExpeditionsForPerson } from "@/universe";
import { buildComms } from "../utils/buildComms";
import { SENDER_BG } from "../data/SENDER_BG";
import { CommsComposer } from "./comms-composer";
import { CommsBroadcast } from "./comms-broadcast";
import type { CommsEntry } from "../types/CommsEntry";

export function CommunicationsCenter() {
  const { can, currentUser } = useSession();
  const canSend = can("comms:send");
  const canBroadcast = can("comms:broadcast");

  // Participants default to their expedition's channel; others start on ALL.
  const defaultFilter = (() => {
    if (can("expeditions:view-all") || !currentUser) return "ALL";
    const myExpeditions = getExpeditionsForPerson(currentUser.id);
    return myExpeditions[0]?.id.toUpperCase() ?? "ALL";
  })();

  const [filter, setFilter] = useState<string>(defaultFilter);
  const [{ entries, expeditionCodes }, setData] = useState(buildComms);
  // Local messages sent this session — prepended to the feed.
  const [localEntries, setLocalEntries] = useState<CommsEntry[]>([]);

  useEffect(() => {
    const id = setInterval(() => setData(buildComms()), 5000);
    return () => clearInterval(id);
  }, []);

  const allEntries = [...localEntries, ...entries];
  const visible =
    filter === "ALL"
      ? allEntries
      : allEntries.filter((e) => e.expeditionCode === filter);

  const handleSend = (entry: CommsEntry) => {
    setLocalEntries((prev) => [entry, ...prev]);
    setFilter(entry.expeditionCode);
  };

  const senderInitials = currentUser?.initials ?? "?";
  const senderName = currentUser?.name ?? "Unknown";
  const senderTone = currentUser?.tone ?? "slate";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Filter bar */}
      <div className="flex-none border-b border-border px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Text
            variant="caption"
            tone="tertiary"
            className="mr-1 font-mono text-2xs uppercase tracking-widest"
          >
            Channel
          </Text>
          {["ALL", ...expeditionCodes].map((code) => (
            <button
              key={code}
              onClick={() => setFilter(code)}
              className={cn(
                "rounded border px-2.5 py-1 font-mono text-2xs font-bold tracking-wider transition-colors",
                filter === code
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-fg-3 hover:border-fg-3 hover:text-fg-2",
              )}
            >
              {code}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="size-1.5 animate-pulse rounded-full bg-accent" />
            <Text variant="caption" tone="tertiary" className="font-mono text-2xs">
              LIVE
            </Text>
          </div>
        </div>
      </div>

      {/* Message feed */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {visible.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <Text variant="caption" tone="tertiary" className="text-2xs">
              No transmissions
            </Text>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "rounded-lg border bg-surface p-4 transition-colors",
                  entry.kind === "alert"
                    ? "border-warn/40 bg-warn/5"
                    : "border-border hover:border-border-strong",
                )}
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 flex-none items-center justify-center rounded-full font-mono text-2xs font-bold",
                      SENDER_BG[entry.senderTone] ?? "bg-fg-4/20 text-fg-3",
                    )}
                  >
                    {entry.senderInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="block text-sm font-semibold leading-none">
                      {entry.senderName}
                    </Text>
                    <Text variant="caption" tone="tertiary" className="mt-0.5 font-mono text-2xs">
                      {entry.time}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded border border-border px-1.5 py-0.5 font-mono text-2xs text-fg-3">
                      {entry.expeditionCode}
                    </span>
                    {entry.kind === "alert" && (
                      <span className="flex items-center gap-1 rounded border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-2xs font-bold text-warn">
                        <Icon name="alert" size={10} className="flex-none" />
                        ALERT
                      </span>
                    )}
                  </div>
                </div>
                <Text
                  variant="caption"
                  tone="secondary"
                  className={cn(
                    "block text-sm leading-relaxed",
                    entry.senderInitials === "•" && "font-mono text-xs text-fg-3",
                  )}
                >
                  {entry.text}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message composer — lead + director */}
      {canSend && (
        <CommsComposer
          expeditionCodes={expeditionCodes}
          activeChannel={filter}
          senderInitials={senderInitials}
          senderName={senderName}
          senderTone={senderTone}
          onSend={handleSend}
        />
      )}

      {/* Org broadcast — director only */}
      {canBroadcast && (
        <CommsBroadcast
          senderInitials={senderInitials}
          senderName={senderName}
          onBroadcast={handleSend}
        />
      )}
    </div>
  );
}
