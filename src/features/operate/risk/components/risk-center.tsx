"use client";

import { listRisks } from "@/universe";
import { useMitigationTracking } from "../hooks/useMitigationTracking";
import { RiskAnnunciator } from "./risk-annunciator";
import { RiskCard } from "./risk-card";
import { RiskIncidentLog } from "./risk-incident-log";
import { RiskSummary } from "./risk-summary";

export function RiskCenter() {
  const risks = listRisks();
  const { getStatus, advance } = useMitigationTracking(risks.map((r) => r.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-y-auto p-5">
        <div className="w-full grid gap-4 grid-cols-1 lg:grid-cols-[1fr_300px] items-start">
          {/* Left column: summary + annunciator + risk cards */}
          <div className="flex flex-col gap-4">
            <RiskSummary />
            <RiskAnnunciator />
            {risks.map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                mitigationStatus={getStatus(risk.id)}
                onAdvance={() => advance(risk.id)}
              />
            ))}
          </div>

          {/* Right sidebar: incident log */}
          <div className="lg:sticky lg:top-0">
            <RiskIncidentLog />
          </div>
        </div>
      </div>
    </div>
  );
}
