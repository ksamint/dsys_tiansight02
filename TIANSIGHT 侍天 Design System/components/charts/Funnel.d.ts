import * as React from "react";

/**
 * 转化漏斗 — stage widths proportional to value, with per-stage drop-off on the right.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface FunnelProps {
  stages: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  /** show the % change vs the previous stage */
  showDrop?: boolean;
}
export function Funnel(props: FunnelProps): JSX.Element;
