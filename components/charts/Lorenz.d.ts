import * as React from "react";

/** 集中度 · Lorenz curve with the Gini coefficient and the top-share marker. Draws through chartKit (d3 v7 on window). */
export interface LorenzProps {
  /** positive values, one per item (SKU 销售额) */
  values: number[];
  height?: number;
  /** fraction of items to mark, default 0.2 (前 20% SKU) */
  topShare?: number;
  itemLabel?: string;
  valueLabel?: string;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Lorenz(props: LorenzProps): JSX.Element;
