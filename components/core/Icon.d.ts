import * as React from "react";

/**
 * 侍天's own hairline glyph, stroked in currentColor.
 * Brand set (assets/icons.svg, inlined): arrow-right, arrow-up-right, arrow-left,
 * arrow-down, chevron-down, check, cross, menu, external, print, chart, compass,
 * route, correction, store, data, seal.
 * Aliases mapping onto it: x/close→cross, line-chart/trending-up→chart,
 * chevron-right→arrow-right, target→compass, circle-dot/shield→seal,
 * clock→correction, layers→route, database→data.
 * Any other name falls back to a Lucide CDN mask — a flagged substitution.
 */
export interface IconProps {
  /** brand glyph name, an alias, or a Lucide name for the fallback */
  name: string;
  /** px, 18–20 in UI, 24 in feature blocks */
  size?: number;
  /** hairline by default; the brand never thickens past 2 */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
