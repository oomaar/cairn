"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlanStation } from "../types/route.types";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/**
 * Shared "live party" progress — the fraction of total route distance the
 * party has reached, advancing slowly along the current leg. Used by both the
 * chart and the elevation profile so they move in lockstep. Deterministic on
 * first render (static at the leg start) and disabled under reduced motion.
 */
export function usePartyProgress(stations: PlanStation[]): number {
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq?.matches);
    apply();
    if (mq && !mq.matches) {
      let dir = 1;
      const id = window.setInterval(() => {
        setPhase((p) => {
          const next = p + dir * 0.02;
          if (next >= 1 || next <= 0) dir = -dir;
          return clamp(next, 0, 1);
        });
      }, 90);
      return () => window.clearInterval(id);
    }
  }, []);

  return useMemo(() => {
    if (stations.length < 2) return 0;
    const total = stations[stations.length - 1].km || 1;
    const cur = stations.findIndex((s) => s.status === "current");
    const base = cur >= 0 ? stations[cur].km / total : 0;
    const end =
      cur >= 0 && cur < stations.length - 1
        ? stations[cur + 1].km / total
        : base;
    return reduced ? base : base + (end - base) * 0.65 * phase;
  }, [stations, phase, reduced]);
}
