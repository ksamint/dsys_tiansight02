import * as React from "react";

/** Controlled toggle for report view options (显示同比 / 仅看异常). Quiet 220ms slide, no bounce. */
export interface SwitchProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
}
export function Switch(props: SwitchProps): JSX.Element;
