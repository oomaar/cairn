import { Text } from "@/components/ui";
import { WORLD_BY_KEY } from "@/features/theme";
import { getExpedition, getLogbook, getPerson } from "@/universe";
import { PreviewFrame } from "./preview-frame";
import {
  FieldLogPanel,
  type FieldLogEntry,
  type FieldLogSnapshot,
} from "./field-log-panel";

const DateTag = () => (
  <span className="font-mono text-3xs uppercase tracking-widest text-fg-3">
    08 Jun
  </span>
);

/**
 * Field log showcase — the daybook for the headline expedition, woven from its
 * movement, weather, incidents and comms. Each entry resolves its author from
 * the universe; filter by kind to read one thread of the record.
 */
export function FieldLog() {
  const expedition = getExpedition("tdp");
  const log = getLogbook("tdp");
  if (!expedition || log.length === 0) return null;

  const entries: FieldLogEntry[] = log.map((entry) => ({
    id: entry.id,
    time: entry.time,
    kind: entry.kind,
    title: entry.title,
    detail: entry.detail,
    authorInitials: entry.authorId
      ? (getPerson(entry.authorId)?.initials ?? "—")
      : "—",
  }));

  const snapshot: FieldLogSnapshot = {
    expeditionName: expedition.name,
    day: expedition.dayCurrent,
    entries,
  };

  return (
    <section className="border-b border-border bg-inset">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          The field log
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          Nothing is lost.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          Movement, weather, incidents and comms fold into one daybook
          automatically. Filter the record to follow a single thread.
        </Text>

        <div className="mt-10">
          <PreviewFrame
            world={WORLD_BY_KEY.record}
            title="Record · Daybook"
            status={<DateTag />}
          >
            <FieldLogPanel snapshot={snapshot} />
          </PreviewFrame>
        </div>
      </div>
    </section>
  );
}
