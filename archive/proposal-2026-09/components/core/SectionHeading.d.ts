import * as React from "react";

/**
 * Rule-divided section opener carrying the brand's eyebrow → 文言 headline → plain substantiation order.
 */
export interface SectionHeadingProps {
  /** small-caps kicker, ≤14 characters */
  eyebrow?: React.ReactNode;
  /** the 文言-cadence headline, e.g. 一份报告，就是一份决策文件 */
  title: React.ReactNode;
  /** one plain modern-Chinese sentence of substantiation */
  subtitle?: React.ReactNode;
  /** right-aligned Button or link */
  action?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  /** 1.5px bronze rule under the block (default true) */
  rule?: boolean;
  size?: "sm" | "md" | "lg";
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
