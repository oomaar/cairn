"use client";

import { useState } from "react";
import { Icon, Text, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCan } from "@/features/session";
import {
  getExpedition,
  getGearManifest,
  getRoster,
  listRisks,
  type ExpeditionRole,
  type GearItem,
  type GearManifestEntry,
  type Person,
  type RosterEntry,
} from "@/universe";
import { CrewManager } from "./crew-manager";
import { EquipmentManager } from "./equipment-manager";
import { GuideAssignment } from "./guide-assignment";
import { capitalize } from "@/utils/capitalize";
import { TONE_DOT } from "../../data/TONE_DOT";
import { Stat } from "../stat";
import { Section } from "../section";
import { Risks } from "./risks";
import { Weather } from "./weather";
import { Incidents } from "./incidents";

interface ExpeditionDetailProps {
  expeditionId: string;
  onClose: () => void;
  onOpenRoute: (id: string) => void;
}

/** Expedition dossier — the full relational picture of one expedition. */
export function ExpeditionDetail({
  expeditionId,
  onClose,
  onOpenRoute,
}: ExpeditionDetailProps) {
  const canManage = useCan("roster:manage");
  const canManageEquipment = useCan("equipment:manage");
  const [leaderId, setLeaderId] = useState(
    () => getExpedition(expeditionId)?.leaderId ?? "",
  );
  const [roster, setRoster] = useState<RosterEntry[]>(() =>
    getRoster(expeditionId),
  );
  const [manifest, setManifest] = useState<GearManifestEntry[]>(() =>
    getGearManifest(expeditionId),
  );
  const expedition = getExpedition(expeditionId);
  if (!expedition) return null;

  const risks = listRisks({ expeditionId });

  const addCrew = (person: Person) =>
    setRoster((prev) => [
      ...prev,
      {
        assignment: {
          id: `asg-${expeditionId}-${person.id}`,
          expeditionId,
          personId: person.id,
          role: "participant",
        },
        person,
      },
    ]);
  const removeCrew = (personId: string) =>
    setRoster((prev) => prev.filter((r) => r.person.id !== personId));
  const setCrewRole = (personId: string, role: ExpeditionRole) =>
    setRoster((prev) =>
      prev.map((r) =>
        r.person.id === personId
          ? { ...r, assignment: { ...r.assignment, role } }
          : r,
      ),
    );
  const addGear = (item: GearItem) =>
    setManifest((prev) => [
      ...prev,
      {
        allocation: {
          id: `alloc-${item.id}-${expeditionId}`,
          gearItemId: item.id,
          expeditionId,
          quantity: 1,
        },
        item,
      },
    ]);
  const removeGear = (itemId: string) =>
    setManifest((prev) => prev.filter((m) => m.item.id !== itemId));
  const setGearQty = (itemId: string, qty: number) =>
    setManifest((prev) =>
      prev.map((m) =>
        m.item.id === itemId
          ? {
              ...m,
              allocation: {
                ...m.allocation,
                quantity: Math.max(1, Math.min(qty, m.item.total)),
              },
            }
          : m,
      ),
    );

  // Live readiness — recomputes as the draft (guide / crew / equipment) changes.
  const crewRatio =
    expedition.capacity > 0
      ? Math.min(1, roster.length / expedition.capacity)
      : 0;
  const highRisk = risks.some((r) => r.level === "high");
  const factors = [
    { label: "Field leader assigned", value: leaderId ? 1 : 0 },
    {
      label: `Crew filled · ${roster.length}/${expedition.capacity}`,
      value: crewRatio,
    },
    {
      label: `Equipment · ${manifest.length} items`,
      value: manifest.length >= 4 ? 1 : manifest.length / 4,
    },
    {
      label: highRisk ? "High risk unresolved" : "Risks under control",
      value: highRisk ? 0.4 : 1,
    },
  ];
  const readiness = Math.round(
    (factors.reduce((s, f) => s + f.value, 0) / factors.length) * 100,
  );

  const progress =
    expedition.status === "in-field"
      ? `Day ${expedition.dayCurrent} of ${expedition.dayTotal}`
      : expedition.status === "complete"
        ? "Completed"
        : `Departs ${expedition.departLabel}`;

  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <aside className="relative flex w-105 max-w-[92vw] flex-col border-l border-border bg-surface shadow-lg">
        {/* Header */}
        <header className="flex flex-none items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2 flex-none rounded-full",
                  TONE_DOT[expedition.statusTone],
                )}
              />
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="font-mono uppercase tracking-[0.08em]"
              >
                {expedition.statusLabel}
              </Text>
            </div>
            <Text as="h2" variant="h3" className="mt-1.5 text-xl">
              {expedition.name}
            </Text>
            <Text variant="caption" as="p" tone="secondary">
              {expedition.region}, {expedition.country} ·{" "}
              {expedition.coordsLabel}
            </Text>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            className="grid size-7 flex-none place-items-center rounded-md text-fg-3 transition-colors hover:bg-raised hover:text-fg-1"
          >
            <Icon name="x" size={15} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-5 py-4">
            <Stat label="Distance" value={`${expedition.distanceKm} km`} />
            <Stat
              label="Ascent"
              value={`▲${expedition.gainM.toLocaleString()} m`}
            />
            <Stat label="Duration" value={`${expedition.dayTotal} days`} />
            <Stat label="Grade" value={capitalize(expedition.grade)} />
            <Stat label="Readiness" value={`${readiness}%`} />
            <Stat label="Progress" value={progress} />
          </div>

          {/* Readiness — live, derived from the draft */}
          <Section title="Readiness">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-[1px]",
                      i < Math.round(readiness / 10)
                        ? "bg-accent"
                        : "bg-border-strong",
                    )}
                  />
                ))}
              </div>
              <Text
                variant="body-sm"
                as="span"
                className="font-mono font-semibold tabular-nums"
              >
                {readiness}%
              </Text>
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {factors.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 flex-none rounded-full",
                      f.value >= 1
                        ? "bg-ok"
                        : f.value > 0
                          ? "bg-warn"
                          : "bg-danger",
                    )}
                  />
                  <Text variant="caption" as="span" tone="secondary">
                    {f.label}
                  </Text>
                </li>
              ))}
            </ul>
          </Section>
          <GuideAssignment
            expeditionId={expeditionId}
            leaderId={leaderId}
            canManage={canManage}
            onReassign={setLeaderId}
          />
          <CrewManager
            roster={roster}
            capacity={expedition.capacity}
            canManage={canManage}
            onAdd={addCrew}
            onRemove={removeCrew}
            onSetRole={setCrewRole}
          />
          <EquipmentManager
            manifest={manifest}
            canManage={canManageEquipment}
            onAdd={addGear}
            onRemove={removeGear}
            onSetQty={setGearQty}
          />
          <Risks risks={risks} />
          <Weather expeditionId={expeditionId} />
          <Incidents expeditionId={expeditionId} />
        </div>

        {/* Footer action */}
        <div className="flex-none border-t border-border p-4">
          <button
            type="button"
            onClick={() => onOpenRoute(expedition.id)}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "w-full gap-2",
            )}
          >
            Open in Route Planning
            <Icon name="arrowR" size={15} />
          </button>
        </div>
      </aside>
    </div>
  );
}
