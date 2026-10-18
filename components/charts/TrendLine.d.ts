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
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
  /** horizontal reference lines — 约定目标, 同类基准; they enter the y domain */
  refs?: Array<{ label?: string; value: number; tone?: string }>;
  /** vertical event lines at a period label, e.g. { label: "动作落地", at: "06月" }; place "bottom" puts the label above the axis instead of the top */
  marks?: Array<{ label?: string; at: string; place?: "top" | "bottom" }>;
}
export function TrendLine(props: TrendLineProps): JSX.Element;
