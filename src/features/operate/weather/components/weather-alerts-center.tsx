"use client";

import { useState } from "react";
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCan } from "@/features/session";
import { useWeatherAlerts } from "../hooks/use-weather-alerts";
import { ALERT_RESPONSE_TYPES } from "../data/ALERT_RESPONSE_TYPES";
import type { AlertResponseType } from "../types/weather-alert.types";
import { WeatherAlertsHeader } from "./weather-alerts-header";

export function WeatherAlertsCenter() {
  const canRespond = useCan("operations:command");
  const { state, displayedAlerts, setFilter, setSortBy, acknowledgeAlert, respondToAlert } =
    useWeatherAlerts();
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [respondingAlertId, setRespondingAlertId] = useState<string | null>(
    null,
  );
  const [selectedResponseType, setSelectedResponseType] =
    useState<AlertResponseType | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  const handleRespond = (alertId: string) => {
    if (selectedResponseType) {
      respondToAlert(alertId, selectedResponseType, responseNotes);
      setRespondingAlertId(null);
      setSelectedResponseType(null);
      setResponseNotes("");
    }
  };

  const getToneColor = (tone?: string) => {
    if (tone === "danger") return "bg-danger/10 border-danger";
    if (tone === "warn") return "bg-warn/10 border-warn";
    return "bg-surface border-border";
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === "active") return "bg-danger/20 text-danger";
    if (status === "acknowledged") return "bg-warn/20 text-warn";
    return "bg-fg-4/20 text-fg-4";
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      <WeatherAlertsHeader state={state} setFilter={setFilter} setSortBy={setSortBy} />

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Text variant="caption" tone="tertiary">
              No weather alerts matching current filters
            </Text>
          </div>
        ) : (
          displayedAlerts.map((alert) => (
            <div key={alert.id}>
              <div
                onClick={() =>
                  setExpandedAlertId(
                    expandedAlertId === alert.id ? null : alert.id,
                  )
                }
                className={cn(
                  "rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm",
                  getToneColor(alert.tone),
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Text className="font-semibold truncate">
                        {alert.title}
                      </Text>
                      <span
                        className={cn(
                          "text-2xs px-2 py-0.5 rounded font-mono",
                          getStatusBadgeColor(alert.status),
                        )}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="block text-2xs mb-1"
                    >
                      {alert.place}
                    </Text>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="block text-2xs"
                    >
                      {alert.window} · {alert.observedAgo}
                    </Text>
                  </div>
                  <div className="flex-none">
                    <Icon
                      name={expandedAlertId === alert.id ? "chevR" : "chevD"}
                      size={16}
                      className="text-fg-3"
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAlertId === alert.id && (
                <div className="mt-2 rounded-lg border border-border bg-inset p-4 space-y-3">
                  <div>
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="text-2xs block mb-1"
                    >
                      Details
                    </Text>
                    <Text className="text-sm">{alert.detail}</Text>
                  </div>

                  {alert.responses.length > 0 && (
                    <div>
                      <Text
                        variant="caption"
                        tone="tertiary"
                        className="text-2xs block mb-2"
                      >
                        Response History
                      </Text>
                      <div className="space-y-2">
                        {alert.responses.map((response, idx) => (
                          <div
                            key={idx}
                            className="text-2xs bg-surface rounded p-2 border border-border-soft"
                          >
                            <div className="font-mono font-semibold text-fg-3">
                              {response.type.toUpperCase()}
                            </div>
                            {response.notes && (
                              <div className="text-fg-3 mt-0.5">
                                {response.notes}
                              </div>
                            )}
                            <div className="text-fg-4 mt-0.5">
                              {response.recordedAt.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons — command/lead only */}
                  {canRespond && alert.status === "active" && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="flex-1 px-3 py-2 rounded border border-border bg-raised hover:bg-raised-hover text-sm font-medium transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => setRespondingAlertId(alert.id)}
                        className="flex-1 px-3 py-2 rounded border border-accent-line bg-accent/10 hover:bg-accent/20 text-sm font-medium transition-colors"
                      >
                        Respond
                      </button>
                    </div>
                  )}

                  {canRespond &&
                    (alert.status === "acknowledged" ||
                    alert.status === "active") &&
                    respondingAlertId === alert.id && (
                      <div className="bg-surface rounded border border-border p-3 space-y-2">
                        <Text
                          variant="caption"
                          tone="tertiary"
                          className="text-2xs block"
                        >
                          Record Response
                        </Text>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            Object.entries(ALERT_RESPONSE_TYPES) as Array<
                              [
                                string,
                                (typeof ALERT_RESPONSE_TYPES)[keyof typeof ALERT_RESPONSE_TYPES],
                              ]
                            >
                          ).map(([key, response]) => (
                            <button
                              key={key}
                              onClick={() =>
                                setSelectedResponseType(
                                  key as AlertResponseType,
                                )
                              }
                              className={cn(
                                "p-2 rounded border text-left transition-all text-2xs",
                                selectedResponseType === key
                                  ? "border-accent bg-accent/10"
                                  : "border-border bg-surface hover:border-border-strong",
                              )}
                            >
                              <div className="font-semibold">
                                {response.label}
                              </div>
                              <div className="text-fg-4 text-2xs">
                                {response.description}
                              </div>
                            </button>
                          ))}
                        </div>

                        <textarea
                          placeholder="Add decision notes..."
                          value={responseNotes}
                          onChange={(e) => setResponseNotes(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-border bg-surface text-sm text-2xs resize-none"
                          rows={2}
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setRespondingAlertId(null);
                              setSelectedResponseType(null);
                              setResponseNotes("");
                            }}
                            className="flex-1 px-2 py-1 rounded border border-border text-2xs font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRespond(alert.id)}
                            disabled={!selectedResponseType}
                            className={cn(
                              "flex-1 px-2 py-1 rounded border text-2xs font-medium transition-colors",
                              selectedResponseType
                                ? "border-accent-line bg-accent/10 hover:bg-accent/20"
                                : "border-border bg-surface text-fg-4 cursor-not-allowed opacity-50",
                            )}
                          >
                            Record
                          </button>
                        </div>
                      </div>
                    )}

                  {alert.status === "resolved" && (
                    <Text
                      variant="caption"
                      tone="tertiary"
                      className="text-2xs text-center py-2"
                    >
                      This alert has been resolved
                    </Text>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
