"use client";

import { useSession } from "@/features/session";
import { getExpeditionsForPerson } from "@/universe";
import { aggregateLogs } from "../utils/aggregateLogs";
import { DaybookEntryList } from "./daybook-entry-list";
import { DaybookRegister } from "./daybook-register";

export function DaybookWorkspace() {
  const { can, currentUser } = useSession();

  const allowedIds = can("expeditions:view-all")
    ? undefined
    : getExpeditionsForPerson(currentUser?.id ?? "").map((e) => e.id);

  const entries = aggregateLogs(allowedIds);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_300px]">
      {/* Left: scrollable log entries with ruled paper background */}
      <div className="flex min-h-0 flex-col overflow-hidden border-b border-border lg:border-b-0 lg:border-r bg-[repeating-linear-gradient(var(--record-rule-faint)_0_1px,transparent_1px_30px)]">
        <DaybookEntryList entries={entries} />
      </div>

      {/* Right: operations register */}
      <div className="min-h-0 overflow-hidden">
        <DaybookRegister allowedIds={allowedIds} />
      </div>
    </div>
  );
}
