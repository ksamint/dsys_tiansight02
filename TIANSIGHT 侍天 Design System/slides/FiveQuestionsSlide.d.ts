import * as React from "react";

/**
 * 经营五问 as a five-step row with Chinese-numeral markers; `active` fills one bronze.
 */
export interface FiveQuestionsSlideProps {
  eyebrow?: string;
  title?: string;
  note?: string;
  steps?: Array<{ label: string; q: string; aim: string }>;
  /** 0-based index of the step to fill bronze */
  active?: number;
  page?: number;
}
export function FiveQuestionsSlide(props: FiveQuestionsSlideProps): JSX.Element;
