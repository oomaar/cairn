import { cn } from "@/lib/cn";
import { listExpeditions, computeKpis, getOperator } from "@/universe";
import { EXPEDITION_COLORS } from "../data/EXPEDITION_COLORS";

interface DaybookRegisterProps {
  allowedIds?: string[];
}

export function DaybookRegister({ allowedIds }: DaybookRegisterProps) {
  const operator = getOperator();
  const kpis = computeKpis();
  const expeditions = listExpeditions().filter(
    (e) =>
      (e.status === "in-field" || e.status === "complete") &&
      (!allowedIds || allowedIds.includes(e.id)),
  );

  const filledBlocks = Math.round((kpis.equipment.readyPct / 100) * 20);
  const score = Math.round(kpis.equipment.readyPct);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="h-full overflow-y-auto bg-surface px-5 py-4">
      {/* ── Operations Register ─────────────────── */}
      <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
        Operations Register
      </div>

      <div className="divide-y divide-border">
        {expeditions.map((expedition, i) => {
          const color = EXPEDITION_COLORS[i % EXPEDITION_COLORS.length]!;
          const isField = expedition.status === "in-field";
          return (
            <div
              key={expedition.id}
              className="flex items-center gap-2.5 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold leading-snug text-fg-1">
                  {expedition.name}
                </div>
                <div className="mt-0.5 font-mono text-[10.5px] text-fg-3">
                  {expedition.filled} participants
                </div>
              </div>
              {/* Stamp — matches entry row stamps */}
              <span
                className={cn(
                  "flex-none rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
                  isField
                    ? `${color.border} ${color.text} rotate-1`
                    : "border-fg-4 text-fg-4 -rotate-1",
                )}
              >
                {isField ? "IN FIELD" : "COMPLETE"}
              </span>
            </div>
          );
        })}
        {expeditions.length === 0 && (
          <div className="py-4 font-mono text-[10.5px] text-fg-3">
            No expeditions in record
          </div>
        )}
      </div>

      {/* ── Operational Readiness ───────────────── */}
      <div className="mt-4 border-t-2 border-fg-2 pt-4">
        <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
          Operational Readiness
        </div>
        <div className="mb-2.5 flex items-baseline gap-2">
          <span className="font-sans text-[40px] font-bold leading-none text-ok">
            {score}
          </span>
          <span className="font-mono text-xs text-fg-3">/ 100</span>
        </div>
        <div className="flex gap-0.75">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-3.5 flex-1 border border-fg-4",
                i < filledBlocks ? "bg-ok/70" : "bg-transparent",
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Certified true record ───────────────── */}
      <div className="mt-4 border-t border-border pt-4">
        <p className="font-mono text-3xs italic text-fg-3">
          Certified true record — {operator.hq}, Duty Officer, {today}
        </p>
      </div>
    </div>
  );
}
