import * as React from "react";

/**
 * 专家顾问团 roster — circular portrait, name, one-line 头衔, 专长. Portraits fall back to a labelled placeholder.
 */
export interface ExpertTeamSlideProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** four seats reads best; `photo` omitted renders a 专家头像 placeholder */
  experts?: Array<{ name: string; title: string; field?: string; photo?: string }>;
  page?: number;
}
export function ExpertTeamSlide(props: ExpertTeamSlideProps): JSX.Element;
