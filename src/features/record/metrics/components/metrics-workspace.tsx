import { getIncidents, listExpeditions } from "@/universe";
import { SectionHeader } from "./section-header";
import { MetricBlock } from "./metric-block";

export function MetricsWorkspace() {
  const expeditions = listExpeditions();

  const total = expeditions.length;
  const inField = expeditions.filter((e) => e.status === "in-field").length;
  const complete = expeditions.filter((e) => e.status === "complete").length;
  const planning = expeditions.filter(
    (e) => e.status === "planning" || e.status === "departing",
  ).length;

  const completedExps = expeditions.filter((e) => e.status === "complete");
  const successCount = completedExps.filter(
    (e) => e.statusTone !== "warn",
  ).length;
  const completionRate =
    complete > 0 ? Math.round((successCount / complete) * 100) : 0;

  const totalKm = expeditions.reduce((s, e) => s + e.distanceKm, 0);
  const completedKm = completedExps.reduce((s, e) => s + e.distanceKm, 0);
  const totalGain = completedExps.reduce((s, e) => s + e.gainM, 0);
  const avgDistance = complete > 0 ? Math.round(completedKm / complete) : 0;

  const totalPax = expeditions.reduce((s, e) => s + e.filled, 0);
  const inFieldPax = expeditions
    .filter((e) => e.status === "in-field")
    .reduce((s, e) => s + e.filled, 0);
  const avgParty = total > 0 ? Math.round((totalPax / total) * 10) / 10 : 0;

  const allIncidents = expeditions.flatMap((e) => getIncidents(e.id));
  const criticalIncidents = allIncidents.filter(
    (i) => i.tone === "danger",
  ).length;
  const expWithIncidents = new Set(allIncidents.map((i) => i.expeditionId))
    .size;

  const gradeCount = {
    moderate: expeditions.filter((e) => e.grade === "moderate").length,
    strenuous: expeditions.filter((e) => e.grade === "strenuous").length,
    expert: expeditions.filter((e) => e.grade === "expert").length,
  };

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
      {/* Margin rule */}
      <div className="pointer-events-none absolute inset-y-0 left-13.5 z-10 w-[1.5px] bg-(--record-margin) opacity-60" />

      <div className="h-full overflow-y-auto">
        <div className="px-5 py-5 sm:px-9 lg:px-19 lg:pr-9">
          {/* Sub-header */}
          <div className="mb-6 flex items-baseline gap-3 border-b-2 border-fg-2 pb-4">
            <span className="font-sans text-base font-bold tracking-tight text-fg-1">
              Expedition metrics
            </span>
            <span className="font-mono text-2xs text-fg-3">
              All-time · {total} expeditions on record
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-4">
            <SectionHeader>Operations</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 sm:col-span-3 sm:grid-cols-3 sm:gap-x-10 lg:col-span-4 lg:grid-cols-4">
              <MetricBlock label="Total expeditions" value={total} />
              <MetricBlock
                label="Currently in field"
                value={inField}
                sub={`${inFieldPax} participants active`}
              />
              <MetricBlock
                label="Completed"
                value={complete}
                sub={`${planning} upcoming`}
              />
              <MetricBlock
                label="Completion rate"
                value={`${completionRate}%`}
                sub={`${successCount} of ${complete} full completions`}
              />
            </div>

            <SectionHeader>Distance & terrain</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 sm:col-span-3 sm:grid-cols-3 sm:gap-x-10 lg:col-span-4 lg:grid-cols-4">
              <MetricBlock
                label="Total distance planned"
                value={totalKm.toLocaleString()}
                unit="km"
              />
              <MetricBlock
                label="Distance completed"
                value={completedKm.toLocaleString()}
                unit="km"
                sub={`avg ${avgDistance} km per expedition`}
              />
              <MetricBlock
                label="Elevation gained"
                value={`▲ ${totalGain.toLocaleString()}`}
                unit="m"
                sub="completed expeditions"
              />
            </div>

            <SectionHeader>Participants</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 sm:col-span-3 sm:grid-cols-3 sm:gap-x-10 lg:col-span-4 lg:grid-cols-4">
              <MetricBlock
                label="Total participants"
                value={totalPax}
                sub="across all expeditions"
              />
              <MetricBlock label="Avg party size" value={avgParty} unit="pax" />
            </div>

            <SectionHeader>Grade distribution</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 sm:col-span-3 sm:grid-cols-3 sm:gap-x-10 lg:col-span-4 lg:grid-cols-4">
              <MetricBlock
                label="Moderate"
                value={gradeCount.moderate}
                sub="expeditions"
              />
              <MetricBlock
                label="Strenuous"
                value={gradeCount.strenuous}
                sub="expeditions"
              />
              <MetricBlock
                label="Expert"
                value={gradeCount.expert}
                sub="expeditions"
              />
            </div>

            <SectionHeader>Incident record</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 sm:col-span-3 sm:grid-cols-3 sm:gap-x-10 lg:col-span-4 lg:grid-cols-4">
              <MetricBlock
                label="Incidents filed"
                value={allIncidents.length}
                sub={`across ${expWithIncidents} expeditions`}
              />
              <MetricBlock
                label="Critical incidents"
                value={criticalIncidents}
                sub="category 3"
              />
              <MetricBlock
                label="Incident rate"
                value={
                  complete > 0
                    ? `${Math.round((expWithIncidents / complete) * 100)}%`
                    : "—"
                }
                sub="of completed expeditions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
