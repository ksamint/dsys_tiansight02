import * as React from "react";

/** 九宫格 · dimension × dimension matrix over a SKU list (味型 × 工艺 and the other six structure presets), with gap cells and click-to-list. Draws through chartKit (d3 v7 on window). */
export interface NineGridProps {
  /** SKU rows carrying the dimension keys (flavor, craft, ingredient, price_band, primary_scene, …) — 菜品 cohort only */
  items: any[];
  /** row dimension key, verbatim from the field contract */
  rowDim?: string;
  colDim?: string;
  /** optional measure instead of SKU count */
  measure?: string | ((row: any) => number);
  agg?: "sum" | "mean";
  unit?: string;
  format?: (v: number) => string;
  /** field used to name SKUs in the detail list */
  labelKey?: string;
  maxRows?: number;
  maxCols?: number;
  interactive?: boolean;
  onSelect?: (sel: { r: string; c: string; items: any[] } | null) => void;
  /** print "·" in empty cells and count 研发补缺 candidates */
  showGaps?: boolean;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function NineGrid(props: NineGridProps): JSX.Element;
