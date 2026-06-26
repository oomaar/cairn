import type { LogEntry } from "@/universe";

// Module-level singleton — shared across all components in this browser session.
// Participant submits → store notifies → leader's events feed re-renders.

const _store = new Map<string, LogEntry[]>();
const _listeners = new Set<() => void>();

export function addLocalCheckin(entry: LogEntry): void {
  const existing = _store.get(entry.expeditionId) ?? [];
  _store.set(entry.expeditionId, [entry, ...existing]);
  _listeners.forEach((fn) => fn());
}

export function getLocalCheckins(expeditionId: string): LogEntry[] {
  return _store.get(expeditionId) ?? [];
}

export function subscribeCheckins(fn: () => void): () => void {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
}
