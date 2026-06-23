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

  return (
    <div className="flex items-center gap-4 border-b border-border pl-19 pr-9 py-3.5">
      {/* Date range */}
      <div className="w-24 flex-none font-mono text-2xs text-fg-3">
        {dateRangeLabel(expedition.departLabel, expedition.dayTotal)}
        <div className="text-3xs text-fg-4">{expedition.country}</div>
      </div>

      {/* Name + region */}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold leading-snug text-fg-1">
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

      {/* Status stamp */}
      <div className="w-36 flex-none text-right">
        <span
          className={cn(
            "inline-block rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
            rotate,
            isClosed ? "border-warn text-warn" : "border-ok text-ok",
          )}
        >
          {expedition.statusLabel}
        </span>
      </div>
    </div>
  );
}
