"use client";

import { Text } from "@/components/ui";

export function EquipmentTracking() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <Text variant="title" className="text-lg">
        Equipment Tracking
      </Text>
      <Text variant="caption" tone="tertiary" className="mt-2">
        Coming soon — Real-time equipment status and inventory
      </Text>
    </div>
  );
}
