import * as React from "react";

/**
 * Deck opener on the ink ground: seal, two-tone wordmark, 拍板之前，问侍天.
 */
export interface TitleSlideProps {
  /** 拍板之前，问侍天 */
  title?: string;
  subtitle?: string;
  /** 提案对象 — the restaurant brand being pitched */
  client?: string;
  /** 日期, mono */
  date?: string;
  page?: number;
}
export function TitleSlide(props: TitleSlideProps): JSX.Element;
