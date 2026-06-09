import { Text } from "@/components/ui";
import type { PlanStation } from "../route.types";

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

/** Right rail: full detail for the selected station. */
export function StationDetail({ station }: { station: PlanStation }) {
  return (
    <div className="flex w-64 flex-none flex-col border-l border-border bg-surface p-4">
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
        <Metric
          label="Gradient"
          value={`${station.gradientPct >= 0 ? "+" : ""}${station.gradientPct}%`}
        />
        <Metric label="ETA" value={station.eta} />
        <Metric label="Segment" value={`${station.segmentKm} km`} />
      </div>

      {station.alert ? (
        <div className="mt-4 rounded-md border border-(--plan-signal) bg-(--plan-signal-fill) p-3">
          <Text
            variant="caption"
            as="p"
            className="font-mono text-3xs uppercase tracking-[0.06em] text-(--plan-signal)"
          >
            ⚠ Hazard · {station.alert.title}
          </Text>
          <Text variant="caption" as="p" tone="secondary" className="mt-1.5">
            {station.alert.detail}
          </Text>
        </div>
      ) : (
        station.hazard && (
          <div className="mt-4 rounded-md border border-warn-line bg-warn-tint p-3">
            <Text
              variant="caption"
              as="p"
              className="font-mono text-3xs uppercase tracking-[0.06em] text-warn"
            >
              ⚠ Exposed checkpoint
            </Text>
          </div>
        )
      )}

      <div className="mt-auto border-t border-border-soft pt-4">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono text-3xs uppercase tracking-[0.08em]"
        >
          Terrain note
        </Text>
        <Text variant="caption" as="p" tone="secondary" className="mt-1.5">
          {station.type === "pass"
            ? "Exposed col — commit only inside the weather window."
            : station.type === "crossing"
              ? "Watercourse crossing — check flow before committing the party."
              : station.type === "camp"
                ? "Established camp — water and shelter on site."
                : "Open station on the plotted line."}
        </Text>
      </div>
    </div>
  );
}
