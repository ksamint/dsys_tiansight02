import * as React from "react";

/** Square 2px-radius checkbox, bronze accent. Used for data-source consent lists (收银 / 平台 / 会员). */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** secondary line under the label */
  description?: React.ReactNode;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
