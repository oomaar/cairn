import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { getComms } from "@/universe";

interface LiveCommsPanelProps {
  expeditionId: string;
}

export function LiveCommsPanel({ expeditionId }: LiveCommsPanelProps) {
  const messages = [...getComms(expeditionId)].reverse().slice(0, 8);

  return (
    <div>
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-2 block font-mono text-2xs uppercase tracking-widest"
      >
        Comms · Teleprinter
      </Text>

      {messages.length === 0 ? (
        <Text variant="caption" tone="tertiary" className="font-mono text-2xs">
          No transmissions
        </Text>
      ) : (
        <div className="space-y-1.5 font-mono">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              <Text
                variant="caption"
                tone="tertiary"
                className="w-12 flex-none text-2xs"
              >
                {msg.time}
              </Text>
              <div
                className={cn(
                  "mt-1 size-1.5 flex-none rounded-full",
                  msg.kind === "alert" ? "bg-danger" : "bg-(--plan-sage)",
                )}
              />
              <Text
                variant="caption"
                tone="secondary"
                className="min-w-0 text-2xs leading-snug"
              >
                {msg.text}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
