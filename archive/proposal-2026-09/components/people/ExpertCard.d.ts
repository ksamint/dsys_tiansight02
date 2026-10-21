/**
 * A 专家顾问团 seat: circular portrait, name, one-line 头衔, optional 专长 line and tags.
 * An absent `photo` renders a dashed 专家头像 placeholder — never substitute a drawn avatar.
 */
export interface ExpertCardProps {
  name: string;
  /** the short 头衔 — one line, e.g. 淮扬菜出品顾问 */
  title: string;
  /** 专长 line, e.g. 菜品结构 · 出餐标准 */
  field?: string;
  /** portrait path; omitted renders the placeholder */
  photo?: string;
  /** short specialism chips */
  tags?: string[];
  /** stack (default) for a grid, row for a list or sidebar */
  layout?: "stack" | "row";
  /** portrait diameter px, default 132 */
  size?: number;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export function ExpertCard(props: ExpertCardProps): JSX.Element;
