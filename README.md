# 侍天 TIANSIGHT — Design System

The current working folders are `brand/` (foundation), `content/` (shared slides and deck
manifests), `assets/` (registered visuals), `build/` (generated decks) and `scripts/` (one
build/export path). `dist/` holds the pinned runtime; `archive/` preserves historical sources.
Read [architecture and contracts](docs/architecture.md) and the [deck catalog](content/deck-catalog.json).
The [intro](build/intro/client/index.html), [exhibit](build/exhibit/client/index.html) and
[sales](build/sales/client/index.html) decks are generated from the same library; kitchen stays planned.
Approval is separate from a successful build.

> **Repository:** `ksamint/dsys_tiansight02` is the public home of the design system from 2026-10-18. It starts from the consolidated v0.7 release of `ksamint/dsys_tiansight01`, which is now a private archive. Nothing confidential is kept here; see `docs/maintaining.md` §6.

> IP identity (IPTrust): `assetKey` sidera · display name 侍天 TIANSIGHT (registry: 侍天 - 智慧餐饮 / tiansight). Snapshot 53340b5 (2026-10-18; checked 2026-10-21), see `brand/source.json`. Official website https://tiansight.apuch.cn; brand design system https://apuch.art/tiansight; repository preview https://ksamint.github.io/dsys_tiansight02/.

> 侍天 TIANSIGHT — 从一道菜，到一家家店的好生意。
> *拍板之前，问侍天。*

## 1. Company & product context

侍天 (TIANSIGHT) is a restaurant operating-intelligence practice for Chinese F&B owners,
from a single new concept to a chain. Its entry point is the **menu**: the one thing every
restaurant has, even without décor, a brand or a resident chef. The current positioning
(the latest company intro, 2026-09) reads:

> **从一道菜，到一家家店的好生意。**
>
> 菜单，是餐厅向顾客发出的购买邀请，也是每天都在执行的经营决策。
>
> 侍天以菜单设计与持续迭代为核心，将餐饮实战、经营分析与组织能力建设结合起来，贯穿新餐厅概念开创、单店经营优化与连锁规模化发展。
>
> **让顾客愿意点，让团队做得稳，让经营留下收益。**

Closing line, unchanged across every version of the brand: **拍板之前，问侍天。**

**Founders** (name them exactly this way): 边江 — 创始人, 北京大学经济学背景, 近三十年餐饮实战经验,
曾任海底捞品牌负责人, 创办尖味菜单工作室, 服务中国 100 多个餐饮品牌, 深耕餐饮定位、产品结构、菜单体系与利润模型;
郭峰 — 瑞士洛桑酒店管理学院（EHL）中国区创始团队成员, 参与 EHL 集团在华业务体系搭建, 服务体验、组织能力构建与
经营系统建设. The pairing carries the thesis: **产品决定顾客的选择，组织决定承诺能否兑现。侍天把这两件事放在同一张经营蓝图里。**

The full intro is kept verbatim in `guidelines/company-intro-2026-09.md` — quote from it, do not
paraphrase it.

### Surfaces represented in this system

| Surface | What it is | Where |
|---|---|---|
| 官网 Marketing site | Single long-scroll site: hero → 报告样张 → 从概念到连锁 (四阶段) → 餐饮第二大脑 → 伙伴背书 → 联系; 伙伴与创始团队 page | `ui_kits/website/` |
| 报告样张 Report sample | The deliverable itself: 决策维度 / 分析维度 / 趋势与归因 / 方法论地图 pages, plus the five insight matrices (渗透率矩阵, 商圈供需洞察, 复购分层四象限, 利润敏感性矩阵, 价格带断层洞察) | `ui_kits/report/` |
| 销售提案 Sales deck | 16:9 deck pitching 侍天 to a restaurant owner — 14 slides: 主张 → 服务内容 (四个阶段) → 服务模式 → 方法论 (第二大脑 · 样张 · 图谱) → 价值 → 案例 → 伙伴 → 创始团队 → 联系 | `content/decks/sales.json`, `build/sales/` |
| 企业介绍 v3 Company intro | 47-page client profile from `guidelines/company-intro-v3.md`, plus internal registry slides | `content/decks/intro.json`, `build/intro/` |
| 展陈与厨房设计 Exhibit | 41 registry slides on the shared runtime with canonical team/contact slides; 33 build today, 8 `hold` pages wait for owner confirmation | `content/decks/exhibit.json`, `build/exhibit/` |
| 全周期图谱 Lifecycle map | 餐饮经营全周期图谱 — flow map, single-store Gantt and 3D views over 60 decisions | `deliverables/lifecycle-map/` |
| 报告模板 Report template | 39-page 1920×1080 Slides template: report standards plus a sample of each of the 27 page types, clickable PDF; built with the report kit (`tsk`) | `deliverables/report-template/`, `templates/report-kit/`, `docs/report-handbook.md` |

### Product framework (memorize this — it drives most layouts)

**Four stages** — the lifecycle every 侍天 engagement is placed in. Each has a bold
headline (two verb phrases split by a comma) and one paragraph of substantiation:

| Stage | Headline | What happens |
|---|---|---|
| 开店之前 | 把生意想清楚 | 客群、场景、商圈竞争 → 餐厅概念、招牌产品、菜单结构、价格与组合；核对成本、后厨产能、人员配置 |
| 经营之中 | 把问题找到菜上 | 真实点单、收入成本、现场出品、顾客反馈 → 哪些菜留、改，哪些场景未满足，哪些环节消耗利润；每个建议明确依据、动作与验证方式 |
| 每月复盘 | 让菜单持续进化 | 新品、时令、价格接受度、组合、履约体验 → 上轮调整与实际结果逐项核对 → 下一轮动作 |
| 复制扩张 | 让好方法进入组织 | 产品标准、经营参数、执行方法沉淀 → 岗位分工、培训辅导、经营例会、持续督导；保留因商圈、客群、店型而异的调整空间 |

**餐饮第二大脑** — the system, described only by its four parts (never as an
already-finished "intelligent system"; the intro says 侍天 **持续建设** it, 为专家判断和门店行动提供支持, and
the methodology doc is explicit that the simulation supports expert judgement, not a proven
predictor):

- **菜单推演** — 用真实点单数据推演顾客可能怎样选、不同菜单方案会带来什么变化。 (The 2026-09 intro's name for
  what earlier copy and the platform call 点单模型 — use 菜单推演 in marketing copy, 点单模型 only
  when naming the platform module.)
- **经营看板** — 讲清哪里发生了变化、影响有多大、哪些事情需要优先处理。
- **教练式督导** — 把建议落实到负责人、完成时间和执行检查。
- **持续复盘** — 将预期与实际对照，让下一次决策有更可靠的依据。

**The value the owner sees** — 落在具体的经营变化上: 顾客是否更容易点到满意的一餐 · 出品是否更稳定 ·
浪费是否减少 · 门店是否留下更多经营贡献. Bounded by the 三不 line, which is copy, not a hedge:
**侍天不替老板拍板，不凭单一销量砍菜，也不把预期收益写成已经发生的结果。** The proof line every
deliverable stands behind: **每次拍板有依据，每项行动有人落实，每轮改善可以核对。**

**Service model** (服务模式, client brief 2026-09-19) — three tiers chosen by 餐饮类型 and
经营阶段, each stated as 服务内容 / 客户价值 / 核心优势 (`ServiceModelSlide` carries the copy):

| Tier | Fits | Entry |
|---|---|---|
| 经营诊断 | 新概念与单店 · any stage's starting point | 交出最近 6 个月的经营数据，7 日内拿到诊断：增长在哪里、利润漏在哪里、先改哪三件、由谁执行、以什么验收 |
| 运营业绩优化落地辅导 | 经营之中的单店与小型连锁 | 经营之中 + 每月复盘, 教练式督导 |
| 第二大脑陪跑 | 复制扩张中的连锁品牌 | 第二大脑 four parts long-term + 复制扩张 |

合作从一份经营诊断开始 — the 6 个月 / 7 日内 diagnosis is the **entry**, not the whole offer, and
"之后再决定是否进入持续跟进或专家上门的阶段". Tier names are the client's; do not rename them.

**Result-linked fees.** For projects with the data and execution conditions, fees can be tied
to jointly confirmed improvements: 约定基线、目标、计量口径与验证方式 at the start; 记录动作和投入
during; 共同核对实际结果与可归属的改善 at review. Copy stays conditional ("可与…挂钩"), never a
guarantee, never a fixed share or a promised uplift.

**Methodology vocabulary** (《侍天方法论总纲》, `uploads/侍天方法论_大纲分类框架版.md` — reference only,
not marketing copy): six questions (为谁做这一餐 / 卖什么 / 顾客愿意怎样买 / 能否稳定交付 / 留下多少钱 /
改完是否真的更好), five 经营层 (机会 · 增长 · 交易 · 履约 · 财务) over 13 决策域, the 三部曲 deliverable
(现状 → 动作 → 验收: one sentence, 3 pieces of evidence, 1 chart; ≤3 actions; 1 main metric + 2
guardrails), evidence grades EGA.E1–E4, and the dashboard's five questions (出了什么变化？影响多少钱？
建议改什么？谁在什么时候做？做后结果怎样？). Reports and dashboards use these; the website does not.

**Retired framing** — still present as sample content in the report kit and in the source
repo's older consumers: 经营五问 (现状/机会/优先/行动/结果), 三层+X, 看得清/改得动/留得下. Do not
lead with these in new work; the four stages, the service model and 第二大脑 replace them.
("交 6 个月数据，7 日内诊断" is *not* retired — it is the diagnosis entry, see Service model.)
The slide set's defaults and the sales-deck template carry the current framing; an older
deck that still needs 经营五问 or 三层+X passes them explicitly as `steps` / `tiers` / `stats`.

**Named customers** (use verbatim, never invent new ones): 苏帮袁、清水亭、3699 河鲜小馆、
游园京梦、吴裕泰、韵 1980 新派淮扬菜、潮发潮汕牛肉、更多伙伴（正在签约中）.

### Sources given for this system

**Primary source — GitHub:** <https://github.com/ksamint/dsys_tiansight02> (branch `main`).
This repository is the brand's own working design-system repo and is worth exploring
directly before doing substantial work on 侍天 designs. The parts that matter most:

| Path in the repo | What it is |
|---|---|
| [`brand/tokens.css`](https://github.com/ksamint/dsys_tiansight02/blob/main/brand/tokens.css) | **The authoritative foundation.** The published palette, type steps, spacing, radii and motion. Everything in `tokens/` here is grounded in it. |
| [`brand/guide.md`](https://github.com/ksamint/dsys_tiansight02/blob/main/brand/guide.md) | The published brand guide, copied here verbatim as `guidelines/brand-guide.md` |
| [`brand/fonts/`](https://github.com/ksamint/dsys_tiansight02/tree/main/brand/fonts) | 127 self-hosted WOFF2 subsets + OFL licenses, copied here to `brand/fonts/` |
| [`brand/components.css`](https://github.com/ksamint/dsys_tiansight02/blob/main/brand/components.css) | The CSS component layer with all five states per component |
| [`brand/icons.svg`](https://github.com/ksamint/dsys_tiansight02/blob/main/brand/icons.svg) | The brand's own 17-glyph hairline sprite, copied to `assets/logo/icons.svg` |
| [`website/`](https://github.com/ksamint/dsys_tiansight02/tree/main/website) · [`deck/`](https://github.com/ksamint/dsys_tiansight02/tree/main/deck) · [`report/`](https://github.com/ksamint/dsys_tiansight02/tree/main/report) | The three real consumers — static HTML on the brand stylesheets |
| [`html-system/`](https://github.com/ksamint/dsys_tiansight02/tree/main/html-system) · [`skills/`](https://github.com/ksamint/dsys_tiansight02/tree/main/skills) | Manifest-driven report/deck builder and six agent skills for producing reports on this system |
| [`docs/`](https://github.com/ksamint/dsys_tiansight02/tree/main/docs) | `principles.md`, `quickstart.md`, `contributing.md`, `foundation-review.md` |

A note on precedence, stated by the repo itself: the repo's `AGENTS.md` records that an
earlier exported proposal of this design system is **not authoritative**, and that
`brand/tokens.css` wins wherever the two disagree. This system follows that ruling — the
token files here carry the published values, with the proposal's alias names kept on top
so component code stays stable. See §3 Color.

**Other assets:** `uploads/侍天-透明-页眉.png`, the transparent circular seal (印章) containing
侍天 in brush calligraphy; `assets/logo/logo.png` is the 601×640 master and `assets/logo/supplied-logo-seal.png`
the smaller header version. Marketing copy for the site, deck and report is quoted
throughout this readme and reproduced in the UI kits.

**Methodology documents** (reference for report and dashboard work, not marketing copy):
`guidelines/company-intro-2026-09.md` (the current company intro, verbatim — the source for all
marketing copy), `uploads/侍天方法论_大纲分类框架版.md` (the integrated 方法论总纲),
`uploads/5x13-餐饮企业第二大脑_13个决策域与136张证据方法卡_V2.md` (13 decision domains, 136 method cards),
`uploads/20_智能分析流水线与可视化图型体系.md` (the 11-stage pipeline and the three-layer chart
taxonomy §4 is built on), `uploads/餐饮品类定位与菜单结构咐询方法论-通用版.md` (category roles,
三效 matrix, seasonal structure). **Second repository — product platform:** <https://github.com/ksamint/vanahom-fb-hom01>
(branch `main`). The running 第二大脑 / 矩阵洞察 platform; read for the dimension contract
(`docs/methodologies/analysis-dimensions-field-contract-v1.md`), the 九宫格 methodology
(`ref/矩阵v3.md`) and the chart inventory (`public/js/v42/v42-charts.js`). Its
`docs/architecture/connected-design-system.md` records that it consumes
this design system as its foundation (formerly `dsys_tiansight01`, now `dsys_tiansight02`) — so it sits upstream of it.

---

## 2. Content fundamentals

**Voice: 参谋，不是销售.** 侍天 writes like a strategist filing a report to a decision
maker. Confident, compressed, evidentiary. It never hypes and never apologizes.

**1. Plain, weighted Chinese — with a headline that lands in two beats.** The current
intro has moved away from 文言 compression toward clear modern prose that still pairs
clauses. Headlines are two verb phrases split by a comma, each 4–7 characters; the second
beat resolves the first.

> 从一道菜，到一家家店的好生意。
> 开店之前，把生意想清楚。
> 经营之中，把问题找到菜上。
> 拍板之前，问侍天。

Rules: headlines end with a full stop (。) when they are complete sentences; body sentences
are long and specific, listing the concrete things (菜品、定价、供应和服务动作) rather than
abstractions. The older 文言 lines (五问既明，百事可决 · 增长与止损，皆可量化) belong to the
retired framing — keep that register for section kickers only, not for new claims.

**2. Every claim carries its verification.** The brand's own test for a piece of advice
is three-fold — **依据、动作、验证方式** — and the closing proof line repeats it:

> 每次拍板有依据，每项行动有人落实，每轮改善可以核对。
> 可计算的，量化到位；不可计算的，如实说明。

Never write a benefit without its check: not "提升复购" but "哪些菜值得保留 → 每个建议明确依据、动作与
验证方式". Claims about the system are deliberately modest (辅助判断 · 讲清 · 为…提供支持) — the
methodology doc forbids calling the 点单模型 a proven predictor or the 第二大脑 a finished
intelligent system. Fees "可与…挂钩", never "保证". Honesty about limits is a selling point,
not a hedge.

**3. Address: 老板 / 经营者, and the 餐厅 / 门店 as the subject.** Sentences are built around the
restaurant, the menu, the dish, the team — “老板看到的价值”, “顾客是否…”, “门店是否…”. 侍天 refers
to itself in the third person by name (“问侍天”, “侍天把这两件事放在同一张经营蓝图里”) — never 我们/我 in
headlines. Never 您 (too deferential for a peer advisor); 你 is used sparingly, mostly
implied and omitted. Founders are named with credentials, not adjectives.

**4. Threes and fours, labeled.** Copy comes in parallel beats: 让顾客愿意点 / 让团队做得稳 /
让经营留下收益 · 开店之前 / 经营之中 / 每月复盘 / 复制扩张 · 点单模型 / 经营看板 / 教练式督导 / 持续复盘 ·
卖什么 / 怎么定价 / 如何组合. Each beat = a short verb phrase in bold + one plain sentence of
substantiation. When writing new sections, find the parallel set before writing prose.

**5. Testimonials are anonymized by role.** 餐饮老板 王总 / 张总 / 李总. Quotes are blunt
and mention the mechanism, including AI skepticism:

> "报告分析得非常细，最关键的是结论有证据，不靠猜，也没有 AI 幻觉。"

**6. Casing & mixed script.** Chinese is primary; English is a quiet subtitle layer.
Latin brand strings are set in **ALL CAPS with wide tracking** (TIANSIGHT, TABLE AI
ALLIANCE, SECOND BRAIN / DECISION SYSTEM / RESTAURANT GROWTH). The wordmark itself is a
pun and is **always set two-tone** — see Iconography. Latin taglines use
sentence case with a period: *Time is money. With TIANSIGHT, lose neither.* Version and
data strings stay bare and monospaced: `V4.2`, `90 天`, `近三十年`.
Numbers are Arabic with a hair space either side in Chinese runs (近 30 年); the intro itself
prefers Chinese numerals in prose (近三十年) — follow the source you are quoting.

**7. No emoji. Ever.** No exclamation marks except inside a customer quote. No
"革命性/颠覆/赋能/闭环" consultant filler. No first-person plural marketing ("我们相信…").
CTAs are imperative and short: 问侍天 · 联系侍天 · 更多伙伴 · 微信扫码联系侍天.

**Micro-copy patterns to reuse**
- Eyebrow → headline → one-sentence substantiation → proof list. Always in that order.
- Card title = a short verb phrase (把生意想清楚). Card body = one or two sentences, end with a period.
- Section kicker sets the stakes in ≤14 characters: 从概念到连锁 · 老板看到的价值 · 以样张为证.

---

## 3. Visual foundations

The brand's frame of reference is a **printed report on 宣纸-toned stock, stamped with a
seal** — an archive document, not a SaaS dashboard. Every decision below follows from that.

### Color

Nine published values carry the whole identity. These are authoritative — they come from
`brand/tokens.css` and are declared first in `tokens/colors.css`.

| Role | Token | Value |
|---|---|---|
| 淡墨纸 Pale Manuscript — base canvas | `--surface` / `--surface-page` | `#F4F0E7` |
| 宣纸 Paper — raised content | `--paper` / `--surface-card` | `#FFFDF8` |
| 素墨 Ink — **primary brand color**, fields and key actions | `--ink-primary` | `#EFE6D2` |
| 玄墨 Charcoal — titles and primary text | `--charcoal` / `--text-display` | `#17130D` |
| 土金 Earth Gold — rules, strokes, navigation | `--gold` / `--text-accent` | `#76551F` |
| 明金 Bright Gold — active state, key numbers 28px+ | `--gold-hi` / `--text-key` | `#D4A862` |
| 深金 Deep Gold — captions, EN labels, the tagline | `--gold-deep` / `--text-caption` | `#76551F` |
| 素墨灰 Ink Muted — secondary text | `--ink-muted` / `--text-muted` | `#706758` |
| 朱红 Vermillion — seal, negation, warnings | `--seal` | `#8C3228` |

**Gold ramp:** `--gold-100 #F3E7CF` · `--gold-300 #D4A862` · `--gold-400 #A8842F` ·
`--gold-500 #76551F` · `--gold-600 #5C4218` · `--gold-700 #3F2D0F`. Hover darkens one
step, press two. The older `--bronze-*` names are retained as aliases of this ramp so
existing component code keeps working; write new code against `--gold-*`.

Data semantics for report charts: 增长 `--growth-500 #4E6B3F`, 利润流失 `--loss-500` =
朱红 `#8C3228`, 关注 `--caution-500 #B98B2A`, 中性 `--datum-500 #6E6355`. The default
chart set is simpler: one series = 明金, two = + 玄墨, three = + 朱红. The semantic set is
**report-only**, for when 增长 must be told apart from 关注.

**Rules.** Max two ground colors per composition: pale manuscript + warm white, or pale
manuscript + charcoal for a single inverse card — **charcoal is never a page ground, and
never more than one charcoal card per section.** Gold is structure, not a crutch: rules,
small caps, seals, numerals, active states — **never a fill**, not even on the primary
button, which is the 素墨 ink field with a gold hairline (v0.7 ruling Q1). 朱红 is the seal:
≤5% of any view, never a fill for positive data. No blue-purple gradients; no pure black;
no pure white; no saturated brights.

**Measured contrast (review 2026-09).** 明金 `#D4A862` on 淡墨纸 `#F4F0E7` is 1.9:1, so the
"key numbers 28px+" use only holds when the numeral sits beside a 玄墨 or 深金 label that
carries the value, or on a 玄墨 ground (8.5:1). Body-size 明金 text is refused. 深金 `#76551F`
(6.0:1) and 素墨灰 `#706758` (4.9:1) pass as text on parchment; the components here already use
`--gold-500` for accent numerals for this reason.

### Type

**Serif everywhere.** There is no sans face in this brand. Three families, all
self-hosted from `brand/fonts/` as unicode-range WOFF2 subsets — no runtime CDN.

- **Display & headings:** `--font-display` / `--font-cn` — Noto Serif SC. Weight 600 for
  titles, 300–400 at 48px+ where the serif gets airy. Tracking `.14em`
  (`--tracking-display`) on CJK display so characters breathe like letterpress.
- **Body & UI:** `--font-body` — also Noto Serif SC, 400, 18px / 1.7. CJK body needs air.
- **Latin & quotes:** `--font-quote` / `--font-en` — Noto Serif, italic 400 for pull quotes.
- **Numerals & tables:** `--font-numeral` / `--font-mono` — IBM Plex Mono, tabular. Every
  KPI, price, percentage and version string is monospaced. This is a signature: the
  numbers *look* measured. Mono is **only** for hex, tokens, data and prices.
- Type steps are fluid at the top: `--type-display` 48–96px, `--type-h1` 36–56px,
  `--type-h2` 28–40px, then fixed `--type-h3` 28 / `--type-body` 18 / `--type-small` 14 /
  `--type-caption` 13. Interface steps are separate: `--type-ui` 16, `--type-table` 14,
  `--type-badge` 12, `--type-tick` 11.
- Eyebrows and EN labels: uppercase, `.34em` tracking (`--tracking-caps`), 深金. The
  tagline 智慧领航者 sets in 深金 at `.5em` tracking **at every size**.
- Measure: `--measure-cn` 36em (28–38 CN characters), `--measure-en` 66ch.
- Never mix more than two families in one block; never use a geometric sans; avoid Inter.

### Layout & spacing

4px base scale (`--space-1` 4 → `--space-10` 96). Sections breathe at
`--section-gap: 96px`, tightening to 64px under 640px. Container `1280px`, 12 columns,
`--gutter: 48px` (24px mobile), card padding 24px / 32px inner, prose `--measure-cn: 36em`. Compositions are **left-aligned and rule-divided**, built on visible
grids: 12-col on the site, 4-col label/value ledgers in the report. Centered text only
for the closing CTA and the seal. Fixed elements: a single translucent sticky header
(parchment at 88% + `backdrop-filter: blur(10px)`, hairline bottom rule); nothing else
floats — no floating chat bubbles, no sticky sidebars.

### Borders, radii, cards

Print geometry: **radius is 2px, a pill, or a circle — nothing else.** `--radius` is 2px
and every `--radius-*` alias resolves to it; `--radius-pill` is for outline status badges
and the WeChat CTA only; `--radius-seal` (50%) is for the seal. Never round a card.

Hairlines carry the design: `--line-hairline rgba(23,19,13,.18)` for internal dividers,
`--line-rule` at `.34` for stronger separations, `--line-card rgba(118,85,31,.34)` for
card edges, 1.5px gold rules under section headings, 2px for the emphasized top edge of a
highlighted plan card.

A **card** = warm-white ground, 1px gold-tinted hairline, 2px radius, 20–28px padding
(24–32 inner) — **and no shadow.** Cards stay bordered; elevation belongs to overlays.
Four steps exist for that: `--shadow-1` through `--shadow-4`, all warm ink
(`rgba(23,19,13,…)`), never grey-blue; open dialogs carry `--shadow-3`. An emphasized card
gains a gold top rule and a parchment-50 ground rather than a bigger shadow.

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

- **Hover:** darken along the gold ramp one step (`--gold-500 → --gold-600`), or strengthen
  a card border `--line-hairline → --line-rule`. Secondary, quiet and nav hovers darken
  along the ramp rather than swapping tokens. Text links darken and their underline rule
  strengthens. Never a color hue change, never scale-up.
- **Active/press:** darken two steps (`--gold-700`) and `translateY(1px)` — a stamp press.
  No shrink transforms.
- **Focus:** 2px `--focus-ring` (= `--gold`) at 2px offset. Always visible.
- **Disabled:** 40% opacity, no shadow, `cursor: not-allowed`. No grey substitution.
- **Selected:** bronze 1.5px left or bottom rule + parchment-100 fill; weight goes 400→500.

### Transparency & blur

Reserved for two cases: the sticky header (88% pale manuscript + 10px blur) and modal
scrims (`--scrim rgba(23,19,13,.55)`, 2px blur). Never blurred cards, never glassmorphism.

---

## 4. Data visualization

Charts are the product's core artifact, so they get their own grammar. **d3 v7 is the
charting library**; every chart draws through `components/charts/chartKit.jsx` so axes,
margins, tones and type are identical wherever a chart appears — report, site or slide.
Load d3 from CDN in the consuming page: `https://unpkg.com/d3@7.9.0/dist/d3.min.js`
(`Sankey` additionally needs `https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js`).
Charts render empty until d3 arrives (`useD3` polls for it); they never throw.

### Choose by task, not by chart name

The grammar follows 《智能分析流水线与可视化图型体系》Part B (`uploads/20_智能分析流水线与可视化图型体系.md`):
three layers — **L1 reading task (12) → L2 mark (9) → L3 chart (~24)** — and the rule that
"我想用个桑基图" is the wrong starting point. `TASK_CHARTS` and `chartFor(task, shape)` in
`chartKit` encode the decision matrix.

| Task | Question | This kit |
|---|---|---|
| 比较 | A 比 B 大多少？ | `BarSeries`, `Dumbbell` (two states), `FacetBars` |
| 排序 | 谁最高？ | `BarSeries` (sorted), `Lollipop` (light rank), `Pareto` (ABC 二八), `Lorenz` (concentration), `SlopeChart` (rank change) |
| 构成 | 由哪些部分组成？ | `StackedBars` (`normalize` for share), `Waffle` (share as a count), `Mekko` (two categoricals), `PairedBars` (版面 vs 产出), `Treemap`, `Donut` (≤5 items) |
| 分布 | 集中在哪？几个峰？ | `Histogram` (+ density, `bands` for the 价格带 in question), `BoxPlot` |
| 趋势 | 随时间怎么变？ | `TrendLine` (`refs` 约定目标 / 基准 lines, `marks` 动作落地 events), `Sparkline` (in rows), `CalendarHeatmap` (rhythm) |
| 关系 | X 和 Y 有关吗？ | `Scatter` (quadrants, bubble), `Heatmap`, `Matrix2x2`, `NineGrid` (维度 × 维度) |
| 偏差 | 离目标差多少？ | `DivergingBars`, `Waterfall` |
| 流转 | 从哪来到哪去？损耗多少？ | `Sankey`, `Waterfall`, `Funnel` |
| 层级 | 谁包含谁？ | `Treemap` |
| 网络 | 谁和谁相连？ | `Heatmap` as adjacency matrix (no force layouts — they don't reproduce) |
| 时段 | 何时开始、持续多久？ | `Gantt` |
| 不确定性 | 这个数有多可信？ | `ForecastCorridor` (P10–P90 band, P50, baseline, 实测), `Tornado` (sensitivity), `ScoreCompass` (factor scorecard) |
| 元模式 | any task × one more dimension | `FacetGrid` (generic), `FacetBars` (dimension analysis) |

**One chart, one task.** When a figure needs a second dimension, add a *panel*, not an
encoding channel — the spec's F32 example (配菜带率 × 市别 × 区域) is a 3 × 5 small-multiple
grid, which `FacetBars` produces from the flat fact table in one call
(`rollupDims` does the aggregation with sum / mean / count / median).

### Dimension analysis (维度分析)

The dimension vocabulary is the one the product runs on — keys verbatim from
`ksamint/vanahom-fb-hom01` → `docs/methodologies/analysis-dimensions-field-contract-v1.md`
(矩阵洞察 v3 `CATEGORY_DIMENSIONS` / `SKU_DIM_META`, 第二大脑 v4.2 `reg.core_table`). They
are exported as `DIMENSION_LABELS` and must not drift into new Chinese names:

| Key | 中文 | Grade | Notes |
|---|---|---|---|
| `category` | 品类 | RAW | 大类 / 系列 |
| `station` | 档口 | ANN | kitchen station |
| `flavor` | 主味型 | ANN | 菜品 cohort only — 酒水 / 茶水 stay NULL |
| `flavor_secondary` · `style` | 辅味型 · 感官风格 | DER | derived from 主味型; read-only |
| `craft` | 工艺 | ANN | 菜品 only |
| `ingredient` (= `material_l1`) | 食材品类 | ANN | |
| `scene` · `primary_scene` | 场景标签 · 主场景 | ANN · DER | 商务 / 家庭 / 社交 / 工作餐 / 包厢 scored 1–5 |
| `price_band` · `margin_band` | 价格带 · 毛利带 | DER | bands are per-category, not a flat 15 元 step |
| `role` vs `role_proxy` | 主辅佐引 vs 经营角色（代理） | ANN vs DER | **never in the same sentence** |
| `months_present` | 出现月份 | RAW | from the fact table, never hand-filled |

Three grades travel with every dimension — **RAW** (POS / menu master), **ANN** (annotated,
editable: `manual` · `source` · `ai-fill`), **DER** (derived by fixed rules, read-only) —
exposed as `DIMENSION_GRADE` and printed by `NineGrid` beside its caption. Analysis windows
gate what a figure may claim: W0 snapshot (menu attributes), W1 current window (KPI, ABC,
四象限), W2 ≥3 months (momentum), W3 ≥12 months (季节), W4 double-year (同比), W5 member
coverage ≥0.30 (复购). A W0 label never supports a W3 seasonal conclusion — mark it
`partial` instead.

The **九宫格** is the product's dimension-analysis figure: `NineGrid` cross-tabs the SKU
roster by two dimension keys (`crossTab`), shades cells by count, prints "·" in empty
cells as 研发补缺 candidates, and lists the SKUs behind a clicked cell — the same reading as
the v4.2 report's `heatmap_nine` (G1 · m10.flavor_craft). The seven structure presets
(`STRUCTURE_PRESETS`) are 食材×味型 · 食材×工艺 · 食材×价格带 · 食材×主场景 · 味型×主场景 ·
工艺×主场景 · 价格带×主场景; the three decision figures that replace the redundant 工艺×食材
transpose are 销量×贡献毛利 (`Matrix2x2` / `Scatter` with quadrants), 口味×顾客喜好 and
工艺/档口×出品复杂度. Coverage gate: a measure must cover ≥90% of the cohort or the matrix
is `partial`. The v4.2 chart inventory this kit now mirrors: `pareto_dual` → `Pareto`,
`lollipop` → `Lollipop`, `treemap` → `Treemap`, `heatmap_nine` → `NineGrid`,
`instSmallMultiples` → `FacetGrid`, `instDumbbell` → `Dumbbell`, `divergingBars` →
`DivergingBars`, `sankeySimple` → `Sankey`, `waterfall` → `Waterfall`.

### Encoding channels

Cleveland–McGill precision order decides which variable gets which channel: **position on a
common scale > length > angle/slope > area > lightness > hue.** So the important number
goes on position or length; area (`Scatter r`, `Treemap`) is a coarse third magnitude and
prints its value; colour lightness is for ordinal strength (`Heatmap`, `CalendarHeatmap`)
and never for reading values; hue is for **categories only**.

### Tones

Default set (guide §5): one series = 明金 `key #D4A862`; two = + 玄墨 `charcoal #17130D`;
three = + 朱红 `seal #8C3228`. `SERIES_ORDER` continues with `datum` and `muted`.
The semantic set is **report-only**, for when 增长 must be told from 关注:

| Meaning | Tone | Hex |
|---|---|---|
| 增长 · gain | `growth` | `#4E6B3F` |
| 利润流失 · leakage | `loss` = 朱红 | `#8C3228` |
| 关注 · watch item | `caution` | `#B98B2A` |
| 总计 · the brand's own series | `gold` | `#76551F` |
| 中性数据 · neutral | `datum` | `#6E6355` |
| 基准 · benchmark | `muted` | `#D6C6A4`, dashed |

Quantity uses the single-hue `SEQUENTIAL` gold ramp; change around zero uses the one
`DIVERGING` pair 朱红 ↔ 增长. Never a rainbow, never a red line for a positive series.

### Every figure carries its 口径

`ChartFrame` takes `scope` (口径 footnote) and `grade` (EGA evidence badge: E1 直接计量 ·
E2 抽样观测 · E3 外部参照 · E4 设计推断; `degraded` flags a proxy field). The same "销售额"
can differ 13% between pages of one report, so a real figure without a scope line is
incomplete. Forecasts are E4 and show their band; a P50 is never labelled 已节省.

### Anti-patterns refused here

No 3D. No dual Y axes (use `FacetGrid`, or index both series to one scale). Bars always
start at zero. No rainbow ramps. No pie above five items. Ranking charts are sorted by
value. Every truncation (TOP 10) carries a deterministic sort. Legends only when a series
is genuinely ambiguous — two series or fewer are labelled inline.

### Sample review

Four production dashboards (烘焙门店进销存决策台, 地点推演台, 席位推演, 清水亭经营模式长卷) were
reviewed figure by figure in `guidelines/viz-sample-review.md`. Six recurring families were
added from them — `Waffle`, `Mekko`, `PairedBars`, `Lorenz`, `Tornado`, `ScoreCompass` — and
every other figure maps onto an existing component or is page-specific model output.

### Performance

Two fast paths keep large facts instant without changing the API: `Scatter` switches its
marks to a device-pixel-ratio-aware `CanvasLayer` above 1,500 points (axes, quadrant
rules and emphasised labels stay in SVG), and `Gantt` does the same above 120 rows at
4px each with every k-th label. 12,000 points or 148 SKUs paint in one frame. Everything
else stays SVG so it exports crisply to PDF and PPTX. Charts animate at most once, on
reveal (`--dur-reveal`, `--ease-out`) — never on hover, never on data change.

### Chart chrome

Hairline axes only (`--line-rule` baseline, `--line-hairline` gridlines, and gridlines only
when reading values off the axis matters). No chart borders, no drop shadows, no icons, no
rounded bar caps. Tick labels and every number are `--font-numeral` tabular mono at
10–11px; category labels 11px serif in `--ink-muted`. Each chart carries an uppercase 深金
caption above and, wherever the figure is real, its 口径 + 数据来源 line beneath.

### Charts on slides

Kit type is set at report scale — 10px ticks, 11px labels, 12px caption — illegible projected.
On a 1280×720 slide every kit chart goes through **`slides/SlideChart`**, which renders the figure
at 1/1.9 of its column and enlarges it with a transform, so the 10px tick lands at 19px, the
deck minimum. SVG stays crisp for PDF. The kit's own chrome (12px caption with caps tracking,
10px EGA pill, 11px 口径) is **not** used on slides — it wraps badly at 1.9×; the slide prints
the caption and 口径 at 19px and the grade with **`SlideGrade`**, and the kit chart carries
only marks and axes. Chart `height` is in rendered px (the slide sees ×1.9); a slide body is
~480px, so a caption row + 180px svg + a two-line 口径 is the ceiling. Never re-draw a chart
with bigger fonts, and never put an unscaled kit chart on a slide.

The sales deck carries three d3 figures, one per beat of the 三部曲: **现状** — `ProofSlide`'s
样张 card holds a `Histogram` of 午市 tickets with the 38–58 元 band and its share (E1);
**动作** — `ChartSlide` picks with `figure` between `Scatter` 渗透率矩阵 (quadrants at the
全店中位数, 气泡 = 月均销量), `Waterfall` 利润归因 (去年同期 → 当期 by driver) and `ForecastCorridor`
菜单推演 (P10–P90, 基线, 实测, badged E4 — the band is the message); **验收** — `CaseSlide` shows
the 主指标's monthly path as a `TrendLine` with the 动作落地 mark and the 约定目标 reference,
then the 护栏指标 as before → after pairs. All three run on 样张 data and say so in their 口径;
the deck page and `dist/components/2026.10.21-e0a760/loader.js` load d3 v7.

## 5. Iconography

侍天 has its own icon sprite. Three rules follow.

1. **The seal is the only brand mark.** `assets/logo/logo.png` (601×640 master) and
   `assets/logo/supplied-logo-seal.png` (smaller header version) — transparent PNGs, a circular outline
   enclosing 侍天 in brush script. Use it at 28–40px in headers (`--mark-min-inline` 24px
   floor) and 88–120px in the closing CTA (`--mark-min-hero` 64px floor). Never recolor
   it, never place it on a saturated ground, never letter-space or reconstruct the
   calligraphy, never derive a monogram from it. Per the v0.7 ruling, the mark already
   reads 侍天, so **the CN name is not set beside it** — lockups pair the mark with
   "Tiansight" only.
2. **The wordmark is a pun: TIANSIGHT contains INSIGHT.** Set the letters **I N S I G H T in
   gold** (`--gold-400 #A8842F`; `--bronze-300` on ink grounds) and the leading **T and the
   A in black/ink** (`--ink-900`; parchment on ink grounds), so a reader sees TIANSIGHT and
   INSIGHT at once. Spectral, all caps, `.3em` tracking. The split must survive at 14px, so
   it carries **two** contrasts, not one: gold letters at weight 400 and ink letters at
   weight **700**. Note the gold is `--gold-400`, deliberately lighter than 辅助色
   `--bronze-500` — at bronze-500 both halves read as one dark word on parchment.
   **Never flatten it to a single color** and never re-split the letters differently. Use the exported `Wordmark`
   component (`components/core/Seal.jsx`) rather than typing the string by hand.
3. **UI icons: the brand's own 17-glyph sprite.** `assets/logo/icons.svg` holds them as
   `<symbol id="ts-*">`; `components/core/Icon.jsx` inlines the same geometry so the
   component works at any directory depth. Drawing style: 24×24 box, `stroke-width: 1.5`,
   round caps and joins, **no fills**, always `currentColor`, rendered at 18–20px in UI
   and 24px in feature blocks.

   The set: `arrow-right` `arrow-up-right` `arrow-left` `arrow-down` `chevron-down`
   `check` `cross` `menu` `external` `print` `chart` `compass` `route` `correction`
   `store` `data` `seal`. Common Lucide names are aliased onto it (`x`→cross,
   `line-chart`/`trending-up`→chart, `target`→compass, `shield`/`circle-dot`→seal,
   `layers`→route, `clock`→correction).

   The set is deliberately small. A name outside it falls back to a Lucide CDN mask at the
   same stroke weight — that fallback **is** a substitution, so prefer a brand glyph, and
   ask 侍天 to extend the sprite rather than leaning on the fallback. `compass` is the
   brand's own motif (it is also the hero watermark) and should be the default choice for
   navigation/direction ideas.

**Other glyph conventions**

- **No emoji, anywhere.** This is a hard brand rule (see Content Fundamentals).
- Step numbering uses **Chinese numerals in a gold hairline circle** — 一 二 三 四 五 for
  的四个阶段 (开店之前 → 复制扩张) and any numbered ladder — not Arabic numerals in filled dots. Cards may
  carry a 天干 index (壹 / 贰 / 叁) in the same way.
- The middot `·` is the brand's connector (开店之前 · 把生意想清楚); the ideographic comma `、`
  separates list items inside a sentence; `—` is avoided in Chinese runs.
- Directional affordances are gold `→` in text, `arrow-right` in buttons.
- Charts use no icons at all: hairline axes, flat semantic fills, mono labels.

---

## 6. Library build commands

```sh
python3 -m pip install -r scripts/pdf-requirements.txt  # if PDF tooling is absent
python3 scripts/content_lib.py --check
python3 scripts/build_assets.py                 # asset register (or --check)
python3 scripts/build_deck.py --all              # all maintained HTML profiles
python3 scripts/build_deck.py intro --profile client --param date=2026-11 --pdf
python3 scripts/build_deck.py --all --check
node scripts/build_deck_catalog.mjs             # catalog and slide index (or --check)
python3 scripts/release.py intro                # verified local PDFs, latestBuilt
python3 scripts/release.py exhibit
python3 scripts/release.py sales
python3 scripts/release.py intro --approve --by production-review  # production review only: content/approvals.json
uv run --with pillow --with pymupdf python scripts/verify_pdf.py intro client
python3 scripts/check.py --render
node scripts/test_component_runtime.mjs
node scripts/test_migration.mjs
node scripts/test_export_text.mjs
python3 scripts/build_preview.py
```

Release outputs are review candidates; production approval is explicit. Compose a temporary
manifest with existing slide IDs and pass `--manifest`. See `docs/architecture.md`.

## 7. Index

```
styles.css                  single entry point — @import list only
tokens/
  fonts.css                 @font-face for the 127 self-hosted WOFF2 subsets
  colors.css                published palette (authoritative) + ramps + aliases
  typography.css            families, roles, published steps, weights, tracking
  layout.css                spacing, container, radii, borders, shadows, motion, z
  base.css                  element defaults, link states, .ts-* utilities
  tokens.json               the same tokens in Design Tokens Community Group format
assets/
  logo.png                  the 侍天 seal, 601×640 master
  logo-seal.png             smaller header version of the same mark
  icons.svg                 the brand's own 17-glyph hairline sprite (ts-* symbols)
  fonts/                    127 WOFF2 unicode subsets + OFL-*.txt licenses
guidelines/                 foundation specimen cards (Design System tab)
  company-intro-2026-09.md  the current company intro, verbatim — source of record for copy
  brand-guide.md            the published brand guide, verbatim from the source repo
  viz-sample-review.md      four 推演 / 长卷 samples → which figures the chart kit covers
components/
  core/                     Button, IconButton, Icon, Badge, Tag, Card, Divider, Eyebrow,
                            SectionHeading, Seal, Wordmark, Stat, Quote, StepMarker, PlanCard
  forms/                    Input, Select, Checkbox, Radio, Switch
  data/                     MetricRow, BarSeries, Matrix2x2, LedgerTable
  charts/                   chartKit (grammar, tones, chartFor, rollupDims, CanvasLayer) +
                            TrendLine, StackedBars, Waterfall, Heatmap, Donut, Funnel, Gauge,
                            Sparkline, Dumbbell, SlopeChart, DivergingBars, Histogram, BoxPlot,
                            Scatter, Sankey, Treemap, Gantt, CalendarHeatmap, ForecastCorridor,
                            FacetGrid, FacetBars, NineGrid, Pareto, Lollipop, Waffle, Mekko,
                            PairedBars, Lorenz, Tornado, ScoreCompass — d3 v7 (+ d3-sankey)
  people/                   ExpertCard, PartnerCase
slides/                     SlideFrame, SlideTitle, SlidePlaceholder, SlideChart, SlideGrade, TitleSlide,
                            PromiseSlide, SectionSlide, FiveQuestionsSlide (= StagesSlide),
                            ServiceModelSlide, ProofSlide, ChartSlide (+ CHART_FIGURES), LadderSlide,
                            ValueSlide, CaseSlide, PartnerWallSlide, ExpertTeamSlide, ContactSlide
                            — plus index.html (the deck)
templates/
  report-kit/               tsk — Python page types for 1920×1080 Slides report decks + lint / render
                            checks and clickable-PDF export; `bash templates/report-kit/build.sh <deck.py> <dir>`,
                            tests `python3 templates/report-kit/tests/test_kit.py` (in check.py)
ui_kits/
  website/                  官网 long-scroll site (index.html) + 伙伴与创始团队 (partners.html)
  report/                   经营诊断报告 sample pages, incl. the d3 趋势与归因 page
  samples/                  four real 推演 / 长卷 dashboards, verbatim, as reference screens
deliverables/
  lifecycle-map/            餐饮经营全周期图谱 — index.html + decisions.json (d3/three.js from cdnjs)
  report-template/          报告模板 — 39 slides (standards + 27 page-type samples), viewer, PDF, deck.json;
                            regenerate with `python3 deliverables/report-template/gen/template_deck.py`
assets/                     canonical registered photos, marks, portraits, QR and fonts
archive/claude-design-system-v13/  Claude Design System snapshot + SYNC.md (set up / sync another Claude account)
docs/maintaining.md         维护规程 — order of authority, branch/PR rule, brand refresh, gate, artifact sync
docs/report-handbook.md     报告模板手册 — voice, colour, type, layout, badges, page types, workflow, QA for Slides reports
scripts/check_contrast.py    WCAG 2.1 audit of every colour pairing in use; `python3 scripts/check_contrast.py` prints the table (in check.py)
people/profiles.json        联合创始人履历库 (边江, 郭峰): classified entries, E1–E4 grades, contract in profiles.schema.json;
                            pages via `python3 scripts/build_profiles.py` (freshness in check.py),
                            PDFs and single-file HTML via `node scripts/export_profiles.mjs` (into people/export/, ignored)
thumbnail.html              project tile
SKILL.md                    Agent-Skills entry point
github.md                   source-repo association + screen map, for upstream sync
readme.md                   this file
```

### Components

**core** — `Button`, `IconButton`, `Icon`, `Badge`, `Tag`, `Card`, `Divider`, `Eyebrow`,
`SectionHeading`, `Seal`, `Wordmark`, `Stat`, `Quote`, `StepMarker`, `PlanCard`

**forms** — `Input`, `Select`, `Checkbox`, `Radio`, `Switch`

**data** — `MetricRow`, `BarSeries`, `Matrix2x2`, `LedgerTable`

**charts** (d3 v7) — `chartKit` (the shared grammar: `CHART_TONES`, `CHART_HEX`,
`SERIES_ORDER`, `SEQUENTIAL`, `DIVERGING`, `TASK_CHARTS`, `chartFor`, `rollupDims`, `crossTab`,
`DIMENSION_LABELS`, `DIMENSION_GRADE`, `STRUCTURE_PRESETS`,
`CHART_MARGIN`, `AXIS_LABEL`, `VALUE_LABEL`, `tone`, `useD3`, `useWidth`, `CanvasLayer`,
`QualityBadge`, `ChartFrame`, `ChartLegend`, `Axes`), then `TrendLine`, `StackedBars`,
`Waterfall`, `Heatmap`, `Donut`, `Funnel`, `Gauge`, `Sparkline`, `Dumbbell`, `SlopeChart`,
`DivergingBars`, `Histogram`, `BoxPlot`, `Scatter`, `Sankey`, `Treemap`, `Gantt`,
`CalendarHeatmap`, `ForecastCorridor`, `FacetGrid`, `FacetBars`, `NineGrid`, `Pareto`, `Lollipop`,
`Waffle`, `Mekko`, `PairedBars`, `Lorenz`, `Tornado`, `ScoreCompass`

**people** — `ExpertCard`, `PartnerCase`

**slides** (16:9, 1280×720) — `SlideFrame`, `SlideTitle`, `SlidePlaceholder`, `SlideChart`, `SlideGrade`, `TitleSlide`,
`PromiseSlide`, `SectionSlide`, `FiveQuestionsSlide` (= `StagesSlide`), `ServiceModelSlide`,
`ProofSlide`, `ChartSlide`, `LadderSlide`, `ValueSlide`, `CaseSlide`, `PartnerWallSlide`,
`ExpertTeamSlide`, `ContactSlide`.
Decks mount these as `<section>` children of `deck-stage` (`dist/components/2026.10.21-e0a760/deck-stage.js`),
which owns scaling, keyboard nav, the thumbnail rail and PDF export — never write a custom
scaler. Slide defaults carry the current framing: `TitleSlide` 从一道菜… / 拍板之前，问侍天,
`PromiseSlide` the menu thesis and three beats, `FiveQuestionsSlide` the four stages,
`ServiceModelSlide` the three tiers, `LadderSlide` the four parts of 第二大脑, `ValueSlide` the
four checkable changes + 三不, `ProofSlide` one report page with its d3 evidence figure, `ChartSlide`
one of three d3 decision figures (`figure`), `CaseSlide` a 现状 → 动作 → 验收 case with the 主指标's
monthly path (sample-badged until a partner confirms), `ContactSlide` the diagnosis entry.
`ExpertTeamSlide` takes the two founders. Kit charts reach slides only through `SlideChart` (§4).

See each directory's `<Name>.prompt.md` for a one-line "what & when" plus a
usage example, and `<Name>.d.ts` for the props contract.

### Intentional additions

The brief supplied brand copy and colors but no component inventory, so the primitives
are a standard set sized to what the two surfaces actually need. Three are brand-specific
rather than generic, and exist because the copy demands them:

- **Seal / Wordmark** — wraps `logo-seal.png` with the brand's sizing/placement rules, and
  renders the two-tone TIANSIGHT / INSIGHT wordmark so no one flattens or re-splits it.
- **StepMarker** — the Chinese-numeral hairline circle used for the four stages (and, in the
  older sample content, 经营五问 / 三层+X).
- **PlanCard** — now carries the four parts of 餐饮第二大脑 on the site; **Matrix2x2** — the five
  report matrices are named, recurring artifacts in the source copy, not invented UI.
- **The slide set** — added on request for a 16:9 sales deck pitching 侍天 to a restaurant
  owner. Every slide maps to a section of the supplied copy; none invent new claims.
- **ExpertTeamSlide / ExpertCard** — the 专家顾问团 named in X · 增值专项, rendered as portrait
  + one-line 头衔 per the client's brief. Portraits are placeholders until photos are supplied.
  The sales-deck template uses the same slide for the 创始团队 (边江 · 郭峰), two seats portrait-left.
- **The chart set** — added on request. `chartKit` plus thirty chart types, all d3 v7 (the
  client's existing library). The five *named* report matrices remain `Matrix2x2`/`BarSeries`;
  the chart set is the general-purpose layer the report and deck needed, organised by reading
  task (§4).
- **PartnerCase** — the 伙伴案例 surface: a testimonial that carries before→after numbers,
  which is the evidence standard the brand applies to its own conclusions.

### Caveats

- **`ksamint/vanahom-fb-hom01` was read for its dimension contract and chart inventory only**
  (`docs/methodologies/analysis-dimensions-field-contract-v1.md`, `ref/矩阵v3.md`,
  `public/js/v42/v42-charts.js` function list, `docs/architecture/connected-design-system.md`).
  The product's own renderers are plain SVG/HTML helpers; the components here are separate
  d3 implementations of the same figures and can drift. Scoring contracts
  (`buildAdaptationProfile` weights, `sceneScores`) were **not** reproduced — the contract
  forbids re-deriving them outside `server/lib/matrix-insights-analysis.js`.
- **Fonts are real, not substituted.** The 127 WOFF2 subsets in `brand/fonts/` come from
  the source repo and are served locally. The families are Noto Serif SC / Noto Serif /
  IBM Plex Mono — the brand's actual choice, not a stand-in. If 侍天 later licenses Source
  Han Serif or a 方正 face, only `tokens/fonts.css` and the family tokens change.
- **Icons are the brand's own set**, but it is only 17 glyphs. Names outside it fall back
  to Lucide via CDN at matching stroke weight — that fallback is the remaining
  substitution. Ask 侍天 to extend `assets/logo/icons.svg` rather than relying on it.
- **No Latin wordmark artwork exists** in the supplied assets — the two-tone TIANSIGHT /
  INSIGHT lockup is set live in type per the rule above. Send artwork if the real mark has
  custom letterforms or different letter-spacing.
- **Two token layers coexist.** `tokens/colors.css` declares the published palette first,
  then a ramp layer whose older `--bronze-*`, `--parchment-*` and `--ink-NNN` names are
  kept as aliases so the components here keep working. New work should use the published
  names (`--gold`, `--charcoal`, `--surface`, `--seal`). A future pass could retire the
  aliases entirely — say the word and I will.
- **The React components are a recreation, not the source repo's implementation.** The
  repo ships its component layer as CSS (`brand/components.css`) over static HTML; the
  JSX here reproduces the same geometry and states against the same tokens. Values were
  read from the repo, not invented, but the two are separate implementations that can
  drift. `brand/components.css` wins on any disagreement.
- **Charts set their own conventions.** `chartKit` (d3 v7) defines margins, axis type and
  tone mapping. The repo's `html-system/charts.py` builds its eleven chart families
  server-side in Python; the two have not been reconciled glyph-for-glyph. If the Python
  output is the reference, `chartKit.jsx` is the single file to align.
- The report matrices are reconstructed from their **names only** (渗透率矩阵,
  商圈供需洞察, 复购分层四象限, 利润敏感性矩阵, 价格带断层洞察) with plausible sample
  data. Chart types and axis labels need confirmation against a real 样张 —
  `reference/catalogue.md` describes the reviewed originals (anonymised; the files stay out of
  this public repo).
- **Decks.** Intro, exhibit and sales are built from canonical manifests in `content/decks/`.
  Compose by slide references; the report kit remains a separate consumer.
