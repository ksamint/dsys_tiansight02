import * as React from "react";

/** 敏感性 · each variable swung ±x%, effect on the target as a bar pair around base, sorted by swing. Draws through chartKit (d3 v7 on window). */
export interface TornadoProps {
  rows: Array<{ label: string; low: number; high: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  baseLabel?: string;
  /** e.g. ±10% — printed in the legend */
  swingLabel?: string;
  labelWidth?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Tornado(props: TornadoProps): JSX.Element;
