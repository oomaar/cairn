"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listExpeditions, getIncidents } from "@/universe";
import { RISK_BORDER } from "../data/RISK_BORDER";

const SEVERITY_LABEL: Record<string, string> = {
  danger: "CRITICAL",
  warn: "WATCH",
  slate: "INFO",
  ok: "CLEAR",
};

const SEVERITY_TEXT: Record<string, string> = {
  danger: "text-danger",
  warn: "text-warn",
  slate: "text-fg-3",
  ok: "text-accent",
};

const SEVERITY_ORDER: Record<string, number> = {
  danger: 0,
  warn: 1,
  slate: 2,
  ok: 3,
};

export function RiskIncidentLog() {
  const incidents = listExpeditions()
    .flatMap((e) =>
      getIncidents(e.id).map((inc) => ({ ...inc, expeditionName: e.name })),
    )
    .sort(
      (a, b) => (SEVERITY_ORDER[a.tone] ?? 4) - (SEVERITY_ORDER[b.tone] ?? 4),
    );

  return (
    <div className="rounded-lg border border-border p-4">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-4 block font-mono tracking-widest text-2xs uppercase"
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
        <div className="flex flex-col gap-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className={cn(
                "rounded border border-border border-l-[3px] bg-inset p-3",
                RISK_BORDER[inc.tone] ?? "border-l-fg-3",
              )}
            >
              {/* Severity + time */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-2xs font-bold tracking-wider",
                    SEVERITY_TEXT[inc.tone] ?? "text-fg-3",
                  )}
                >
                  {SEVERITY_LABEL[inc.tone] ?? "INFO"}
                </span>
                <span className="font-mono text-2xs text-fg-3">
                  {inc.timeLabel}
                </span>
              </div>

              {/* Title */}
              <Text className="block text-sm font-semibold leading-snug">
                {inc.title}
              </Text>

              {/* Status */}
              <Text
                variant="caption"
                tone="tertiary"
                className="mt-1.5 block font-mono text-2xs"
              >
                {inc.status}
              </Text>

              {/* Detail */}
              <Text
                variant="caption"
                tone="secondary"
                className="mt-2 block text-xs leading-relaxed"
              >
                {inc.detail}
              </Text>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 w-full rounded border border-border py-2.5 font-mono text-2xs tracking-wider text-accent transition-colors hover:border-accent-line hover:bg-accent/5">
        FILE FORMAL REPORT → RECORD
      </button>
    </div>
  );
}
