import * as React from "react";

/**
 * The core offer slide — the 6 个月 / 7 日内 / 90 天 promise as a mono stat ledger.
 */
export interface PromiseSlideProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** defaults to 数据窗口 6 个月 / 交付周期 7 日内 / 行动清单 90 天 */
  stats?: Array<{ label: string; value: string; unit?: string; accent?: boolean }>;
  page?: number;
}
export function PromiseSlide(props: PromiseSlideProps): JSX.Element;
