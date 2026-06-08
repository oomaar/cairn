import Link from "next/link";
import { Icon, Text } from "@/components/ui";
import { computeKpis, getLeader, listExpeditions } from "@/universe";
import { ExpeditionCard } from "./expedition-card";

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
 * The operation as it stands right now, sourced from the live universe — KPIs
 * plus the full slate of expeditions as teaser cards. The public site is
 * backed by the same data the platform runs on.
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

        <div className="mt-12 flex items-baseline justify-between">
          <Text variant="title" as="h3" className="text-lg">
            Expeditions on the board
          </Text>
          <Link
            href="/plan/expeditions"
            className="flex items-center gap-1.5 text-sm font-semibold text-fg-2 transition-colors hover:text-fg-1"
          >
            Open the expeditions board
            <Icon name="arrowR" size={14} />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {expeditions.map((expedition, i) => (
            <ExpeditionCard
              key={expedition.id}
              expedition={expedition}
              leader={getLeader(expedition.id)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
