import * as React from "react";

/** Single-line field: warm-white ground, hairline border, bronze focus ring. Used in the contact and data-intake forms. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  /** helper line under the field */
  hint?: React.ReactNode;
  /** error message; also turns the border 利润流失 red */
  error?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
