"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import type { WeatherAlert } from "@/universe";
import { TONE_COLORS } from "../../data/TONE_COLORS";
import { WEATHER_ICONS } from "../../data/WEATHER_ICONS";

interface LiveExpeditionDetailWeatherAlertsProps {
  alerts: WeatherAlert[];
  limit?: number;
  expeditionId?: string;
}

export function LiveExpeditionDetailWeatherAlerts({
  alerts,
  limit = 5,
  expeditionId,
}: LiveExpeditionDetailWeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-border p-3">
        <Text variant="caption" tone="tertiary" className="mb-2">
          Weather Alerts
        </Text>
        <Text
          variant="caption"
          tone="tertiary"
          className="text-center block py-2"
        >
          No active weather alerts
        </Text>
      </div>
    );
  }

  // Sort by severity: danger, warn, slate
  const sorted = [...alerts].sort((a, b) => {
    const severityOrder = { danger: 0, warn: 1, slate: 2 };
    return (
      (severityOrder[a.tone as keyof typeof severityOrder] ?? 3) -
      (severityOrder[b.tone as keyof typeof severityOrder] ?? 3)
    );
  });

  const displayed = sorted.slice(0, limit);

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <Text variant="caption" tone="tertiary">
          Weather Alerts ({alerts.length})
        </Text>
        {expeditionId && (
          <Link
            href={`/operate/weather`}
            className="text-2xs text-accent hover:text-accent-hover transition-colors font-medium"
          >
            View all
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {displayed.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded border p-2 transition-all",
              TONE_COLORS[alert.tone as keyof typeof TONE_COLORS] ||
                TONE_COLORS.slate,
            )}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg flex-none">
                {WEATHER_ICONS[alert.icon] || "⚠️"}
              </span>
              <div className="min-w-0 flex-1">
                <Text
                  variant="caption"
                  className="block font-semibold truncate"
                >
                  {alert.title}
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="block text-2xs"
                >
                  {alert.place}
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="block text-2xs mt-0.5"
                >
                  {alert.detail}
                </Text>
                <Text
                  variant="caption"
                  tone="tertiary"
                  className="block text-2xs mt-1"
                >
                  {alert.window} · {alert.observedAgo}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
