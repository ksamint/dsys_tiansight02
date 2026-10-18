import * as React from "react";

/**
 * Shared chart grammar — margins, tone hexes, axis type and the d3/width hooks every
 * 侍天 chart draws through. Import from here rather than restyling axes per chart.
 * d3 v7 must be on `window` (CDN); `useD3` waits for it.
 */
export declare const CHART_TONES: Record<string, string>;
/** Literal hex values — d3 interpolation cannot read CSS custom properties. */
export declare const CHART_HEX: Record<string, string>;
/** Ordered series palette: 明金 → 玄墨 → 朱红 → datum → muted. Never a rainbow. */
export declare const SERIES_ORDER: string[];
/** Single-hue gold ramp for quantity; the one diverging pair 朱红 ↔ 增长. */
export declare const SEQUENTIAL: string[];
export declare const DIVERGING: string[];
/** L1 reading task → first-choice charts in this kit (spec B2). */
export declare const TASK_CHARTS: Record<string, { label: string; charts: string[] }>;
/** Decision matrix B6: task × data shape (q1 | q2 | qc | qt | cc) → chart name, or null. */
export function chartFor(task: string, shape: "q1" | "q2" | "qc" | "qt" | "cc"): string | null;
/** Roll a flat fact table up by 1–2 dimension keys. Returns [{ dim, items: [{ label, value, n }] }]. */
export function rollupDims(rows: any[], dims: string[], measure: string | ((r: any) => number), agg?: "sum" | "mean" | "count" | "median" | "max" | "min"): Array<{ dim: string; items: Array<{ label: string; value: number; n: number }> }>;
export declare const Rollup: typeof rollupDims;
/** Dimension keys → 中文, verbatim from vanahom-fb-hom01 analysis-dimensions-field-contract-v1 (CATEGORY_DIMENSIONS / SKU_DIM_META). */
export declare const DIMENSION_LABELS: Record<string, string>;
/** Data grade per dimension: RAW · ANN (annotated, editable) · DER (derived, read-only). */
export declare const DIMENSION_GRADE: Record<string, "RAW" | "ANN" | "DER">;
/** The seven 九宫 structure presets as [rowDim, colDim]. */
export declare const STRUCTURE_PRESETS: Array<[string, string]>;
/** Cross-tab a SKU list by two dimension keys. */
export function crossTab(list: any[], rowDim: string, colDim: string, measure?: string | ((r: any) => number), agg?: "sum" | "mean"): { rows: string[]; cols: string[]; cells: Record<string, { n: number; value: number; items: any[] }> };
/** i-th series tone hex following SERIES_ORDER. */
export function seriesTone(i: number): string;
export declare const CHART_MARGIN: { top: number; right: number; bottom: number; left: number };
export declare const AXIS_LABEL: React.CSSProperties;
export declare const VALUE_LABEL: React.CSSProperties;
/** Semantic tone name → hex. Defaults to bronze. */
export function tone(name?: string): string;
/** Returns window.d3 once available (polls a loading CDN script). `need` names a required plugin, e.g. "sankey". */
export function useD3(need?: string): any;
/** [ref, width] — attach ref to the wrapper; width tracks its measured size. */
export function useWidth(fallback?: number): [React.RefObject<HTMLDivElement>, number];
/** DPR-aware canvas drawn once per data/size change, positioned under the SVG (Scatter, Gantt fast paths). */
export interface CanvasLayerProps { width: number; height: number; draw: (ctx: CanvasRenderingContext2D, info: { width: number; height: number; dpr: number }) => void; deps?: any[] }
export function CanvasLayer(props: CanvasLayerProps): JSX.Element;
/** Evidence-grade / degradation corner badge. */
export interface QualityBadgeProps { grade?: "E1" | "E2" | "E3" | "E4"; degraded?: boolean; label?: string }
export function QualityBadge(props: QualityBadgeProps): JSX.Element | null;
export interface ChartFrameProps {
  caption?: React.ReactNode;
  /** 数据来源 line under the chart */
  note?: React.ReactNode;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
  degraded?: boolean;
  /** canvas layers rendered under the SVG */
  layers?: React.ReactNode;
  height: number;
  width: number;
  svgRef?: React.Ref<SVGSVGElement>;
  children?: React.ReactNode;
}
export function ChartFrame(props: ChartFrameProps): JSX.Element;
/** Legend rendered as wrapping HTML beside/below the chart — never inside the SVG. */
export interface ChartLegendProps {
  items: Array<{ label: string; tone?: string; dashed?: boolean; band?: boolean }>;
  style?: React.CSSProperties;
}
export function ChartLegend(props: ChartLegendProps): JSX.Element | null;
/** True when a filled cell is dark enough to need light ink (works for both ends of a diverging scale). */
export function isDarkFill(d3: any, color: string): boolean;

export interface AxesProps {
  x: any; y: any; width: number; height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  xTicks?: number; yTicks?: number;
  /** faint horizontal rules at the y ticks; off by default */
  grid?: boolean;
  xFormat?: (v: any) => string;
  yFormat?: (v: any) => string;
  /** x is a band scale (categorical) */
  band?: boolean;
  /** y is a band scale (horizontal charts) */
  yBand?: boolean;
}
export function Axes(props: AxesProps): JSX.Element;
