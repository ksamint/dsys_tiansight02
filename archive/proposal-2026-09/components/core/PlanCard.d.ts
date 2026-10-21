import * as React from "react";

/**
 * A tier of the 三层 + X service ladder. The 老板得到 block is structural — never omit it.
 */
export interface PlanCardProps {
  /** 第一层 · 经营洞察 */
  tier: string;
  /** 先把问题看清 */
  name: string;
  /** one plain sentence */
  tagline?: string;
  /** what the owner gets — rendered under the 老板得到 label */
  deliverable: string;
  /** engagement mode badge: 深度共建 / 从 0 共创 / 按需挂接 */
  mode?: string;
  action?: React.ReactNode;
  /** bronze top rule + solid mode badge for the recommended tier */
  emphasized?: boolean;
}
export function PlanCard(props: PlanCardProps): JSX.Element;
