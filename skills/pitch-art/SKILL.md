---
name: "pitch-art"
description: "Build client-facing pitch decks, proposals and service proposals (服务建议书 / 提案 / 方案汇报 / 诊断报告) that win decisions: formal titles, one insight per slide, an implementation timeline, a sourced value model with investment and ROI, client value on every module, and every claim backed or marked illustrative. Use for any pitch, proposal deck, 提案, 建议书, sales or capability deck, or when asked to make slides less wordy, more visual, more convincing or less AI."
---

# PitchArt

A pitch deck exists to move one client toward one decision. The client should grasp each slide in five seconds, see their own money and risk on it, and believe it because it is backed. Five habits carry this:

1. One insight per page, stated in a takeaway line before the chart.
2. Charts that show only what the insight needs, with the insight in the accent color.
3. A source line and evidence grade under every number.
4. A dated plan: what happens in which month, with milestones.
5. Money both ways: what the client gains and what it costs, with ROI and a payback point.

## 1. Before designing

1. **Pin the decision.** One line: what the client should agree to at the end (e.g. "approve a 6-month rollout starting with 5 pilot stores"). The kickoff page asks for exactly that.
2. **Pin the client's scale and targets.** Use the client's full footprint (e.g. 120 stores nationwide, not only the stores visible on a review platform) and every stated target (e.g. flexible labor 10% → 30% in 6 months). Value is always computed at full scale. If scale is unknown, ask once; if unanswered, state the assumption on the baseline page.
3. **List the client's concerns.** Usually profit, opportunity, risk, cost, speed, proof. These words become the highlighted vocabulary.
4. **Research before writing.** Find public evidence for each claim: listed-company filings, statistics bureaus, laws and regulations, peer-reviewed studies, recognized industry data. Prefer primary sources; mark secondary media as such.
5. **Collect real material.** Read every file the user gave and the design system if one is named. Never invent statistics, quotes, cases, results or credentials.
6. **One facts file, one value model.** Keep every number the deck shows in one JSON/dict (value, unit, window, source, grade). Compute value, ramp and ROI in a small script and render its outputs into slides; never type computed numbers by hand. Fix each time window once and reuse it.
7. **Outline first when the brief is open.** One line per slide with title and takeaway; confirm unless the user already said to generate.

## 2. Storyline (default order)

Each slide answers the question the previous one raises.

| # | Slide | Question it answers |
|---|---|---|
| 1 | Cover | Client / project / document type. Nothing else. |
| 2 | Baseline | Where does the client stand, against peer benchmarks? |
| 3 | Pain | Where is the client losing money or chances today? |
| 4–6 | Logic | What drives the result? (equation, model, method evidence) |
| 7–11 | Value levers | One lever per page: mechanism, evidence, size |
| 12 | Value at full scale | Non-overlapping levers as range bars with an annual total |
| 13 | Assumptions | Every parameter: value, source, grade, how it gets replaced |
| 14 | Investment and ROI | Cumulative value vs investment, payback month, return multiple |
| 15 | Architecture | The service as modules in layers |
| 16 | Roadmap | Month-by-month scope, target, actions, milestone |
| 17 | Module Gantt | All modules on one week grid with review milestones |
| 18–21 | Module details | Per module: cadence, subtasks on a mini Gantt, deliverable, value |
| 22 | Metrics | 1 main metric, 2 guardrails, baselines, cadence |
| 23 | Next stage | Add-on modules the first phase enables, with timing and value |
| 24 | Team and proof | Photos, verbatim credentials, logos, samples |
| 25 | Kickoff | Three concrete first actions, ending in the decision |
| 26 | Sources | Appendix table of sources and evidence grades |
| 27 | Close | Brand line, seal or logo |

The value block (levers, scale, assumptions, ROI) is the largest part: clients decide on what they gain. A pitch is incomplete without the **roadmap, the investment/ROI page, a value line on every module, and the next-stage page**; add them even when the brief does not ask.

For a diagnostic or research report, open with a one-page executive summary (situation, complication, question, answer) after the cover, run diagnosis chapters of 2–4 insight pages, and close with the same value, ROI, roadmap and kickoff block.

## 3. Writing rules

- **Two text layers per content page.**
  - **Title**: a formal noun phrase naming the topic, the way a consulting report names a section: "共识预测模型", "灵活用工合规边界", "投入与回报", "六个月实施路线图", "下一步工作建议". Never a spoken sentence, a claim or a slogan: not "每 30 分钟的用工是算出来的", not "人工成本是第二本账", not "一句话改排班", not "盈亏，取决于三项决策。".
  - **Takeaway** under it: one declarative, data-backed sentence with key numbers in accent ("强降雨日餐厅客流下降 7.4%–11%，提前 72 小时调减零工短班可避免整班闲置"). Written-report register: no colloquial verbs (算出来, 用起来, 找到菜上), no questions, no "不是 X，而是 Y", no openers like "今天…", no first-person marketing ("我们相信…").
- **No explanation, no filler.** Beyond the takeaway, slides carry labels and short phrases. Body text ≈ 30 Chinese characters or 20 English words outside diagram labels.
- **Client value everywhere.** Every module, phase and add-on states what the client gets in money, risk or time ("A 时段匹配：年 298–496 万元"; "店长排班时间压缩（不计入测算）"). Value that is not monetized is labelled as such.
- **Highlight what the client cares about.** Profit, opportunity, risk, results: accent color + bold, larger where it is the point. One to three highlights per slide; supporting data in the brand neutral, context in gray.
- **Backup or mark.** A number appears only if it comes from a source (client data, cited research, the value model). Every data page ends with a source line and an evidence grade: E1 measured from client data · E2 correlation in client data · E3 external reference · E4 inferred or estimated. Illustrative charts carry "示意 / illustrative" and no numbers. Demo screenshots carry "演示版本 · 模拟数据".
- **People.** Quote credentials verbatim from the latest client-facing source. If sources disagree, use the latest and flag the conflict to the user.
- **Cover rule.** Three lines at most: client, project name, document type.

## 4. Timeline rules (always)

- **Roadmap page**: one column per month or phase with scope (stores, regions), the target for that month (e.g. 10% → 12% → 15% → 20% → 25% → 30%), three key actions and one milestone. Accent on the final month.
- **Module Gantt**: all modules on one week grid (e.g. 24 weeks under six month bands), accent color for modules that produce value directly, diamonds for review milestones.
- **Module detail pages**: two modules per page. Each card: name, cadence chip ("第 1 月 · 之后每周"), 3–4 subtasks on a mini Gantt, deliverables, value.
- Typical pilot logic: month 1 build models, choose pilot and control stores, simulate on history; month 2 run the pilot against control stores and adjust; month 3 widen the pilot and add the next system; months 4–6 roll out by region to full scale, then review and decide the next stage.
- State the start rule in the footer ("以数据接入完成日为第 1 周起算").

## 5. Value, investment and ROI rules (always)

- **Levers must not overlap.** Give each lever its own base so they add up honestly (e.g. A on the current staffing mix, B only on event days, C only on newly flexible hours) and say so on the page. If levers overlap, show them separately and do not sum.
- **Ranges, not points.** Low = conservative, high = ambitious. Show per unit (per store per month) and full scale (all stores per year).
- **Ramp realistically.** Value starts when units go live; new units count at about 50% in their first month; phased targets scale their lever.
- **Assumptions page.** Every parameter with value, source, grade and replacement plan ("第 1 月以考勤替换", "第 2 月试点对照校准"). Take wage and cost inputs from official statistics where possible.
- **Investment and ROI page.** Cumulative value band (low/high) over 12 months against investment lines; a table of return multiple (first-year value ÷ investment) and payback month. If the price is not set, show three investment tiers marked "示意，正式报价另附". Never promise returns: "不作收益承诺".
- Revenue upside and soft value (service quality, manager time) go in a "未计入测算" note, not in the total.
- When a range collapses to one value, print one value ("第 6 月", not "第 6–6 月").

## 6. Typography rules (no orphans)

- **No orphan characters.** No second line of one or two characters. Every line either fits (`nowrap` + width check) or is broken by hand into balanced lines.
- **Width math.** CJK glyph ≈ 1.0 × font-size plus letter-spacing; Latin ≈ 0.6 ×; monospace digits ≈ 0.6 ×. Check `chars × (size + tracking) ≤ box width` before writing. If it does not fit, shorten the words.
- **Big type** on 1920×1080: display 96, headline 64–72, takeaway 32–36, block title 40–44, body 28–32, label/footer 24. Nothing under 24 px except appendix tables (17–20 px) and chart tick labels (≥ 20 px).
- **Fixed rhythm.** Eyebrow, title, takeaway, chapter tracker and footer at identical positions on every content page; page numbers counted automatically.

## 7. Every slide is visual

From slide 2 on, every slide carries a chart, infographic, diagram, icon set or photo. Pick by the question:

| Question | Visual |
|---|---|
| Where does it hurt? | 3 icon cards → arrows → accent banner with the consequence |
| What drives the result? | Equation (Profit = A × B − C − D) with lever icons under each term |
| How does a model work? | Inputs → accent core → output flow |
| How does an external factor move demand? | Gap bars around zero |
| How big is each lever? | Range bars, solid to low, light to high, total row |
| When does it pay back? | Cumulative value band vs investment lines, payback table |
| Why act early? | Cost-of-change curve with intervention zone |
| Where is money lost? | Waterfall: base → leaks → current vs improved (示意 if no data) |
| Where is new revenue? | Matrix with existing vs opportunity cells |
| How is the service built? | Layered architecture with a feedback arrow |
| What is the plan? | Month columns + week Gantt with milestone diamonds |
| How does it scale? | Pilot → standard package → many sites |
| What happens after launch? | Cycle loop (data → adjust → execute → verify) |
| How do we start? | 3-step flow, last step in accent |

Recipes with coordinates are in `references/infographics.md`; read it before drawing these. If the skill bundle also has `scripts/charts.py`, use it for data charts.

Chart hygiene: value labels never sit on category labels (put negative-bar values on the empty side of the zero line); every label stays inside the drawing; spread labels of nearby reference lines. Icons: one hairline set (same stroke, round caps, no fill); never mix styles on one slide.

## 8. Trust visuals

- **People:** real portraits and verbatim credentials. Photo left, name + role + 2 tags + 3 proof lines right. Highlight the credential most relevant to this client.
- **Logos:** real logo files and names only.
- **Samples:** real report pages or screens, labelled when demo data.
- **Photography:** only images the user or design system supplies; warm, on-brand; as a side panel on cover/close or a band under a timeline, never behind text. Photos not of the client carry "示意".

## 9. Design system first

If a design system is named, read its README fully before choosing any color or font. Apply palette, type, radii, voice and brand rules. Its accent or warning color becomes the highlight color. Bring in its photos, logos and portraits as files. Explicit user instructions override it. Without one: one dark, one light, one accent, toned neutrals, two background tones.

## 10. Build, verify, deliver

1. Build HTML slides at 1920×1080 from the facts file and value model (or the environment's native slide type). PDF is an export.
2. Render every page and look at it: no overflow, nothing entering the footer band, no clipped text, no font under the minimum. If `scripts/check_layout.py` is bundled, run it and review its contact sheets. Fix and re-render until clean.
3. Rerun the value model and compare every rendered number with its output.
4. Offer companions when data-heavy: an interactive dashboard on the same facts, a data export, a fill-in template for missing client inputs.
5. Reply in a few lines: what changed, and which content is illustrative, assumed or inferred and needs the user's check.

## 11. Final checklist

- [ ] Every title is a formal noun phrase; every takeaway is one declarative sentence with accent numbers
- [ ] Value computed at the client's full scale; levers non-overlapping; ranges, not points
- [ ] Assumptions page with source, grade and replacement plan for each parameter
- [ ] Investment and ROI page with payback month and return multiple (tiers marked 示意 if price unknown)
- [ ] Month-by-month roadmap, module Gantt with milestones, module details with cadence, subtasks, deliverable and value
- [ ] Next-stage add-on modules with timing and what they build on
- [ ] Kickoff page asks for the one decision
- [ ] Every slide from 2 on is visual; insight in accent, context in gray
- [ ] Every number traced to the facts file or value model; source line and E-grade on each data page
- [ ] No 1–2 character orphans; nothing under 24 px outside appendix tables and ticks
- [ ] Team, logos and samples use real assets; credentials verbatim
- [ ] Every page rendered and checked