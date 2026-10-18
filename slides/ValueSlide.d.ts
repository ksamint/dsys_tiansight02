import * as React from "react";

/**
 * 老板看到的价值 — the four checkable changes as a numbered ledger, the 三不 line
 * (不替老板拍板 · 不凭单一销量砍菜 · 不把预期收益写成已经发生的结果) and the proof line.
 */
export interface ValueSlideProps {
  eyebrow?: string;
  title?: string;
  /** the checkable changes, one per row; default the four from the company intro */
  items?: string[];
  /** the bounding statement under the title */
  note?: string;
  /** the closing proof line in 深金 */
  proof?: string;
  page?: number;
}
export function ValueSlide(props: ValueSlideProps): JSX.Element;
