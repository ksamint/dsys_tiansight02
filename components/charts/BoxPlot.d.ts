import * as React from "react";

/** 分布 + 离群 · box plot per category. Draws through chartKit (d3 v7 on window). */
export interface BoxPlotProps {
  groups: Array<{ label: string; values: number[]; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** long CN labels → horizontal */
  horizontal?: boolean;
  showN?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function BoxPlot(props: BoxPlotProps): JSX.Element;
