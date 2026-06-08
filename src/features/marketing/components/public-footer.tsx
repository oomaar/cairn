import { Text, Wordmark } from "@/components/ui";
import { getOperator } from "@/universe";

/** Public site footer. */
export function PublicFooter() {
  const operator = getOperator();

  return (
    <footer className="bg-app">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Wordmark size={16} />
          <Text variant="caption" as="p" tone="tertiary">
            Plan · Operate · Record — expedition operations by {operator.name}.
          </Text>
        </div>
        <Text variant="caption" as="p" tone="meta">
          © 2026 Cairn. Built for the field.
        </Text>
      </div>
    </footer>
  );
}
