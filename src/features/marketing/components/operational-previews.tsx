import type { ReactNode } from "react";
import Link from "next/link";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLD_BY_KEY, type WorldKey } from "@/features/theme";
import { PlanPreview } from "./plan-preview";
import { RecordPreview } from "./record-preview";

interface PreviewRowProps {
  worldKey: WorldKey;
  headline: string;
  blurb: string;
  reverse: boolean;
  children: ReactNode;
}

function PreviewRow({
  worldKey,
  headline,
  blurb,
  reverse,
  children,
}: PreviewRowProps) {
  const world = WORLD_BY_KEY[worldKey];
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div className={cn(reverse && "md:order-2")}>
        <Text variant="eyebrow" as="p" tone="tertiary">
          {world.label}
        </Text>
        <Text as="h3" variant="h2" className="mt-3 text-2xl">
          {headline}
        </Text>
        <Text variant="body" tone="secondary" className="mt-3 max-w-md">
          {blurb}
        </Text>
        <Link
          href={`/${world.key}/${world.defaultModule}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-2 transition-colors hover:text-fg-1"
        >
          Open {world.label}
          <Icon name="arrowR" size={14} />
        </Link>
      </div>
      <div className={cn(reverse && "md:order-1")}>{children}</div>
    </div>
  );
}

/** "See it in operation" — real, data-backed previews of each world. */
export function OperationalPreviews() {
  return (
    <section className="border-b border-border bg-inset">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          In the field
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          See it in operation.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          Every preview below is drawn from a live expedition in the system —
          the Torres del Paine Circuit, on the move right now.
        </Text>

        <div className="mt-14 flex flex-col gap-16">
          <PreviewRow
            worldKey="plan"
            headline="Plot the line, read the terrain."
            blurb="A route becomes elevation, checkpoints and timing you can brief from — hazards flagged where the mountain demands respect."
            reverse={false}
          >
            <PlanPreview />
          </PreviewRow>

          <PreviewRow
            worldKey="record"
            headline="Keep a faithful record."
            blurb="Movement, weather, incidents and comms fold into a daybook automatically — a complete account you can hand to anyone."
            reverse
          >
            <RecordPreview />
          </PreviewRow>
        </div>
      </div>
    </section>
  );
}
