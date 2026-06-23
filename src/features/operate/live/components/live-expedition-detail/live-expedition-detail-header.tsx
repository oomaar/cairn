import { Icon, Text } from "@/components/ui";
import type { Expedition } from "@/universe";

interface LiveExpeditionDetailHeaderProps {
  expedition: Expedition;
  onClose: () => void;
}

export function LiveExpeditionDetailHeader({
  expedition,
  onClose,
}: LiveExpeditionDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-3">
      <div className="min-w-0 flex-1">
        <Text variant="title" className="text-lg">
          {expedition.name}
        </Text>
        <Text variant="caption" tone="tertiary" className="font-mono">
          {expedition.region}, {expedition.country}
        </Text>
      </div>
      <button
        onClick={onClose}
        className="flex-none rounded p-1 transition-colors hover:bg-raised"
      >
        <Icon name="x" size={18} />
      </button>
    </div>
  );
}
