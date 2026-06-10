"use client";

import { useState } from "react";
import { Avatar, Icon, Text, Dropdown } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useNavigation } from "@/features/navigation";
import { useCan } from "@/features/session";
import { listGear, listPeople, type Grade } from "@/universe";
import { useExpeditionDrafts } from "../../expeditions/utils/expedition-drafts";
import type { BuilderState } from "../types/BuilderState";
import { EMPTY } from "../data/EMPTY";
import { GRADES } from "../data/GRADES";
import { avatarTone } from "../utils/avatarTone";
import { StepRail } from "./step-rail";
import { StepPanel } from "./step-panel";
import { FooterNav } from "./footer-nav";

const fieldLabel = "font-mono text-3xs uppercase tracking-[0.08em] text-fg-3";
const fieldInput =
  "mt-1 w-full rounded-md border border-border bg-inset px-2.5 py-2 text-sm text-fg-1 outline-none focus-visible:border-accent-line placeholder:text-fg-4";

export function PlanBuilder() {
  const nav = useNavigation();
  const canCreate = useCan("expeditions:create");
  const { addDraft } = useExpeditionDrafts();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BuilderState>(EMPTY);
  const [safety, setSafety] = useState(false);

  const patch = (p: Partial<BuilderState>) =>
    setDraft((prev) => ({ ...prev, ...p }));
  const toggleGear = (id: string) =>
    setDraft((prev) => ({
      ...prev,
      gear: prev.gear.includes(id)
        ? prev.gear.filter((g) => g !== id)
        : [...prev.gear, id],
    }));

  const done = [
    Boolean(draft.name && draft.region && draft.country),
    draft.distanceKm > 0 && draft.gainM > 0 && draft.dayTotal > 0,
    Boolean(draft.leaderId),
    draft.gear.length > 0,
    safety,
  ];
  const steps = [
    "Destination",
    "Route & profile",
    "Field leader",
    "Equipment",
    "Safety review",
  ];
  const completed = done.filter(Boolean).length;
  const canFile = done.slice(0, 4).every(Boolean) && safety;

  if (!canCreate) {
    return (
      <div className="grid flex-1 place-items-center bg-app px-6 text-center">
        <div className="max-w-sm">
          <Icon name="shield" size={28} className="mx-auto text-fg-3" />
          <Text as="p" variant="title" className="mt-3 text-lg">
            Director access required
          </Text>
          <Text variant="body-sm" tone="tertiary" className="mt-1.5">
            Filing a new expedition needs the Expedition Director role. Switch
            role from the spine to continue.
          </Text>
        </div>
      </div>
    );
  }

  const file = () => {
    addDraft({
      name: draft.name,
      region: draft.region,
      country: draft.country,
      grade: draft.grade,
      distanceKm: draft.distanceKm,
      gainM: draft.gainM,
      dayTotal: draft.dayTotal,
      leaderId: draft.leaderId || null,
      gearCount: draft.gear.length,
    });
    nav.goTo("plan", "expeditions");
  };

  const guides = listPeople().filter((p) => p.baseRole === "field-leader");
  const catalog = listGear();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-app lg:flex-row">
      <StepRail
        steps={steps}
        done={done}
        step={step}
        setStep={setStep}
        completed={completed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <StepPanel step={step} steps={steps} />
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-xl">
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <label className="block">
                  <span className={fieldLabel}>Expedition name</span>
                  <input
                    value={draft.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder="e.g. Torres del Paine Circuit"
                    className={fieldInput}
                  />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Region</span>
                    <input
                      value={draft.region}
                      onChange={(e) => patch({ region: e.target.value })}
                      placeholder="Patagonia"
                      className={fieldInput}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Country</span>
                    <input
                      value={draft.country}
                      onChange={(e) => patch({ country: e.target.value })}
                      placeholder="Chile"
                      className={fieldInput}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={fieldLabel}>Grade</span>
                  <Dropdown
                    value={draft.grade}
                    options={GRADES.map((g) => ({
                      value: g,
                      label: g.charAt(0).toUpperCase() + g.slice(1),
                    }))}
                    onChange={(value) => patch({ grade: value as Grade })}
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className={fieldLabel}>Distance (km)</span>
                  <input
                    type="number"
                    value={draft.distanceKm || ""}
                    onChange={(e) =>
                      patch({ distanceKm: Number(e.target.value) || 0 })
                    }
                    className={`${fieldInput} font-mono`}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Ascent (m)</span>
                  <input
                    type="number"
                    value={draft.gainM || ""}
                    onChange={(e) =>
                      patch({ gainM: Number(e.target.value) || 0 })
                    }
                    className={`${fieldInput} font-mono`}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Days</span>
                  <input
                    type="number"
                    value={draft.dayTotal || ""}
                    onChange={(e) =>
                      patch({ dayTotal: Number(e.target.value) || 0 })
                    }
                    className={`${fieldInput} font-mono`}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <ul className="flex flex-col gap-1">
                {guides.map((g) => {
                  const selected = g.id === draft.leaderId;
                  return (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => patch({ leaderId: g.id })}
                        aria-pressed={selected}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                          selected
                            ? "border-accent bg-raised"
                            : "border-border hover:bg-raised/60",
                        )}
                      >
                        <Avatar
                          initials={g.initials}
                          size="sm"
                          tone={avatarTone(g.tone)}
                        />
                        <Text
                          variant="body-sm"
                          as="span"
                          className="flex-1 truncate"
                        >
                          {g.name}
                        </Text>
                        {selected && (
                          <Icon
                            name="check"
                            size={14}
                            className="text-accent-bright"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {step === 3 && (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {catalog.map((item) => {
                  const selected = draft.gear.includes(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => toggleGear(item.id)}
                        aria-pressed={selected}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                          selected
                            ? "border-accent bg-raised"
                            : "border-border hover:bg-raised/60",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-4 flex-none place-items-center rounded-sm border",
                            selected
                              ? "border-accent bg-accent text-fg-on-accent"
                              : "border-border-strong",
                          )}
                        >
                          {selected && (
                            <Icon name="check" size={10} strokeWidth={3} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <Text
                            variant="caption"
                            as="span"
                            className="block truncate text-fg-1"
                          >
                            {item.name}
                          </Text>
                          <Text
                            variant="caption"
                            as="span"
                            tone="tertiary"
                            className="font-mono text-3xs uppercase"
                          >
                            {item.category}
                          </Text>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <Text as="p" variant="title" className="text-lg">
                    {draft.name || "Untitled expedition"}
                  </Text>
                  <Text variant="caption" as="p" tone="tertiary">
                    {draft.region || "—"}, {draft.country || "—"}
                  </Text>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border-soft pt-3 font-mono text-2xs text-fg-3">
                    <span>{draft.distanceKm} km</span>
                    <span>▲{draft.gainM.toLocaleString()} m</span>
                    <span>{draft.dayTotal} days</span>
                    <span className="capitalize text-accent-bright">
                      {draft.grade}
                    </span>
                    <span>{draft.gear.length} kit items</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSafety((s) => !s)}
                  aria-pressed={safety}
                  className="flex items-center gap-2.5 text-left"
                >
                  <span
                    className={cn(
                      "grid size-4 flex-none place-items-center rounded-sm border",
                      safety
                        ? "border-accent bg-accent text-fg-on-accent"
                        : "border-border-strong",
                    )}
                  >
                    {safety && <Icon name="check" size={10} strokeWidth={3} />}
                  </span>
                  <Text
                    variant="body-sm"
                    as="span"
                    className={safety ? "text-fg-1" : "text-fg-2"}
                  >
                    Safety brief reviewed — route, weather window and risks
                    acknowledged.
                  </Text>
                </button>
              </div>
            )}
          </div>
        </div>
        <FooterNav
          step={step}
          setStep={setStep}
          steps={steps}
          file={file}
          canFile={canFile}
        />
      </div>
    </div>
  );
}
