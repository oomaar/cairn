"use client";

import { useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getGearManifest,
  listGear,
  type GearItem,
  type GearManifestEntry,
} from "@/universe";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

interface EquipmentManagerProps {
  expeditionId: string;
  canManage: boolean;
}

function StepButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  icon: "plus" | "minus";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-5 flex-none place-items-center rounded border border-border text-fg-3 transition-colors hover:text-fg-1 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon name={icon} size={11} />
    </button>
  );
}

/** Equipment requirements — read-only manifest, or an editable requirements
 *  manager (adjust quantities, remove, add from the catalog) when allowed. */
export function EquipmentManager({
  expeditionId,
  canManage,
}: EquipmentManagerProps) {
  const [manifest, setManifest] = useState<GearManifestEntry[]>(() =>
    getGearManifest(expeditionId),
  );
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

  if (!canManage && manifest.length === 0) return null;

  const onManifest = new Set(manifest.map((m) => m.item.id));
  const q = query.trim().toLowerCase();
  const catalog = listGear().filter(
    (g) =>
      !onManifest.has(g.id) &&
      (!q ||
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)),
  );

  const setQty = (itemId: string, qty: number) =>
    setManifest((prev) =>
      prev.map((m) =>
        m.item.id === itemId
          ? {
              ...m,
              allocation: {
                ...m.allocation,
                quantity: clamp(qty, 1, m.item.total),
              },
            }
          : m,
      ),
    );
  const remove = (itemId: string) =>
    setManifest((prev) => prev.filter((m) => m.item.id !== itemId));
  const add = (item: GearItem) =>
    setManifest((prev) => [
      ...prev,
      {
        allocation: {
          id: `alloc-${item.id}-${expeditionId}`,
          gearItemId: item.id,
          expeditionId,
          quantity: 1,
        },
        item,
      },
    ]);

  return (
    <section className="border-t border-border-soft px-5 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Text
          variant="caption"
          as="h3"
          tone="tertiary"
          className="font-mono uppercase tracking-widest"
        >
          Equipment requirements
        </Text>
        <Text variant="caption" as="span" tone="tertiary" className="font-mono">
          {manifest.length}
        </Text>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            aria-pressed={adding}
            className="ml-auto flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-2xs font-semibold text-fg-2 transition-colors hover:border-accent-line hover:text-accent-bright"
          >
            <Icon name="plus" size={12} />
            Add
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {manifest.map(({ allocation, item }) => (
          <li key={allocation.id} className="flex items-center gap-2.5">
            <div className="min-w-0 flex-1">
              <Text variant="caption" as="p" className="truncate text-fg-1">
                {item.name}
              </Text>
              <Text
                variant="caption"
                as="p"
                tone="tertiary"
                className="font-mono text-3xs uppercase"
              >
                {item.category} · {item.ready} ready
              </Text>
            </div>
            {canManage ? (
              <>
                <span className="flex items-center gap-1.5">
                  <StepButton
                    label={`Fewer ${item.name}`}
                    icon="minus"
                    disabled={allocation.quantity <= 1}
                    onClick={() => setQty(item.id, allocation.quantity - 1)}
                  />
                  <Text
                    variant="caption"
                    as="span"
                    className="w-6 text-center font-mono text-fg-1"
                  >
                    {allocation.quantity}
                  </Text>
                  <StepButton
                    label={`More ${item.name}`}
                    icon="plus"
                    disabled={allocation.quantity >= item.total}
                    onClick={() => setQty(item.id, allocation.quantity + 1)}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="grid size-5 flex-none place-items-center rounded text-fg-4 transition-colors hover:text-danger-bright"
                >
                  <Icon name="x" size={12} />
                </button>
              </>
            ) : (
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="font-mono"
              >
                ×{allocation.quantity}
              </Text>
            )}
          </li>
        ))}
      </ul>

      {canManage && adding && (
        <div className="mt-3 rounded-md border border-border bg-inset p-2.5">
          <div className="flex items-center gap-2 border-b border-border-soft pb-2">
            <Icon name="search" size={13} className="text-fg-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Add equipment from the catalog…"
              aria-label="Search equipment catalog"
              className="h-6 flex-1 bg-transparent text-sm text-fg-1 outline-none placeholder:text-fg-4"
            />
          </div>
          <ul className="mt-2 flex max-h-40 flex-col gap-0.5 overflow-y-auto">
            {catalog.length === 0 ? (
              <li className="px-1 py-1">
                <Text variant="caption" as="span" tone="tertiary">
                  Everything in the catalog is already on the manifest.
                </Text>
              </li>
            ) : (
              catalog.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => add(item)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left transition-colors hover:bg-raised",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <Text
                        variant="caption"
                        as="span"
                        className="block truncate text-fg-2"
                      >
                        {item.name}
                      </Text>
                      <Text
                        variant="caption"
                        as="span"
                        tone="tertiary"
                        className="font-mono text-3xs uppercase"
                      >
                        {item.category} · {item.ready}/{item.total}
                      </Text>
                    </span>
                    <Icon
                      name="plus"
                      size={13}
                      className="flex-none text-fg-4"
                    />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
