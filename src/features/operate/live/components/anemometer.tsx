"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CARDINAL_DIRECTIONS } from "../data/CARDINAL_DIRECTIONS";

interface AnemometerProps {
  windSpeed: number;
  windThreshold?: number;
}

export function Anemometer({ windSpeed, windThreshold = 40 }: AnemometerProps) {
  // Convert wind speed to degrees for needle (0-180 degrees for 0-100 km/h)
  const maxKmh = 100;
  const needleRotation = (Math.min(windSpeed, maxKmh) / maxKmh) * 180;

  // Determine wind direction (simulate based on seed)
  const directionIndex = Math.floor(windSpeed % 16);
  const direction = CARDINAL_DIRECTIONS[directionIndex];

  // Determine if threshold is exceeded
  const isExceeded = windSpeed > windThreshold;

  // Determine color zones
  const getArcColor = (percentage: number) => {
    if (percentage < (windThreshold / maxKmh) * 100) {
      return "rgba(34, 197, 94, 0.3)"; // Green for safe zone
    }
    return "rgba(239, 68, 68, 0.3)"; // Red for danger zone
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        isExceeded ? "border-danger bg-danger/5" : "border-border bg-surface",
      )}
    >
      <Text variant="caption" tone="tertiary" className="block mb-3">
        Wind Conditions
      </Text>

      {/* Anemometer Gauge */}
      <div className="flex flex-col items-center justify-center mb-4">
        <svg viewBox="0 0 200 120" className="w-full max-w-xs h-24">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            stroke={getArcColor(50)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Threshold line (at 50%) */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="25"
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth="2"
            strokeDasharray="3,3"
          />

          {/* Needle */}
          <g transform={`rotate(${needleRotation} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={isExceeded ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="5"
              fill={isExceeded ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
            />
          </g>

          {/* Scale labels */}
          <text
            x="25"
            y="115"
            fontSize="10"
            fill="currentColor"
            textAnchor="middle"
          >
            0
          </text>
          <text
            x="100"
            y="115"
            fontSize="10"
            fill="currentColor"
            textAnchor="middle"
          >
            50
          </text>
          <text
            x="175"
            y="115"
            fontSize="10"
            fill="currentColor"
            textAnchor="middle"
          >
            100
          </text>
        </svg>
      </div>

      {/* Current Reading */}
      <div className="text-center mb-3">
        <Text className="font-mono font-bold text-lg">
          {Math.round(windSpeed)} km/h · {direction}
        </Text>
        <Text variant="caption" tone="tertiary" className="text-2xs">
          {windSpeed > 50
            ? "Dangerous"
            : windSpeed > 40
              ? "Elevated"
              : "Normal"}
        </Text>
      </div>

      {/* Alert Banner */}
      {isExceeded && (
        <div className="rounded border border-danger bg-danger/5 px-3 py-2 text-center">
          <Text className="text-sm font-semibold text-danger">
            ⚠️ THRESHOLD {windThreshold} KM/H — EXCEEDED
          </Text>
          <Text
            variant="caption"
            tone="tertiary"
            className="text-2xs block mt-0.5"
          >
            High wind condition - proceed with caution
          </Text>
        </div>
      )}
    </div>
  );
}
