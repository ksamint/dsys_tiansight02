import * as React from "react";

/**
 * 表内微图 — a bare inline trend for a table cell or MetricRow. No axes, no labels, no tooltip.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  toneName?: string;
  area?: boolean;
  /** dot on the final point (default true) */
  showLast?: boolean;
}
export function Sparkline(props: SparklineProps): JSX.Element;
