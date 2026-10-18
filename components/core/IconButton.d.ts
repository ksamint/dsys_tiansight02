import * as React from "react";

/** Square 2px-radius icon affordance for headers, table rows and dismissals. Always pass an accessible label. */
export interface IconButtonProps {
  /** a brand glyph — <Icon name="menu" /> etc. */
  icon: React.ReactNode;
  /** aria-label — required, the button has no visible text */
  label: string;
  /** quiet = bare glyph; outline = 宣纸 + card hairline; primary = 素墨 field + gold hairline. Hovers step the gold ramp; no shadows */
  variant?: "quiet" | "outline" | "primary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export function IconButton(props: IconButtonProps): JSX.Element;
