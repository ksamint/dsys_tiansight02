import * as React from "react";

/**
 * 逐店逐月 heatmap — rows × columns keyed `"<row>|<column>"`; `diverging` splits loss↔growth around zero.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface HeatmapProps {
  /** row labels, e.g. 门店 */
  rows: string[];
  /** column labels, e.g. 月份 */
  columns: string[];
  /** values keyed "<row>|<column>"; missing keys render as a dashed empty cell */
  values: Record<string, number>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** loss→paper→growth ramp instead of parchment→bronze */
  diverging?: boolean;
  unit?: string;
  cellGap?: number;
  labelWidth?: number;
}
export function Heatmap(props: HeatmapProps): JSX.Element;
