import * as React from "react";

/** 偏差 · deviation from a target, zero line centred. Draws through chartKit (d3 v7 on window). */
export interface DivergingBarsProps {
  rows: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** sort by value (default true) */
  sorted?: boolean;
  /** 增长 right / 利润流失 left (default) or brand gold */
  semantic?: boolean;
  labelWidth?: number;
  targetLabel?: string;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function DivergingBars(props: DivergingBarsProps): JSX.Element;
