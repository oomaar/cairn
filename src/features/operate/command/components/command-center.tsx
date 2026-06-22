"use client";

import { CommandExpeditionBoard } from "./command-expedition-board";
import { CommandConditions } from "./command-conditions";
import { CommandAnnunciator } from "./command-annunciator";
import { CommandReadiness } from "./command-readiness";

export function CommandCenter() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-y-auto p-5">
        <div className="w-full grid gap-4 grid-cols-1 lg:grid-cols-[1fr_1fr_300px] lg:grid-rows-[auto_auto] items-start">
          {/* Expedition Status Board — spans 2 cols on desktop */}
          <div className="lg:col-span-2">
            <CommandExpeditionBoard />
          </div>

          {/* Conditions by Range — right sidebar spans 2 rows on desktop */}
          <div className="lg:row-span-2">
            <CommandConditions />
          </div>

          {/* Annunciator + Readiness — bottom row, 2 cols */}
          <div>
            <CommandAnnunciator />
          </div>
          <div>
            <CommandReadiness />
          </div>
        </div>
      </div>
    </div>
  );
}
