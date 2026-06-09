import { Text } from "@/components/ui";
import type { RoutePlan } from "../route.types";

/** The survey-sheet meta strip beneath the world tabs. */
export function SheetMeta({ plan }: { plan: RoutePlan }) {
  const fields = [
    `Sheet ${plan.sheetNo}`,
    "1:50 000",
    "Datum WGS84",
    "UTM 18S",
  ];
  return (
    <div className="flex h-9 flex-none items-stretch border-b border-border bg-surface font-mono">
      {fields.map((field) => (
        <div
          key={field}
          className="flex items-center border-r border-border px-4"
        >
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="uppercase tracking-[0.06em]"
          >
            {field}
          </Text>
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2 px-4">
        <span className="size-1.5 rounded-full bg-accent" />
        <Text
          variant="caption"
          as="span"
          tone="secondary"
          className="uppercase tracking-[0.08em]"
        >
          Plotting
        </Text>
      </div>
    </div>
  );
}
