import * as React from "react";

/**
 * 利润流失归因 waterfall — start value, signed contributions, end value. Gains green, losses red, totals bronze.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface WaterfallProps {
  /** opening value */
  start: number;
  /** signed contributions in order: [{label, value}] */
  steps: Array<{ label: string; value: number }>;
  startLabel?: string;
  endLabel?: string;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
  /** shown as 单位：<unit> */
  unit?: string;
}
export function Waterfall(props: WaterfallProps): JSX.Element;
