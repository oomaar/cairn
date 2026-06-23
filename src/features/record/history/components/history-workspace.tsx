import { listExpeditions } from "@/universe";
import { HistoryExpeditionRow } from "./history-expedition-row";

export function HistoryWorkspace() {
  const completed = listExpeditions().filter((e) => e.status === "complete");
  const successCount = completed.filter((e) => e.statusTone !== "warn").length;
  const completionPct =
    completed.length > 0
      ? Math.round((successCount / completed.length) * 100)
      : 0;

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
      {/* Margin rule */}
      <div className="pointer-events-none absolute inset-y-0 left-13.5 z-10 w-[1.5px] bg-(--record-margin) opacity-60" />

      <div className="h-full overflow-y-auto">
        {/* Sub-header */}
        <div className="flex items-baseline gap-3 pb-4 pl-19 pr-9 pt-4">
          <span className="font-sans text-base font-bold tracking-tight text-fg-1">
            Mission archive
          </span>
          <span className="font-mono text-2xs text-fg-3">
            {completed.length} expeditions on file · {completionPct}% completion
          </span>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-4 border-b-2 border-fg-2 pb-2 pl-19 pr-9">
          <div className="w-24 flex-none font-mono text-3xs uppercase tracking-[0.12em] text-fg-3">
            Date
          </div>
          <div className="min-w-0 flex-1 font-mono text-3xs uppercase tracking-[0.12em] text-fg-3">
            Expedition
          </div>
          <div className="w-20 flex-none text-right font-mono text-3xs uppercase tracking-[0.12em] text-fg-3">
            Distance
          </div>
          <div className="w-14 flex-none text-right font-mono text-3xs uppercase tracking-[0.12em] text-fg-3">
            Pax
          </div>
          <div className="w-36 flex-none text-right font-mono text-3xs uppercase tracking-[0.12em] text-fg-3">
            Status
          </div>
        </div>

        {completed.length === 0 ? (
          <div className="flex items-center justify-center p-16">
            <p className="font-mono text-[10.5px] text-fg-3">
              No completed expeditions on record.
            </p>
          </div>
        ) : (
          completed.map((expedition, i) => (
            <HistoryExpeditionRow
              key={expedition.id}
              expedition={expedition}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
