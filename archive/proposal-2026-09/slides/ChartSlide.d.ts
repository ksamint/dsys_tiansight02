import * as React from "react";

/**
 * Chart slide: graphic on the left, 结论 + 先改这件 on the right. Pass a data component as `chart`.
 */
export interface ChartSlideProps {
  eyebrow?: string;
  title?: string;
  /** uppercase bronze caption over the graphic, e.g. 渗透率矩阵 */
  chartTitle?: string;
  /** a BarSeries / Matrix2x2 / LedgerTable element — never a slide-only chart */
  chart?: React.ReactNode;
  takeaway?: React.ReactNode;
  action?: React.ReactNode;
  /** 数据来源 line under the graphic */
  source?: React.ReactNode;
  page?: number;
}
export function ChartSlide(props: ChartSlideProps): JSX.Element;
