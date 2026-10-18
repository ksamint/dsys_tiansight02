import * as React from "react";

/**
 * The 主张 slide — headline, one paragraph of substantiation, and the three beats
 * 让顾客愿意点 / 让团队做得稳 / 让经营留下收益 as a ruled ledger. Pass `stats` instead for a
 * numeric offer (mono value + unit rows).
 */
export interface PromiseSlideProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** defaults to the three beats; each label is a short verb phrase, note one plain sentence */
  points?: Array<{ label: string; note?: string }>;
  /** when given, replaces `points` with a mono stat ledger */
  stats?: Array<{ label: string; value: string; unit?: string; accent?: boolean }>;
  page?: number;
}
export function PromiseSlide(props: PromiseSlideProps): JSX.Element;
