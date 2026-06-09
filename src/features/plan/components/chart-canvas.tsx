"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  CHART_H,
  CHART_W,
  chartPointAtKm,
  contourRing,
  type AlternateRoute,
} from "../route.utils";
import type { ChartLayers, PlanStation } from "../route.types";

interface ChartCanvasProps {
  stations: PlanStation[];
  selectedId: string;
  onSelect: (id: string) => void;
  layers: ChartLayers;
  distanceKm: number;
  originLat: number;
  originLng: number;
  alternate: AlternateRoute | null;
  /** Live party position as a fraction of total distance (0..1). */
  partyT: number;
}

export interface ChartHandle {
  /** Zoom the sheet to center on a chart position (used by station search). */
  focusOn: (x: number, y: number) => void;
}

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ASPECT = CHART_H / CHART_W;
const FULL: ViewBox = { x: 0, y: 0, w: CHART_W, h: CHART_H };
const MIN_W = 300;

const PEAKS: [number, number, number][] = [
  [300, 250, 1],
  [660, 360, 2],
];
const RIVER =
  "M120 600 C 220 480, 360 520, 430 430 S 560 360, 700 420 S 880 460, 960 380";
const ISOBARS = [
  "M40 120 C 240 60, 520 180, 920 90",
  "M40 180 C 240 130, 520 240, 920 160",
];
const BARBS: [number, number][] = [
  [200, 110],
  [440, 150],
  [700, 120],
  [860, 130],
];
/** Hypsometric relief bands (low → high) for the terrain view. */
const RELIEF_BANDS = ["#101a17", "#13211c", "#172821", "#1c2f26"];

type ChartView = "chart" | "terrain";

const tagLabel = (name: string) =>
  name.length > 16 ? `${name.slice(0, 15)}…` : name;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const ChartCanvas = forwardRef<ChartHandle, ChartCanvasProps>(
  function ChartCanvas(
    {
      stations,
      selectedId,
      onSelect,
      layers,
      distanceKm,
      originLat,
      originLng,
      alternate,
      partyT,
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [vb, setVb] = useState<ViewBox>(FULL);
    const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
    const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
    const [measureMode, setMeasureMode] = useState(false);
    const [measurePts, setMeasurePts] = useState<{ x: number; y: number }[]>(
      [],
    );
    const [view, setView] = useState<ChartView>("chart");
    const drag = useRef<{ cx: number; cy: number; moved: boolean } | null>(
      null,
    );

    const points = useMemo(
      () => stations.map((s) => ({ x: s.x, y: s.y })),
      [stations],
    );
    const routeD = `M${points.map((p) => `${p.x} ${p.y}`).join(" L")}`;

    const clampVb = useCallback((next: ViewBox): ViewBox => {
      const w = clamp(next.w, MIN_W, CHART_W);
      const h = w * ASPECT;
      return {
        w,
        h,
        x: clamp(next.x, 0, CHART_W - w),
        y: clamp(next.y, 0, CHART_H - h),
      };
    }, []);

    const toUser = useCallback((clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const p = pt.matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    }, []);

    const zoomAt = useCallback(
      (ux: number, uy: number, scale: number) => {
        setVb((prev) => {
          const w = clamp(prev.w * scale, MIN_W, CHART_W);
          const h = w * ASPECT;
          const fx = (ux - prev.x) / prev.w;
          const fy = (uy - prev.y) / prev.h;
          return clampVb({ x: ux - fx * w, y: uy - fy * h, w, h });
        });
      },
      [clampVb],
    );

    // Non-passive wheel zoom centered on the cursor.
    useEffect(() => {
      const svg = svgRef.current;
      if (!svg) return;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const { x, y } = toUser(e.clientX, e.clientY);
        zoomAt(x, y, e.deltaY < 0 ? 1 / 1.12 : 1.12);
      };
      svg.addEventListener("wheel", onWheel, { passive: false });
      return () => svg.removeEventListener("wheel", onWheel);
    }, [toUser, zoomAt]);

    // Imperative zoom-to a station (called from search) — no effect-setState.
    const focusOn = useCallback(
      (x: number, y: number) => {
        const w = 460;
        const h = w * ASPECT;
        setVb(clampVb({ x: x - w / 2, y: y - h / 2, w, h }));
      },
      [clampVb],
    );
    useImperativeHandle(ref, () => ({ focusOn }), [focusOn]);

    const fit = () => {
      if (points.length === 0) return setVb(FULL);
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const minX = Math.min(...xs) - 60;
      const maxX = Math.max(...xs) + 170;
      const minY = Math.min(...ys) - 90;
      const maxY = Math.max(...ys) + 70;
      let w = maxX - minX;
      let h = maxY - minY;
      if (w * ASPECT < h) w = h / ASPECT;
      h = w * ASPECT;
      setVb(clampVb({ x: minX, y: minY, w, h }));
    };

    // Pointer: pan (drag) / measure & probe (click) / hover (crosshair).
    const onPointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      svgRef.current?.setPointerCapture(e.pointerId);
      drag.current = { cx: e.clientX, cy: e.clientY, moved: false };
    };
    const onPointerMove = (e: React.PointerEvent) => {
      if (drag.current) {
        const dx = e.clientX - drag.current.cx;
        const dy = e.clientY - drag.current.cy;
        if (Math.hypot(dx, dy) > 4) drag.current.moved = true;
        if (drag.current.moved && !measureMode) {
          // Pan in user space — works regardless of preserveAspectRatio.
          const prev = toUser(drag.current.cx, drag.current.cy);
          const now = toUser(e.clientX, e.clientY);
          setVb((v) =>
            clampVb({
              ...v,
              x: v.x + (prev.x - now.x),
              y: v.y + (prev.y - now.y),
            }),
          );
          drag.current.cx = e.clientX;
          drag.current.cy = e.clientY;
          return;
        }
      }
      setCursor(toUser(e.clientX, e.clientY));
    };
    const onPointerUp = () => {
      if (drag.current && !drag.current.moved) {
        const point = toUser(drag.current.cx, drag.current.cy);
        if (measureMode) {
          setMeasurePts((prev) =>
            prev.length >= 2 ? [point] : [...prev, point],
          );
        } else {
          setProbe(point);
        }
      }
      drag.current = null;
    };

    // Live party position along the current leg.
    const partyPos = useMemo(
      () =>
        stations.length < 2
          ? null
          : chartPointAtKm(stations, partyT * distanceKm),
      [stations, partyT, distanceKm],
    );

    // Crosshair readout — live cursor, else a clicked probe point, else the
    // selected station.
    const readout = useMemo(() => {
      const at = cursor ?? probe ?? stations.find((s) => s.id === selectedId);
      if (!at) return null;
      const lng = originLng + (at.x / CHART_W - 0.5) * 0.22;
      const lat = originLat - (at.y / CHART_H - 0.5) * 0.16;
      let nearest = stations[0];
      let best = Infinity;
      for (const s of stations) {
        const d = Math.hypot(s.x - at.x, s.y - at.y);
        if (d < best) {
          best = d;
          nearest = s;
        }
      }
      const a = nearest;
      const b = stations[Math.min(nearest.index + 1, stations.length - 1)];
      let brg = (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
      if (brg < 0) brg += 360;
      return {
        coords: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
        elev: nearest.elevationM,
        brg: Math.round(brg),
        live: !!cursor,
      };
    }, [cursor, probe, selectedId, stations, originLat, originLng]);

    const labelScale = vb.w / CHART_W;
    const measureInfo =
      measurePts.length === 2
        ? (() => {
            const [p1, p2] = measurePts;
            const px = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const km = (px / polylineLength(points)) * distanceKm;
            let brg = (Math.atan2(p2.x - p1.x, -(p2.y - p1.y)) * 180) / Math.PI;
            if (brg < 0) brg += 360;
            return {
              km: km.toFixed(1),
              brg: Math.round(brg),
              mid: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
            };
          })()
        : null;

    return (
      <>
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "absolute inset-0 h-full w-full touch-none",
            measureMode ? "cursor-crosshair" : "cursor-grab",
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => {
            setCursor(null);
            drag.current = null;
          }}
        >
          <rect
            x={0}
            y={0}
            width={CHART_W}
            height={CHART_H}
            className="fill-app"
          />

          {/* Terrain view — hypsometric relief bands (low → high) */}
          {view === "terrain" &&
            PEAKS.map(([cx, cy, s], pi) =>
              RELIEF_BANDS.map((col, bi) => (
                <path
                  key={`band${pi}-${bi}`}
                  d={contourRing(
                    cx,
                    cy,
                    (RELIEF_BANDS.length - bi) * 52 + 34,
                    s + bi * 0.6,
                  )}
                  fill={col}
                />
              )),
            )}

          {layers.terrain &&
            PEAKS.map(([cx, cy, s], pi) =>
              Array.from({ length: 9 }).map((_, i) => {
                const idx = i % 2 === 0;
                return (
                  <path
                    key={`c${pi}-${i}`}
                    d={contourRing(cx, cy, 28 + i * 26, s + i * 0.4)}
                    fill="none"
                    strokeWidth={idx ? 1 : 0.7}
                    className={
                      idx
                        ? "stroke-(--plan-contour-index)"
                        : "stroke-(--plan-contour)"
                    }
                  />
                );
              }),
            )}

          <g className="stroke-border" strokeWidth={1}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`gx${i}`}
                x1={i * 120}
                y1={0}
                x2={i * 120}
                y2={CHART_H}
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`gy${i}`}
                x1={0}
                y1={i * 120}
                x2={CHART_W}
                y2={i * 120}
              />
            ))}
          </g>

          {layers.water && (
            <>
              <path
                d={RIVER}
                fill="none"
                strokeWidth={3.5}
                opacity={0.9}
                className="stroke-(--plan-water)"
              />
              <path
                d={RIVER}
                fill="none"
                strokeWidth={1}
                opacity={0.7}
                className="stroke-(--plan-water-light)"
              />
            </>
          )}

          {layers.weather && (
            <g
              className="stroke-(--plan-water-light)"
              strokeWidth={1}
              fill="none"
              opacity={0.5}
            >
              {ISOBARS.map((d, i) => (
                <path key={`iso${i}`} d={d} strokeDasharray="2 4" />
              ))}
              {BARBS.map(([x, y], i) => (
                <g key={`barb${i}`} strokeWidth={1.2} opacity={0.8}>
                  <line x1={x} y1={y} x2={x + 18} y2={y - 6} />
                  <line x1={x + 18} y1={y - 6} x2={x + 13} y2={y - 12} />
                  <line x1={x + 18} y1={y - 6} x2={x + 10} y2={y - 9} />
                </g>
              ))}
            </g>
          )}

          {layers.risk &&
            stations
              .filter((s) => s.hazard)
              .map((s) => (
                <g key={`hz${s.id}`}>
                  <path
                    d={contourRing(s.x, s.y, 72, 5, 0.7, 0.2)}
                    strokeWidth={1.3}
                    strokeDasharray="5 4"
                    opacity={0.9}
                    className="fill-(--plan-signal-fill) stroke-(--plan-signal)"
                  />
                  <text
                    x={s.x}
                    y={s.y - 80}
                    textAnchor="middle"
                    fontSize={10.5}
                    className="fill-(--plan-signal) font-mono"
                  >
                    EXPOSURE · WIND &gt;50KT
                  </text>
                </g>
              ))}

          {/* Alternate route overlay */}
          {alternate && (
            <g className="stroke-(--plan-sage)">
              <path
                d={`M${alternate.points.map((p) => `${p.x} ${p.y}`).join(" L")}`}
                fill="none"
                strokeWidth={2}
                strokeDasharray="6 5"
                opacity={0.85}
              />
              {(() => {
                const tip = alternate.points.reduce(
                  (a, b) => (b.y > a.y ? b : a),
                  alternate.points[0],
                );
                return (
                  <g transform={`translate(${tip.x}, ${tip.y + 22})`}>
                    <rect
                      x={-58}
                      y={-12}
                      width={116}
                      height={20}
                      rx={3}
                      className="fill-surface stroke-(--plan-sage)"
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      y={2}
                      fontSize={9}
                      className="fill-(--plan-sage) font-mono"
                    >
                      ALT · {alternate.distanceKm} km
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Primary route */}
          <path
            d={routeD}
            fill="none"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-app"
          />
          <path
            d={routeD}
            fill="none"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-accent"
          />

          {/* Measure */}
          {measurePts.length > 0 && (
            <g>
              {measurePts.length === 2 && (
                <line
                  x1={measurePts[0].x}
                  y1={measurePts[0].y}
                  x2={measurePts[1].x}
                  y2={measurePts[1].y}
                  strokeWidth={1.5 * labelScale}
                  strokeDasharray={`${5 * labelScale} ${4 * labelScale}`}
                  className="stroke-fg-1"
                />
              )}
              {measurePts.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4 * labelScale}
                  className="fill-app stroke-fg-1"
                  strokeWidth={1.5 * labelScale}
                />
              ))}
              {measureInfo && (
                <text
                  x={measureInfo.mid.x}
                  y={measureInfo.mid.y - 8 * labelScale}
                  textAnchor="middle"
                  fontSize={12 * labelScale}
                  className="fill-fg-1 font-mono"
                >
                  {measureInfo.km} km · {measureInfo.brg}°
                </text>
              )}
            </g>
          )}

          {/* Waypoints — selected renders last (on top); others dim to declutter */}
          {[...stations]
            .sort(
              (a, b) =>
                (a.id === selectedId ? 1 : 0) - (b.id === selectedId ? 1 : 0),
            )
            .map((s) => {
              const sel = s.id === selectedId;
              const cur = s.status === "current";
              const right = s.x > CHART_W * 0.62;
              const tagX = right ? s.x - 154 : s.x + 22;
              const elbowX = right ? s.x - 22 : s.x + 22;
              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(s.id);
                  }}
                >
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={elbowX}
                    y2={s.y - 26}
                    strokeWidth={0.8}
                    className="stroke-fg-4"
                  />
                  <g
                    transform={`translate(${tagX},${s.y - 50})`}
                    opacity={sel || cur || s.hazard ? 1 : 0.4}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={132}
                      height={30}
                      rx={3}
                      strokeWidth={1}
                      className={cn(
                        "fill-surface",
                        s.hazard
                          ? "stroke-(--plan-signal)"
                          : sel
                            ? "stroke-accent"
                            : "stroke-border",
                      )}
                    />
                    <text
                      x={8}
                      y={13}
                      fontSize={9.5}
                      fontWeight={600}
                      className="fill-fg-1 font-mono"
                    >
                      {String(s.index + 1).padStart(2, "0")} ·{" "}
                      {tagLabel(s.name)}
                    </text>
                    <text
                      x={8}
                      y={24}
                      fontSize={8.5}
                      className={cn(
                        "font-mono",
                        s.hazard ? "fill-(--plan-signal)" : "fill-fg-2",
                      )}
                    >
                      {s.elevationM} m{s.hazard ? "  ⚠ HOLD" : ""}
                    </text>
                  </g>
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={cur ? 7 : 5}
                    strokeWidth={cur ? 3 : 2}
                    className={cn(
                      "fill-app",
                      cur || sel
                        ? "stroke-accent"
                        : s.hazard
                          ? "stroke-(--plan-signal)"
                          : "stroke-(--plan-sage)",
                    )}
                  />
                  {(cur || sel) && (
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={13}
                      fill="none"
                      strokeWidth={1}
                      opacity={0.5}
                      className="stroke-accent"
                    />
                  )}
                </g>
              );
            })}

          {/* Live party */}
          {partyPos && (
            <g>
              <circle
                cx={partyPos.x}
                cy={partyPos.y}
                r={11}
                className="fill-accent"
                opacity={0.18}
              />
              <circle
                cx={partyPos.x}
                cy={partyPos.y}
                r={4.5}
                className="fill-accent stroke-app"
                strokeWidth={1.5}
              />
            </g>
          )}

          {/* Probe (clicked point) */}
          {probe && !cursor && (
            <g pointerEvents="none">
              <circle
                cx={probe.x}
                cy={probe.y}
                r={4}
                className="fill-accent stroke-app"
                strokeWidth={1.5}
              />
              <circle
                cx={probe.x}
                cy={probe.y}
                r={9}
                fill="none"
                strokeWidth={1}
                opacity={0.5}
                className="stroke-accent"
              />
            </g>
          )}

          {/* Crosshair */}
          {cursor && (
            <g
              className="stroke-accent"
              strokeWidth={0.6}
              opacity={0.5}
              strokeDasharray="4 4"
              pointerEvents="none"
            >
              <line x1={cursor.x} y1={0} x2={cursor.x} y2={CHART_H} />
              <line x1={0} y1={cursor.y} x2={CHART_W} y2={cursor.y} />
            </g>
          )}

          {/* Compass */}
          <g transform="translate(888,512)" opacity={0.92}>
            <circle r={30} fill="none" className="stroke-border" />
            <circle
              r={22}
              fill="none"
              strokeWidth={0.7}
              className="stroke-border"
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={`ct${i}`}
                  x1={Math.sin(a) * 22}
                  y1={-Math.cos(a) * 22}
                  x2={Math.sin(a) * 30}
                  y2={-Math.cos(a) * 30}
                  strokeWidth={0.8}
                  className="stroke-fg-3"
                />
              );
            })}
            <path d="M0 -26 L5 0 L0 8 L-5 0 Z" className="fill-accent" />
            <text
              x={0}
              y={-34}
              textAnchor="middle"
              fontSize={9}
              className="fill-fg-1 font-mono"
            >
              N
            </text>
          </g>
        </svg>

        {/* Controls */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <div className="flex overflow-hidden rounded-md border border-border bg-app/85 font-mono text-3xs backdrop-blur-sm">
            {(["chart", "terrain"] as ChartView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "px-2.5 py-1 uppercase tracking-[0.06em] transition-colors",
                  view === v
                    ? "bg-accent-tint text-accent-bright"
                    : "text-fg-3 hover:text-fg-1",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex flex-col overflow-hidden rounded-md border border-border bg-app/85 backdrop-blur-sm">
            <ControlButton
              label="Zoom in"
              onClick={() => zoomAt(vb.x + vb.w / 2, vb.y + vb.h / 2, 1 / 1.3)}
              icon="plus"
            />
            <span className="h-px bg-border" />
            <ControlButton
              label="Zoom out"
              onClick={() => zoomAt(vb.x + vb.w / 2, vb.y + vb.h / 2, 1.3)}
              icon="minus"
            />
          </div>
          <ControlButton
            label="Fit route"
            onClick={fit}
            icon="crosshair"
            boxed
          />
          <button
            type="button"
            onClick={() => {
              setMeasureMode((m) => !m);
              setMeasurePts([]);
            }}
            aria-pressed={measureMode}
            title="Measure distance & bearing"
            className={cn(
              "grid size-8 place-items-center rounded-md border backdrop-blur-sm transition-colors",
              measureMode
                ? "border-accent-line bg-accent-tint text-accent-bright"
                : "border-border bg-app/85 text-fg-2 hover:text-fg-1",
            )}
          >
            <Icon name="route" size={15} />
          </button>
        </div>

        {/* Readout */}
        {readout && (
          <div className="absolute right-3 top-3 rounded-md border border-border bg-app/85 px-2.5 py-1.5 text-right font-mono text-3xs text-fg-2 backdrop-blur-sm">
            <div className="flex items-center justify-end gap-1.5">
              {readout.live && (
                <span className="size-1 rounded-full bg-accent" />
              )}
              {readout.coords}
            </div>
            <div>
              ELEV {readout.elev} m · BRG {readout.brg}°
            </div>
          </div>
        )}

        {/* Scale bar */}
        <div className="absolute bottom-3 left-3 font-mono text-3xs text-fg-2">
          <div className="flex">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-7 border border-fg-3",
                  i % 2 === 0 ? "bg-fg-3" : "bg-transparent",
                )}
              />
            ))}
          </div>
          <div className="mt-1">
            0&nbsp;&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;10 km
          </div>
        </div>
      </>
    );
  },
);

function ControlButton({
  label,
  onClick,
  icon,
  boxed,
}: {
  label: string;
  onClick: () => void;
  icon: "plus" | "minus" | "crosshair";
  boxed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "grid size-8 place-items-center text-fg-2 transition-colors hover:text-fg-1",
        boxed && "rounded-md border border-border bg-app/85 backdrop-blur-sm",
      )}
    >
      <Icon name={icon} size={15} />
    </button>
  );
}

function polylineLength(points: { x: number; y: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
  }
  return total || 1;
}
