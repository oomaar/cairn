import { Text } from "@/components/ui";
import type { EquipmentStats } from "../types/EquipmentStats";
import { TILES } from "../data/TILES";

interface EquipmentStatTilesProps {
  stats: EquipmentStats;
}

export function EquipmentStatTiles({ stats }: EquipmentStatTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {TILES.map(({ key, label, valueClass }) => (
        <div
          key={key}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <Text
            variant="caption"
            tone="tertiary"
            className="block font-mono text-2xs uppercase tracking-widest"
          >
            {label}
          </Text>
          <p className={`mt-2 font-mono text-3xl font-bold ${valueClass}`}>
            {stats[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
