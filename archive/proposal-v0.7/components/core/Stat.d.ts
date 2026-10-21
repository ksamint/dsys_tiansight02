export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Mono, 40px, bright gold (legible only at display size) */
  value: string | number;
  unit?: string;
  /** The claim's boundary condition, e.g. 客单价与客流不变 */
  boundary?: string;
  /** Charcoal figure instead of bright gold */
  charcoal?: boolean;
}