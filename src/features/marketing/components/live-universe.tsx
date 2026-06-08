import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { computeKpis, listExpeditions } from "@/universe";
import { TONE_DOT } from "../marketing.constants";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 border-l border-border-soft pl-4">
      <Text variant="figure" as="span" className="text-3xl">
        {value}
      </Text>
      <Text variant="caption" as="span" tone="tertiary">
        {label}
      </Text>
    </div>
  );
}

/**
 * A readout of the operation as it stands right now, sourced from the live
 * universe — the public site is backed by the same data the platform runs on.
 */
export function LiveUniverse() {
  const kpis = computeKpis();
  const expeditions = listExpeditions();
  const ranges = new Set(expeditions.map((e) => e.country)).size;

  return (
    <section className="border-b border-border bg-inset">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          Live universe
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          A real operation, running now.
        </Text>

        <div className="mt-10 grid grid-cols-2 gap-y-8 md:grid-cols-4">
          <Stat
            value={String(kpis.activeExpeditions)}
            label="Active expeditions"
          />
          <Stat
            value={String(kpis.participantsInField)}
            label="Participants in field"
          />
          <Stat value={String(ranges)} label="Mountain ranges" />
          <Stat value={`${kpis.equipment.readyPct}%`} label="Equipment ready" />
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-border bg-surface">
          {expeditions.map((expedition, i) => (
            <div
              key={expedition.id}
              className={cn(
                "flex items-center gap-4 px-5 py-4",
                i > 0 && "border-t border-border-soft",
              )}
            >
              <span
                className={cn(
                  "size-2 flex-none rounded-full",
                  TONE_DOT[expedition.statusTone],
                )}
              />
              <div className="min-w-0 flex-1">
                <Text variant="body-sm" as="p" className="truncate font-medium">
                  {expedition.name}
                </Text>
                <Text variant="caption" as="p" tone="tertiary">
                  {expedition.region}, {expedition.country}
                </Text>
              </div>
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="hidden sm:block"
              >
                {expedition.distanceKm} km · {expedition.grade}
              </Text>
              <Text
                variant="caption"
                as="span"
                tone="secondary"
                className="w-20 text-right font-mono uppercase"
              >
                {expedition.statusLabel}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
