import { Text } from "@/components/ui";
import type { Checkpoint, Expedition } from "@/universe";

interface ParticipantCheckinPanelProgressHeaderProps {
  checkpoints: Checkpoint[];
  expedition: Expedition;
}

export function ParticipantCheckinPanelProgressHeader({
  checkpoints,
  expedition,
}: ParticipantCheckinPanelProgressHeaderProps) {
  const doneCount = checkpoints.filter((c) => c.status === "done").length;

  const progressPct =
    checkpoints.length > 0
      ? Math.round((doneCount / checkpoints.length) * 100)
      : 0;

  return (
    <div className="flex-none border-b border-border px-5 py-3">
      <div className="mb-2 flex items-center justify-between">
        <Text
          variant="caption"
          tone="tertiary"
          className="font-mono text-2xs uppercase tracking-widest"
        >
          Route Progress — Day {expedition.dayCurrent} of {expedition.dayTotal}
        </Text>
        <Text variant="caption" tone="tertiary" className="font-mono text-2xs">
          {doneCount}/{checkpoints.length} checkpoints
        </Text>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
