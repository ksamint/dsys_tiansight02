import * as React from "react";

/**
 * Section divider with a Chinese numeral and the oversized outline-seal ornament.
 */
export interface SectionSlideProps {
  /** 1-based; maps to 一 二 三 四 五 */
  index?: number;
  /** explicit glyph, overrides index */
  numeral?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  page?: number;
}
export function SectionSlide(props: SectionSlideProps): JSX.Element;
