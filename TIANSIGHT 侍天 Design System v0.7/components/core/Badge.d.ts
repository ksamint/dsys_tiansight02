export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** filled = ink field, mono, square (prices/tiers); outline = gold pill, bright-gold text (status); seal = vermillion (warning) */
  variant?: 'filled' | 'outline' | 'seal';
  children: React.ReactNode;
}