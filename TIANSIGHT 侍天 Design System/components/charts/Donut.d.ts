import * as React from "react";

/**
 * 占比环 — a share breakdown with an optional center figure and a value legend.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface DonutProps {
  data: Array<{ label: string; value: number; tone?: string }>;
  size?: number;
  thickness?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** big mono figure in the middle */
  centerValue?: string | number;
  centerLabel?: string;
  unit?: string;
  showLegend?: boolean;
}
export function Donut(props: DonutProps): JSX.Element;
