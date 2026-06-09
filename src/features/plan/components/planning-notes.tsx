"use client";

import { useState } from "react";
import { Avatar, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlanStation } from "../route.types";
import type { PlanningNote } from "../planning-notes.types";
import { firstName } from "../planning-notes.utils";

interface PlanningNotesProps {
  notes: PlanningNote[];
  stations: PlanStation[];
  selectedId: string;
  onSelectCheckpoint: (id: string) => void;
  /** Provided only when the planner may file notes. */
  onAdd?: (body: string, checkpointId: string | null) => void;
}

/** Left-rail planning log — the route's running notebook. Notes can pin to a
 *  checkpoint (click the chip to jump to it) or stand sheet-wide. */
export function PlanningNotes({
  notes,
  stations,
  selectedId,
  onSelectCheckpoint,
  onAdd,
}: PlanningNotesProps) {
  const nameById = (id: string) => stations.find((s) => s.id === id)?.name;
  const ordered = [...notes].sort((a, b) => b.order - a.order);

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-between px-4">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Planning notes
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {notes.length}
        </Text>
      </div>

      {onAdd && (
        <NoteComposer
          selectedName={nameById(selectedId)}
          onSubmit={(body, pin) => onAdd(body, pin ? selectedId : null)}
        />
      )}

      <ul className="mt-1 flex flex-col">
        {ordered.map((note) => (
          <li
            key={note.id}
            className="border-t border-border-soft px-4 py-3 first:border-t-0"
          >
            <div className="flex items-center gap-2">
              <Avatar
                initials={note.authorInitials}
                size="sm"
                tone={note.authorTone}
              />
              <Text
                variant="caption"
                as="span"
                tone="secondary"
                className="truncate"
              >
                {firstName(note.authorName)}
              </Text>
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="ml-auto whitespace-nowrap font-mono text-3xs"
              >
                {note.timeLabel}
              </Text>
            </div>
            <Text
              variant="caption"
              as="p"
              tone="secondary"
              className="mt-1.5 leading-snug"
            >
              {note.body}
            </Text>
            {note.checkpointId && nameById(note.checkpointId) && (
              <button
                type="button"
                onClick={() => onSelectCheckpoint(note.checkpointId!)}
                className="mt-2 inline-flex max-w-full items-center gap-1 rounded-pill border border-(--plan-sage) px-2 py-0.5 text-(--plan-sage) transition-colors hover:bg-olive-tint"
              >
                <Icon name="pin" size={10} className="flex-none" />
                <span className="truncate font-mono text-3xs uppercase tracking-[0.04em]">
                  {nameById(note.checkpointId)}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoteComposer({
  selectedName,
  onSubmit,
}: {
  selectedName?: string;
  onSubmit: (body: string, pin: boolean) => void;
}) {
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
