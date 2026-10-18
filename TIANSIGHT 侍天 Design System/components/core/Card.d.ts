import * as React from "react";

/** Warm-white document panel: hairline border, 4px radius, ink-toned shadow. Emphasis = bronze top rule, not a bigger shadow. */
export interface CardProps {
  children?: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  /** paper = #FFFDF8, muted = parchment-50, inverse = ink closing band */
  tone?: "paper" | "muted" | "inverse";
  /** adds the 2px bronze top rule used on the recommended plan tier */
  emphasized?: boolean;
  /** enables hover lift + pointer */
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
