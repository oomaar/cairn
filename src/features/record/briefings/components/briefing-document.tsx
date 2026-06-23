import { cn } from "@/lib/cn";
import { getLeader, getWeather } from "@/universe";
import type { Expedition } from "@/universe";
import { DocField } from "./doc-field";
import { RISK_BY_GRADE } from "../data/RISK_BY_GRADE";
import { EQUIPMENT_BY_GRADE } from "../data/EQUIPMENT_BY_GRADE";

interface BriefingDocumentProps {
  expedition: Expedition;
  index: number;
}

export function BriefingDocument({ expedition, index }: BriefingDocumentProps) {
  const leader = getLeader(expedition.id);
  const weatherAlerts = getWeather(expedition.id);

  const rotate = index % 2 ? "-rotate-[3deg]" : "rotate-[4deg]";

  const party = `${expedition.filled} participants · Grade ${expedition.grade.charAt(0).toUpperCase()}${expedition.grade.slice(1)}`;
  const duration = `${expedition.dayTotal} days · ${expedition.distanceKm} km · ▲${expedition.gainM.toLocaleString()} m`;

  const weatherText =
    weatherAlerts.length > 0
      ? weatherAlerts
          .slice(0, 2)
          .map((w) => w.detail)
          .join(" ")
      : "No active alerts. Conditions nominal for the departure window. Monitor 48-hour forecast on approach.";

  const objective = `${expedition.name} through ${expedition.region}, ${expedition.country}. Self-sufficient for ${expedition.dayTotal} days with resupply at designated waypoints. Party certified to ${expedition.grade} grade.`;

  return (
    <div className="mx-auto max-w-195 border border-border bg-surface px-11 py-8.5 shadow-card">
      {/* Doc header */}
      <div className="mb-4.5 flex items-start border-b-2 border-fg-1 pb-3.5">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-fg-3">
            Pre-Departure Briefing
          </div>
          <h2 className="mt-0.75 font-sans text-2xl font-bold leading-tight text-fg-1">
            {expedition.name}
          </h2>
        </div>
        <div className="ml-auto pt-1.5">
          <span
            className={cn(
              "inline-block rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
              "border-ok text-ok",
              rotate,
            )}
          >
            Issued
          </span>
        </div>
      </div>

      {/* 2-col fields */}
      <div className="grid grid-cols-1 gap-x-7 sm:grid-cols-2">
        <DocField
          label="Departure"
          value={`${expedition.departLabel} · ${expedition.coordsLabel}`}
        />
        <DocField label="Field Leader" value={leader?.name ?? "—"} />
        <DocField label="Party" value={party} />
        <DocField label="Duration" value={duration} />
      </div>

      {/* Text sections */}
      {(
        [
          ["Objective", objective],
          ["Weather Outlook", weatherText],
          ["Risk Notes", RISK_BY_GRADE[expedition.grade]],
          ["Equipment", EQUIPMENT_BY_GRADE[expedition.grade]],
        ] as [string, string][]
      ).map(([title, text]) => (
        <div key={title} className="mt-4">
          <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-3">
            {title}
          </div>
          <p className="m-0 text-sm leading-relaxed text-fg-2">{text}</p>
        </div>
      ))}

      {/* Signature line */}
      <div className="mt-6.5 flex gap-10 border-t border-border pt-4.5">
        <div className="flex-1">
          <div className="h-7.5 border-b border-fg-3" />
          <div className="mt-1.25 font-mono text-3xs uppercase text-fg-3">
            Briefing Acknowledged — All Participants
          </div>
        </div>
      </div>
    </div>
  );
}
