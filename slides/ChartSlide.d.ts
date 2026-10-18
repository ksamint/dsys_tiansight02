import * as React from "react";

/**
 * 图谱 slide: one d3 figure on the left, 结论 + 先改这件 on the right. Three built-in figures
 * (kit charts through SlideChart, 样张 data) answer 增长在哪里 · 利润漏在哪里 · 先改哪三件;
 * pick with `figure`, or pass any chart as `chart`. The page must load d3 v7.
 */
export interface ChartSlideProps {
  eyebrow?: string;
  /** scatter = 渗透率矩阵 (Scatter, quadrants at the 全店中位数) · waterfall = 利润归因 (Waterfall) · corridor = 菜单推演 (ForecastCorridor, E4). Default scatter. */
  figure?: "scatter" | "waterfall" | "corridor";
  /** defaults to the figure's headline */
  title?: string;
  /** optional 19px accent caption over the chart; built-in figures bring their own */
  chartTitle?: string | null;
  /** EGA badge (SlideGrade) beside the caption; built-in figures bring their own (corridor = E4) */
  grade?: "E1" | "E2" | "E3" | "E4" | null;
  /** a custom figure — wrap kit charts in SlideChart; overrides `figure` */
  chart?: React.ReactNode;
  /** default per figure; pass null to hide */
  takeaway?: React.ReactNode | null;
  /** default per figure; pass null to hide */
  action?: React.ReactNode | null;
  /** 口径 / 数据来源 line under the chart at 19px; default per figure */
  source?: React.ReactNode | null;
  page?: number;
}
export function ChartSlide(props: ChartSlideProps): JSX.Element;

/** The three built-in figures: label, title, caption, grade, takeaway, action, source, padRight and a render() returning the kit chart. */
export const CHART_FIGURES: Record<"scatter" | "waterfall" | "corridor", { label: string; title: string; caption: string; grade: "E1" | "E4"; takeaway: string; action: string; source: string; padRight: number; render: () => React.ReactElement }>;
