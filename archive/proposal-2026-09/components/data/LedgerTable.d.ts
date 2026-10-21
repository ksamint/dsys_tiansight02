import * as React from "react";

/**
 * The report's action table — 动作 / 责任人 / 期限 / 验收指标. Mono columns for anything numeric.
 * Per-cell tone: add a "<key>Tone" field on the row (e.g. deltaTone: "loss").
 */
export interface LedgerColumn {
  key: string;
  label: React.ReactNode;
  align?: "left" | "right" | "center";
  /** render this column in tabular mono */
  mono?: boolean;
}
export interface LedgerTableProps {
  columns: LedgerColumn[];
  rows: Array<Record<string, any>>;
  /** uppercase bronze caption above the table */
  caption?: React.ReactNode;
  dense?: boolean;
  /** source / methodology note under the table */
  footer?: React.ReactNode;
}
export function LedgerTable(props: LedgerTableProps): JSX.Element;
