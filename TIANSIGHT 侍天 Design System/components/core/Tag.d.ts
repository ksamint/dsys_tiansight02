import * as React from "react";

/** Pill filter/label — the one place the pill radius is allowed. Used for partner names and report chapter filters. */
export interface TagProps {
  children?: React.ReactNode;
  /** selected state: bronze border + parchment fill + weight 500 */
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  /** renders a × affordance */
  onRemove?: (e: React.MouseEvent) => void;
}
export function Tag(props: TagProps): JSX.Element;
