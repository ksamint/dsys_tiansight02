/**
 * 伙伴案例 — one partner's full story: identity, summary, before→after metrics, the
 * actions taken, and a quote. Metrics are PAIRS so every claim shows its baseline.
 * Only use verbatim partner names from the brand's own list; never invent a case.
 */
export interface PartnerCaseProps {
  /** verbatim brand name, e.g. 韵 1980 新派淮扬菜 */
  brand: string;
  /** 业态, e.g. 新派淮扬菜 */
  kind?: string;
  /** store count */
  stores?: number | string;
  /** 自 <since>, e.g. 2024-09 */
  since?: string;
  summary?: string;
  /** before→after pairs; tone "loss" colours a reduction target red */
  metrics?: Array<{ label: string; before: string; after: string; delta?: string; tone?: "growth" | "loss" }>;
  /** what was actually executed, numbered */
  actions?: string[];
  quote?: { text: string; by: string; role?: string };
  /** logo path once artwork exists; omitted renders the name in type only */
  logo?: string;
}
export function PartnerCase(props: PartnerCaseProps): JSX.Element;
