import * as React from "react";

/**
 * 伙伴案例 — one engagement as 现状 → 动作 → 结果. The result panel is the report's 验收 read:
 * the 主指标's monthly path (d3 TrendLine with the 动作落地 mark and the 约定目标 line), its
 * before → after pair, and the 护栏指标 as before → after pairs beneath. `sample` keeps a
 * 样例数据 · 待伙伴确认 badge visible until a partner confirms; `brand` takes only verbatim
 * names from the brand's partner list. The page must load d3 v7.
 */
export interface CaseSlideProps {
  eyebrow?: string;
  /** verbatim partner name, or a neutral descriptor (新派淮扬菜单店) while unconfirmed */
  brand?: string;
  /** 阶段 · 服务层级, e.g. 经营之中 · 运营业绩优化落地辅导 */
  stage?: string;
  situation?: string;
  /** what was executed, numbered 一 二 三 */
  actions?: string[];
  /** metrics[0] is the 主指标 (header pair; its path is `trend`), the rest are 护栏指标. Every value is a window average; tone "loss" colours a reduction metric 朱红 */
  metrics?: Array<{ label: string; before: string; after: string; delta?: string; tone?: "growth" | "loss" }>;
  /** the 主指标 by month: points, the 动作落地 mark and the 约定目标 reference. null → text-only ledger of all metrics */
  trend?: { unit?: string; points: Array<{ label: string; value: number }>; mark?: { label?: string; at: string }; target?: { label?: string; value: number } } | null;
  /** the 口径 + window line under the slide */
  scope?: string;
  /** default true — shows the 样例数据 badge */
  sample?: boolean;
  page?: number;
}
export function CaseSlide(props: CaseSlideProps): JSX.Element;
