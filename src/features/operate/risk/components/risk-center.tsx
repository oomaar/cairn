"use client";

import { listRisks } from "@/universe";
import { RiskAnnunciator } from "./risk-annunciator";
import { RiskCard } from "./risk-card";
import { RiskIncidentLog } from "./risk-incident-log";

export function RiskCenter() {
  const risks = listRisks();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-y-auto p-5">
        <div className="w-full grid gap-4 grid-cols-1 lg:grid-cols-[1fr_300px] items-start">
          {/* Left column: annunciator + risk cards */}
          <div className="flex flex-col gap-4">
            <RiskAnnunciator />
            {risks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
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
