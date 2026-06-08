import Link from "next/link";
import { Icon, Text, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ContourBackdrop } from "./contour-backdrop";

/** Landing hero — the one-line promise and the entry points. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <ContourBackdrop className="text-amber-line opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <Text variant="eyebrow" as="p" tone="tertiary">
            Expedition Operations Platform
          </Text>
          <Text
            as="h1"
            variant="display"
            className="mt-5 text-balance text-5xl md:text-6xl"
          >
            Plan the route. Operate live. Record everything.
          </Text>
          <Text
            variant="body"
            tone="secondary"
            className="mt-6 max-w-xl text-lg"
          >
            Cairn is the operations platform for expedition teams — terrain
            planning, live field command, and a complete operational record, in
            one system built for the field.
          </Text>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/plan/route"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "gap-2.5",
              )}
            >
              Enter operations
              <Icon name="arrowR" size={16} />
            </Link>
            <a
              href="#worlds"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Explore the worlds
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
