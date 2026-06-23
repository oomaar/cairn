import { Text } from "@/components/ui";
import { CONDITION_EMOJI } from "../../data/CONDITION_EMOJI";
import type { LiveExpeditionState } from "../../types/live-expedition.types";

interface LiveExpeditionDetailLocationAndWeatherProps {
  state: LiveExpeditionState;
}

export function LiveExpeditionDetailLocationAndWeather({
  state,
}: LiveExpeditionDetailLocationAndWeatherProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border p-3">
        <Text variant="caption" tone="tertiary" className="block">
          Current Location
        </Text>
        <Text className="mt-1 font-mono text-sm">
          {state.currentLocation.elevation} m
        </Text>
        <Text
          variant="caption"
          tone="tertiary"
          className="mt-1 font-mono text-2xs"
        >
          {state.currentLocation.lat.toFixed(2)}°,{" "}
          {state.currentLocation.lng.toFixed(2)}°
        </Text>
      </div>

      <div className="rounded-lg border border-border p-3">
        <Text variant="caption" tone="tertiary" className="block">
          Weather
        </Text>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg">
            {CONDITION_EMOJI[state.weather.condition]}
          </span>
          <div>
            <Text className="font-mono text-sm">
              {state.weather.temperature.toFixed(1)}°C
            </Text>
            <Text
              variant="caption"
              tone="tertiary"
              className="font-mono text-2xs"
            >
              {state.weather.windSpeed.toFixed(0)} km/h wind
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
