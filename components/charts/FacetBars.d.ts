import * as React from "react";

/** 维度分析 · roll a fact table up by 1–2 dimensions into small-multiple bars, one shared scale. Draws through chartKit (d3 v7 on window). */
export interface FacetBarsProps {
  /** flat fact rows; each row is one observation */
  rows?: any[];
  /** 1–2 dimension keys: [facet, bar] */
  dims?: string[];
  /** measure key or accessor */
  measure?: string | ((row: any) => number);
  agg?: "sum" | "mean" | "count" | "median" | "max" | "min";
  /** pre-aggregated alternative to rows/dims */
  facets?: Array<{ dim: string; items: Array<{ label: string; value: number; n?: number; tone?: string }> }>;
  columns?: number;
  caption?: string;
  note?: string;
  scope?: string;
  unit?: string;
  format?: (v: number) => string;
  /** values are ratios → show as % */
  percent?: boolean;
  panelHeight?: number;
  sortBars?: boolean;
  /** bar label to draw in 玄墨 across every facet */
  highlight?: string;
}
export function FacetBars(props: FacetBarsProps): JSX.Element;
