import * as React from "react";

/**
 * 结构占比 stacked bars — composition across categories; `normalize` makes every bar 100%.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface StackedBarsProps {
  /** rows: [{label, <key>: number, …}] */
  data: Array<Record<string, any>>;
  /** stack order, bottom first */
  keys: string[];
  /** key → tone name, e.g. {堂食:"growth", 外卖:"caution"} */
  tones?: Record<string, string>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  /** convert each bar to 100% */
  normalize?: boolean;
  grid?: boolean;
}
export function StackedBars(props: StackedBarsProps): JSX.Element;
