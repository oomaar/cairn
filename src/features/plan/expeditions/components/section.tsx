import { Text } from "@/components/ui";

interface SectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
}

export function Section({ title, count, children }: SectionProps) {
  return (
    <section className="border-t border-border-soft px-5 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Text
          variant="caption"
          as="h3"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          {title}
        </Text>
        {count !== undefined && (
          <Text
            variant="caption"
            as="span"
            tone="tertiary"
            className="font-mono"
          >
            {count}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}
