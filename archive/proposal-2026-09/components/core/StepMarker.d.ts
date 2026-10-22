/**
 * Chinese-numeral hairline circle — the brand's step device for 经营五问 and the 三层 ladder.
 * Never substitute Arabic numerals in filled dots.
 */
export interface StepMarkerProps {
  /** 1-based; maps to 一 二 三 四 五 */
  index?: number;
  /** explicit glyph, overrides index */
  numeral?: string;
  /** 现状 / 机会 / 优先 / 行动 / 结果 */
  label?: string;
  /** 现在怎样 · 看清经营 */
  sublabel?: string;
  /** bronze-filled current step */
  active?: boolean;
  /** circle diameter in px, default 44 */
  size?: number;
  tone?: "default" | "inverse";
}
export function StepMarker(props: StepMarkerProps): JSX.Element;
