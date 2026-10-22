/* 侍天 TIANSIGHT — component types, window.TIANSIGHT. Synced from ksamint/dsys_tiansight01 @ 0548dc7 (components/**/*.d.ts). Documentation only. */
import * as React from "react";

// ── Badge (core) ──
/** Status marker for report metadata and plan states — ¥1,999 / 月 · 真实报告 · V4.2 · 深度共建. */
export interface BadgeProps {
  children?: React.ReactNode;
  /** gold = brand default (soft gold-100 ground); bronze is a retained alias of gold */
  tone?: "gold" | "bronze" | "neutral" | "growth" | "loss" | "caution";
  /** solid = 素墨 ink-primary fill + 玄墨 mono text (prices, tiers); outline = pill with the tone's hairline (status); soft = tinted ground */
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
  /** set figures in IBM Plex Mono; solid is always mono */
  mono?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;

// ── Button (core) ──
/**
 * 侍天 primary action. Print-derived geometry: 2px radius, 素墨 ink field with a gold hairline, no shadow, press = 1px stamp down.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = 素墨 ink field + gold hairline (one per view), secondary = card hairline on 宣纸, ghost = gold text, inverse = gold fill for the single charcoal card */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  /** brand glyph node (Icon), stroke-width 1.5 */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  /** renders an <a> instead of a <button> */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
}
export function Button(props: ButtonProps): JSX.Element;

// ── Card (core) ──
/** Warm-white document panel: hairline border, 4px radius, ink-toned shadow. Emphasis = bronze top rule, not a bigger shadow. */
export interface CardProps {
  children?: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  /** paper = #FFFDF8, muted = parchment-50, inverse = ink closing band */
  tone?: "paper" | "muted" | "inverse";
  /** adds the 2px bronze top rule used on the recommended plan tier */
  emphasized?: boolean;
  /** enables hover lift + pointer */
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;

// ── Divider (core) ──
/** Hairline rule — the brand's main structural device. 1px hair, 1.5px section rule, 2px emphasis. */
export interface DividerProps {
  variant?: "hair" | "rule" | "strong";
  inverse?: boolean;
  vertical?: boolean;
  /** CSS length for the margin along the flow axis */
  spacing?: string;
}
export function Divider(props: DividerProps): JSX.Element;

// ── Eyebrow (core) ──
/** Small-caps bronze kicker that opens every section: eyebrow → headline → substantiation → proof. */
export interface EyebrowProps {
  children?: React.ReactNode;
  tone?: "bronze" | "muted" | "inverse";
  as?: keyof JSX.IntrinsicElements;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;

// ── Icon (core) ──
/**
 * 侍天's own hairline glyph, stroked in currentColor.
 * Brand set (assets/icons.svg, inlined): arrow-right, arrow-up-right, arrow-left,
 * arrow-down, chevron-down, check, cross, menu, external, print, chart, compass,
 * route, correction, store, data, seal.
 * Aliases mapping onto it: x/close→cross, line-chart/trending-up→chart,
 * chevron-right→arrow-right, target→compass, circle-dot/shield→seal,
 * clock→correction, layers→route, database→data.
 * Any other name falls back to a Lucide CDN mask — a flagged substitution.
 */
export interface IconProps {
  /** brand glyph name, an alias, or a Lucide name for the fallback */
  name: string;
  /** px, 18–20 in UI, 24 in feature blocks */
  size?: number;
  /** hairline by default; the brand never thickens past 2 */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;

// ── IconButton (core) ──
/** Square 2px-radius icon affordance for headers, table rows and dismissals. Always pass an accessible label. */
export interface IconButtonProps {
  /** a brand glyph — <Icon name="menu" /> etc. */
  icon: React.ReactNode;
  /** aria-label — required, the button has no visible text */
  label: string;
  /** quiet = bare glyph; outline = 宣纸 + card hairline; primary = 素墨 field + gold hairline. Hovers step the gold ramp; no shadows */
  variant?: "quiet" | "outline" | "primary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export function IconButton(props: IconButtonProps): JSX.Element;

// ── PlanCard (core) ──
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

// ── Quote (core) ──
/** Serif pull quote with a hairline attribution dash. Testimonials are anonymized by role: 餐饮老板 王总. */
export interface QuoteProps {
  children?: React.ReactNode;
  /** 王总 / 张总 / 李总 — surname + title only */
  author?: string;
  /** 餐饮老板 */
  role?: string;
  tone?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
}
export function Quote(props: QuoteProps): JSX.Element;

// ── Seal (core) ──
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

// ── SectionHeading (core) ──
/**
 * Rule-divided section opener carrying the brand's eyebrow → 文言 headline → plain substantiation order.
 */
export interface SectionHeadingProps {
  /** small-caps kicker, ≤14 characters */
  eyebrow?: React.ReactNode;
  /** the 文言-cadence headline, e.g. 一份报告，就是一份决策文件 */
  title: React.ReactNode;
  /** one plain modern-Chinese sentence of substantiation */
  subtitle?: React.ReactNode;
  /** right-aligned Button or link */
  action?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  /** 1.5px bronze rule under the block (default true) */
  rule?: boolean;
  size?: "sm" | "md" | "lg";
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;

// ── Stat (core) ──
/** Monospaced KPI. Every number in this brand is tabular mono — that is the "measured" signature. */
export interface StatProps {
  value: string | number;
  /** 天 / % / 元 — set in sans beside the mono figure */
  unit?: string;
  /** uppercase small-caps caption above the figure */
  label?: string;
  /** one short line of evidence under the figure */
  note?: string;
  tone?: "default" | "bronze" | "growth" | "loss" | "caution" | "inverse";
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "center";
}
export function Stat(props: StatProps): JSX.Element;

// ── StepMarker (core) ──
/**
 * Chinese-numeral hairline circle — the brand's step device for 经营五问 and the 三层 ladder.
 * Never substitute Arabic numerals in filled dots.
 */
export interface StepMarkerProps {
  /** 1-based; maps to 一 二 三 四 五 */
  index?: number;
  /** explicit glyph, overrides index */
  numeral?: string;
  /** 现状 / 机会 / 优先 / 行动 / 结果 */
  label?: string;
  /** 现在怎样 · 看清经营 */
  sublabel?: string;
  /** bronze-filled current step */
  active?: boolean;
  /** circle diameter in px, default 44 */
  size?: number;
  tone?: "default" | "inverse";
}
export function StepMarker(props: StepMarkerProps): JSX.Element;

// ── Tag (core) ──
/** Pill filter/label — the one place the pill radius is allowed. Used for partner names and report chapter filters. */
export interface TagProps {
  children?: React.ReactNode;
  /** selected state: bronze border + parchment fill + weight 500 */
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  /** renders a × affordance */
  onRemove?: (e: React.MouseEvent) => void;
}
export function Tag(props: TagProps): JSX.Element;

// ── Checkbox (forms) ──
/** Square 2px-radius checkbox, bronze accent. Used for data-source consent lists (收银 / 平台 / 会员). */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** secondary line under the label */
  description?: React.ReactNode;
}
export function Checkbox(props: CheckboxProps): JSX.Element;

// ── Input (forms) ──
/** Single-line field: warm-white ground, hairline border, bronze focus ring. Used in the contact and data-intake forms. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  /** helper line under the field */
  hint?: React.ReactNode;
  /** error message; also turns the border 利润流失 red */
  error?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;

// ── Radio (forms) ──
/** Single-choice control, bronze accent. Group by shared `name`; pair with a plain label above the group. */
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}
export function Radio(props: RadioProps): JSX.Element;

// ── Select (forms) ──
/** Native select with brand chrome and a bronze ▾ marker. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  options?: Array<string | { value: string; label: string }>;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;

// ── Switch (forms) ──
/** Controlled toggle for report view options (显示同比 / 仅看异常). Quiet 220ms slide, no bounce. */
export interface SwitchProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
}
export function Switch(props: SwitchProps): JSX.Element;

// ── BarSeries (data) ──
/** Horizontal hairline bar chart — the report's default comparison graphic. No gridlines, no icons, no legend chrome. */
export interface BarSeriesDatum {
  label: string;
  value: number;
  tone?: "bronze" | "growth" | "loss" | "caution" | "datum" | "muted";
}
export interface BarSeriesProps {
  data: BarSeriesDatum[];
  /** fixed scale ceiling; defaults to the series peak */
  max?: number;
  unit?: string;
  showValues?: boolean;
  /** px width of the label gutter */
  labelWidth?: number;
  /** bar thickness in px */
  height?: number;
}
export function BarSeries(props: BarSeriesProps): JSX.Element;

// ── LedgerTable (data) ──
/**
 * The report's action table — 动作 / 责任人 / 期限 / 验收指标. Mono columns for anything numeric.
 * Per-cell tone: add a "<key>Tone" field on the row (e.g. deltaTone: "loss").
 */
export interface LedgerColumn {
  key: string;
  label: React.ReactNode;
  align?: "left" | "right" | "center";
  /** render this column in tabular mono */
  mono?: boolean;
}
export interface LedgerTableProps {
  columns: LedgerColumn[];
  rows: Array<Record<string, any>>;
  /** uppercase bronze caption above the table */
  caption?: React.ReactNode;
  dense?: boolean;
  /** source / methodology note under the table */
  footer?: React.ReactNode;
}
export function LedgerTable(props: LedgerTableProps): JSX.Element;

// ── Matrix2x2 (data) ──
/**
 * Four-quadrant scatter — the report's signature graphic (复购分层四象限, 利润敏感性矩阵,
 * 渗透率矩阵, 商圈供需洞察). Points are placed in normalized 0–1 space.
 */
export interface MatrixPoint {
  label: string;
  /** 0–1, left to right */
  x: number;
  /** 0–1, bottom to top */
  y: number;
  tone?: "bronze" | "growth" | "loss" | "caution" | "datum" | "muted";
  /** dot diameter px, default 9 */
  size?: number;
}
export interface Matrix2x2Props {
  /** uppercase axis caption under the plot */
  xAxis?: string;
  /** uppercase axis caption, rendered vertically */
  yAxis?: string;
  /** quadrant labels in order: top-left, top-right, bottom-left, bottom-right */
  quadrants?: Array<{ label: string; tone?: string }>;
  points?: MatrixPoint[];
  height?: number;
}
export function Matrix2x2(props: Matrix2x2Props): JSX.Element;

// ── MetricRow (data) ──
/** One line of a report ledger: label + mono figure + signed delta. The delta's tone carries the judgement. */
export interface MetricRowProps {
  label: React.ReactNode;
  /**门店 / 渠道 / 时段 qualifier */
  sublabel?: React.ReactNode;
  value: string | number;
  unit?: string;
  /** pre-formatted signed string, e.g. "+3.2%" or "-1.4pt" */
  delta?: string;
  deltaTone?: "growth" | "loss" | "caution" | "datum" | "bronze" | "muted";
  /** short evidence line */
  note?: React.ReactNode;
  dense?: boolean;
}
export function MetricRow(props: MetricRowProps): JSX.Element;

// ── ExpertCard (people) ──
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

// ── PartnerCase (people) ──
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

// ── BoxPlot (charts) ──
/** 分布 + 离群 · box plot per category. Draws through chartKit (d3 v7 on window). */
export interface BoxPlotProps {
  groups: Array<{ label: string; values: number[]; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** long CN labels → horizontal */
  horizontal?: boolean;
  showN?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function BoxPlot(props: BoxPlotProps): JSX.Element;

// ── CalendarHeatmap (charts) ──
/** 趋势 × 日历 · one tile per day for pattern reading. Draws through chartKit (d3 v7 on window). */
export interface CalendarHeatmapProps {
  values: Array<{ date: string; value: number }>;
  /** 同比 around zero → 朱红 ↔ 增长 ramp */
  diverging?: boolean;
  /** tile size px (auto from width) */
  cell?: number;
  format?: (v: number) => string;
  unit?: string;
  /** 1 = Monday (default), 0 = Sunday */
  weekStart?: 0 | 1;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function CalendarHeatmap(props: CalendarHeatmapProps): JSX.Element;

// ── DivergingBars (charts) ──
/** 偏差 · deviation from a target, zero line centred. Draws through chartKit (d3 v7 on window). */
export interface DivergingBarsProps {
  rows: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** sort by value (default true) */
  sorted?: boolean;
  /** 增长 right / 利润流失 left (default) or brand gold */
  semantic?: boolean;
  labelWidth?: number;
  targetLabel?: string;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function DivergingBars(props: DivergingBarsProps): JSX.Element;

// ── Donut (charts) ──
/**
 * 占比环 — a share breakdown with an optional center figure and a value legend.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface DonutProps {
  data: Array<{ label: string; value: number; tone?: string }>;
  size?: number;
  thickness?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** big mono figure in the middle */
  centerValue?: string | number;
  centerLabel?: string;
  unit?: string;
  showLegend?: boolean;
}
export function Donut(props: DonutProps): JSX.Element;

// ── Dumbbell (charts) ──
/** 比较 · two-state comparison (P1↔P2 KPIs) as point×2 + line, horizontal. Draws through chartKit (d3 v7 on window). */
export interface DumbbellProps {
  rows: Array<{ label: string; before: number; after: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  fromLabel?: string;
  toLabel?: string;
  /** colour the change 增长/利润流失 (default) or keep brand gold */
  semantic?: boolean;
  labelWidth?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Dumbbell(props: DumbbellProps): JSX.Element;

// ── FacetBars (charts) ──
/** 维度分析 · roll a fact table up by 1–2 dimensions into small-multiple bars, one shared scale. Draws through chartKit (d3 v7 on window). */
export interface FacetBarsProps {
  /** flat fact rows; each row is one observation */
  rows?: any[];
  /** 1–2 dimension keys: [facet, bar] */
  dims?: string[];
  /** measure key or accessor */
  measure?: string | ((row: any) => number);
  agg?: "sum" | "mean" | "count" | "median" | "max" | "min";
  /** pre-aggregated alternative to rows/dims */
  facets?: Array<{ dim: string; items: Array<{ label: string; value: number; n?: number; tone?: string }> }>;
  columns?: number;
  caption?: string;
  note?: string;
  scope?: string;
  unit?: string;
  format?: (v: number) => string;
  /** values are ratios → show as % */
  percent?: boolean;
  panelHeight?: number;
  sortBars?: boolean;
  /** bar label to draw in 玄墨 across every facet */
  highlight?: string;
}
export function FacetBars(props: FacetBarsProps): JSX.Element;

// ── FacetGrid (charts) ──
/** 元模式 · small multiples: one panel per value of an extra dimension, shared scale. Draws through chartKit (d3 v7 on window). */
export interface FacetGridProps {
  panels: Array<{ key?: string; title: string; meta?: string; [k: string]: any }>;
  columns?: number;
  gap?: number;
  /** draw one facet; ctx.width is the facet width, ctx.max any shared scale max */
  render: (panel: any, ctx: { width: number; height: number; max?: number; index: number }) => React.ReactNode;
  caption?: string;
  note?: string;
  scope?: string;
  panelHeight?: number;
  /** shared scale maximum passed to every facet */
  max?: number;
  rowLabel?: string;
}
export function FacetGrid(props: FacetGridProps): JSX.Element;

// ── ForecastCorridor (charts) ──
/** 不确定性 · forecast band (P10–P90) with P50, baseline and 实测. Draws through chartKit (d3 v7 on window). */
export interface ForecastCorridorProps {
  history?: Array<{ label: string; value: number }>;
  forecast?: Array<{ label: string; p10: number; p50: number; p90: number }>;
  /** realised values to compare against the corridor */
  actual?: Array<{ label: string; value: number }>;
  /** 历史同期 / simple baseline, dashed */
  baseline?: Array<{ label: string; value: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  grid?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function ForecastCorridor(props: ForecastCorridorProps): JSX.Element;

// ── Funnel (charts) ──
/**
 * 转化漏斗 — stage widths proportional to value, with per-stage drop-off on the right.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface FunnelProps {
  stages: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  /** show the % change vs the previous stage */
  showDrop?: boolean;
}
export function Funnel(props: FunnelProps): JSX.Element;

// ── Gantt (charts) ──
/** 时段 / 区间 · life spans and versions on a time axis; canvas above 120 rows. Draws through chartKit (d3 v7 on window). */
export interface GanttProps {
  rows: Array<{ label: string; start: string | Date; end: string | Date; tone?: string; group?: string; note?: string }>;
  height?: number;
  /** ISO date or Date for a 朱红 today marker */
  today?: string | Date;
  /** switch bars to canvas above this row count (default 120) */
  canvasThreshold?: number;
  rowHeight?: number;
  labelWidth?: number;
  /** group name → tone, drives colour and legend */
  groupTone?: Record<string, string>;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Gantt(props: GanttProps): JSX.Element;

// ── Gauge (charts) ──
/**
 * 指标达成 gauge — a 200° arc with the target ticked; the fill tones itself by attainment.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface GaugeProps {
  value?: number;
  /** the goal; ticked on the arc */
  target?: number;
  /** scale ceiling; defaults to target × 1.25 */
  max?: number;
  size?: number;
  label?: string;
  unit?: string;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** tone by attainment: ≥100% growth, ≥85% caution, else loss (default true) */
  autoTone?: boolean;
  /** force a tone name instead */
  toneName?: string;
}
export function Gauge(props: GaugeProps): JSX.Element;

// ── Heatmap (charts) ──
/**
 * 逐店逐月 heatmap — rows × columns keyed `"<row>|<column>"`; `diverging` splits loss↔growth around zero.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface HeatmapProps {
  /** row labels, e.g. 门店 */
  rows: string[];
  /** column labels, e.g. 月份 */
  columns: string[];
  /** values keyed "<row>|<column>"; missing keys render as a dashed empty cell */
  values: Record<string, number>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** loss→paper→growth ramp instead of parchment→bronze */
  diverging?: boolean;
  unit?: string;
  cellGap?: number;
  labelWidth?: number;
}
export function Heatmap(props: HeatmapProps): JSX.Element;

// ── Histogram (charts) ──
/** 分布 · histogram with KDE density and reference marks. Draws through chartKit (d3 v7 on window). */
export interface HistogramProps {
  values: number[];
  /** bin count hint for d3.bin */
  bins?: number;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** overlay a kernel density curve (default true) */
  density?: boolean;
  /** vertical reference lines: mean, thresholds */
  marks?: Array<{ label: string; value: number; tone?: "gold" | "loss" }>;
  /** shaded value ranges the reading is about (a 价格带), dashed edges, optional label with the share */
  bands?: Array<{ from: number; to: number; label?: string }>;
  domain?: [number, number];
  /** show the n / 密度曲线 legend (default true) */
  legend?: boolean;
  /** y tick count hint (default 4); use 2–3 on short charts so 10px ticks keep clear of each other */
  yTicks?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Histogram(props: HistogramProps): JSX.Element;

// ── Lollipop (charts) ──
/** 排序 · point + hairline rank chart, the light version of a sorted bar. Draws through chartKit (d3 v7 on window). */
export interface LollipopProps {
  rows: Array<{ label: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  labelWidth?: number;
  /** dashed 朱红 rule; items at or above it turn gold */
  threshold?: number;
  thresholdLabel?: string;
  sorted?: boolean;
  /** labels drawn in 玄墨 */
  highlight?: string[];
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Lollipop(props: LollipopProps): JSX.Element;

// ── Lorenz (charts) ──
/** 集中度 · Lorenz curve with the Gini coefficient and the top-share marker. Draws through chartKit (d3 v7 on window). */
export interface LorenzProps {
  /** positive values, one per item (SKU 销售额) */
  values: number[];
  height?: number;
  /** fraction of items to mark, default 0.2 (前 20% SKU) */
  topShare?: number;
  itemLabel?: string;
  valueLabel?: string;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Lorenz(props: LorenzProps): JSX.Element;

// ── Mekko (charts) ──
/** 构成 × 两个分类 · marimekko: column width = outer share, segment height = inner share. Draws through chartKit (d3 v7 on window). */
export interface MekkoProps {
  columns: Array<{ label: string; parts: Array<{ label: string; value: number }> }>;
  height?: number;
  format?: (v: number) => string;
  /** px² below which a segment gets no label */
  minLabelArea?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Mekko(props: MekkoProps): JSX.Element;

// ── NineGrid (charts) ──
/** 九宫格 · dimension × dimension matrix over a SKU list (味型 × 工艺 and the other six structure presets), with gap cells and click-to-list. Draws through chartKit (d3 v7 on window). */
export interface NineGridProps {
  /** SKU rows carrying the dimension keys (flavor, craft, ingredient, price_band, primary_scene, …) — 菜品 cohort only */
  items: any[];
  /** row dimension key, verbatim from the field contract */
  rowDim?: string;
  colDim?: string;
  /** optional measure instead of SKU count */
  measure?: string | ((row: any) => number);
  agg?: "sum" | "mean";
  unit?: string;
  format?: (v: number) => string;
  /** field used to name SKUs in the detail list */
  labelKey?: string;
  maxRows?: number;
  maxCols?: number;
  interactive?: boolean;
  onSelect?: (sel: { r: string; c: string; items: any[] } | null) => void;
  /** print "·" in empty cells and count 研发补缺 candidates */
  showGaps?: boolean;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function NineGrid(props: NineGridProps): JSX.Element;

// ── PairedBars (charts) ──
/** 结构错位 · two shares of the same categories side by side on one scale, gap printed. Draws through chartKit (d3 v7 on window). */
export interface PairedBarsProps {
  rows: Array<{ label: string; a: number; b: number }>;
  height?: number;
  aLabel?: string;
  bLabel?: string;
  /** values are ratios → % (default true) */
  percent?: boolean;
  unit?: string;
  format?: (v: number) => string;
  labelWidth?: number;
  showGap?: boolean;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function PairedBars(props: PairedBarsProps): JSX.Element;

// ── Pareto (charts) ──
/** ABC 二八 · ranked bars with the cumulative-share line on a declared 0–100% axis; A/B cuts at 80% / 95%. Draws through chartKit (d3 v7 on window). */
export interface ParetoProps {
  rows: Array<{ label: string; value: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** cumulative-share cut points for A and B (default [0.8, 0.95]) */
  cuts?: [number, number];
  /** cap on bars drawn (the tail is still counted in the total) */
  maxBars?: number;
  /** draw every k-th x label */
  labelEvery?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Pareto(props: ParetoProps): JSX.Element;

// ── Sankey (charts) ──
/** 流转 · Sankey with gradient links, path isolation on hover/click, in/out ledger, stage headers and a visible 未分配 tail. Needs d3-sankey. */
export interface SankeyProps {
  nodes: Array<{ id: string; label?: string; tone?: string; group?: string }>;
  links: Array<{ source: string; target: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  nodeWidth?: number;
  nodePadding?: number;
  /** column alignment */
  align?: "justify" | "left" | "right" | "center";
  /** one header per column, left to right */
  stages?: string[];
  /** node group → tone; ungrouped nodes are gold */
  groupTone?: Record<string, string>;
  /** print each node's share of the first stage */
  showShare?: boolean;
  /** draw flow that leaves a node unaccounted as a 朱红 tail */
  showBalance?: boolean;
  /** hide labels on nodes thinner than this (px) unless focused */
  minLabelHeight?: number;
  linkOpacity?: number;
  /** order links by value within each node (fewer crossings) */
  sortLinks?: boolean;
  /** draw links in once on mount */
  reveal?: boolean;
  caption?: string;
  note?: string;
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Sankey(props: SankeyProps): JSX.Element;

// ── Scatter (charts) ──
/** 关系 · scatter / bubble with quadrant rules; canvas above 1,500 points. Draws through chartKit (d3 v7 on window). */
export interface ScatterProps {
  points: Array<{ x: number; y: number; r?: number; label?: string; tone?: string }>;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  /** true = median rules; {x,y} = explicit thresholds */
  quadrants?: boolean | { x?: number; y?: number };
  /** four labels: top-left, top-right, bottom-left, bottom-right */
  quadrantLabels?: string[];
  /** switch marks to a canvas layer above this count (default 1500) */
  canvasThreshold?: number;
  maxR?: number;
  /** labels to emphasise and always label */
  emphasis?: string[];
  /** least-squares fit line */
  trend?: boolean;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Scatter(props: ScatterProps): JSX.Element;

// ── ScoreCompass (charts) ──
/** 评分罗盘 · ring of arcs, one per factor, radius = score, tone by threshold, weighted total in the hub. Draws through chartKit (d3 v7 on window). */
export interface ScoreCompassProps {
  factors: Array<{ label: string; score: number; weight?: number; note?: string }>;
  size?: number;
  /** [risk→watch, watch→fit] score cut points, default [45, 68] */
  thresholds?: [number, number];
  hubLabel?: string;
  /** 宜 / 慎 / 否 stamp under the ring */
  verdict?: string;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function ScoreCompass(props: ScoreCompassProps): JSX.Element;

// ── SlopeChart (charts) ──
/** 排序 / 趋势 · rank or value change between exactly two time points. Draws through chartKit (d3 v7 on window). */
export interface SlopeChartProps {
  items: Array<{ label: string; a: number; b: number; tone?: string }>;
  height?: number;
  leftLabel?: string;
  rightLabel?: string;
  /** ≤3 labels to emphasise (明金 → 玄墨 → 朱红); others go muted */
  highlight?: string[];
  unit?: string;
  format?: (v: number) => string;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function SlopeChart(props: SlopeChartProps): JSX.Element;

// ── Sparkline (charts) ──
/**
 * 表内微图 — a bare inline trend for a table cell or MetricRow. No axes, no labels, no tooltip.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  toneName?: string;
  area?: boolean;
  /** dot on the final point (default true) */
  showLast?: boolean;
}
export function Sparkline(props: SparklineProps): JSX.Element;

// ── StackedBars (charts) ──
/**
 * 结构占比 stacked bars — composition across categories; `normalize` makes every bar 100%.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface StackedBarsProps {
  /** rows: [{label, <key>: number, …}] */
  data: Array<Record<string, any>>;
  /** stack order, bottom first */
  keys: string[];
  /** key → tone name, e.g. {堂食:"growth", 外卖:"caution"} */
  tones?: Record<string, string>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  /** convert each bar to 100% */
  normalize?: boolean;
  grid?: boolean;
}
export function StackedBars(props: StackedBarsProps): JSX.Element;

// ── Tornado (charts) ──
/** 敏感性 · each variable swung ±x%, effect on the target as a bar pair around base, sorted by swing. Draws through chartKit (d3 v7 on window). */
export interface TornadoProps {
  rows: Array<{ label: string; low: number; high: number }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  baseLabel?: string;
  /** e.g. ±10% — printed in the legend */
  swingLabel?: string;
  labelWidth?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Tornado(props: TornadoProps): JSX.Element;

// ── Treemap (charts) ──
/** 层级 + 构成 · treemap for 大类 → 系列 → 品项 (area is coarse — label the values). Draws through chartKit (d3 v7 on window). */
export interface TreemapProps {
  data: { name: string; value?: number; children?: any[] };
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  /** px² below which a tile gets no label */
  minLabelArea?: number;
  caption?: string;
  /** 数据来源 / method note under the chart */
  note?: string;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Treemap(props: TreemapProps): JSX.Element;

// ── TrendLine (charts) ──
/**
 * 逐月走势 line chart — one or more series over labelled periods, the report's default time graphic.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface TrendLineProps {
  /** each series: {name, tone, points:[{label,value}], area?, dashed?, emphasis?} */
  series: Array<{ name?: string; tone?: string; points: Array<{ label: string; value: number }>; area?: boolean; dashed?: boolean; emphasis?: boolean }>;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  unit?: string;
  yFormat?: (v: number) => string;
  showPoints?: boolean;
  grid?: boolean;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
  /** horizontal reference lines — 约定目标, 同类基准; they enter the y domain */
  refs?: Array<{ label?: string; value: number; tone?: string }>;
  /** vertical event lines at a period label, e.g. { label: "动作落地", at: "06月" }; place "bottom" puts the label above the axis instead of the top */
  marks?: Array<{ label?: string; at: string; place?: "top" | "bottom" }>;
}
export function TrendLine(props: TrendLineProps): JSX.Element;

// ── Waffle (charts) ──
/** 构成 · 10 × 10 waffle where one cell is 1% (or one real unit), so a share reads as a count. Draws through chartKit (d3 v7 on window). */
export interface WaffleProps {
  parts: Array<{ label: string; value: number; tone?: string }>;
  cols?: number;
  rows?: number;
  /** unit word for the legend, e.g. 件 */
  unitLabel?: string;
  /** line under the legend, e.g. 每 100 件出炉 */
  totalLabel?: string;
  /** cell px (auto from width) */
  cell?: number;
  caption?: string;
  note?: string;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Waffle(props: WaffleProps): JSX.Element;

// ── Waterfall (charts) ──
/**
 * 利润流失归因 waterfall — start value, signed contributions, end value. Gains green, losses red, totals bronze.
 * Draws through `chartKit` (shared margins, tones, axis type). Requires d3 v7 on window.
 */
export interface WaterfallProps {
  /** opening value */
  start: number;
  /** signed contributions in order: [{label, value}] */
  steps: Array<{ label: string; value: number }>;
  startLabel?: string;
  endLabel?: string;
  height?: number;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  /** 口径 footnote — every real figure carries one */
  scope?: string;
  /** EGA evidence grade badge: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断 */
  grade?: "E1" | "E2" | "E3" | "E4";
  /** shown as 单位：<unit> */
  unit?: string;
}
export function Waterfall(props: WaterfallProps): JSX.Element;

// ── chartKit (charts) ──
/**
 * Shared chart grammar — margins, tone hexes, axis type and the d3/width hooks every
 * 侍天 chart draws through. Import from here rather than restyling axes per chart.
 * d3 v7 must be on `window` (CDN); `useD3` waits for it.
 */
export declare const CHART_TONES: Record<string, string>;
/** Literal hex values — d3 interpolation cannot read CSS custom properties. */
export declare const CHART_HEX: Record<string, string>;
/** Ordered series palette: 明金 → 玄墨 → 朱红 → datum → muted. Never a rainbow. */
export declare const SERIES_ORDER: string[];
/** Single-hue gold ramp for quantity; the one diverging pair 朱红 ↔ 增长. */
export declare const SEQUENTIAL: string[];
export declare const DIVERGING: string[];
/** L1 reading task → first-choice charts in this kit (spec B2). */
export declare const TASK_CHARTS: Record<string, { label: string; charts: string[] }>;
/** Decision matrix B6: task × data shape (q1 | q2 | qc | qt | cc) → chart name, or null. */
export function chartFor(task: string, shape: "q1" | "q2" | "qc" | "qt" | "cc"): string | null;
/** Roll a flat fact table up by 1–2 dimension keys. Returns [{ dim, items: [{ label, value, n }] }]. */
export function rollupDims(rows: any[], dims: string[], measure: string | ((r: any) => number), agg?: "sum" | "mean" | "count" | "median" | "max" | "min"): Array<{ dim: string; items: Array<{ label: string; value: number; n: number }> }>;
export declare const Rollup: typeof rollupDims;
/** Dimension keys → 中文, verbatim from vanahom-fb-hom01 analysis-dimensions-field-contract-v1 (CATEGORY_DIMENSIONS / SKU_DIM_META). */
export declare const DIMENSION_LABELS: Record<string, string>;
/** Data grade per dimension: RAW · ANN (annotated, editable) · DER (derived, read-only). */
export declare const DIMENSION_GRADE: Record<string, "RAW" | "ANN" | "DER">;
/** The seven 九宫 structure presets as [rowDim, colDim]. */
export declare const STRUCTURE_PRESETS: Array<[string, string]>;
/** Cross-tab a SKU list by two dimension keys. */
export function crossTab(list: any[], rowDim: string, colDim: string, measure?: string | ((r: any) => number), agg?: "sum" | "mean"): { rows: string[]; cols: string[]; cells: Record<string, { n: number; value: number; items: any[] }> };
/** i-th series tone hex following SERIES_ORDER. */
export function seriesTone(i: number): string;
export declare const CHART_MARGIN: { top: number; right: number; bottom: number; left: number };
export declare const AXIS_LABEL: React.CSSProperties;
export declare const VALUE_LABEL: React.CSSProperties;
/** Semantic tone name → hex. Defaults to bronze. */
export function tone(name?: string): string;
/** Returns window.d3 once available (polls a loading CDN script). `need` names a required plugin, e.g. "sankey". */
export function useD3(need?: string): any;
/** [ref, width] — attach ref to the wrapper; width tracks its measured size. */
export function useWidth(fallback?: number): [React.RefObject<HTMLDivElement>, number];
/** DPR-aware canvas drawn once per data/size change, positioned under the SVG (Scatter, Gantt fast paths). */
export interface CanvasLayerProps { width: number; height: number; draw: (ctx: CanvasRenderingContext2D, info: { width: number; height: number; dpr: number }) => void; deps?: any[] }
export function CanvasLayer(props: CanvasLayerProps): JSX.Element;
/** Evidence-grade / degradation corner badge. */
export interface QualityBadgeProps { grade?: "E1" | "E2" | "E3" | "E4"; degraded?: boolean; label?: string }
export function QualityBadge(props: QualityBadgeProps): JSX.Element | null;
export interface ChartFrameProps {
  caption?: React.ReactNode;
  /** 数据来源 line under the chart */
  note?: React.ReactNode;
  /** 口径 footnote */
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
  degraded?: boolean;
  /** canvas layers rendered under the SVG */
  layers?: React.ReactNode;
  height: number;
  width: number;
  svgRef?: React.Ref<SVGSVGElement>;
  children?: React.ReactNode;
}
export function ChartFrame(props: ChartFrameProps): JSX.Element;
/** Legend rendered as wrapping HTML beside/below the chart — never inside the SVG. */
export interface ChartLegendProps {
  items: Array<{ label: string; tone?: string; dashed?: boolean; band?: boolean }>;
  style?: React.CSSProperties;
}
export function ChartLegend(props: ChartLegendProps): JSX.Element | null;
/** True when a filled cell is dark enough to need light ink (works for both ends of a diverging scale). */
export function isDarkFill(d3: any, color: string): boolean;

export interface AxesProps {
  x: any; y: any; width: number; height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  xTicks?: number; yTicks?: number;
  /** faint horizontal rules at the y ticks; off by default */
  grid?: boolean;
  xFormat?: (v: any) => string;
  yFormat?: (v: any) => string;
  /** x is a band scale (categorical) */
  band?: boolean;
  /** y is a band scale (horizontal charts) */
  yBand?: boolean;
}
export function Axes(props: AxesProps): JSX.Element;
