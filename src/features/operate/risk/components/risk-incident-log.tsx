"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listExpeditions, getIncidents } from "@/universe";
import { RISK_DOT } from "../data/RISK_DOT";

export function RiskIncidentLog() {
  const incidents = listExpeditions().flatMap((e) =>
    getIncidents(e.id).map((inc) => ({ ...inc, expeditionName: e.name })),
  );

  return (
    <div className="rounded-lg border border-border p-4">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-3 block font-mono tracking-widest text-2xs uppercase"
      >
        Incident Log
      </Text>

      {incidents.length === 0 ? (
        <Text
          variant="caption"
          tone="tertiary"
          className="block py-4 text-center text-2xs"
        >
          No incidents recorded
        </Text>
      ) : (
        <div className="space-y-0">
          {incidents.map((inc, idx) => (
            <div
              key={inc.id}
              className={cn(
                "py-3",
                idx < incidents.length - 1 && "border-b border-border-soft",
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={cn(
                    "size-1.5 flex-none rounded-full",
                    RISK_DOT[inc.tone] ?? "bg-fg-4",
                  )}
                />
                <Text className="block text-sm font-semibold leading-tight">
                  {inc.title}
                </Text>
              </div>
              <Text
                variant="caption"
                tone="tertiary"
                className="mb-1 block font-mono text-2xs ml-3.5"
              >
                {inc.timeLabel} · {inc.status}
              </Text>
              <Text
                variant="caption"
                tone="secondary"
                className="block text-xs ml-3.5 leading-relaxed"
              >
                {inc.detail}
              </Text>
            </div>
          ))}
        </div>
      )}

      <button className="mt-3 w-full rounded border border-border py-2.5 font-mono text-2xs tracking-wider text-accent transition-colors hover:border-accent-line hover:bg-accent/5">
        FILE FORMAL REPORT → RECORD
      </button>
    </div>
  );
}
