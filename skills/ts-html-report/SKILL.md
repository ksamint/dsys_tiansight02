---
name: ts-html-report
description: Build or revise a Tiansight HTML slide deck (1280×720) or long-scroll report on the brand foundation, with every number sourced, calibrated and explained. Use for any 经营诊断 / 战略提案 / 数据分析 deliverable in HTML, including converting an existing deck to the standard.
---

# Tiansight HTML report

One manifest per report drives everything. You write `manifest.json`, `data/*.csv` and the slide
bodies; the builder generates the cover, TOC, evidence base, evidence map, change log, quality,
limitations, source log, glossary, the explanation panel behind every slide and the drill-down
appendix. Nothing structural is hand-written, so nothing structural can drift.

## Workflow

1. **Read the brand foundation once**: `brand/guide.md` §0 rules, §4 voice, §5 charts. The report
   uses `brand/tokens.css` + `html-system/report.css`; never introduce colours or fonts.
2. **Register the data** before writing any slide: load `ts-data-provenance` and fill
   `sources`, `fields`, `metrics`, `glossary`. Run `ts-data-quality` on every table and paste the
   results into `quality`. A number without a source id and a formula cannot appear on a slide.
3. **Outline the deck as conclusions.** Every content slide's `title` is the conclusion with its
   number (`<em>` for the key number, `<s>` for the negative). List them first; the evidence map is
   generated from `conclusion.{text, metric, value}`.
4. **Compose slides** from blocks (`chart`, `kpis`, `panel`, `table`, `list`, `html`). Charts come
   from `ts-dataviz-modules`; each chart inherits the slide's first `src` for drill-down.
5. **Write the explanation** (`meta`: source, formula, derivation, glossary, conclusion,
   confidence) and the one-line `caliber` that goes in the footer. Set `ega` to the weakest
   grade among the slide's sources and metrics.
6. **Build and gate**:
   ```sh
   python3 html-system/build_deck.py <dir>
   python3 html-system/check_report.py <dir> --layout
   ```
   Fix the manifest until the gate passes. Never patch the generated HTML or add per-slide CSS
   overrides; if a slide overflows, cut content or split the slide.
7. **Version**: bump `report.version`, append to `versions` (`ts-report-versioning`), rebuild.
8. **Deliver**: the directory (`index.html` + `data/` + `manifest.json`) is self-contained and
   works from `file://`. Print → 1280×720 PDF. For the web build load `ts-webapp-interactive`.

## Slide anatomy (fixed, from the reference decks)

```
.s-top   chip (section id) · ega badge · ⊞ 数据出处 · tag           22px
.s-title the conclusion, ≤ 2 lines, number in <em>, negative in <s>   74px
.s-body  layouts: rows | g2 | g3 | g4 | sp (330px + 1fr) | sp2        498px
.s-foot  client · title · report id · version ｜ 口径：… · page       26px
aside.meta  SOURCE · FORMULA · DERIVATION · GLOSSARY · CONCLUSION · CONFIDENCE (screen only)
```
Body heights are fixed so the print never overflows; the gate measures every slide.

## Writing rules (from `brand/guide.md` §4 and the reviewed decks)

- Headline = conclusion with a number and, where it matters, its boundary. Not a topic.
- One slide, one conclusion, one chart or table that supports it; side panels say 读图 / 边界 / 先改这件.
- Four elements for any recommendation: 证据 · 利润影响 · 执行动作 · 验收指标.
- 可计算的量化到位，不可计算的如实说明: write "不可计算，如实说明" rather than an invented number.
- Say 领航 / 复利 / 模型 / 数据校准; never 赋能 / 抓手 / 闭环 / 包治百病 / 爆款 / 裂变.
- Numbers in mono, Arabic, with a hair space in CN runs (交 6 个月); percentages with the unit; pp for differences of percentages.
- Every chart has a source line; every table has a 口径 line; every slide has a footer 口径.
- Tone: 沉稳、专业、敢言、克制、有据可依. No exclamation marks outside quotes.

## Generated slides you must not hand-write
Cover · 目录 · 证据底盘 (sources, windows, known bias, EGA legend and page counts) · 结论索引 ·
卷首变更 · 质量异常 · 分析局限 · 附录 SOURCE LOG · 附录 GLOSSARY · the appendix overlay.
Add a divider with `kind: divider` for each 卷.

## Scroll mode
Set `report.mode: "scroll"` for a long-scroll web report (受据 / 长卷 style). Same manifest, same
charts; sections carry eyebrow · number · ega · srcbtn, a `.stat-grid`, a `.ledger`, and the
explanation panel inline under each section. Build with the same commands.

## Files
- `html-system/manifest.schema.json` — the contract. `html-system/sample/` — a complete worked example (22 slides, every chart family, drill-down, change log).
- `html-system/report.css`, `report.js` — the runtime. `reference/catalogue.md` — where each pattern came from.
