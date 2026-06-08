import { Text } from "@/components/ui";

interface Principle {
  title: string;
  body: string;
}

/** The three convictions behind the platform — drawn from how Cairn is built:
 *  workflows over readouts, a living operational world, one continuous system. */
const PRINCIPLES: readonly Principle[] = [
  {
    title: "Operations, not dashboards",
    body: "Every screen supports a decision — planning a line, holding at a pass, clearing a checkpoint. Numbers earn their place by driving an action.",
  },
  {
    title: "A world that stays alive",
    body: "Weather turns, routes progress, teams move. The operation keeps running whether or not someone is watching — and Cairn keeps the record.",
  },
  {
    title: "One system, end to end",
    body: "From the first contour to the final log, planning, command and record share one source of truth. No handoffs, no export, no gaps.",
  },
];

/** Mission statement — why Cairn exists, stated plainly. */
export function Mission() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Text variant="eyebrow" as="p" tone="tertiary">
          Our mission
        </Text>

        <Text
          as="p"
          variant="h1"
          className="mt-6 max-w-3xl text-balance text-2xl leading-snug md:text-3xl"
        >
          An expedition is an operation — planned, run, and accounted for. Cairn
          exists to run it: to turn maps, weather, people and risk into one
          coordinated effort, and to keep a faithful record of every decision
          made in the field.
        </Text>

        <div className="mt-14 grid gap-x-10 gap-y-10 border-t border-border-soft pt-12 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="flex flex-col gap-2.5">
              <Text as="h3" variant="title" className="text-lg">
                {principle.title}
              </Text>
              <Text variant="body-sm" tone="secondary">
                {principle.body}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
