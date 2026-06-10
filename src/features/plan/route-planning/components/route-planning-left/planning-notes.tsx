import { Avatar, Icon, Text } from "@/components/ui";
import type { PlanStation } from "../../types/route.types";
import type { PlanningNote } from "../../types/planning-notes.types";
import { firstName } from "../../utils/planning-notes.utils";
import { NoteComposer } from "./note-composer";

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
