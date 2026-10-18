import * as React from "react";

/**
 * 侍天 primary action. Print-derived geometry: 4px radius, bronze fill, press = 1px stamp down.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = bronze fill (one per view), secondary = hairline outline on warm white, ghost = bronze text, inverse = parchment on ink grounds */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  /** Lucide glyph node, stroke-width 1.5 */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  /** renders an <a> instead of a <button> */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
}
export function Button(props: ButtonProps): JSX.Element;
