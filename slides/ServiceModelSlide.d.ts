import * as React from "react";

/**
 * 服务模式 — three tiers chosen by 餐饮类型 and 经营阶段 (经营诊断 · 运营业绩优化落地辅导 ·
 * 第二大脑陪跑), one column each, with 服务内容 / 客户价值 / 核心优势 as rows. `highlight`
 * raises the tier being proposed; `note` carries the conditional fee sentence.
 */
export interface ServiceModelSlideProps {
  eyebrow?: string;
  title?: string;
  /** one per column; `fit` = which 餐饮类型 / 阶段 it suits; row keys default to content / value / edge */
  tiers?: Array<{ name: string; fit?: string; content: string; value: string; edge: string; numeral?: string }>;
  /** row order and labels; `key` must exist on every tier */
  rows?: Array<{ key: string; label: string }>;
  /** 0-based index of the raised tier; default -1 (none) */
  highlight?: number;
  /** one line under the ledger; default the 结果挂钩 sentence */
  note?: string;
  page?: number;
}
export function ServiceModelSlide(props: ServiceModelSlideProps): JSX.Element;
