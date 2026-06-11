import { Text } from "@/components/ui";
import { TONE_DOT } from "@/features/marketing/marketing.constants";
import { Section } from "../section";
import { cn } from "@/lib/cn";
import type { Risk } from "@/universe";

interface RisksProps {
  risks: Risk[];
}

export function Risks({ risks }: RisksProps) {
  return (
    <>
      {risks.length > 0 && (
        <Section title="Open risks" count={risks.length}>
          <ul className="flex flex-col gap-2">
            {risks.map((r) => (
              <li key={r.id} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 flex-none rounded-full",
                    TONE_DOT[r.tone],
                  )}
                />
                <div className="min-w-0">
                  <Text variant="caption" as="p" className="text-fg-1">
                    {r.title}
                  </Text>
                  <Text
                    variant="caption"
                    as="p"
                    tone="tertiary"
                    className="font-mono uppercase"
                  >
                    {r.level} · {r.category}
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
