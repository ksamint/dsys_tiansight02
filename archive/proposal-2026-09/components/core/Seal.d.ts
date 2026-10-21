/**
 * The 侍天 seal (印章) — the only brand mark. Enforces sizing and the plain-type Latin wordmark rule.
 * Never recolor the calligraphy, never rebuild it as SVG, never derive a monogram from it.
 *
 * WORDMARK RULE: TIANSIGHT is set so INSIGHT reads out of it — the I N S I G H T letters are
 * bronze (--bronze-500; --bronze-300 on ink), the leading T and the A stay ink. The exported
 * `Wordmark` renders this split; never set TIANSIGHT in one flat color.
 */
export interface SealProps {
  /** px; 28–40 in headers, 88–120 in the closing CTA */
  size?: number;
  /** path to assets/logo-seal.png, relative to the consuming page */
  src?: string;
  /** show "TIANSIGHT" set in plain Spectral caps beside the seal (no supplied wordmark exists) */
  wordmark?: boolean;
  /** small-caps line under the wordmark, e.g. 智慧餐饮 · SECOND BRAIN */
  subtitle?: string;
  /** for ink grounds — lightens the mark instead of recoloring it */
  inverse?: boolean;
  align?: "row" | "column";
}
export function Seal(props: SealProps): JSX.Element;

/** The two-tone TIANSIGHT wordmark on its own (INSIGHT in bronze, T and A in ink). */
export interface WordmarkProps {
  /** any CSS font-size */
  fontSize?: string;
  /** lighten for ink grounds */
  inverse?: boolean;
}
export function Wordmark(props: WordmarkProps): JSX.Element;
