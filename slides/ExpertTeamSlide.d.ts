import * as React from "react";

/**
 * People roster — circular portrait, name, one-line 头衔, 专长. Default content is the
 * 专家顾问团 placeholder roster; pass the two founders for a 创始团队 slide (≤2 people lay
 * out portrait-left). Portraits fall back to a labelled placeholder until `photo` is given.
 */
export interface ExpertTeamSlideProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** 1–4 seats per row; `photo` omitted renders a placeholder */
  experts?: Array<{ name: string; title: string; field?: string; photo?: string }>;
  page?: number;
}
export function ExpertTeamSlide(props: ExpertTeamSlideProps): JSX.Element;
