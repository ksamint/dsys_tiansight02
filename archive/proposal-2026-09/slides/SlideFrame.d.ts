import * as React from "react";

/**
 * 1280×720 slide shell — owns ground, margin, hairline footer, seal and page number.
 * Every slide template wraps its content in this; never hand-roll slide chrome.
 */
export interface SlideFrameProps {
  children?: React.ReactNode;
  /** parchment (default) · paper · muted · ink — max two grounds per deck */
  ground?: "parchment" | "paper" | "muted" | "ink";
  /** small-caps kicker at the top of the slide */
  eyebrow?: React.ReactNode;
  /** page number, zero-padded automatically */
  page?: number;
  /** footer text; defaults to 侍天 TIANSIGHT · 餐饮第二大脑 */
  footer?: React.ReactNode;
  /** apply the .ts-paper 宣纸 grain instead of a flat ground */
  grain?: boolean;
  /** show the seal in the footer (default true) */
  seal?: boolean;
  /** outer margin in px, default 72 */
  pad?: number;
}
export function SlideFrame(props: SlideFrameProps): JSX.Element;

/** Slide-scale display heading: sm 36 · md 46 · lg 62 · xl 88 px. */
export interface SlideTitleProps {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  ground?: "parchment" | "paper" | "muted" | "ink";
  style?: React.CSSProperties;
}
export function SlideTitle(props: SlideTitleProps): JSX.Element;

/** Dashed placeholder standing in for imagery 侍天 has not supplied (portraits, QR codes). */
export interface SlidePlaceholderProps {
  /** what belongs here, e.g. 专家头像 */
  label: React.ReactNode;
  /** CSS aspect-ratio, default "1 / 1" */
  aspect?: string;
  radius?: string;
  /** circular crop, for portraits */
  round?: boolean;
  style?: React.CSSProperties;
}
export function SlidePlaceholder(props: SlidePlaceholderProps): JSX.Element;
