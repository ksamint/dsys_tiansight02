import * as React from "react";

/** ABC 二八 · ranked bars with the cumulative-share line on a declared 0–100% axis; A/B cuts at 80% / 95%. Draws through chartKit (d3 v7 on window). */
export interface ParetoProps {
  rows: Array<{ label: string; value: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** cumulative-share cut points for A and B (default [0.8, 0.95]) */
  cuts?: [number, number];
  /** cap on bars drawn (the tail is still counted in the total) */
  maxBars?: number;
  /** draw every k-th x label */
  labelEvery?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Pareto(props: ParetoProps): JSX.Element;
