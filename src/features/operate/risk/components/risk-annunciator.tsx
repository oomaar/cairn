"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listRisks } from "@/universe";
import { deriveAnnunciatorCells } from "../utils/deriveAnnunciatorCells";
import { TONE_BORDER } from "../data/TONE_BORDER";
import { TONE_BG } from "../data/TONE_BG";
import { TONE_TEXT } from "../data/TONE_TEXT";

export function RiskAnnunciator() {
  const cells = deriveAnnunciatorCells(listRisks());

  return (
    <div className="rounded-lg border border-border p-4">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-3 block font-mono tracking-widest text-2xs uppercase"
      >
        Risk Annunciator
      </Text>
      <div className="grid grid-cols-4 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={cn(
              "rounded border px-2 py-3 text-center transition-all",
              cell.active
                ? `${TONE_BORDER[cell.tone]} ${TONE_BG[cell.tone]}`
                : "border-border opacity-35",
            )}
          >
            <Text
              className={cn(
                "block font-mono text-2xs font-bold leading-tight tracking-wider",
                cell.active ? TONE_TEXT[cell.tone] : "text-fg-4",
              )}
            >
              {cell.label}
            </Text>
            {cell.sub && cell.active && (
              <Text
                className={cn(
                  "mt-0.5 block font-mono text-2xs tracking-widest",
                  TONE_TEXT[cell.tone],
                )}
              >
                · {cell.sub}
              </Text>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
