/** Hairline rule — the brand's main structural device. 1px hair, 1.5px section rule, 2px emphasis. */
export interface DividerProps {
  variant?: "hair" | "rule" | "strong";
  inverse?: boolean;
  vertical?: boolean;
  /** CSS length for the margin along the flow axis */
  spacing?: string;
}
export function Divider(props: DividerProps): JSX.Element;
