/**
 * Four-quadrant scatter — the report's signature graphic (复购分层四象限, 利润敏感性矩阵,
 * 渗透率矩阵, 商圈供需洞察). Points are placed in normalized 0–1 space.
 */
export interface MatrixPoint {
  label: string;
  /** 0–1, left to right */
  x: number;
  /** 0–1, bottom to top */
  y: number;
  tone?: "bronze" | "growth" | "loss" | "caution" | "datum" | "muted";
  /** dot diameter px, default 9 */
  size?: number;
}
export interface Matrix2x2Props {
  /** uppercase axis caption under the plot */
  xAxis?: string;
  /** uppercase axis caption, rendered vertically */
  yAxis?: string;
  /** quadrant labels in order: top-left, top-right, bottom-left, bottom-right */
  quadrants?: Array<{ label: string; tone?: string }>;
  points?: MatrixPoint[];
  height?: number;
}
export function Matrix2x2(props: Matrix2x2Props): JSX.Element;
