/** @startingPoint section="Tiansight" subtitle="Ink-field primary, gold outline secondary" viewport="700x180" */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = ink field + gold hairline (Q1); secondary = gold outline; quiet = text; charcoal = solid, sparingly */
  variant?: 'primary' | 'secondary' | 'quiet' | 'charcoal';
  size?: 'sm' | 'lg';
  pressed?: boolean;
  /** Optional uppercase Latin suffix, e.g. "Book" */
  latin?: string;
  children: React.ReactNode;
}