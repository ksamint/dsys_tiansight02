import * as React from "react";

/**
 * 三层 + X service ladder, four across; `highlight` raises the recommended tier.
 */
export interface LadderSlideProps {
  eyebrow?: string;
  title?: string;
  tiers?: Array<{ tier: string; name: string; mode?: string; got: string }>;
  /** 0-based index of the recommended tier, default 1 */
  highlight?: number;
  page?: number;
}
export function LadderSlide(props: LadderSlideProps): JSX.Element;
