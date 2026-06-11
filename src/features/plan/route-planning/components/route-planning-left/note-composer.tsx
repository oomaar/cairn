"use client";

import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useState } from "react";

interface NoteComposerProps {
  selectedName?: string;
  onSubmit: (body: string, pin: boolean) => void;
}

export function NoteComposer({ selectedName, onSubmit }: NoteComposerProps) {
  const [body, setBody] = useState("");
  const [pin, setPin] = useState(false);
  const trimmed = body.trim();

  const submit = () => {
    if (!trimmed) return;
    onSubmit(trimmed, pin && Boolean(selectedName));
    setBody("");
    setPin(false);
  };

  return (
    <div className="mt-2 px-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a planning note…"
        rows={2}
        aria-label="Add a planning note"
        className="w-full resize-none rounded-md border border-border bg-inset px-2.5 py-2 text-sm text-fg-1 outline-none placeholder:text-fg-4 focus:border-accent"
      />
      {selectedName && (
        <button
          type="button"
          onClick={() => setPin((p) => !p)}
          aria-pressed={pin}
          className="mt-1.5 flex items-center gap-1.5 text-left"
        >
          <span
            className={cn(
              "grid size-3.5 flex-none place-items-center rounded-sm border",
              pin
                ? "border-accent bg-accent text-fg-on-accent"
                : "border-border-strong",
            )}
          >
            {pin && <Icon name="check" size={9} strokeWidth={3} />}
          </span>
          <Text
            variant="caption"
            as="span"
            className={pin ? "text-fg-2" : "text-fg-3"}
          >
            Pin to {selectedName}
          </Text>
        </button>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={!trimmed}
        className="mt-2 w-full rounded-md border border-border-strong py-1.5 text-center font-mono text-2xs uppercase tracking-[0.06em] text-fg-2 transition-colors hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add note
      </button>
    </div>
  );
}
