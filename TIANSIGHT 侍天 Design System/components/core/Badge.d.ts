import * as React from "react";

/** Status marker for report metadata and plan states — 真实报告 / V4.2 / 正在签约中 / 深度共建. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "bronze" | "neutral" | "growth" | "loss" | "caution";
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
}
export function Badge(props: BadgeProps): JSX.Element;
