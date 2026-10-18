import * as React from "react";

/** 关系 · scatter / bubble with quadrant rules; canvas above 1,500 points. Draws through chartKit (d3 v7 on window). */
export interface ScatterProps {
  points: Array<{ x: number; y: number; r?: number; label?: string; tone?: string }>;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  /** true = median rules; {x,y} = explicit thresholds */
  quadrants?: boolean | { x?: number; y?: number };
  /** four labels: top-left, top-right, bottom-left, bottom-right */
  quadrantLabels?: string[];
  /** switch marks to a canvas layer above this count (default 1500) */
  canvasThreshold?: number;
  maxR?: number;
  /** labels to emphasise and always label */
  emphasis?: string[];
  /** least-squares fit line */
  trend?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Scatter(props: ScatterProps): JSX.Element;
