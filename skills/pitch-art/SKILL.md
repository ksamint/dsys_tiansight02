---
name: "pitch-art"
description: "Build client-facing pitch decks, proposals and service proposals (服务建议书 / 提案 / 方案汇报 / 诊断报告) that win decisions: one insight per slide shown as an infographic, formal titles, a dated plan, a sourced value model with investment and ROI, and every claim backed or marked illustrative. Use for any pitch, proposal deck, 提案, 建议书, sales or capability deck, or when asked to make slides less wordy, more visual, more professional or less AI."
---

# PitchArt

A pitch moves one client to one decision. Each slide is read in five seconds: a formal title, one takeaway sentence, one figure. The figure carries the argument; words only label it.

## 1. Slide anatomy (every content slide)

| Layer | Content | Limit |
|---|---|---|
| Eyebrow | chapter in English caps (`VALUE · 价值测算`) | 1 line |
| Title | formal noun phrase | ≤ 12 CJK |
| Takeaway | one declarative sentence, key numbers in accent | ≤ 40 CJK, 1 line, 2 at most |
| Figure | one infographic, chart or diagram | ≥ 60% of the content box |
| Labels | words inside or beside the figure | ≤ 8 CJK each |
| Footer | source · evidence grade · page | 1 line |

Nothing else. No paragraph, no bullet list under the figure, no "说明", no closing sentence. If a slide needs explaining, the figure is wrong: redraw it or split the slide.

## 2. Before designing

1. **Decision.** One line: what the client agrees to at the end. The kickoff slide asks for exactly that.
2. **Scale and targets.** The client's full footprint and every stated target. Value is computed at full scale; an unknown scale is asked once, then stated as an assumption.
3. **Concerns.** Profit, opportunity, risk, cost, speed, proof. These are the words that get the accent.
4. **Evidence.** Primary public sources first (filings, statistics bureaus, regulations, peer-reviewed studies). Never invent statistics, quotes, cases, results or credentials.
5. **One facts file, one value model.** Every number lives in one JSON (value, unit, window, source, grade). A script computes value, ramp and ROI; slides render its output. No hand-typed computed numbers.
6. **Outline.** One line per slide: title, takeaway, figure type. Confirm it unless the user said to generate.

## 3. Storyline (default)

| # | Slide | Figure |
|---|---|---|
| 1 | Cover | client · project · document type, nothing else |
| 2 | Baseline | benchmark bars, client marked in accent |
| 3 | Pain | three icon cards → accent consequence banner |
| 4–6 | Logic | profit equation · model flow · driver chart |
| 7–11 | Value levers | one lever per slide: mechanism diagram + size |
| 12 | Value at full scale | range bars with annual total |
| 13 | Assumptions | table: parameter · value · source · grade · replaced by |
| 14 | Investment and ROI | cumulative value band vs investment, payback table |
| 15 | Architecture | layered modules |
| 16 | Roadmap | month columns with targets and milestones |
| 17 | Module Gantt | week grid, milestone diamonds |
| 18–21 | Module details | two module cards per slide with mini Gantt |
| 22 | Metrics | 1 main metric + 2 guardrails as KPI tiles |
| 23 | Next stage | add-on modules on a timeline |
| 24 | Team and proof | profile rows, logos, sample pages |
| 25 | Kickoff | three-step start, last step in accent |
| 26 | Sources | appendix table |
| 27 | Close | brand line, seal or logo |

Roadmap, investment/ROI, a value line on every module and the next-stage slide are always present. Diagnostic report: an executive summary slide (situation · complication · answer as three blocks) after the cover, diagnosis chapters of 2–4 slides, then the same value, ROI, roadmap and kickoff block.

## 4. Figure choice

Pick by the question the slide answers. Recipes with coordinates: `references/infographics.md` (read before drawing).

| Question | Figure |
|---|---|
| Where do we stand? | benchmark bars, client in accent, peers in neutral |
| Where does it hurt? | pain cards → arrows → consequence banner |
| What drives the result? | equation with lever icons under each term |
| How does the model work? | inputs → accent core → output |
| How does an outside factor move demand? | gap bars around zero |
| Where is money lost? | waterfall (示意 without data) |
| How big is each lever? | range bars, total row |
| When does it pay back? | cumulative band vs investment lines |
| Before vs after? | paired bars or slope chart, delta labelled |
| What is one number? | KPI tile: number 96, unit, one label |
| Where is new revenue? | opportunity matrix |
| How is the service built? | layered architecture with feedback arrow |
| What is the plan? | month columns + week Gantt |
| How does it scale? | pilot → standard package → many sites |
| What happens after launch? | cycle loop |
| What do we deliver? | deliverables tree |
| How do we start? | three-step start |

Rules for every figure:

- **One message per figure.** The insight in accent; everything else neutral or gray. One to three accent marks per slide.
- **Label directly.** Labels sit on or beside the mark; no legend when direct labels fit. Value labels never collide with category labels.
- **Strip.** No gridlines beyond a baseline, no axis titles that repeat the takeaway, no 3D, no shadows, no gradients, no decorative shapes.
- **Five or fewer.** At most five items per group; merge the tail into "其他" or split the slide.
- **Same grammar.** One icon set per deck (same stroke, no fill), same colors for the same meaning on every slide.
- **Illustrative is marked.** Charts without data carry "示意" and no numbers; demo screens "演示版本 · 模拟数据".

## 5. Writing

**Title**: a section name in report register: "共识预测模型", "投入与回报", "六个月实施路线图", "下一步工作建议". Never a sentence, claim or slogan.

**Takeaway**: one declarative sentence with numbers: "强降雨日客流下降 7.4%–11%，提前 72 小时调减零工短班可避免整班闲置".

**Labels**: nouns and numbers. "A 时段匹配 · 年 298–496 万元", not "通过时段匹配，每年可为您节省…".

Professional, not AI. Delete on sight:

| Pattern | Examples |
|---|---|
| Hype verbs and abstractions | 赋能、助力、打造、抓手、闭环、全方位、一站式、深度、极致、全链路、底层逻辑、新范式 |
| Contrast and rhetorical frames | 不是 X，而是 Y · 不仅…更… · 真正的… · 你是否… · 答案是… |
| Spoken openers and closers | 今天… · 让我们… · 一句话… · 总之… · 我们相信… |
| Slogan titles | 每 30 分钟都是算出来的 · 人工成本是第二本账 |
| Colon-pair headlines | 效率：从经验到数据 |
| Reflex triplets | three parallel adjectives or three cards when the content has two or four |
| Decoration | emoji, exclamation marks, quotation-mark emphasis, stacked dashes |

Every number has a unit and a window. Value not monetized is labelled "不计入测算". Never promise returns: "不作收益承诺".

## 6. Timeline

- **Roadmap**: one column per month or phase: scope, target (10% → 15% → 30%), three actions, one milestone. Final month in accent.
- **Gantt**: all modules on one week grid under month bands; accent bars for modules that produce value directly; diamonds for reviews.
- **Module cards**: name, cadence chip ("第 1 月 · 之后每周"), 3–4 subtasks on a mini Gantt, deliverable, value.
- Start rule in the footer: "以数据接入完成日为第 1 周起算".

## 7. Value, investment, ROI

- **No overlap.** Each lever on its own base, stated on the slide. Overlapping levers are shown, not summed.
- **Ranges.** Low = conservative, high = ambitious; per unit per month and full scale per year.
- **Ramp.** Value starts at go-live; first month at about 50%; phased targets scale their lever.
- **Assumptions.** Every parameter: value, source, grade, replacement plan ("第 1 月以考勤替换"). Wage and cost inputs from official statistics.
- **ROI.** Cumulative band (low/high) over 12 months against investment; return multiple and payback month. Unpriced: three tiers marked "示意，正式报价另附".
- Revenue upside and soft value go in a "未计入测算" note. A collapsed range prints one value ("第 6 月").

## 8. Evidence

Every data slide ends with a source line and grade: **E1** measured in client data · **E2** correlation in client data · **E3** external reference · **E4** inferred or estimated. Credentials quoted verbatim from the latest client-facing source; conflicts flagged to the user.

## 9. Reading comfort (1920×1080)

- **Type**: display 96 · headline 64–72 · takeaway 32–36 · block title 40–44 · label 28–32 · footer 24. Nothing under 24 px except appendix tables (17–20) and chart ticks (≥ 20).
- **Rhythm**: eyebrow, title, takeaway, chapter tracker and footer at identical positions on every slide; page numbers automatic.
- **Space**: 128 px side margins; at least a third of each slide empty; figure aligned to the grid, never floating.
- **Reading path**: title → takeaway → accent mark → labels. If the eye lands elsewhere first, reduce it.
- **No orphans**: no line ending in one or two characters. Width check: CJK ≈ 1.0 × size + tracking, Latin ≈ 0.6 ×. If it does not fit, shorten the words, never shrink the type.

## 10. Trust visuals

- **People**: portrait left; name, role, two tags, three proof lines right; the credential that matters to this client highlighted.
- **Logos and samples**: real files only; demo screens labelled.
- **Photos**: only supplied images, as a side panel or a band under a timeline, never behind text; photos not of the client carry "示意".

## 11. Design system

A named design system is read in full before any color or font is chosen; its accent becomes the highlight color and its icons replace the library in the recipes. User instructions override it.

**Tiansight (this repository)**: `brand/tokens.css` is the only color source. Highlight `--gold-hi` (key numbers, 28 px+) on `--surface` / `--paper`; structure `--gold`; text `--charcoal` and `--ink-muted`; `--seal` only for loss or warning, ≤ 5% of a slide. Serif stacks only; radius 2 px, pill or circle; no gradients, no emoji. Icons from `brand/icons.svg` first, the recipe library only for glyphs it lacks. Name: 侍天 TIANSIGHT. Build with `ts-slides-report` (Slides decks) or `ts-html-report` (HTML).

Without a design system: one dark, one light, one accent, toned neutrals, two background tones.

## 12. Build and check

1. Build 1920×1080 slides from the facts file and value model; PDF is an export.
2. Render every slide and look: no overflow, nothing in the footer band, no clipped text, no type under the minimum.
3. Rerun the value model; every rendered number matches its output.
4. Read every slide against §1 and §5: any paragraph, list or flagged phrase is removed.
5. Reply in a few lines: what changed, and what is illustrative, assumed or inferred and needs checking.

## 13. Checklist

- [ ] Every content slide: noun-phrase title, one-sentence takeaway, one figure, nothing else
- [ ] Figure chosen from §4; one accent message; direct labels; ≤ 5 items per group
- [ ] No sentence in any label; no phrase from the §5 delete list
- [ ] Value at full scale; levers non-overlapping; ranges; assumptions with source, grade, replacement
- [ ] Investment and ROI with payback month and return multiple (tiers marked 示意 if unpriced)
- [ ] Roadmap, module Gantt, module cards with value, next stage, kickoff decision
- [ ] Source line and E-grade on every data slide; illustrative figures marked
- [ ] Type at or above the minimum; no orphans; a third of each slide empty
- [ ] Real people, logos and samples; credentials verbatim
- [ ] Every slide rendered and checked
