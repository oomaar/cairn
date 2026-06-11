import { Text } from "@/components/ui";
import { Section } from "../section";
import { TONE_DOT } from "@/features/marketing/marketing.constants";
import { getIncidents } from "@/universe";
import { cn } from "@/lib/cn";

interface IncidentsProps {
  expeditionId: string;
}

export function Incidents({ expeditionId }: IncidentsProps) {
  const incidents = getIncidents(expeditionId);

  return (
    <>
      {incidents.length > 0 && (
        <Section title="Incidents" count={incidents.length}>
          <ul className="flex flex-col gap-2">
            {incidents.map((inc) => (
              <li key={inc.id} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 flex-none rounded-full",
                    TONE_DOT[inc.tone],
                  )}
                />
                <div className="min-w-0">
                  <Text variant="caption" as="p" className="text-fg-1">
                    {inc.title}
                  </Text>
                  <Text variant="caption" as="p" tone="tertiary">
                    {inc.timeLabel} · {inc.status}
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
