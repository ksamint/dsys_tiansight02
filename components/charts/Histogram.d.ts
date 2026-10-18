import * as React from "react";

/** 分布 · histogram with KDE density and reference marks. Draws through chartKit (d3 v7 on window). */
export interface HistogramProps {
  values: number[];
  /** bin count hint for d3.bin */
  bins?: number;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** overlay a kernel density curve (default true) */
  density?: boolean;
  /** vertical reference lines: mean, thresholds */
  marks?: Array<{ label: string; value: number; tone?: "gold" | "loss" }>;
  /** shaded value ranges the reading is about (a 价格带), dashed edges, optional label with the share */
  bands?: Array<{ from: number; to: number; label?: string }>;
  domain?: [number, number];
  /** show the n / 密度曲线 legend (default true) */
  legend?: boolean;
  /** y tick count hint (default 4); use 2–3 on short charts so 10px ticks keep clear of each other */
  yTicks?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Histogram(props: HistogramProps): JSX.Element;
