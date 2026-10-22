import * as React from "react";

/** Square 4px-radius icon affordance for headers, table rows and dismissals. Always pass an accessible label. */
export interface IconButtonProps {
  icon: React.ReactNode;
  /** aria-label — required, the button has no visible text */
  label: string;
  variant?: "quiet" | "outline" | "solid";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export function IconButton(props: IconButtonProps): JSX.Element;
