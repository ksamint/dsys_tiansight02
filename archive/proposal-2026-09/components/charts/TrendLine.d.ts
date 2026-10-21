import * as React from "react";

/**
 * 逐月走势 line chart — one or more series over labelled periods, the report's default time graphic.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface TrendLineProps {
  /** each series: {name, tone, points:[{label,value}], area?, dashed?, emphasis?} */
  series: Array<{ name?: string; tone?: string; points: Array<{ label: string; value: number }>; area?: boolean; dashed?: boolean; emphasis?: boolean }>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  yFormat?: (v: number) => string;
  showPoints?: boolean;
  grid?: boolean;
}
export function TrendLine(props: TrendLineProps): JSX.Element;
