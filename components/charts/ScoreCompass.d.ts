import * as React from "react";

/** 评分罗盘 · ring of arcs, one per factor, radius = score, tone by threshold, weighted total in the hub. Draws through chartKit (d3 v7 on window). */
export interface ScoreCompassProps {
  factors: Array<{ label: string; score: number; weight?: number; note?: string }>;
  size?: number;
  /** [risk→watch, watch→fit] score cut points, default [45, 68] */
  thresholds?: [number, number];
  hubLabel?: string;
  /** 宜 / 慎 / 否 stamp under the ring */
  verdict?: string;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function ScoreCompass(props: ScoreCompassProps): JSX.Element;
