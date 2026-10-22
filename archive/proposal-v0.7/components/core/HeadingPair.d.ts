export interface HeadingPairProps extends React.HTMLAttributes<HTMLDivElement> {
  /** UPPERCASE EN caption in deep gold, rendered above the CN heading */
  caption: string;
  level?: 1 | 2 | 3 | 4;
  /** Muted supporting line, weight 300 */
  sub?: string;
  children: React.ReactNode;
}