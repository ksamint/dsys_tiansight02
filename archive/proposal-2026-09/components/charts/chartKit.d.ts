import * as React from "react";

/**
 * Shared chart grammar — margins, tone hexes, axis type and the d3/width hooks every
 * 侍天 chart draws through. Import from here rather than restyling axes per chart.
 * d3 v7 must be on `window` (CDN); `useD3` waits for it.
 */
export declare const CHART_TONES: Record<string, string>;
/** Literal hex values — d3 interpolation cannot read CSS custom properties. */
export declare const CHART_HEX: Record<string, string>;
export declare const CHART_MARGIN: { top: number; right: number; bottom: number; left: number };
export declare const AXIS_LABEL: React.CSSProperties;
export declare const VALUE_LABEL: React.CSSProperties;
/** Semantic tone name → hex. Defaults to bronze. */
export function tone(name?: string): string;
/** Returns window.d3 once available (polls a loading CDN script). */
export function useD3(): any;
/** [ref, width] — attach ref to the wrapper; width tracks its measured size. */
export function useWidth(fallback?: number): [React.RefObject<HTMLDivElement>, number];
export interface ChartFrameProps {
  caption?: React.ReactNode;
  /** 数据来源 line under the chart */
  note?: React.ReactNode;
  height: number;
  width: number;
  svgRef?: React.Ref<SVGSVGElement>;
  children?: React.ReactNode;
}
export function ChartFrame(props: ChartFrameProps): JSX.Element;
/** Legend rendered as wrapping HTML beside/below the chart — never inside the SVG. */
export interface ChartLegendProps {
  items: Array<{ label: string; tone?: string; dashed?: boolean }>;
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
}
export function Axes(props: AxesProps): JSX.Element;
