import * as React from "react";

/**
 * Slide adapter for the d3 chart kit: renders a kit chart at report scale and enlarges it
 * `scale`× so 10–11px chart type lands at ≥19px on a 1280×720 slide. Wrap every
 * components/charts figure placed on a slide in this. The chart's own `height` prop is in
 * rendered px — the slide sees height × scale. The page must load d3 v7.
 */
export interface SlideChartProps {
  /** one kit chart element (Scatter, TrendLine, Histogram, Waterfall, ForecastCorridor…) */
  children?: React.ReactNode;
  /** enlargement factor; 1.9 turns the kit's 10px ticks into 19px (default) */
  scale?: number;
  /** rendered px kept free on the right for labels that hang off the plot (P10/P50/P90, edge labels) */
  padRight?: number;
  style?: React.CSSProperties;
}
export function SlideChart(props: SlideChartProps): JSX.Element;

/** EGA evidence badge at slide type — E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 (E4 / degraded in 朱红). Slides print caption and 口径 at 19px themselves instead of the kit's 10px chrome. */
export interface SlideGradeProps { grade?: "E1" | "E2" | "E3" | "E4"; degraded?: boolean; label?: string; }
export function SlideGrade(props: SlideGradeProps): JSX.Element | null;
