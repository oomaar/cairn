import { cn } from "@/lib/cn";
import type { Expedition } from "@/universe";

interface ExpeditionListRowProps {
  expedition: Expedition;
  isSelected: boolean;
  onSelect: () => void;
}

const STAMP_CLASSES: Partial<Record<Expedition["status"], string>> = {
  "in-field": "border-ok text-ok",
  departing: "border-warn text-warn",
  complete: "border-border text-fg-3",
  planning: "border-border text-fg-3",
};

export function ExpeditionListRow({
  expedition,
  isSelected,
  onSelect,
}: ExpeditionListRowProps) {
  const stampClasses =
    STAMP_CLASSES[expedition.status] ?? "border-border text-fg-3";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full border-b border-border/50 px-6 py-4 text-left transition-colors hover:bg-raised/30",
        isSelected && "bg-raised border-border",
      )}
    >
      {/* Expedition name + status stamp */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-base font-semibold leading-tight",
            isSelected ? "text-fg-1" : "text-fg-2",
          )}
        >
          {expedition.name}
        </span>
        <span
          className={cn(
            "flex-none rounded-sm border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] opacity-75",
            stampClasses,
          )}
        >
          {expedition.statusLabel}
        </span>
      </div>

      {/* Meta line: region, distance, days */}
      <div className="font-mono text-[10.5px] text-fg-3">
        {expedition.region} · {expedition.distanceKm} km · {expedition.dayTotal}
        <span className="ml-0.5">days</span>
      </div>
    </button>
  );
}
