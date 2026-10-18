import * as React from "react";

/**
 * 样张为证 — one page of the report as the 三部曲 prescribes: one sentence, four elements, one
 * chart. Left: title + the 证据 / 利润影响 / 执行动作 / 验收指标 ledger + the 可计算的 maxim.
 * Right: the 结论 card with its d3 evidence figure (default: 午市 ticket distribution, the
 * 38–58 元 band and its share, E1). The page must load d3 v7.
 */
export interface ProofSlideProps {
  eyebrow?: string;
  title?: string;
  /** one-line explanation under the title; default names the four elements */
  subtitle?: string | null;
  /** the headline finding */
  conclusion?: string;
  /** exactly four elements; tone "growth"/"loss" renders the value in mono color */
  elements?: Array<{ k: string; v: string; tone?: "growth" | "loss" }>;
  /** the evidence figure inside the 结论 card — a SlideChart-wrapped kit chart; null for a text-only card */
  chart?: React.ReactNode | null;
  /** 19px caption over the figure (default names the histogram and its window) */
  chartTitle?: string;
  /** EGA badge beside the caption (default E1) */
  grade?: "E1" | "E2" | "E3" | "E4" | null;
  /** 口径 line under the figure at 19px */
  scope?: string | null;
  note?: string | null;
  page?: number;
}
export function ProofSlide(props: ProofSlideProps): JSX.Element;

/** the deterministic 260-ticket 样张 sample behind the default histogram */
export const SAMPLE_TICKETS: number[];
