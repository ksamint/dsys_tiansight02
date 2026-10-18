import * as React from "react";

/** 不确定性 · forecast band (P10–P90) with P50, baseline and 实测. Draws through chartKit (d3 v7 on window). */
export interface ForecastCorridorProps {
  history?: Array<{ label: string; value: number }>;
  forecast?: Array<{ label: string; p10: number; p50: number; p90: number }>;
  /** realised values to compare against the corridor */
  actual?: Array<{ label: string; value: number }>;
  /** 历史同期 / simple baseline, dashed */
  baseline?: Array<{ label: string; value: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  grid?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function ForecastCorridor(props: ForecastCorridorProps): JSX.Element;
