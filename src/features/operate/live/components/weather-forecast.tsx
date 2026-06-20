"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CONDITION_EMOJI } from "../data/CONDITION_EMOJI";
import type { ForecastPeriod } from "../types/live-expedition.types";

interface WeatherForecastProps {
  forecast: ForecastPeriod[];
  windThreshold?: number;
}

const MAX_WIND = 80;

function isFavorable(period: ForecastPeriod, threshold: number): boolean {
  return (
    period.windSpeed < threshold &&
    period.condition !== "storm" &&
    period.condition !== "snow"
  );
}

export function WeatherForecast({
  forecast,
  windThreshold = 40,
}: WeatherForecastProps) {
  if (forecast.length === 0) return null;

  const maxWind = Math.max(...forecast.map((p) => p.windSpeed), MAX_WIND);

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between mb-3">
        <Text variant="caption" tone="tertiary">
          6-Hour Forecast
        </Text>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-accent/60" />
          <Text variant="caption" tone="tertiary" className="text-2xs">
            Favorable window
          </Text>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {forecast.map((period, idx) => {
          const favorable = isFavorable(period, windThreshold);
          const windPct = Math.min(period.windSpeed / maxWind, 1);
          const barHeight = Math.max(windPct * 40, 4);
          const isAboveThreshold = period.windSpeed >= windThreshold;

          return (
            <div
              key={idx}
              className={cn(
                "flex min-w-13 flex-1 flex-col items-center rounded-md p-2 transition-colors",
                favorable ? "bg-accent/5" : "bg-surface",
              )}
            >
              {/* Time label */}
              <Text
                variant="caption"
                tone="tertiary"
                className="text-2xs font-mono mb-2"
              >
                {idx === 0 ? "Now" : `+${idx}h`}
              </Text>

              {/* Condition emoji */}
              <span className="text-base mb-2">
                {CONDITION_EMOJI[period.condition]}
              </span>

              {/* Wind bar */}
              <div className="flex h-10 w-full items-end justify-center mb-1">
                <div
                  className={cn(
                    "w-4 rounded-sm transition-all",
                    isAboveThreshold ? "bg-danger/70" : "bg-accent/50",
                  )}
                  style={{ height: `${barHeight}px` }}
                />
              </div>

              {/* Wind speed */}
              <Text
                variant="caption"
                className={cn(
                  "text-2xs font-mono",
                  isAboveThreshold ? "text-danger" : "text-fg-3",
                )}
              >
                {Math.round(period.windSpeed)}
              </Text>

              {/* Temperature */}
              <Text
                variant="caption"
                tone="tertiary"
                className="text-2xs font-mono mt-0.5"
              >
                {period.temperature.toFixed(0)}°
              </Text>
            </div>
          );
        })}
      </div>

      {/* Wind scale label */}
      <div className="mt-2 flex items-center justify-between">
        <Text variant="caption" tone="tertiary" className="text-2xs">
          Wind km/h · Temp °C
        </Text>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-sm bg-danger/70" />
          <Text variant="caption" tone="tertiary" className="text-2xs">
            ≥{windThreshold} km/h
          </Text>
        </div>
      </div>
    </div>
  );
}
