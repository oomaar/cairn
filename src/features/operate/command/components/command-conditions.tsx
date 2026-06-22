"use client";

import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { listExpeditions, getWeather } from "@/universe";
import { ICON_MAP } from "../data/ICON_MAP";
import { TONE_STYLE } from "../data/TONE_STYLE";

export function CommandConditions() {
  const expeditions = listExpeditions().filter((e) => e.status === "in-field");

  const alerts = expeditions.flatMap((expedition) =>
    getWeather(expedition.id).map((alert) => ({
      ...alert,
      expeditionName: expedition.name,
    })),
  );

  const sorted = [...alerts].sort((a, b) => {
    const order = { danger: 0, warn: 1, slate: 2 };
    return (
      (order[a.tone as keyof typeof order] ?? 3) -
      (order[b.tone as keyof typeof order] ?? 3)
    );
  });

  return (
    <div className="rounded-lg border border-border p-4">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-3 block font-mono tracking-widest text-2xs uppercase"
      >
        Conditions by Range
      </Text>

      {sorted.length === 0 ? (
        <Text
          variant="caption"
          tone="tertiary"
          className="block py-4 text-center text-2xs"
        >
          No active alerts
        </Text>
      ) : (
        <div className="space-y-0">
          {sorted.map((alert, idx) => (
            <div
              key={alert.id}
              className={cn(
                "flex gap-3 py-3",
                idx < sorted.length - 1 && "border-b border-border-soft",
              )}
            >
              <Icon
                name={ICON_MAP[alert.icon] ?? "alert"}
                size={15}
                className={cn(
                  "mt-0.5 flex-none",
                  TONE_STYLE[alert.tone] ?? "text-fg-3",
                )}
              />
              <div className="min-w-0 flex-1">
                <Text className="block text-sm font-semibold leading-tight">
                  {alert.title}
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="mt-1 block font-mono text-2xs"
                >
                  {alert.expeditionName}
                </Text>
                <Text
                  variant="caption"
                  className={cn(
                    "mt-1 block font-mono text-2xs",
                    TONE_STYLE[alert.tone] ?? "text-fg-3",
                  )}
                >
                  {alert.window}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
