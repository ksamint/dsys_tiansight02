import * as React from "react";

/** 时段 / 区间 · life spans and versions on a time axis; canvas above 120 rows. Draws through chartKit (d3 v7 on window). */
export interface GanttProps {
  rows: Array<{ label: string; start: string | Date; end: string | Date; tone?: string; group?: string; note?: string }>;
  height?: number;
  /** ISO date or Date for a 朱红 today marker */
  today?: string | Date;
  /** switch bars to canvas above this row count (default 120) */
  canvasThreshold?: number;
  rowHeight?: number;
  labelWidth?: number;
  /** group name → tone, drives colour and legend */
  groupTone?: Record<string, string>;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Gantt(props: GanttProps): JSX.Element;
