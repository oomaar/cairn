import { cn } from "@/lib/cn";
import {
  getDebrief,
  getIncidents,
  getLeader,
  type Expedition,
} from "@/universe";
import { dateRangeLabel } from "../utils/dateRangeLabel";
import { STAMP_CLASSES } from "../data/STAMP_CLASSES";
import { StatCell } from "./stat-cell";
import { INCIDENT_DOT } from "../data/INCIDENT_DOT";

interface ExpeditionDetailPanelProps {
  expedition: Expedition | undefined;
}

export function ExpeditionDetailPanel({
  expedition,
}: ExpeditionDetailPanelProps) {
  if (!expedition) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-[10.5px] text-fg-4">
          Select an expedition to view its record.
        </p>
      </div>
    );
  }

  const leader = getLeader(expedition.id);
  const debrief = getDebrief(expedition.id);
  const incidents = getIncidents(expedition.id);
  const dateRange = dateRangeLabel(expedition.departLabel, expedition.dayTotal);
  const rotate = "rotate-[4deg]";
  const stampClasses =
    STAMP_CLASSES[expedition.statusTone] ?? "border-border text-fg-3";

  return (
    <div className="h-full overflow-y-auto bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
      <div className="px-7 py-6">
        {/* Detail header */}
        <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-fg-1 pb-4">
          <div>
            <div className="font-mono text-3xs uppercase tracking-eyebrow text-fg-3">
              Expedition Record
            </div>
            <h2 className="mt-1 font-sans text-xl font-bold leading-tight text-fg-1">
              {expedition.name}
            </h2>
            <p className="mt-0.5 font-mono text-3xs text-fg-3">
              {expedition.region} · {expedition.country}
            </p>
          </div>
          <span
            className={cn(
              "mt-1 inline-block flex-none rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
              stampClasses,
              rotate,
            )}
          >
            {expedition.statusLabel}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-6">
          <StatCell label="Date range" value={dateRange} />
          <StatCell label="Field Leader" value={leader?.name ?? "—"} />
          <StatCell label="Distance" value={`${expedition.distanceKm} km`} />
          <StatCell label="Duration" value={`${expedition.dayTotal} days`} />
          <StatCell
            label="Party"
            value={`${expedition.filled} / ${expedition.capacity} pax`}
          />
          <StatCell
            label="Grade"
            value={`${expedition.grade.charAt(0).toUpperCase()}${expedition.grade.slice(1)}`}
          />
          <StatCell
            label="Elevation gain"
            value={`▲ ${expedition.gainM.toLocaleString()} m`}
          />
          <StatCell label="Departure" value={expedition.departLabel} />
        </div>

        {/* Debrief sections */}
        {debrief ? (
          <>
            <Section title="Outcome" body={debrief.outcome} />
            <Section title="Field Leader Notes" body={debrief.leaderNotes} />

            <div className="mt-5">
              <SectionLabel>Lessons Learned</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {debrief.lessonsLearned.map((lesson, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-relaxed text-fg-2"
                  >
                    <span className="mt-1.25 size-1.5 flex-none rounded-full bg-fg-4" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="mt-5 border-t border-border pt-4">
            <p className="font-mono text-3xs text-fg-4 italic">
              Debrief pending — expedition in progress.
            </p>
          </div>
        )}

        {/* Incidents */}
        <div className="mt-5 border-t border-border pt-4">
          <SectionLabel>
            Incidents Filed{" "}
            <span className="ml-1 text-fg-4">({incidents.length})</span>
          </SectionLabel>
          {incidents.length === 0 ? (
            <p className="mt-2 font-mono text-[10.5px] text-fg-4">
              None filed.
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {incidents.map((inc) => (
                <div key={inc.id} className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "mt-1.5 size-1.5 flex-none rounded-full",
                      INCIDENT_DOT[inc.tone] ?? "bg-fg-4",
                    )}
                  />
                  <div>
                    <div className="text-sm text-fg-1">{inc.title}</div>
                    <div className="font-mono text-3xs text-fg-4">
                      {inc.timeLabel} · {inc.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signature */}
        {debrief && (
          <div className="mt-6 border-t border-border pt-4">
            <div className="h-6 border-b border-fg-3" />
            <div className="mt-1.5 font-mono text-3xs uppercase text-fg-3">
              Field Leader · {leader?.name ?? "—"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-3xs uppercase tracking-eyebrow text-fg-3">
      {children}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 border-t border-border pt-4">
      <SectionLabel>{title}</SectionLabel>
      <p className="mt-2 text-sm leading-relaxed text-fg-2">{body}</p>
    </div>
  );
}
