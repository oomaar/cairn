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
  onMove?: (fromIndex: number, toIndex: number) => void;
}

/** The checkpoint manifest for the route — select to inspect; add/remove when
 *  the role allows. Stays in sync with the chart, profile and timeline. */
export function CheckpointList({
  stations,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
  onMove,
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
        {stations.map((s, i) => {
          const sel = s.id === selectedId;
          const removable = onRemove && stations.length > 2;
          const editable = !!onMove || !!removable;
          return (
            <li key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={sel}
                className={cn(
                  "flex w-full items-center gap-2.5 border-l-2 px-3.5 py-2 text-left transition-colors",
                  editable && "pr-20",
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
              {editable && (
                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                  {onMove && (
                    <>
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => onMove(i, i - 1)}
                        title="Move up"
                        aria-label={`Move ${s.name} up`}
                        className="grid size-6 place-items-center rounded text-fg-4 transition-colors hover:text-fg-1 disabled:pointer-events-none disabled:opacity-25"
                      >
                        <Icon name="chevD" size={13} className="rotate-180" />
                      </button>
                      <button
                        type="button"
                        disabled={i === stations.length - 1}
                        onClick={() => onMove(i, i + 1)}
                        title="Move down"
                        aria-label={`Move ${s.name} down`}
                        className="grid size-6 place-items-center rounded text-fg-4 transition-colors hover:text-fg-1 disabled:pointer-events-none disabled:opacity-25"
                      >
                        <Icon name="chevD" size={13} />
                      </button>
                    </>
                  )}
                  {removable && (
                    <button
                      type="button"
                      onClick={() => onRemove(s.id)}
                      title={`Remove ${s.name}`}
                      aria-label={`Remove ${s.name}`}
                      className="grid size-6 place-items-center rounded text-fg-4 transition-colors hover:text-danger-bright"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
