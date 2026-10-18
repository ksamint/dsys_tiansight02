import * as React from "react";

/** 构成 · 10 × 10 waffle where one cell is 1% (or one real unit), so a share reads as a count. Draws through chartKit (d3 v7 on window). */
export interface WaffleProps {
  parts: Array<{ label: string; value: number; tone?: string }>;
  cols?: number;
  rows?: number;
  /** unit word for the legend, e.g. 件 */
  unitLabel?: string;
  /** line under the legend, e.g. 每 100 件出炉 */
  totalLabel?: string;
  /** cell px (auto from width) */
  cell?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Waffle(props: WaffleProps): JSX.Element;
