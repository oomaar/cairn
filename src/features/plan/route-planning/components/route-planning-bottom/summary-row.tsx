import { Text } from "@/components/ui";

interface SummaryRowProps {
  label: string;
  value: string;
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between">
      <Text
        variant="caption"
        as="span"
        tone="tertiary"
        className="font-mono uppercase tracking-[0.06em]"
      >
        {label}
      </Text>
      <Text variant="caption" as="span" className="font-mono text-fg-1">
        {value}
      </Text>
    </div>
  );
}
