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
  /** shown as 单位：<unit> */
  unit?: string;
}
export function Waterfall(props: WaterfallProps): JSX.Element;
