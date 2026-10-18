import * as React from "react";

/** 构成 × 两个分类 · marimekko: column width = outer share, segment height = inner share. Draws through chartKit (d3 v7 on window). */
export interface MekkoProps {
  columns: Array<{ label: string; parts: Array<{ label: string; value: number }> }>;
  height?: number;
  format?: (v: number) => string;
  /** px² below which a segment gets no label */
  minLabelArea?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Mekko(props: MekkoProps): JSX.Element;
