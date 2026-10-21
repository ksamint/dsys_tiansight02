/** Horizontal hairline bar chart — the report's default comparison graphic. No gridlines, no icons, no legend chrome. */
export interface BarSeriesDatum {
  label: string;
  value: number;
  tone?: "bronze" | "growth" | "loss" | "caution" | "datum" | "muted";
}
export interface BarSeriesProps {
  data: BarSeriesDatum[];
  /** fixed scale ceiling; defaults to the series peak */
  max?: number;
  unit?: string;
  showValues?: boolean;
  /** px width of the label gutter */
  labelWidth?: number;
  /** bar thickness in px */
  height?: number;
}
export function BarSeries(props: BarSeriesProps): JSX.Element;
