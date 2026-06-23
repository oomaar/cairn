import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { GearItem } from "@/universe";
import { readinessPct } from "../utils/readinessPct";
import { barClass } from "../utils/barClass";

interface EquipmentStatusListProps {
  gear: GearItem[];
}

export function EquipmentStatusList({ gear }: EquipmentStatusListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="min-w-140">
        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_180px_64px_88px] items-center gap-4 border-b border-border px-5 py-2.5">
          {["ID", "Name", "Readiness", "Ready", "Status"].map((h) => (
            <Text
              key={h}
              variant="caption"
              tone="tertiary"
              className="font-mono text-2xs uppercase tracking-widest"
            >
              {h}
            </Text>
          ))}
        </div>

        {/* Rows */}
        {gear.map((item, i) => {
          const pct = readinessPct(item);
          const isOk = item.status === "ok";

          return (
            <div
              key={item.id}
              className={cn(
                "grid grid-cols-[60px_1fr_180px_64px_88px] items-center gap-4 px-5 py-3",
                i < gear.length - 1 && "border-b border-border",
              )}
            >
              {/* ID */}
              <Text
                variant="caption"
                tone="tertiary"
                className="font-mono text-xs"
              >
                {item.id}
              </Text>

              {/* Name + category */}
              <div className="min-w-0">
                <Text className="block truncate text-sm font-semibold">
                  {item.name}
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="font-mono text-2xs uppercase"
                >
                  {item.category}
                </Text>
              </div>

              {/* Readiness bar */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 min-w-0 flex-1 rounded-full bg-inset">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      barClass(pct),
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="w-8 flex-none text-right font-mono text-2xs"
                >
                  {pct}%
                </Text>
              </div>

              {/* Ready / total */}
              <Text
                variant="caption"
                tone="secondary"
                className="text-right font-mono text-xs"
              >
                {item.ready}/{item.total}
              </Text>

              {/* Status badge */}
              <div className="flex justify-end">
                <span
                  className={cn(
                    "rounded border px-2 py-0.5 font-mono text-2xs font-bold",
                    isOk ? "border-ok/40 text-ok" : "border-warn/40 text-warn",
                  )}
                >
                  {isOk ? "READY" : "ATTENTION"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
