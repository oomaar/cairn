"use client";

import { useState } from "react";
import { Avatar, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getExpedition,
  getPerson,
  listExpeditions,
  listPeople,
  type Tone,
} from "@/universe";

type AvatarTone = "amber" | "olive" | "slate" | "quiet";
const avatarTone = (tone?: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

interface GuideAssignmentProps {
  expeditionId: string;
  canManage: boolean;
}

/** Field leader (guide) assignment — read-only, or reassignable from the
 *  available guides when the role can manage the roster. */
export function GuideAssignment({
  expeditionId,
  canManage,
}: GuideAssignmentProps) {
  const expedition = getExpedition(expeditionId);
  const [leaderId, setLeaderId] = useState<string>(expedition?.leaderId ?? "");
  const [picking, setPicking] = useState(false);

  const leader = getPerson(leaderId);
  const guides = listPeople().filter((p) => p.baseRole === "field-leader");
  const leadsByGuide = new Map(listExpeditions().map((e) => [e.leaderId, e]));

  return (
    <section className="border-t border-border-soft px-5 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Text
          variant="caption"
          as="h3"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Field leader
        </Text>
        {canManage && (
          <button
            type="button"
            onClick={() => setPicking((p) => !p)}
            aria-pressed={picking}
            className="ml-auto flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-2xs font-semibold text-fg-2 transition-colors hover:border-accent-line hover:text-accent-bright"
          >
            <Icon name="users" size={12} />
            Reassign
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <Avatar
          initials={leader?.initials ?? "—"}
          size="md"
          tone={avatarTone(leader?.tone)}
        />
        <div className="min-w-0">
          <Text variant="body-sm" as="p" className="truncate">
            {leader?.name ?? "Unassigned"}
          </Text>
          <Text variant="caption" as="p" tone="tertiary">
            Expedition lead
          </Text>
        </div>
      </div>

      {canManage && picking && (
        <ul className="mt-3 flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded-md border border-border bg-inset p-1.5">
          {guides.map((guide) => {
            const selected = guide.id === leaderId;
            const leads = leadsByGuide.get(guide.id);
            const hint =
              leads && leads.id !== expeditionId
                ? `Leads ${leads.name}`
                : leads
                  ? "Leads this"
                  : "Available";
            return (
              <li key={guide.id}>
                <button
                  type="button"
                  onClick={() => {
                    setLeaderId(guide.id);
                    setPicking(false);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left transition-colors",
                    selected ? "bg-raised" : "hover:bg-raised/60",
                  )}
                >
                  <Avatar
                    initials={guide.initials}
                    size="sm"
                    tone={avatarTone(guide.tone)}
                  />
                  <span className="min-w-0 flex-1">
                    <Text
                      variant="caption"
                      as="span"
                      className="block truncate text-fg-1"
                    >
                      {guide.name}
                    </Text>
                    <Text
                      variant="caption"
                      as="span"
                      tone="tertiary"
                      className="font-mono text-3xs"
                    >
                      {hint}
                    </Text>
                  </span>
                  {selected && (
                    <Icon
                      name="check"
                      size={13}
                      className="flex-none text-accent-bright"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
