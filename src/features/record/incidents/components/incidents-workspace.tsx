import { listExpeditions, getIncidents } from "@/universe";
import { IncidentDocument } from "./incident-document";

export function IncidentsWorkspace() {
  const allIncidents = listExpeditions().flatMap((expedition) =>
    getIncidents(expedition.id).map((incident) => ({ incident, expedition })),
  );

  return (
    <div className="h-full overflow-y-auto bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
      <div className="space-y-8 px-5 py-6.5 sm:px-9">
        {/* Sub-header */}
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-base font-bold tracking-tight text-fg-1">
            Field incident reports
          </span>
          <span className="font-mono text-2xs text-fg-3">
            {allIncidents.length} report
            {allIncidents.length !== 1 ? "s" : ""} on file
          </span>
        </div>

        {allIncidents.length === 0 ? (
          <div className="flex items-center justify-center p-16">
            <p className="font-mono text-[10.5px] text-fg-3">
              No incident reports on file.
            </p>
          </div>
        ) : (
          allIncidents.map(({ incident, expedition }, i) => (
            <IncidentDocument
              key={incident.id}
              incident={incident}
              expedition={expedition}
              serial={i + 1}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
