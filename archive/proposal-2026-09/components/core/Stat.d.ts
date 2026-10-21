/** Monospaced KPI. Every number in this brand is tabular mono — that is the "measured" signature. */
export interface StatProps {
  value: string | number;
  /** 天 / % / 元 — set in sans beside the mono figure */
  unit?: string;
  /** uppercase small-caps caption above the figure */
  label?: string;
  /** one short line of evidence under the figure */
  note?: string;
  tone?: "default" | "bronze" | "growth" | "loss" | "caution" | "inverse";
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "center";
}
export function Stat(props: StatProps): JSX.Element;
