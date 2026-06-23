import { cn } from "@/lib/cn";
import { getLeader, getPerson } from "@/universe";
import type { Expedition, Incident } from "@/universe";
import { DocField } from "../../components/doc-field";
import { STAMP_CLASSES } from "../data/STAMP_CLASSES";
import { SEVERITY } from "../data/SEVERITY";

interface IncidentDocumentProps {
  incident: Incident;
  expedition: Expedition;
  serial: number;
  index: number;
}

export function IncidentDocument({
  incident,
  expedition,
  serial,
  index,
}: IncidentDocumentProps) {
  const leader = getLeader(expedition.id);
  const subject = incident.subjectPersonId
    ? getPerson(incident.subjectPersonId)
    : null;

  const rotate = index % 2 ? "-rotate-[3deg]" : "rotate-[4deg]";
  const stampClasses =
    STAMP_CLASSES[incident.tone] ?? "border-border text-fg-3";

  const irNumber = `IR-2026-${String(serial).padStart(3, "0")}`;
  const severity = SEVERITY[incident.tone] ?? "—";
  const personLabel = subject ? `${subject.name}, Participant` : "—";

  return (
    <div className="mx-auto max-w-195 border border-border bg-surface px-11 py-8.5 shadow-card">
      {/* Doc header */}
      <div className="mb-4.5 flex items-start border-b-2 border-fg-1 pb-3.5">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-fg-3">
            Field Incident Report
          </div>
          <h2 className="mt-0.75 font-sans text-2xl font-bold leading-tight text-fg-1">
            {irNumber}
          </h2>
          <p className="mt-1 text-sm text-fg-2">{incident.title}</p>
        </div>
        <div className="ml-auto pt-1.5">
          <span
            className={cn(
              "inline-block rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
              stampClasses,
              rotate,
            )}
          >
            {incident.status}
          </span>
        </div>
      </div>

      {/* 2-col fields */}
      <div className="grid grid-cols-1 gap-x-7 sm:grid-cols-2">
        <DocField label="Expedition" value={expedition.name} />
        <DocField label="Date / Time" value={incident.timeLabel} />
        <DocField label="Location" value={expedition.region} />
        <DocField
          label="Reported By"
          value={leader ? `${leader.name}, Field Leader` : "—"}
        />
        <DocField label="Person Involved" value={personLabel} />
        <DocField label="Severity" value={severity} />
      </div>

      {/* Narrative */}
      <div className="mt-5">
        <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
          Narrative
        </div>
        <p className="m-0 text-sm leading-relaxed text-fg-2">
          {incident.detail}
        </p>
      </div>

      {/* Signature block */}
      <div className="mt-6.5 flex gap-10 border-t border-border pt-4.5">
        {[
          ["Field Leader", leader?.name],
          ["Reviewed — Operations", "E. Vargas"],
        ].map(([role, name]) => (
          <div key={role} className="flex-1">
            <div className="h-7.5 border-b border-fg-3" />
            <div className="mt-1.25 font-mono text-3xs uppercase text-fg-3">
              {role}
            </div>
            <div className="mt-0.5 text-[13px] font-semibold text-fg-1">
              {name ?? "—"}
              <span className="ml-1.5 font-normal text-fg-3">
                · {incident.timeLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
