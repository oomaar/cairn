import { Text } from "@/components/ui";

type StatProps = { label: string; value: string };

export function Stat({ label, value }: StatProps) {
  return (
    <div>
      <Text
        variant="caption"
        as="p"
        tone="tertiary"
        className="font-mono text-3xs uppercase tracking-[0.08em]"
      >
        {label}
      </Text>
      <Text variant="body-sm" as="p" className="mt-0.5 font-semibold">
        {value}
      </Text>
    </div>
  );
}
