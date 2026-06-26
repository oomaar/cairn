import { Dropdown, Text } from "@/components/ui";
import type { WeatherAlertFilter, WeatherAlertsDashboardState } from "../types/weather-alert.types";

interface WeatherAlertsHeaderProps {
  state: WeatherAlertsDashboardState;
  setFilter: (filter: WeatherAlertFilter) => void;
  setSortBy: (sortBy: "severity" | "time" | "expeditionName") => void;
}

export function WeatherAlertsHeader({ state, setFilter, setSortBy }: WeatherAlertsHeaderProps) {
  const activeCounts = {
    active: state.allAlerts.filter((a) => a.status === "active").length,
    acknowledged: state.allAlerts.filter((a) => a.status === "acknowledged").length,
    resolved: state.allAlerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <div className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <Text variant="title" className="text-2xl">
          Weather Alerts
        </Text>
      </div>

      {/* Alert Counts */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="size-2 bg-danger rounded-full animate-pulse" />
          <Text variant="caption" tone="tertiary">
            {activeCounts.active} Active
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 bg-warn rounded-full" />
          <Text variant="caption" tone="tertiary">
            {activeCounts.acknowledged} Acknowledged
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 bg-fg-4 rounded-full" />
          <Text variant="caption" tone="tertiary">
            {activeCounts.resolved} Resolved
          </Text>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="w-32">
          <label className="text-2xs text-fg-4 block mb-1">Severity</label>
          <Dropdown
            value={state.filter.severity || "all"}
            options={[
              { value: "all", label: "All" },
              { value: "danger", label: "Danger" },
              { value: "warn", label: "Warning" },
              { value: "info", label: "Info" },
            ]}
            onChange={(val) =>
              setFilter({
                ...state.filter,
                severity:
                  val === "all"
                    ? undefined
                    : (val as "danger" | "warn" | "info"),
              })
            }
          />
        </div>

        <div className="w-44">
          <label className="text-2xs text-fg-4 block mb-1">Status</label>
          <Dropdown
            value={state.filter.status || "all"}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "acknowledged", label: "Acknowledged" },
              { value: "resolved", label: "Resolved" },
            ]}
            onChange={(val) =>
              setFilter({
                ...state.filter,
                status:
                  val === "all"
                    ? undefined
                    : (val as "active" | "acknowledged" | "resolved"),
              })
            }
          />
        </div>

        <div className="w-36">
          <label className="text-2xs text-fg-4 block mb-1">Sort By</label>
          <Dropdown
            value={state.sortBy}
            options={[
              { value: "severity", label: "Severity" },
              { value: "time", label: "Time" },
              { value: "expeditionName", label: "Expedition" },
            ]}
            onChange={(val) =>
              setSortBy(val as "severity" | "time" | "expeditionName")
            }
          />
        </div>
      </div>
    </div>
  );
}
