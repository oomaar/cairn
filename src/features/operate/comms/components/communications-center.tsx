"use client";

import { useEffect, useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { buildComms } from "../utils/buildComms";
import { SENDER_BG } from "../data/SENDER_BG";

export function CommunicationsCenter() {
  const [filter, setFilter] = useState<string>("ALL");
  const [{ entries, expeditionCodes }, setData] = useState(buildComms);

  useEffect(() => {
    const id = setInterval(() => setData(buildComms()), 5000);
    return () => clearInterval(id);
  }, []);

  const visible =
    filter === "ALL"
      ? entries
      : entries.filter((e) => e.expeditionCode === filter);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Filter bar */}
      <div className="flex-none border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Text
            variant="caption"
            tone="tertiary"
            className="font-mono text-2xs uppercase tracking-widest mr-1"
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
                {/* Header row */}
                <div className="mb-2.5 flex items-center gap-2.5">
                  {/* Sender badge */}
                  <div
                    className={cn(
                      "flex size-7 flex-none items-center justify-center rounded-full font-mono text-2xs font-bold",
                      SENDER_BG[entry.senderTone] ?? "bg-fg-4/20 text-fg-3",
                    )}
                  >
                    {entry.senderInitials}
                  </div>

                  {/* Sender name + time */}
                  <div className="min-w-0 flex-1">
                    <Text className="block text-sm font-semibold leading-none">
                      {entry.senderName}
                    </Text>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="mt-0.5 font-mono text-2xs"
                    >
                      {entry.time}
                    </Text>
                  </div>

                  {/* Expedition + kind badges */}
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

                {/* Message text */}
                <Text
                  variant="caption"
                  tone="secondary"
                  className={cn(
                    "block text-sm leading-relaxed",
                    entry.senderInitials === "•" &&
                      "font-mono text-xs text-fg-3",
                  )}
                >
                  {entry.text}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
