import Link from "next/link";
import { Wordmark, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLDS } from "@/features/theme";

/** Public site header: wordmark, world anchors, and the entry CTA. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-app/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" aria-label="Cairn home">
          <Wordmark size={17} />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {WORLDS.map((world) => (
            <a
              key={world.key}
              href="#worlds"
              className="text-sm font-medium text-fg-2 transition-colors hover:text-fg-1"
            >
              {world.label}
            </a>
          ))}
        </nav>

        <Link
          href="/plan/route"
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "ml-auto md:ml-0",
          )}
        >
          Enter operations
        </Link>
      </div>
    </header>
  );
}
