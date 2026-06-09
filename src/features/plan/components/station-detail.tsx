import { Text } from "@/components/ui";
import type { CheckpointType } from "@/universe";
import type { PlanStation } from "../route.types";

const TYPES: CheckpointType[] = [
  "trailhead",
  "camp",
  "viewpoint",
  "crossing",
  "pass",
  "summit",
];

function defaultNote(type: CheckpointType): string {
  switch (type) {
    case "pass":
      return "Exposed col — commit only inside the weather window.";
    case "crossing":
      return "Watercourse crossing — check flow before committing the party.";
    case "camp":
      return "Established camp — water and shelter on site.";
    case "viewpoint":
      return "Viewpoint — brief photo stop, no shelter.";
    case "summit":
      return "Summit — turnaround time is non-negotiable.";
    default:
      return "Open station on the plotted line.";
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="font-mono text-3xs uppercase tracking-[0.08em]"
      >
        {label}
      </Text>
      <Text variant="body-sm" as="p" className="mt-0.5 font-semibold">
        {value}
      </Text>
    </div>
  );
}

const fieldLabel = "font-mono text-3xs uppercase tracking-[0.08em] text-fg-3";
const fieldInput =
  "mt-1 w-full rounded-md border border-border bg-inset px-2 py-1.5 text-sm text-fg-1 outline-none focus-visible:border-accent-line";

interface StationDetailProps {
  station: PlanStation;
  /** When provided, the role may edit — the panel becomes a form. */
  onChange?: (patch: Partial<PlanStation>) => void;
}

/** Detail for the selected station — read-only, or an editable form when the
 *  active role can edit the route. */
export function StationDetail({ station, onChange }: StationDetailProps) {
  const gradient = `${station.gradientPct >= 0 ? "+" : ""}${station.gradientPct}%`;

  if (!onChange) {
    return (
      <div className="flex flex-none flex-col border-t border-border p-4">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Station {String(station.index + 1).padStart(2, "0")} · Selected
        </Text>
        <Text as="p" variant="title" className="mt-2 text-lg">
          {station.name}
        </Text>
        <Text variant="caption" as="p" tone="secondary" className="font-mono">
          {station.coordsLabel}
        </Text>

        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-border-soft pt-4">
          <Metric label="Elevation" value={`${station.elevationM} m`} />
          <Metric label="Gradient" value={gradient} />
          <Metric label="ETA" value={station.eta} />
          <Metric label="Segment" value={`${station.segmentKm} km`} />
        </div>

        {station.hazard && (
          <div className="mt-4 rounded-md border border-(--plan-signal) bg-(--plan-signal-fill) p-3">
            <Text
              variant="caption"
              as="p"
              className="font-mono text-3xs uppercase tracking-[0.06em] text-(--plan-signal)"
            >
              ⚠ Hazard{station.alert ? ` · ${station.alert.title}` : ""}
            </Text>
            {station.alert && (
              <Text
                variant="caption"
                as="p"
                tone="secondary"
                className="mt-1.5"
              >
                {station.alert.detail}
              </Text>
            )}
          </div>
        )}

        <div className="mt-4 border-t border-border-soft pt-4">
          <Text
            variant="caption"
            as="p"
            tone="tertiary"
            className="font-mono text-3xs uppercase tracking-[0.08em]"
          >
            Terrain note
          </Text>
          <Text variant="caption" as="p" tone="secondary" className="mt-1.5">
            {station.note || defaultNote(station.type)}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-none flex-col gap-3 border-t border-border p-4">
      <div className="flex items-center justify-between">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Station {String(station.index + 1).padStart(2, "0")} · Editing
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {station.coordsLabel}
        </Text>
      </div>

      <label className="block">
        <span className={fieldLabel}>Title</span>
        <input
          value={station.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-label="Checkpoint title"
          className={fieldInput}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={fieldLabel}>Type</span>
          <select
            value={station.type}
            onChange={(e) =>
              onChange({ type: e.target.value as CheckpointType })
            }
            aria-label="Checkpoint type"
            className={`${fieldInput} capitalize`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={fieldLabel}>ETA</span>
          <input
            value={station.eta}
            onChange={(e) => onChange({ eta: e.target.value })}
            aria-label="ETA"
            className={`${fieldInput} font-mono`}
          />
        </label>
        <label className="block">
          <span className={fieldLabel}>Elevation (m)</span>
          <input
            type="number"
            value={station.elevationM}
            onChange={(e) =>
              onChange({ elevationM: Number(e.target.value) || 0 })
            }
            aria-label="Elevation"
            className={`${fieldInput} font-mono`}
          />
        </label>
        <div>
          <span className={fieldLabel}>Gradient</span>
          <Text
            variant="body-sm"
            as="p"
            className="mt-1.5 font-mono font-semibold"
          >
            {gradient}
          </Text>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange({ hazard: !station.hazard })}
        aria-pressed={station.hazard}
        className="flex items-center gap-2 text-left"
      >
        <span
          className={`grid size-4 flex-none place-items-center rounded-sm border ${
            station.hazard
              ? "border-(--plan-signal) bg-(--plan-signal)"
              : "border-border-strong"
          }`}
        />
        <Text
          variant="body-sm"
          as="span"
          className={station.hazard ? "text-(--plan-signal)" : "text-fg-2"}
        >
          Mark as hazard
        </Text>
      </button>

      <label className="block">
        <span className={fieldLabel}>Note</span>
        <textarea
          value={station.note ?? ""}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder={defaultNote(station.type)}
          rows={2}
          aria-label="Terrain note"
          className={`${fieldInput} resize-none placeholder:text-fg-4`}
        />
      </label>
    </div>
  );
}
