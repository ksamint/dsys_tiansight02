import * as React from "react";

/** 排序 · point + hairline rank chart, the light version of a sorted bar. Draws through chartKit (d3 v7 on window). */
export interface LollipopProps {
  rows: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  labelWidth?: number;
  /** dashed 朱红 rule; items at or above it turn gold */
  threshold?: number;
  thresholdLabel?: string;
  sorted?: boolean;
  /** labels drawn in 玄墨 */
  highlight?: string[];
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Lollipop(props: LollipopProps): JSX.Element;
