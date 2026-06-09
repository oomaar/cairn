import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CheckpointStatus } from "@/universe";
import type { PlanStation } from "../route.types";

const STATUS_DOT: Record<CheckpointStatus, string> = {
  done: "bg-(--plan-sage)",
  current: "bg-accent",
  ahead: "border border-border-strong",
};

interface CheckpointListProps {
  stations: PlanStation[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Provided only when the active role may edit the route. */
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

/** The checkpoint manifest for the route — select to inspect; add/remove when
 *  the role allows. Stays in sync with the chart, profile and timeline. */
export function CheckpointList({
  stations,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
}: CheckpointListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 px-4 py-3">
        <Text
          variant="caption"
          as="p"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Checkpoints
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {stations.length}
        </Text>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            title="Add checkpoint"
            aria-label="Add checkpoint"
            className="ml-auto flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-2xs font-semibold text-fg-2 transition-colors hover:border-accent-line hover:text-accent-bright"
          >
            <Icon name="plus" size={12} />
            Add
          </button>
        )}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto pb-2">
        {stations.map((s) => {
          const sel = s.id === selectedId;
          const removable = onRemove && stations.length > 2;
          return (
            <li key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={sel}
                className={cn(
                  "flex w-full items-center gap-2.5 border-l-2 px-3.5 py-2 text-left transition-colors",
                  sel
                    ? "border-accent bg-raised"
                    : "border-transparent hover:bg-raised/60",
                )}
              >
                <span
                  className={cn(
                    "size-2 flex-none rounded-full",
                    STATUS_DOT[s.status],
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1">
                    <Text
                      variant="caption"
                      as="span"
                      className="truncate text-fg-1"
                    >
                      {s.name}
                    </Text>
                    {s.hazard && (
                      <Icon
                        name="alert"
                        size={11}
                        className="flex-none text-(--plan-signal)"
                      />
                    )}
                  </span>
                  <Text
                    variant="caption"
                    as="span"
                    tone="tertiary"
                    className="font-mono text-3xs"
                  >
                    {s.km} km · {s.elevationM} m · {s.eta}
                  </Text>
                </span>
              </button>
              {removable && (
                <button
                  type="button"
                  onClick={() => onRemove(s.id)}
                  title={`Remove ${s.name}`}
                  aria-label={`Remove ${s.name}`}
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-fg-4 opacity-0 transition-opacity hover:text-danger-bright focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Icon name="x" size={13} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
