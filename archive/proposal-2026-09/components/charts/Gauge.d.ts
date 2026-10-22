import * as React from "react";

/**
 * 指标达成 gauge — a 200° arc with the target ticked; the fill tones itself by attainment.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface GaugeProps {
  value?: number;
  /** the goal; ticked on the arc */
  target?: number;
  /** scale ceiling; defaults to target × 1.25 */
  max?: number;
  size?: number;
  label?: string;
  unit?: string;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** tone by attainment: ≥100% growth, ≥85% caution, else loss (default true) */
  autoTone?: boolean;
  /** force a tone name instead */
  toneName?: string;
}
export function Gauge(props: GaugeProps): JSX.Element;
