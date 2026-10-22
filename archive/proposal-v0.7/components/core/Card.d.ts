/** @startingPoint section="Tiansight" subtitle="Paper card, 2px radius, 天干 index" viewport="700x240" */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** field = ink-primary fill (recommended tier); charcoal = inverse, ONE per view (p6) */
  variant?: 'field' | 'charcoal';
  /** 天干 index shown top-right in vermillion: 壹 贰 叁 … */
  index?: string;
  caption?: string;
  title?: string;
  interactive?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
}