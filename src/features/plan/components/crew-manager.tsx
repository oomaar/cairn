"use client";

import { useState } from "react";
import { Avatar, Icon, Text } from "@/components/ui";
import {
  getExpeditionsForPerson,
  listPeople,
  type ExpeditionRole,
  type Person,
  type RosterEntry,
  type Tone,
} from "@/universe";

const ROLES: { key: ExpeditionRole; label: string }[] = [
  { key: "field-leader", label: "Lead" },
  { key: "assistant-lead", label: "Assist" },
  { key: "participant", label: "Member" },
];
const ROLE_LABEL: Record<ExpeditionRole, string> = {
  "field-leader": "Lead",
  "assistant-lead": "Assist",
  participant: "Member",
};
type AvatarTone = "amber" | "olive" | "slate" | "quiet";
const avatarTone = (tone?: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

interface CrewManagerProps {
  roster: RosterEntry[];
  capacity: number;
  canManage: boolean;
  onAdd: (person: Person) => void;
  onRemove: (personId: string) => void;
  onSetRole: (personId: string, role: ExpeditionRole) => void;
}

/** Crew roster — read-only, or an assignment manager when the role can manage
 *  the roster: change roles, remove crew, and assign available people. */
export function CrewManager({
  roster,
  capacity,
  canManage,
  onAdd,
  onRemove,
  onSetRole,
}: CrewManagerProps) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

  const assignedIds = new Set(roster.map((r) => r.person.id));
  const q = query.trim().toLowerCase();
  const available = listPeople().filter(
    (p) =>
      p.baseRole === "participant" &&
      !assignedIds.has(p.id) &&
      getExpeditionsForPerson(p.id).length === 0 &&
      (!q || p.name.toLowerCase().includes(q)),
  );
  const atCapacity = roster.length >= capacity;

  return (
    <section className="border-t border-border-soft px-5 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Text
          variant="caption"
          as="h3"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Crew
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {roster.length}/{capacity}
        </Text>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            aria-pressed={adding}
            className="ml-auto flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-2xs font-semibold text-fg-2 transition-colors hover:border-accent-line hover:text-accent-bright"
          >
            <Icon name="plus" size={12} />
            Assign
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {roster.map(({ assignment, person }) => (
          <li key={assignment.id} className="flex items-center gap-2.5">
            <Avatar
              initials={person.initials}
              size="sm"
              tone={avatarTone(person.tone)}
            />
            <Text
              variant="caption"
              as="span"
              className="min-w-0 flex-1 truncate text-fg-1"
            >
              {person.name}
            </Text>
            {canManage ? (
              <>
                <select
                  value={assignment.role}
                  onChange={(e) =>
                    onSetRole(person.id, e.target.value as ExpeditionRole)
                  }
                  aria-label={`Role for ${person.name}`}
                  className="rounded border border-border bg-inset px-1.5 py-0.5 font-mono text-2xs text-fg-1 outline-none focus-visible:border-accent-line"
                >
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onRemove(person.id)}
                  aria-label={`Remove ${person.name}`}
                  className="grid size-5 flex-none place-items-center rounded text-fg-4 transition-colors hover:text-danger-bright"
                >
                  <Icon name="x" size={12} />
                </button>
              </>
            ) : (
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="font-mono uppercase"
              >
                {ROLE_LABEL[assignment.role]}
              </Text>
            )}
          </li>
        ))}
      </ul>

      {canManage && adding && (
        <div className="mt-3 rounded-md border border-border bg-inset p-2.5">
          {atCapacity ? (
            <Text variant="caption" as="p" tone="tertiary">
              At capacity ({capacity}). Remove someone to assign more.
            </Text>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-border-soft pb-2">
                <Icon name="search" size={13} className="text-fg-3" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Assign available crew…"
                  aria-label="Search available crew"
                  className="h-6 flex-1 bg-transparent text-sm text-fg-1 outline-none placeholder:text-fg-4"
                />
              </div>
              <ul className="mt-2 flex max-h-40 flex-col gap-0.5 overflow-y-auto">
                {available.length === 0 ? (
                  <li className="px-1 py-1">
                    <Text variant="caption" as="span" tone="tertiary">
                      No available crew{q ? " match" : " on the bench"}.
                    </Text>
                  </li>
                ) : (
                  available.slice(0, 12).map((person) => (
                    <li key={person.id}>
                      <button
                        type="button"
                        onClick={() => onAdd(person)}
                        className="flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left transition-colors hover:bg-raised"
                      >
                        <Avatar
                          initials={person.initials}
                          size="sm"
                          tone={avatarTone(person.tone)}
                        />
                        <Text
                          variant="caption"
                          as="span"
                          className="flex-1 truncate text-fg-2"
                        >
                          {person.name}
                        </Text>
                        <Icon
                          name="plus"
                          size={13}
                          className="flex-none text-fg-4"
                        />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
