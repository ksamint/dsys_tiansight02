import * as React from "react";

/**
 * Four-across card row. Default content is 餐饮第二大脑's four parts (点单模型 · 经营看板 ·
 * 教练式督导 · 持续复盘); the earlier 三层 + X service ladder renders by passing `tiers`
 * (last one with `numeral: "X"`, a `mode` badge) and `highlight`. No shadow — emphasis is
 * a gold top rule on a paper ground.
 */
export interface LadderSlideProps {
  eyebrow?: string;
  title?: string;
  /** tier = small-caps label above the name (Latin reads best), got = one sentence under `gotLabel` */
  tiers?: Array<{ tier?: string; name: string; mode?: string; got: string; numeral?: string }>;
  /** 0-based index of the raised card; default -1 (none) */
  highlight?: number;
  /** small-caps label above each description; default 作用 — use 老板得到 for a service ladder */
  gotLabel?: string;
  page?: number;
}
export function LadderSlide(props: LadderSlideProps): JSX.Element;
