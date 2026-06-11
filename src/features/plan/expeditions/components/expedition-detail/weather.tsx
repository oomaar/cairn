import { Icon, Text } from "@/components/ui";
import { Section } from "../section";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../data/TONE_TEXT";
import { getWeather } from "@/universe";

interface WeatherProps {
  expeditionId: string;
}

export function Weather({ expeditionId }: WeatherProps) {
  const weather = getWeather(expeditionId);

  return (
    <>
      {weather.length > 0 && (
        <Section title="Weather" count={weather.length}>
          <ul className="flex flex-col gap-2">
            {weather.map((w) => (
              <li key={w.id} className="flex items-start gap-2">
                <Icon
                  name="wind"
                  size={13}
                  className={cn("mt-0.5 flex-none", TONE_TEXT[w.tone])}
                />
                <div className="min-w-0">
                  <Text variant="caption" as="p" className="text-fg-1">
                    {w.title}
                  </Text>
                  <Text variant="caption" as="p" tone="tertiary">
                    {w.place} · {w.window}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
