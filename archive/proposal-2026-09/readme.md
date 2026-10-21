# 侍天 TIANSIGHT — Design System

> 侍天 · 智慧餐饮 — 餐饮第二大脑，打造 AI 原生餐饮组织
> *Second Brain / Decision System / Restaurant Growth*

## 1. Company & product context

侍天 (TIANSIGHT) sells **restaurant operating intelligence** to Chinese F&B owners and
chains. The customer hands over ~6 months of operating data (收银 POS, 平台 delivery,
会员 CRM, 门店 store-level); within 7 days 侍天 returns an **经营诊断** — a decision
document, not a dashboard tour. Its promise is unusually specific and is the spine of
all copy:

> 交 6 个月经营数据，7 日内取得经营诊断：增长在何处、利润失于何处、先改哪三件、由谁执行、以何验收。

### Surfaces represented in this system

| Surface | What it is | Where |
|---|---|---|
| 官网 Marketing site | Single long-scroll site: hero → 报告样张 → 经营五问 → 服务与价格 (三层+X) → 伙伴背书 → 联系 | `ui_kits/website/` |
| 报告样张 Report sample | The deliverable itself: 决策维度 / 分析维度 / 趋势与归因 / 方法论地图 pages, plus the five insight matrices (渗透率矩阵, 商圈供需洞察, 复购分层四象限, 利润敏感性矩阵, 价格带断层洞察) | `ui_kits/report/` |
| 销售提案 Sales deck | 16:9 deck pitching 侍天 to a restaurant owner — 11 slide templates | `slides/`, `templates/sales-deck/` |

### Product framework (memorize this — it drives most layouts)

**经营五问** — a five-step loop, run 逐店逐月 (store by store, month by month):
现状 (现在怎样 · 看清经营) → 机会 (机会在哪 · 发现增长点) → 优先 (先做什么 · 判断顺序)
→ 行动 (谁来负责 · 形成清单) → 结果 (是否有效 · 验证结果).
Closing line: 经验证有效的做法沉淀为门店标准，不随人员流动而流失。

**三层 + X** service ladder:
- 第一层 · 经营洞察 — 先把问题看清
- 第二层 · 第二大脑共建 — 让系统昼夜守望经营 (深度共建)
- 第三层 · AI 原生品牌 — 从零构建一个新品牌 (从 0 共创)
- X · 增值专项 — 随层挂接，按需启用 (按需挂接)

**三件事** owner-facing triad: 看得清 / 改得动 / 留得下.

**Named customers** (use verbatim, never invent new ones): 苏帮袁、清水亭、3699 河鲜小馆、
游园京梦、吴裕泰、韵 1980 新派淮扬菜、潮发潮汕牛肉、更多伙伴（正在签约中）.

### Sources given for this system

- `uploads/侍天-透明-页眉.png` — the only brand asset supplied: a transparent-background
  circular seal (印章) containing 侍天 in brush calligraphy. Copied to `assets/logo-seal.png`.
- Brand color pair supplied in the brief: 主色 `#EFE6D2`, 辅助色 `#76551F`.
- A full page of marketing copy (hero, 五问, 三层+X, testimonials, footer) — quoted
  throughout this readme and reproduced in the website UI kit.
- **No codebase, no Figma file, no slide deck, and no font binaries were provided.**
  Everything below is derived from the copy, the two brand colors, and the seal mark.
  Wordmark/typography and all component geometry are therefore *proposals grounded in the
  brand's print-derived character* — see Caveats at the end.

---

## 2. Content fundamentals

**Voice: 参谋，不是销售.** 侍天 writes like a strategist filing a report to a decision
maker. Confident, compressed, evidentiary. It never hypes and never apologizes.

**1. Classical-Chinese compression.** Headline copy uses four-character and parallel
constructions with 文言 cadence — the single most recognizable trait of the brand.

> 拍板之前，问侍天
> 五问既明，百事可决
> 增长在何处、利润失于何处
> 携手侍天，持续领先。
> 增长与止损，皆可量化

Rules: prefer 何处/皆/既/可 over 哪里/都/已经/能够 in **headlines**; drop 的 and 了 where
grammar allows; keep clauses to 4–8 characters and pair them. Body copy then relaxes into
plain modern Chinese — the contrast is the effect.

**2. Every claim carries evidence and a number.** The brand's stated standard for a
report conclusion is four elements: **证据、利润影响、执行动作、验收指标**. Copy mirrors it.

> 可计算的，量化到位；不可计算的，如实说明。

Never write a benefit without its verification: not "提升复购" but "复购分层四象限 →
先改哪三件 → 由谁执行 → 以何验收". Honesty about limits is a selling point, not a hedge.

**3. Address: 老板 / 经营者, in the second person, unnamed.** Section labels literally read
**老板得到** ("what the owner gets"). 侍天 refers to itself in the third person by name
("问侍天", "把复杂留给侍天") — never 我们/我 in headlines. Never 您 (too deferential for a
peer advisor); 你 is used sparingly, mostly implied and omitted.

**4. Three-beat structure everywhere.** Copy comes in threes and fives, labeled:
看得清 / 改得动 / 留得下 · 现状/机会/优先/行动/结果 · 哪里最值得先改 / 谁负责，何时完成 /
用什么指标验收. Each beat = a 3-char verb phrase + one plain sentence of substantiation.
When writing new sections, find the triad before writing prose.

**5. Testimonials are anonymized by role.** 餐饮老板 王总 / 张总 / 李总. Quotes are blunt
and mention the mechanism, including AI skepticism:

> "报告分析得非常细，最关键的是结论有证据，不靠猜，也没有 AI 幻觉。"

**6. Casing & mixed script.** Chinese is primary; English is a quiet subtitle layer.
Latin brand strings are set in **ALL CAPS with wide tracking** (TIANSIGHT, TABLE AI
ALLIANCE, SECOND BRAIN / DECISION SYSTEM / RESTAURANT GROWTH). The wordmark itself is a
pun and is **always set two-tone** — see Iconography. Latin taglines use
sentence case with a period: *Time is money. With TIANSIGHT, lose neither.* Version and
data strings stay bare and monospaced: `V4.2`, `90 天`, `7 日内`, `6 个月`.
Numbers are always Arabic, with a hair space either side in Chinese runs (交 6 个月).

**7. No emoji. Ever.** No exclamation marks except inside a customer quote. No
"革命性/颠覆/赋能/闭环" consultant filler. No first-person plural marketing ("我们相信…").
CTAs are imperative and short: 进入平台 · 服务与价格 · 更多伙伴 · 微信扫码联系侍天.

**Micro-copy patterns to reuse**
- Eyebrow → headline → one-sentence substantiation → proof list. Always in that order.
- Card title = 3 characters. Card body = one sentence, ends with a period.
- Section kicker sets the stakes in ≤14 characters: 以样张为证 · 把复杂留给侍天 · 层层递进，天天有数.

---

## 3. Visual foundations

The brand's frame of reference is a **printed report on 宣纸-toned stock, stamped with a
seal** — an archive document, not a SaaS dashboard. Every decision below follows from that.

### Color

| Role | Token | Value |
|---|---|---|
| 主色 parchment (page ground) | `--parchment-200` / `--surface-page` | `#EFE6D2` |
| 辅助色 bronze (accent, rules, seal) | `--bronze-500` / `--text-accent` | `#76551F` |
| Seal ink (logo brush) | `--ink-600` | `#5B4A3F` |
| Ink display / body | `--ink-900` / `--ink-700` | `#241F19` / `#4A4136` |
| Card | `--surface-card` | `#FFFDF8` (warm white, never `#fff`) |
| Inverse ground | `--surface-inverse` | `#241F19` |

Data semantics for report charts: 增长 `--growth-500 #4E6B3F`, 利润流失
`--loss-500 #A34A2C`, 关注 `--caution-500 #B98B2A`, neutral datum `--datum-500 #3F5A6B`.
All four are desaturated to sit on parchment without vibrating.

**Rules.** Max two ground colors per composition: parchment + warm white, or parchment +
ink for one closing/inverse section. Bronze is *accent only* — rules, small caps, seals,
numerals, active states — never a large fill except on a single primary button or one
full-bleed CTA band. No blue-purple gradients; no pure black; no pure white; no
saturated brights anywhere.

### Type

- **Display & headings:** `--font-display` — Noto Serif SC (stand-in for Source Han
  Serif / 方正). Weight 500 for headings; 300–400 at 52px+ where the serif gets airy.
  Tracking `.06em` on CJK display so characters breathe like letterpress.
- **Body & UI:** `--font-body` — Noto Sans SC, 400/500, line-height 1.62 (CJK needs air).
- **Latin & quotes:** `--font-quote` — Spectral, including italics for pull quotes.
- **Numerals & tables:** `--font-numeral` — IBM Plex Mono, tabular. Every KPI, price,
  percentage and version string is monospaced. This is a signature: the numbers *look*
  measured.
- Eyebrows: 12px sans, uppercase, `.18em` tracking, bronze.
- Never mix more than two families in one block; never use a geometric sans; avoid Inter.

### Layout & spacing

4px base scale; sections breathe at `--section-y: 96px`. Container `1200px`, prose
`--measure: 34em`. Compositions are **left-aligned and rule-divided**, built on visible
grids: 12-col on the site, 4-col label/value ledgers in the report. Centered text only
for the closing CTA and the seal. Fixed elements: a single translucent sticky header
(parchment at 88% + `backdrop-filter: blur(10px)`, hairline bottom rule); nothing else
floats — no floating chat bubbles, no sticky sidebars.

### Borders, radii, cards

Print geometry: radii are **2–6px**, effectively square (`--radius-md: 4px`). The pill
radius exists only for status chips and the WeChat CTA. Hairlines carry the design:
`1px rgba(118,85,31,.16)` for internal dividers, `1.5px` bronze rules under section
headings, `2px` for the emphasized top edge of a highlighted plan card.

A **card** = warm-white ground, 1px bronze-tinted hairline, 4px radius, `--shadow-sm`
(a hairline ring plus a 2px ink-toned shadow), 24–32px padding. Elevation is rare:
`--shadow-md` for hovered/interactive cards, `--shadow-lg` only for modals. Shadows are
warm ink (`rgba(58,44,20,…)`) — never grey-blue. An emphasized card gains a bronze top
rule and a parchment-50 ground rather than a bigger shadow.

### Backgrounds & texture

Flat parchment is the default. The one permitted texture is `.ts-paper` — a faint
two-layer warm dot grain at 3–5% opacity standing in for 宣纸 fibre. Large ornament is a
single **oversized outline seal circle** at 4–8% bronze, bleeding off an edge, or a
vertical hairline grid. No photographic hero backgrounds; if photography is introduced it
should be warm-toned, low-contrast, slightly grainy, near-monochrome — sepia rather than
colorful. Gradients only as **protection washes** (parchment → transparent, top or bottom,
for text over imagery) and as very low-contrast section separators.

### Motion

Quiet and short. `--dur-base: 220ms` with `--ease-standard cubic-bezier(.2,.6,.2,1)`;
reveals use `--dur-reveal: 700ms` with `--ease-out`. Vocabulary: opacity fade + ≤12px
upward translate, hairline rules that grow in width, numerals that count up once.
**No bounce, no spring, no parallax, no auto-carousels.** Respect
`prefers-reduced-motion` (already handled in `tokens/base.css`).

### Interaction states

- **Hover:** darken bronze one step (`--bronze-500 → --bronze-600`), or lift card
  `--shadow-sm → --shadow-md` with border `--line-hairline → --line-rule`. Ghost/quiet
  elements hover to a parchment-100 fill. Text links darken and their underline rule
  strengthens. Never a color hue change, never scale-up.
- **Active/press:** darken again (`--bronze-700`) and `translateY(1px)` — a stamp press.
  No shrink transforms.
- **Focus:** 2px `--focus-ring rgba(118,85,31,.38)` at 2px offset. Always visible.
- **Disabled:** 40% opacity, no shadow, `cursor: not-allowed`. No grey substitution.
- **Selected:** bronze 1.5px left or bottom rule + parchment-100 fill; weight goes 400→500.

### Transparency & blur

Reserved for two cases: the sticky header (88% parchment + 10px blur) and modal
scrims (`rgba(36,31,25,.55)`, 2px blur). Never blurred cards, never glassmorphism panels.

---

## 4. Data visualization

Charts are the product's core artifact, so they get their own rules. **d3 v7 is the charting
library** (the client's stated choice); every chart draws through
`components/charts/chartKit.jsx` so axes, margins, tones and type are identical wherever a
chart appears — report, site, or slide. Load d3 from CDN in the consuming page:
`https://unpkg.com/d3@7.9.0/dist/d3.min.js`. Charts render empty until d3 arrives (`useD3`
polls for it); they never throw.

**Semantic color, never decorative.** A chart's palette is an argument, not a theme:

| Meaning | Token | Hex |
|---|---|---|
| 增长 · gain, upside | `--growth-500` | `#4E6B3F` |
| 利润流失 · leakage, overspend | `--loss-500` | `#A34A2C` |
| 关注 · watch item, near threshold | `--caution-500` | `#B98B2A` |
| 总计 · totals, the brand's own series | `--bronze-500` | `#76551F` |
| 中性数据 · neutral measure | `--datum-500` | `#3F5A6B` |
| 基准 · benchmark, peer average | `--parchment-400` | `#D6C6A4` |

Never assign these by series index — a red line must mean lost profit. Benchmarks and peer
averages are muted and dashed so the brand's own series always reads first.

**Chart chrome.** Hairline axes only (`rgba(118,85,31,.28)` baseline, `.16` gridlines, and
gridlines only when reading values off the axis matters). No chart borders, no drop shadows,
no icons, no 3D, no rounded bar caps beyond 1px. Tick labels and every number are
`--font-numeral` tabular mono at 10–11px; category labels are 11px sans in `--ink-400`.
Legends only when a series is genuinely ambiguous — two series or fewer should be labelled
inline. Each chart carries an uppercase bronze caption above and, wherever the figure is
real, a 数据来源 note beneath.

**Chart choice.** 走势 → `TrendLine`. 结构占比 → `StackedBars` (`normalize` for share-of-total).
归因 → `Waterfall`. 逐店逐月 → `Heatmap` (`diverging` around zero for 同比). 单一占比 →
`Donut`. 转化 → `Funnel`. 达成率 → `Gauge`. In a table or ledger row → `Sparkline`.
Quadrant positioning stays with `Matrix2x2`, ranked comparison with `BarSeries`.

**Motion.** Charts animate once, on reveal, or not at all: bars grow from the axis, lines
draw left to right, both at `--dur-reveal` with `--ease-out`. Never loop, never animate on
hover, never re-animate on data change.

## 5. Iconography

**The source supplied no icon set.** Two rules follow.

1. **The seal is the only brand mark.** `assets/logo-seal.png` — 240×240 transparent PNG,
   circular outline enclosing 侍天 in brush script, ink `#5B4A3F`. Use it at 28–40px in
   headers and 88–120px in the closing CTA. Never recolor it, never place it on a
   saturated ground, never letter-space or reconstruct the calligraphy, never derive a
   monogram from it.
2. **The wordmark is a pun: TIANSIGHT contains INSIGHT.** Set the letters **I N S I G H T in
   gold** (`--gold-400 #A8842F`; `--bronze-300` on ink grounds) and the leading **T and the
   A in black/ink** (`--ink-900`; parchment on ink grounds), so a reader sees TIANSIGHT and
   INSIGHT at once. Spectral, all caps, `.3em` tracking. The split must survive at 14px, so
   it carries **two** contrasts, not one: gold letters at weight 400 and ink letters at
   weight **700**. Note the gold is `--gold-400`, deliberately lighter than 辅助色
   `--bronze-500` — at bronze-500 both halves read as one dark word on parchment.
   **Never flatten it to a single color** and never re-split the letters differently. Use the exported `Wordmark`
   component (`components/core/Seal.jsx`) rather than typing the string by hand.
3. **UI icons: Lucide via CDN, flagged as a substitution.** Loaded from
   `https://unpkg.com/lucide-static` / the `lucide` UMD build in the kits, at
   `stroke-width: 1.5`, 18–20px, `currentColor`, no fills, square caps. Lucide's thin
   uniform stroke is the closest widely-available match to the hairline-rule character of
   the brand; it is **not** the brand's own set. Replace it if 侍天 has one.
   Icons used: `arrow-right`, `arrow-up-right`, `check`, `chevron-down`, `chevron-right`,
   `circle-dot`, `file-text`, `layers`, `line-chart`, `search`, `shield`, `store`,
   `target`, `trending-down`, `trending-up`, `users`, `x`.

**Other glyph conventions**
- **No emoji, anywhere.** This is a hard brand rule (see Content Fundamentals).
- Step numbering uses **Chinese numerals in a bronze hairline circle** — 一 二 三 四 五 for
  经营五问 and 第一层/第二层/第三层 for the ladder — not Arabic numerals in filled dots.
- The middot `·` is the brand's connector (第一层 · 经营洞察); the ideographic comma `、`
  separates list items inside a sentence; `—` is avoided in Chinese runs.
- Directional affordances are bronze `→` in text, Lucide `arrow-right` in buttons.
- Charts use no icons at all: hairline axes, flat semantic fills, mono labels.

---

## 6. Index

```
styles.css                  single entry point — @import list only
tokens/
  fonts.css                 Google Fonts substitutions (see Caveats)
  colors.css                brand base + ink + data semantics + aliases
  typography.css            families, roles, scale, weights, tracking
  layout.css                spacing, container, radii, borders, shadows, motion, z
  base.css                  element defaults, link states, .ts-* utilities
assets/
  logo-seal.png             the 侍天 seal (only supplied brand asset)
guidelines/                 foundation specimen cards (Design System tab)
components/
  core/                     Button, IconButton, Icon, Badge, Tag, Card, Divider, Eyebrow,
                            SectionHeading, Seal, Wordmark, Stat, Quote, StepMarker, PlanCard
  forms/                    Input, Select, Checkbox, Radio, Switch
  data/                     MetricRow, BarSeries, Matrix2x2, LedgerTable
  charts/                   chartKit (shared grammar) + TrendLine, StackedBars,
                            Waterfall, Heatmap, Donut, Funnel, Gauge, Sparkline — d3 v7
  people/                   ExpertCard, PartnerCase
slides/                     SlideFrame, SlideTitle, SlidePlaceholder, TitleSlide,
                            PromiseSlide, SectionSlide, FiveQuestionsSlide, ProofSlide,
                            ChartSlide, LadderSlide, PartnerWallSlide, ExpertTeamSlide,
                            ContactSlide  — plus index.html (the deck) and deck-stage.js
templates/
  sales-deck/               侍天 销售提案 — the 16:9 deck as a copyable template
ui_kits/
  website/                  官网 long-scroll site (index.html) + 伙伴与专家 (partners.html)
  report/                   经营诊断报告 sample pages, incl. the d3 趋势与归因 page
thumbnail.html              project tile
SKILL.md                    Agent-Skills entry point
readme.md                   this file
```

### Components

**core** — `Button`, `IconButton`, `Icon`, `Badge`, `Tag`, `Card`, `Divider`, `Eyebrow`,
`SectionHeading`, `Seal`, `Wordmark`, `Stat`, `Quote`, `StepMarker`, `PlanCard`

**forms** — `Input`, `Select`, `Checkbox`, `Radio`, `Switch`

**data** — `MetricRow`, `BarSeries`, `Matrix2x2`, `LedgerTable`

**charts** (d3 v7) — `chartKit` (the shared grammar: `CHART_TONES`, `CHART_HEX`,
`CHART_MARGIN`, `AXIS_LABEL`, `VALUE_LABEL`, `tone`, `useD3`, `useWidth`, `ChartFrame`,
`Axes`), then `TrendLine`, `StackedBars`, `Waterfall`, `Heatmap`, `Donut`, `Funnel`,
`Gauge`, `Sparkline`

**people** — `ExpertCard`, `PartnerCase`

**slides** (16:9, 1280×720) — `SlideFrame`, `SlideTitle`, `SlidePlaceholder`, `TitleSlide`,
`PromiseSlide`, `SectionSlide`, `FiveQuestionsSlide`, `ProofSlide`, `ChartSlide`,
`LadderSlide`, `PartnerWallSlide`, `ExpertTeamSlide`, `ContactSlide`.
Decks mount these as `<section>` children of `deck-stage` (`slides/deck-stage.js`), which
owns scaling, keyboard nav, the thumbnail rail and PDF export — never write a custom scaler.

See each directory's `<Name>.prompt.md` for a one-line "what & when" plus a
usage example, and `<Name>.d.ts` for the props contract.

### Intentional additions

The brief supplied brand copy and colors but no component inventory, so the primitives
are a standard set sized to what the two surfaces actually need. Three are brand-specific
rather than generic, and exist because the copy demands them:

- **Seal / Wordmark** — wraps `logo-seal.png` with the brand's sizing/placement rules, and
  renders the two-tone TIANSIGHT / INSIGHT wordmark so no one flattens or re-splits it.
- **StepMarker** — the Chinese-numeral hairline circle required by 经营五问 and 三层+X.
- **PlanCard / Matrix2x2** — the ladder tiers and the five report matrices are named,
  recurring artifacts in the source copy, not invented UI.
- **The slide set** — added on request for a 16:9 sales deck pitching 侍天 to a restaurant
  owner. Every slide maps to a section of the supplied copy; none invent new claims.
- **ExpertTeamSlide / ExpertCard** — the 专家顾问团 named in X · 增值专项, rendered as portrait
  + one-line 头衔 per the client's brief. Portraits are placeholders until photos are supplied.
- **The chart set** — added on request. `chartKit` plus eight chart types, all d3 v7 (the
  client's existing library). The five *named* report matrices remain `Matrix2x2`/`BarSeries`;
  these eight are the general-purpose layer the report and deck needed.
- **PartnerCase** — the 伙伴案例 surface: a testimonial that carries before→after numbers,
  which is the evidence standard the brand applies to its own conclusions.

### Caveats

- **Fonts are substituted.** No binaries were provided; Noto Serif SC / Noto Sans SC /
  Spectral / IBM Plex Mono are loaded from Google Fonts as nearest matches. If 侍天 licenses
  Source Han Serif, 方正, or a bespoke face, send the files and only `tokens/fonts.css`
  plus the family tokens need to change.
- **Icons are substituted** (Lucide, CDN) — see Iconography.
- **No Latin wordmark artwork exists** in the supplied assets — the two-tone TIANSIGHT /
  INSIGHT lockup is set live in type per the rule above. Send artwork if the real mark has
  custom letterforms or different letter-spacing.
- **Charts were built without reference to the client's existing d3 code.** The attached
  codebase folder (`dsys_tiansight01`) was empty when read, so `chartKit` *sets* the
  conventions (margins, axis type, tone mapping) rather than matching existing ones. If
   侍天 has established d3 patterns, send them and `chartKit` is the single file to reconcile.
- The report matrices are reconstructed from their **names only** (渗透率矩阵,
  商圈供需洞察, 复购分层四象限, 利润敏感性矩阵, 价格带断层洞察) with plausible sample
  data. Chart types and axis labels need confirmation against a real 样张.
