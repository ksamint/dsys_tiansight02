import * as React from "react";

/** Serif pull quote with a hairline attribution dash. Testimonials are anonymized by role: 餐饮老板 王总. */
export interface QuoteProps {
  children?: React.ReactNode;
  /** 王总 / 张总 / 李总 — surname + title only */
  author?: string;
  /** 餐饮老板 */
  role?: string;
  tone?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
}
export function Quote(props: QuoteProps): JSX.Element;
