import { cn } from "@/lib/cn";
import type { Expedition } from "@/universe";
import { dateRangeLabel } from "../utils/dateRangeLabel";

interface HistoryExpeditionRowProps {
  expedition: Expedition;
  index: number;
}

export function HistoryExpeditionRow({
  expedition,
  index,
}: HistoryExpeditionRowProps) {
  const isClosed = expedition.statusTone === "warn";
  const rotate = index % 2 ? "-rotate-2" : "rotate-3";
  const dateRange = dateRangeLabel(expedition.departLabel, expedition.dayTotal);

  const stamp = (
    <span
      className={cn(
        "inline-block rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
        rotate,
        isClosed ? "border-warn text-warn" : "border-ok text-ok",
      )}
    >
      {expedition.statusLabel}
    </span>
  );

  return (
    <div className="border-b border-border pl-5 pr-5 py-3.5 sm:pl-19 sm:pr-9">
      {/* ── Mobile / tablet layout (< lg) ── */}
      <div className="flex items-start justify-between gap-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold leading-snug text-fg-1">
            {expedition.name}
          </div>
          <div className="mt-0.5 text-xs text-fg-3">{expedition.region}</div>
          <div className="mt-1.5 font-mono text-2xs text-fg-3">
            {dateRange} · {expedition.country} · {expedition.distanceKm} km ·{" "}
            {expedition.filled}/{expedition.capacity} pax
          </div>
        </div>
        <div className="flex-none pt-0.5">{stamp}</div>
      </div>

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden items-center gap-4 lg:flex">
        {/* Date */}
        <div className="w-24 flex-none font-mono text-2xs text-fg-3">
          {dateRange}
          <div className="text-3xs text-fg-4">{expedition.country}</div>
        </div>
        {/* Name + region */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-bold leading-snug text-fg-1">
            {expedition.name}
          </div>
          <div className="mt-px text-xs text-fg-3">{expedition.region}</div>
        </div>
        {/* Distance */}
        <div className="w-20 flex-none text-right font-mono text-[11.5px] text-fg-2">
          {expedition.distanceKm} km
        </div>
        {/* Pax */}
        <div className="w-14 flex-none text-right font-mono text-[11.5px] text-fg-2">
          {expedition.filled}/{expedition.capacity}
        </div>
        {/* Stamp */}
        <div className="w-36 flex-none text-right">{stamp}</div>
      </div>
    </div>
  );
}
