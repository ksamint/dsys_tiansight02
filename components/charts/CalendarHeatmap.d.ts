import * as React from "react";

/** 趋势 × 日历 · one tile per day for pattern reading. Draws through chartKit (d3 v7 on window). */
export interface CalendarHeatmapProps {
  values: Array<{ date: string; value: number }>;
  /** 同比 around zero → 朱红 ↔ 增长 ramp */
  diverging?: boolean;
  /** tile size px (auto from width) */
  cell?: number;
  format?: (v: number) => string;
  unit?: string;
  /** 1 = Monday (default), 0 = Sunday */
  weekStart?: 0 | 1;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function CalendarHeatmap(props: CalendarHeatmapProps): JSX.Element;
