import * as React from "react";

/** Native select with brand chrome and a bronze ▾ marker. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  options?: Array<string | { value: string; label: string }>;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
