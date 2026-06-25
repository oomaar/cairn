import { listExpeditions } from "@/universe";
import { BriefingDocument } from "./briefing-document";

export function BriefingsWorkspace() {
  const upcoming = listExpeditions().filter(
    (e) => e.status === "planning" || e.status === "departing",
  );

  return (
    <div className="h-full overflow-y-auto bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
      {/* Margin rule */}
      <div className="pointer-events-none fixed inset-y-0 left-13.5 z-10 hidden w-[1.5px] bg-(--record-margin) opacity-60" />

      <div className="space-y-8 px-5 py-6.5 sm:px-9">
        {/* Sub-header */}
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-base font-bold tracking-tight text-fg-1">
            Pre-departure briefings
          </span>
          <span className="font-mono text-2xs text-fg-3">
            {upcoming.length} expedition{upcoming.length !== 1 ? "s" : ""}{" "}
            pending
          </span>
        </div>

        {upcoming.length === 0 ? (
          <div className="flex items-center justify-center p-16">
            <p className="font-mono text-[10.5px] text-fg-3">
              No upcoming expeditions pending briefing.
            </p>
          </div>
        ) : (
          upcoming.map((expedition, i) => (
            <BriefingDocument
              key={expedition.id}
              expedition={expedition}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
