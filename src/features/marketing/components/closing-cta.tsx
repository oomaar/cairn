import Link from "next/link";
import { Icon, Text, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ContourBackdrop } from "./contour-backdrop";

/** Closing call to action — the final push into the operation. */
export function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <ContourBackdrop className="text-amber-line opacity-30" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <Text
          as="h2"
          variant="h1"
          className="max-w-2xl text-balance text-3xl md:text-4xl"
        >
          Take command of your next expedition.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-lg">
          Plan it, run it, and keep the record — without leaving the platform.
        </Text>
        <Link
          href="/plan/route"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "mt-8 gap-2.5",
          )}
        >
          Enter operations
          <Icon name="arrowR" size={16} />
        </Link>
      </div>
    </section>
  );
}
