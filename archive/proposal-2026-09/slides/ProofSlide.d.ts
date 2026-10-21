import * as React from "react";

/**
 * Sample-report evidence slide: one 结论 card carrying the mandatory 证据 / 利润影响 / 执行动作 / 验收指标 quartet.
 */
export interface ProofSlideProps {
  eyebrow?: string;
  title?: string;
  /** the headline finding */
  conclusion?: string;
  /** exactly four elements; tone "growth"/"loss" renders the value in mono color */
  elements?: Array<{ k: string; v: string; tone?: "growth" | "loss" }>;
  note?: string;
  page?: number;
}
export function ProofSlide(props: ProofSlideProps): JSX.Element;
