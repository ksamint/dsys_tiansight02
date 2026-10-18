import * as React from "react";

/** 比较 · two-state comparison (P1↔P2 KPIs) as point×2 + line, horizontal. Draws through chartKit (d3 v7 on window). */
export interface DumbbellProps {
  rows: Array<{ label: string; before: number; after: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  fromLabel?: string;
  toLabel?: string;
  /** colour the change 增长/利润流失 (default) or keep brand gold */
  semantic?: boolean;
  labelWidth?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Dumbbell(props: DumbbellProps): JSX.Element;
