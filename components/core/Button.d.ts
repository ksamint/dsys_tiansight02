import * as React from "react";

/**
 * 侍天 primary action. Print-derived geometry: 2px radius, 素墨 ink field with a gold hairline, no shadow, press = 1px stamp down.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = 素墨 ink field + gold hairline (one per view), secondary = card hairline on 宣纸, ghost = gold text, inverse = gold fill for the single charcoal card */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  /** brand glyph node (Icon), stroke-width 1.5 */
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
