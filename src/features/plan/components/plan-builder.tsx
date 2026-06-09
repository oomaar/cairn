"use client";

import { useState } from "react";
import { Avatar, Icon, Text, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useNavigation } from "@/features/navigation";
import { useCan } from "@/features/session";
import { listGear, listPeople, type Grade, type Tone } from "@/universe";
import { useExpeditionDrafts } from "../expedition-drafts";

type AvatarTone = "amber" | "olive" | "slate" | "quiet";
const avatarTone = (tone?: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

interface BuilderState {
  name: string;
  region: string;
  country: string;
  grade: Grade;
  distanceKm: number;
  gainM: number;
  dayTotal: number;
  leaderId: string;
  gear: string[];
}

const EMPTY: BuilderState = {
  name: "",
  region: "",
  country: "",
  grade: "moderate",
  distanceKm: 0,
  gainM: 0,
  dayTotal: 0,
  leaderId: "",
  gear: [],
};

const GRADES: Grade[] = ["moderate", "strenuous", "expert"];
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
  const readiness = Math.round((completed / steps.length) * 100);
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
  const meterSegments = Math.round((completed / steps.length) * 16);

  return (
    <div className="flex min-h-0 flex-1 bg-app">
      {/* Step rail */}
      <div className="flex w-72 flex-none flex-col border-r border-border bg-surface py-5">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="px-5 font-mono uppercase tracking-widest"
        >
          Mission preparation
        </Text>
        <ol className="mt-3 flex flex-col">
          {steps.map((title, i) => {
            const isDone = done[i];
            const current = i === step;
            return (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex w-full items-center gap-3 border-l-2 px-5 py-2.5 text-left transition-colors",
                    current
                      ? "border-accent bg-raised"
                      : "border-transparent hover:bg-raised/60",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 flex-none place-items-center rounded-full border font-mono text-2xs",
                      isDone
                        ? "border-(--plan-sage) bg-[color-mix(in_srgb,var(--plan-sage)_18%,transparent)] text-(--plan-sage)"
                        : current
                          ? "border-accent text-accent-bright"
                          : "border-border text-fg-3",
                    )}
                  >
                    {isDone ? (
                      <Icon name="check" size={12} strokeWidth={3} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0">
                    <Text
                      variant="body-sm"
                      as="span"
                      className={cn(
                        "block truncate",
                        current ? "text-fg-1" : "text-fg-2",
                      )}
                    >
                      {title}
                    </Text>
                    <Text
                      variant="caption"
                      as="span"
                      tone="tertiary"
                      className="font-mono"
                    >
                      {isDone
                        ? "Complete"
                        : current
                          ? "In progress"
                          : "Pending"}
                    </Text>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-auto px-5 pt-5">
          <Text
            variant="caption"
            as="p"
            tone="tertiary"
            className="font-mono uppercase tracking-[0.08em]"
          >
            Readiness to file
          </Text>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-[1px]",
                  i < meterSegments ? "bg-accent" : "bg-border-strong",
                )}
              />
            ))}
          </div>
          <Text
            variant="caption"
            as="p"
            tone="tertiary"
            className="mt-2 font-mono"
          >
            {completed} of {steps.length} steps · {readiness}%
          </Text>
        </div>
      </div>

      {/* Step panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 flex-none items-center gap-3 border-b border-border bg-surface px-5 font-mono">
          <Text
            variant="caption"
            as="span"
            tone="secondary"
            className="uppercase tracking-[0.08em]"
          >
            New expedition
          </Text>
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="uppercase tracking-[0.06em]"
          >
            Step {step + 1} / {steps.length} · {steps[step]}
          </Text>
        </div>

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
                <div className="grid grid-cols-2 gap-4">
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
                  <select
                    value={draft.grade}
                    onChange={(e) => patch({ grade: e.target.value as Grade })}
                    className={`${fieldInput} capitalize`}
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-3 gap-4">
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
              <ul className="grid grid-cols-2 gap-2">
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

        {/* Footer nav */}
        <div className="flex flex-none items-center gap-3 border-t border-border bg-surface px-5 py-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={cn(
              buttonVariants({ variant: "secondary", size: "md" }),
              "disabled:opacity-40",
            )}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "ml-auto",
              )}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={file}
              disabled={!canFile}
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "ml-auto gap-2 disabled:opacity-40",
              )}
            >
              File expedition
              <Icon name="check" size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
