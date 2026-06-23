import { useState, useCallback } from "react";

export type MitigationStatus = "pending" | "in-progress" | "done";

const NEXT: Record<MitigationStatus, MitigationStatus> = {
  pending: "in-progress",
  "in-progress": "done",
  done: "pending",
};

export function useMitigationTracking(riskIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, MitigationStatus>>(
    () => Object.fromEntries(riskIds.map((id) => [id, "pending"])),
  );

  const advance = useCallback((riskId: string) => {
    setStatuses((prev) => ({
      ...prev,
      [riskId]: NEXT[prev[riskId] ?? "pending"],
    }));
  }, []);

  const getStatus = useCallback(
    (riskId: string): MitigationStatus => statuses[riskId] ?? "pending",
    [statuses],
  );

  return { getStatus, advance };
}
