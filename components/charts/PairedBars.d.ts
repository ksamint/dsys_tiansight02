import * as React from "react";

/** 结构错位 · two shares of the same categories side by side on one scale, gap printed. Draws through chartKit (d3 v7 on window). */
export interface PairedBarsProps {
  rows: Array<{ label: string; a: number; b: number }>;
  height?: number;
  aLabel?: string;
  bLabel?: string;
  /** values are ratios → % (default true) */
  percent?: boolean;
  unit?: string;
  format?: (v: number) => string;
  labelWidth?: number;
  showGap?: boolean;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function PairedBars(props: PairedBarsProps): JSX.Element;
