import * as React from "react";

/**
 * Lucide glyph, masked to currentColor. SUBSTITUTED SET — 侍天 supplied no icons.
 * Approved names: arrow-right, arrow-up-right, check, chevron-down, chevron-right,
 * circle-dot, file-text, layers, line-chart, search, shield, store, target,
 * trending-down, trending-up, users, x.
 */
export interface IconProps {
  /** kebab-case Lucide icon name */
  name: string;
  /** px, 18–20 in UI, 24 in feature blocks */
  size?: number;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
