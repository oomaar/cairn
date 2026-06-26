"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CommsEntry } from "../types/CommsEntry";

interface CommsComposerProps {
  expeditionCodes: string[];
  activeChannel: string;
  senderInitials: string;
  senderName: string;
  senderTone: string;
  onSend: (entry: CommsEntry) => void;
}

export function CommsComposer({
  expeditionCodes,
  activeChannel,
  senderInitials,
  senderName,
  senderTone,
  onSend,
}: CommsComposerProps) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState(
    activeChannel !== "ALL" ? activeChannel : (expeditionCodes[0] ?? "ORG"),
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend({
      id: `local-${Date.now()}`,
      expeditionId: channel === "ORG" ? null : channel.toLowerCase(),
      expeditionCode: channel,
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      kind: "message",
      text: trimmed,
      senderInitials,
      senderName,
      senderTone,
    });
    setText("");
    textareaRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex-none border-t border-border bg-surface px-5 py-3">
      <div className="flex items-end gap-3">
        {/* Channel selector */}
        <div className="flex flex-none flex-col gap-1">
          <span className="font-mono text-3xs uppercase tracking-widest text-fg-4">
            Channel
          </span>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-8 rounded border border-border bg-inset px-2 font-mono text-2xs text-fg-2 focus:border-accent-line focus:outline-none"
          >
            {expeditionCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {/* Message input */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-mono text-3xs uppercase tracking-widest text-fg-4">
            Message
          </span>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="w-full resize-none rounded border border-border bg-inset px-3 py-1.5 text-sm text-fg-1 placeholder:text-fg-4 focus:border-accent-line focus:outline-none"
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          className={cn(
            "flex h-8 flex-none items-center gap-1.5 rounded border px-3 font-mono text-2xs font-bold tracking-wider transition-colors",
            text.trim()
              ? "border-accent-line bg-accent/10 text-accent hover:bg-accent/20"
              : "border-border text-fg-4 opacity-50",
          )}
        >
          <Icon name="arrowR" size={12} />
          SEND
        </button>
      </div>
    </div>
  );
}
