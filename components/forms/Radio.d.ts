import * as React from "react";

/** Single-choice control, bronze accent. Group by shared `name`; pair with a plain label above the group. */
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}
export function Radio(props: RadioProps): JSX.Element;
