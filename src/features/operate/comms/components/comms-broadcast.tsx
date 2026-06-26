"use client";

import { useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CommsEntry } from "../types/CommsEntry";
import { TONES } from "../data/TONES";

type BroadcastTone = (typeof TONES)[number]["value"];

interface CommsBroadcastProps {
  senderInitials: string;
  senderName: string;
  onBroadcast: (entry: CommsEntry) => void;
}

export function CommsBroadcast({
  senderInitials,
  senderName,
  onBroadcast,
}: CommsBroadcastProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<BroadcastTone>("info");

  const canSend = title.trim() && body.trim();

  const send = () => {
    if (!canSend) return;
    onBroadcast({
      id: `bcast-${Date.now()}`,
      expeditionId: null,
      expeditionCode: "ORG",
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      kind: tone === "info" ? "message" : "alert",
      text: `[${title.trim()}] ${body.trim()}`,
      senderInitials,
      senderName,
      senderTone:
        tone === "danger" ? "danger" : tone === "warn" ? "warn" : "slate",
    });
    setTitle("");
    setBody("");
    setTone("info");
    setOpen(false);
  };

  return (
    <div className="flex-none border-t border-border bg-surface">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-5 py-2.5 font-mono text-2xs font-bold tracking-widest text-fg-3 transition-colors hover:text-fg-2"
      >
        <Icon name="radio" size={13} className="flex-none" />
        ORG BROADCAST
        <Icon
          name={open ? "chevD" : "chevR"}
          size={13}
          className="ml-auto flex-none"
        />
      </button>

      {/* Compose panel */}
      {open && (
        <div className="space-y-2.5 border-t border-border px-5 pb-4 pt-3">
          {/* Tone pills */}
          <div className="flex gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={cn(
                  "rounded border px-2.5 py-0.5 font-mono text-2xs font-bold tracking-wider transition-colors",
                  tone === t.value
                    ? t.value === "danger"
                      ? "border-danger/50 bg-danger/10 text-danger"
                      : t.value === "warn"
                        ? "border-warn/50 bg-warn/10 text-warn"
                        : "border-accent-line bg-accent/10 text-accent"
                    : "border-border text-fg-4 hover:border-fg-3",
                )}
              >
                {t.label}
              </button>
            ))}
            <Text
              variant="caption"
              tone="tertiary"
              className="ml-auto self-center text-3xs"
            >
              Broadcasts to all expeditions
            </Text>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subject line…"
            className="w-full rounded border border-border bg-inset px-3 py-1.5 font-mono text-2xs text-fg-1 placeholder:text-fg-4 focus:border-accent-line focus:outline-none"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Broadcast message…"
            rows={2}
            className="w-full resize-none rounded border border-border bg-inset px-3 py-1.5 text-sm text-fg-1 placeholder:text-fg-4 focus:border-accent-line focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-border px-3 py-1 font-mono text-2xs text-fg-3 transition-colors hover:text-fg-2"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className={cn(
                "rounded border px-3 py-1 font-mono text-2xs font-bold tracking-wider transition-colors",
                canSend
                  ? "border-accent-line bg-accent/10 text-accent hover:bg-accent/20"
                  : "border-border text-fg-4 opacity-50",
              )}
            >
              BROADCAST
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
