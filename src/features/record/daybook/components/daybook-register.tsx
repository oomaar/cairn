import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { listExpeditions, computeKpis, getOperator } from "@/universe";
import { EXPEDITION_COLORS } from "../data/EXPEDITION_COLORS";

export function DaybookRegister() {
  const operator = getOperator();
  const kpis = computeKpis();
  const expeditions = listExpeditions().filter(
    (e) => e.status === "in-field" || e.status === "complete",
  );

  const filledBlocks = Math.round((kpis.equipment.readyPct / 100) * 20);
  const readinessLabel =
    kpis.equipment.readyPct >= 80 ? "OPERATIONAL" : "DEGRADED";
  const readinessColor =
    kpis.equipment.readyPct >= 80 ? "text-ok" : "text-warn";

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto p-5">
      {/* Header */}
      <div>
        <Text
          variant="caption"
          tone="tertiary"
          className="block font-mono text-2xs uppercase tracking-widest"
        >
          Operations Register
        </Text>
        <Text
          variant="caption"
          tone="tertiary"
          className="mt-0.5 font-mono text-2xs"
        >
          {operator.name}
        </Text>
      </div>

      {/* Expedition list */}
      <div className="rounded-lg border border-border">
        <div className="border-b border-border px-3 py-2">
          <Text
            variant="caption"
            tone="tertiary"
            className="font-mono text-2xs uppercase tracking-widest"
          >
            Active & Complete
          </Text>
        </div>
        <div className="divide-y divide-border/50">
          {expeditions.map((expedition, i) => {
            const color = EXPEDITION_COLORS[i % EXPEDITION_COLORS.length]!;
            const isField = expedition.status === "in-field";
            return (
              <div
                key={expedition.id}
                className="flex items-center gap-2.5 px-3 py-2.5"
              >
                <div
                  className={cn("size-2 flex-none rounded-full", color.bar)}
                />
                <div className="min-w-0 flex-1">
                  <Text className="block truncate text-xs font-semibold">
                    {expedition.name}
                  </Text>
                  <Text
                    variant="caption"
                    tone="tertiary"
                    className="font-mono text-2xs"
                  >
                    {expedition.filled} participants
                  </Text>
                </div>
                <span
                  className={cn(
                    "flex-none rounded border px-1.5 py-0.5 font-mono text-2xs font-bold",
                    isField
                      ? "border-accent/40 text-accent"
                      : "border-border text-fg-4",
                  )}
                >
                  {isField ? "IN FIELD" : "COMPLETE"}
                </span>
              </div>
            );
          })}
          {expeditions.length === 0 && (
            <div className="px-3 py-4">
              <Text
                variant="caption"
                tone="tertiary"
                className="font-mono text-2xs"
              >
                No expeditions in record
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Operational readiness */}
      <div className="rounded-lg border border-border p-3">
        <div className="mb-2 flex items-center justify-between">
          <Text
            variant="caption"
            tone="tertiary"
            className="font-mono text-2xs uppercase tracking-widest"
          >
            Readiness
          </Text>
          <Text className={cn("font-mono text-xs font-bold", readinessColor)}>
            {readinessLabel}
          </Text>
        </div>
        <div className="mb-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold text-fg-1">
            {Math.round(kpis.equipment.readyPct)}
          </span>
          <span className="font-mono text-xs text-fg-3">/100</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm",
                i < filledBlocks ? "bg-ok/60" : "bg-inset",
              )}
            />
          ))}
        </div>
      </div>

      {/* Certified record block */}
      <div className="rounded-lg border border-border p-3">
        <Text
          variant="caption"
          tone="tertiary"
          className="mb-3 block font-mono text-2xs uppercase tracking-widest"
        >
          Certified True Record
        </Text>
        <div className="border-t border-dashed border-border pt-3">
          <Text className="block text-xs font-semibold">{operator.name}</Text>
          <Text
            variant="caption"
            tone="tertiary"
            className="mt-0.5 font-mono text-2xs"
          >
            {operator.hq}
          </Text>
          <Text
            variant="caption"
            tone="tertiary"
            className="mt-2 block font-mono text-2xs uppercase tracking-wider"
          >
            {today}
          </Text>
        </div>
      </div>
    </div>
  );
}
