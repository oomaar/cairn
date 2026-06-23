"use client";

import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { buildAlerts } from "../utils/buildAlerts";
import { TONE_BORDER } from "../data/TONE_BORDER";
import { TONE_ICON } from "../data/TONE_ICON";

export function CommandAlerts() {
  const alerts = buildAlerts();

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <Text
          variant="caption"
          tone="tertiary"
          className="block font-mono tracking-widest text-2xs uppercase"
        >
          Alerts & Broadcasts
        </Text>
        {alerts.length > 0 && (
          <span className="rounded-full bg-warn/15 px-2 py-0.5 font-mono text-2xs font-bold text-warn">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <Text
          variant="caption"
          tone="tertiary"
          className="block py-3 text-center text-2xs"
        >
          No active alerts
        </Text>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "rounded border border-border border-l-[3px] bg-inset p-3",
                TONE_BORDER[alert.tone] ?? "border-l-fg-3",
              )}
            >
              <div className="mb-1.5 flex items-start gap-2">
                <Icon
                  name={alert.icon}
                  size={13}
                  className={cn(
                    "mt-0.5 flex-none",
                    TONE_ICON[alert.tone] ?? "text-fg-3",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <Text className="block text-sm font-semibold leading-snug">
                    {alert.title}
                  </Text>
                  <div className="mt-1 flex items-center gap-2">
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="font-mono text-2xs"
                    >
                      {alert.context}
                    </Text>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="ml-auto font-mono text-2xs"
                    >
                      {alert.time}
                    </Text>
                  </div>
                </div>
              </div>
              {alert.body && (
                <Text
                  variant="caption"
                  tone="secondary"
                  className="ml-5 block text-xs leading-relaxed"
                >
                  {alert.body}
                </Text>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
