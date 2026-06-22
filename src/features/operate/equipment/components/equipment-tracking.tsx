"use client";

import { Text } from "@/components/ui";
import { listGear } from "@/universe";
import { computeEquipmentStats } from "../utils/computeEquipmentStats";
import { EquipmentStatTiles } from "./equipment-stat-tiles";
import { EquipmentStatusList } from "./equipment-status-list";

export function EquipmentTracking() {
  const gear = listGear();
  const stats = computeEquipmentStats(gear);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex-none border-b border-border px-5 py-4">
        <Text variant="title" className="text-lg">
          Equipment Tracking
        </Text>
        <Text variant="caption" tone="tertiary" className="mt-1">
          {gear.length} categories · {stats.total} items total
        </Text>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="space-y-5">
          <EquipmentStatTiles stats={stats} />

          <div>
            <Text
              variant="caption"
              tone="tertiary"
              className="mb-3 block font-mono text-2xs uppercase tracking-widest"
            >
              Equipment Status
            </Text>
            <EquipmentStatusList gear={gear} />
          </div>
        </div>
      </div>
    </div>
  );
}
