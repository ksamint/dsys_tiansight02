import * as React from "react";

/** 排序 / 趋势 · rank or value change between exactly two time points. Draws through chartKit (d3 v7 on window). */
export interface SlopeChartProps {
  items: Array<{ label: string; a: number; b: number; tone?: string }>;
  height?: number;
  leftLabel?: string;
  rightLabel?: string;
  /** ≤3 labels to emphasise (明金 → 玄墨 → 朱红); others go muted */
  highlight?: string[];
  unit?: string;
  format?: (v: number) => string;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function SlopeChart(props: SlopeChartProps): JSX.Element;
