import * as React from "react";

/** 层级 + 构成 · treemap for 大类 → 系列 → 品项 (area is coarse — label the values). Draws through chartKit (d3 v7 on window). */
export interface TreemapProps {
  data: { name: string; value?: number; children?: any[] };
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** px² below which a tile gets no label */
  minLabelArea?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Treemap(props: TreemapProps): JSX.Element;
