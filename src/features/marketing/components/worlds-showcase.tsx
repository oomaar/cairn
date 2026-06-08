import Link from "next/link";
import { Icon, Text, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLDS } from "@/features/theme";
import { WORLD_ACCENT } from "../marketing.constants";

/** The three operational worlds, each linking into its default workspace. */
export function WorldsShowcase() {
  return (
    <section id="worlds" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          The platform
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          Three worlds, one operation.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          Every expedition moves through the same arc — planned, run, and
          recorded. Cairn gives each phase a workspace built for it.
        </Text>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {WORLDS.map((world) => {
            const accent = WORLD_ACCENT[world.key];
            return (
              <Link
                key={world.key}
                href={`/${world.key}/${world.defaultModule}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-lg",
                    accent.chip,
                    accent.text,
                  )}
                >
                  <Icon name={world.icon as IconName} size={22} />
                </span>
                <Text as="h3" variant="title" className="mt-5">
                  {world.label}
                </Text>
                <Text variant="body-sm" tone="secondary" className="mt-1.5">
                  {world.description}.
                </Text>

                <ul className="mt-5 flex flex-col gap-1.5 border-t border-border-soft pt-4">
                  {world.modules.map((m) => (
                    <li key={m.key} className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1 rounded-full",
                          accent.text,
                          "bg-current",
                        )}
                      />
                      <Text variant="caption" as="span" tone="tertiary">
                        {m.label}
                      </Text>
                    </li>
                  ))}
                </ul>

                <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-fg-2 transition-colors group-hover:text-fg-1">
                  Open {world.label}
                  <Icon name="arrowR" size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
