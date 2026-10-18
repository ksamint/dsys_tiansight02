import * as React from "react";

/** Status marker for report metadata and plan states — ¥1,999 / 月 · 真实报告 · V4.2 · 深度共建. */
export interface BadgeProps {
  children?: React.ReactNode;
  /** gold = brand default (soft gold-100 ground); bronze is a retained alias of gold */
  tone?: "gold" | "bronze" | "neutral" | "growth" | "loss" | "caution";
  /** solid = 素墨 ink-primary fill + 玄墨 mono text (prices, tiers); outline = pill with the tone's hairline (status); soft = tinted ground */
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
  /** set figures in IBM Plex Mono; solid is always mono */
  mono?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;
