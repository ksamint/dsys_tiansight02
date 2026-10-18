import * as React from "react";

/** One line of a report ledger: label + mono figure + signed delta. The delta's tone carries the judgement. */
export interface MetricRowProps {
  label: React.ReactNode;
  /**门店 / 渠道 / 时段 qualifier */
  sublabel?: React.ReactNode;
  value: string | number;
  unit?: string;
  /** pre-formatted signed string, e.g. "+3.2%" or "-1.4pt" */
  delta?: string;
  deltaTone?: "growth" | "loss" | "caution" | "datum" | "bronze" | "muted";
  /** short evidence line */
  note?: React.ReactNode;
  dense?: boolean;
}
export function MetricRow(props: MetricRowProps): JSX.Element;
