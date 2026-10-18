import * as React from "react";

/**
 * Numbered step row. Default content is the four stages 开店之前 → 复制扩张 (readme §1);
 * columns follow `steps.length`, so the earlier 经营五问 loop renders by passing five steps.
 * `active` fills one marker bronze. Also exported as `StagesSlide`.
 */
export interface FiveQuestionsSlideProps {
  eyebrow?: string;
  title?: string;
  note?: string;
  /** label = stage, q = its two-beat headline, aim = one line of substantiation; `numeral` overrides 一 二 三 … */
  steps?: Array<{ label: string; q: string; aim: string; numeral?: string }>;
  /** 0-based index of the step to fill bronze */
  active?: number;
  page?: number;
}
export function FiveQuestionsSlide(props: FiveQuestionsSlideProps): JSX.Element;
export const StagesSlide: typeof FiveQuestionsSlide;
