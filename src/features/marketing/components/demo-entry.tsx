"use client";

import { useRouter } from "next/navigation";
import { Avatar, Icon, Text, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ROLES, persistDemoRole, type RoleKey } from "@/features/session";
import { getPerson, type Tone } from "@/universe";

const ROLE_BLURB: Record<RoleKey, string> = {
  director:
    "Full operational command — every expedition, risk, roster and broadcast across the organization.",
  lead: "Run one expedition from the field — command the day, send comms, log incidents and write the record.",
  participant:
    "On the trail — follow the plan, see the route and weather, and check in.",
};

const ROLE_TAG: Record<RoleKey, string> = {
  director: "Full access",
  lead: "Field command",
  participant: "Trail view",
};

const AVATAR_TONE = (tone: Tone): "amber" | "olive" | "slate" | "quiet" =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

/**
 * DEMO entry — there's no sign-up. Pick a vantage point; the choice is
 * persisted as the demo identity and carried into the operation.
 */
export function DemoEntry() {
  const router = useRouter();

  const enter = (role: RoleKey) => {
    persistDemoRole(role);
    router.push("/plan/route");
  };

  return (
    <section id="enter" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          Enter the demo
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          Choose your vantage point.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          Cairn is a live demo backed by a real operational universe. Pick a
          role to enter — you can switch any time from the spine.
        </Text>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ROLES.map((role) => {
            const person = getPerson(role.personId);
            return (
              <article
                key={role.key}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={role.initials}
                      size="lg"
                      tone={person ? AVATAR_TONE(person.tone) : "quiet"}
                    />
                    <div className="min-w-0 flex-1">
                      <Text as="p" variant="title" className="truncate text-lg">
                        {role.label}
                      </Text>
                      <Text
                        variant="caption"
                        as="p"
                        tone="tertiary"
                        className="truncate font-mono"
                      >
                        {person?.name}
                      </Text>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="inline-flex whitespace-nowrap rounded-pill bg-accent-tint px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.04em] text-accent-bright">
                      {ROLE_TAG[role.key]}
                    </span>
                  </div>

                  <Text variant="body-sm" tone="secondary" className="mt-3">
                    {ROLE_BLURB[role.key]}
                  </Text>
                </div>

                <button
                  type="button"
                  onClick={() => enter(role.key)}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "md" }),
                    "mt-6 w-full justify-between text-fg-2 transition-colors group-hover:border-accent-line group-hover:bg-accent-tint group-hover:text-accent-bright",
                  )}
                >
                  Enter as {role.label}
                  <Icon name="arrowR" size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
