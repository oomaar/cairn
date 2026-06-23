"use client";

import { useNavigation } from "@/features/navigation";
import { WORLD_BY_KEY } from "@/features/theme";

export function RecordMasthead() {
  const nav = useNavigation();
  const world = WORLD_BY_KEY["record"];
  const currentModule = world.modules.find((m) => m.key === nav.module);

  const dayLabel = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div className="flex-none border-b-2 border-fg-1 bg-app px-9 pb-3 pt-3.5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-3">
            Cairn · The Record
          </div>
          <h1 className="mt-0.5 font-sans text-[30px] font-bold leading-none tracking-heading text-fg-1">
            {currentModule?.label ?? "The Record"}
          </h1>
        </div>
        <div className="flex-none text-right font-mono text-2xs leading-[1.7] text-fg-2">
          {dayLabel}
        </div>
      </div>
    </div>
  );
}
