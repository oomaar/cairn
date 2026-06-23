import { cn } from "@/lib/cn";
import type { Expedition } from "@/universe";
import { STATUS_DOT } from "../data/STATUS_DOT";

interface ExpeditionListRowProps {
  expedition: Expedition;
  isSelected: boolean;
  onSelect: () => void;
}

export function ExpeditionListRow({
  expedition,
  isSelected,
  onSelect,
}: ExpeditionListRowProps) {
  const dot = STATUS_DOT[expedition.status] ?? "bg-border";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full border-b border-border px-5 py-3 text-left transition-colors sm:px-6",
        isSelected ? "bg-raised" : "hover:bg-raised/50",
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className={cn("mt-px size-1.5 flex-none rounded-full", dot)} />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm font-semibold leading-snug",
            isSelected ? "text-fg-1" : "text-fg-2",
          )}
        >
          {expedition.name}
        </span>
      </div>
      <div className="mt-0.5 pl-4 font-mono text-[10.5px] text-fg-4">
        {expedition.region} · {expedition.distanceKm} km · {expedition.dayTotal}
        d
      </div>
    </button>
  );
}
