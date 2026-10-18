---
name: ts-slides-report
description: Build a Tiansight client report, supplement or proposal annex as a 1920×1080 Claude Slides deck with the report kit (tsk) — 27 page types, render checks and a clickable PDF. Use instead of ts-html-report when the deliverable is a Slides artifact or its PDF.
---

# Tiansight Slides report

Rules: `docs/report-handbook.md`. Every page type, rendered: `deliverables/report-template/`
(viewer, `report-template.pdf`, generator `gen/template_deck.py`). Kit: `templates/report-kit/`
(read its README once for setup and the runtime patch). Report-type profiles: `repurchase.md`
(会员菜品复购).

## Workflow (each step leaves a file)

1. **Data facts** → `01_数据事实与字段定义.md`: files, windows, row counts, every field, the
   conclusions the data can and cannot support, and the **expected inventory**: stores, the chart
   set per store, the detail list behind every chart, item counts. Shortening copy later never
   removes a page or a row from this inventory.
2. **Outline and page data** → `02_报告大纲与逐页数据稿.md`: per page a title (conclusion on
   argument pages, noun phrase on data, comparison and appendix pages; see Voice) and the key
   numbers; methods in plain words.
3. **Compute and reconcile** → `res.json` (or similar) plus a reconciliation table. Every number on
   a slide is read from it, never typed. Reconcile rows, stores, items, totals and weighted rates
   with the source before generating; list every difference (`skills/ts-data-quality`
   §Reconciliation, §Pre-generation gate).
4. **Generate**: copy `templates/report-kit/example/starter.py`; `configure()` → `set_order()` →
   page-type calls. Keep eyebrows, titles and badges in one table; unify wording with `apply_terms()`.
   Declare the expected inventory with `expect(group, ids)`, list label-title pages in
   `configure(label_pages=[…])` (or `title_style='label'`), and split long detail tables with
   `table_pages()`.
5. **Check**: `bash templates/report-kit/build.sh <script> <deck dir> [out.pdf]`. It stops at the
   first failure, so fix and rerun until it finishes. It enforces: no overlapping text (OVERLAP), no
   one- or two-character last lines (ORPHAN), one-line titles (TITLE2), no shrinking or overflow,
   body above y = 920, ≥ 24px, titles ending in 。 (label pages: no 。, ≤ 16 characters), every
   page of the expected inventory present (MISSING), no 我们 / 您 / avoided words / emoji, ≤ 1
   charcoal block, two-tone footer wordmark, the renderer subset, valid page references and PDF
   links, 朱红 ≤ 5%. Then look at `<deck dir>/.build/shots/_sheet*.png` for what a script cannot
   judge. The full table is in the kit README.
6. **Verify and accept** → `03_验收记录.md`: tie each key number back to the results file and the
   raw source; facts (store counts, dates, names) from the original material. Check the deck
   against the expected inventory (every store, every chart, every detail list). Record three
   lists: passed, failed, not checked. Never write 「全部通过」 unless every item passed; a source
   rate that differs in even one row is a failure with its rows listed. The kit's checks certify
   only decks built with the kit: a version rendered another way (e.g. Chart.js, html2canvas,
   jsPDF) states the checks it actually ran. For high-stakes decks have someone who did not build
   it do this pass.
7. **Publish**: Slides artifact — upload images, `TSK_BLOBS=blobs.json` regenerate, publish
   `deck.json` + `slides/*.html` as `project/…` with the design-system tokens entry (kit README).
   Deliver the clickable PDF (`verify_pdf` must report 0 unresolved and 0 misdirected) and the data
   tables. Remind the owner that the artifact is private until shared.

## Voice

- 参谋，不是销售. Argument pages: the title is one conclusion ending in 。. Data, comparison and
  appendix pages: a noun-phrase title without 。 (字段说明 · 门店对比 · 四象限). When the client
  asks for short titles, use them throughout and move the conclusion into the first body line or
  the callout. Always one line, no orphan characters.
- Body keeps the key numbers; cut conversational explanation and repeated background.
- No 我们 / 您; 侍天 in the third person. No emoji, no exclamation marks (customer quotes excepted).
- Avoid 赋能 抓手 闭环 打法 解决方案 颠覆 爆款 裂变 数据补全; prefer 领航 校准 复盘 验收 增利 口径.
- Every number has a unit, a window and a source; design and estimated values say so — never write a
  target as a result.

## Visual

- Grounds 淡墨纸 / 宣纸; 玄墨 text, at most one charcoal block per page; 土金 rules, eyebrows,
  numerals; 明金 fills (as text only ≥ 28px); 朱红 for warnings and the project's focus, ≤ 5% of a
  page. Semantic chart colours (growth, caution, datum, benchmark) are report-only.
- Title 56px (fit() steps to 52 / 48 / 44), eyebrow 24, card titles 34–44, numerals IBM Plex Mono
  48–64 in 土金, body 24–26. Nothing under 24px.
- Margins 128, body ends at y = 920, footer at bottom 64: two-tone wordmark · report name ·
  目录 术语 · page. The seal never has 侍天 set beside it.
- Length-encoded charts (bars) start at 0; rankings sorted; one series 明金 → + 玄墨 → + 朱红; no
  3D, dual axes or pies over five. Scatter, matrix and bubble charts may use a log or density
  (non-uniform) scale: say so on the chart, label ticks with real values, and compute quadrant
  boundaries, thresholds and callouts on the original data so they do not move with the scale.
- Above each chart: unit, sample and scale. Below: a one-line source tag pointing to the
  appendix. Period, generation time, fields, formulas, 口径, sources, scope and limits sit
  together in the appendix; notes may add the reading.
- Label values wherever they fit; avoid label collisions; split long lists into columns or pages
  with the header repeated; never shrink type to fit.
- Decorative images come from the official brand library only and never stand in for a client's
  store photos.

## Badges (中文 + 代码)

观测值 VAL.O (= 实测值) · 估计值 VAL.E · 模拟值 VAL.S · 设计假设值 VAL.H (= 设计值) · 可信上限 假设级 <
估计级 < 观测级 · 外部参照 ORG.E3 (design system EGA = ORG) · 数据级 DM1–DM5. Move codes to the eyebrow
when a badge crowds the title.

## Page types (`tsk.pages`)

A1 cover · A2 toc · A3 section_opener · A4 exec_summary · A5 closing · B1 kpi_cards · B2 two_lists ·
B3 steps · B4 quadrant · B5 quotes · B6 roadmap · B7 process_flow · C1 vbars · C2 hbar_list ·
C3 paired_bars · C4 diverging · C5 small_multiples · C6 ratio_bars · C7 heat_table · C8 timeline ·
D1–D3 table · D4 list_columns · E1 glossary (id `gloss`) · E2 sources · F1 team (seat titles exactly
as `guidelines/company-intro-v3.md`). One page = header + one body + at most one callout; over
capacity, split the page. B4 quadrant: Top 5 per quadrant, numbered, each number in the detail
table; a quadrant with fewer than 5 items shows its actual count.

## Standard structure

Cover · contents · executive summary → 一 数据与口径 → 二 现状画像 → 三 聚焦目标 → 四 市场与对策 →
appendix (period and generation time, fields, formulas, 口径, sources, scope and limits, terms,
full detail tables) · closing.

## Renderer limits

No margin, z-index, em or var(); one gap value; padding ≤ 256; no font or weight on table cells
(set on the table, emphasise with colour); spans take colour, bold, italic, underline only; links
http(s) only; empty unpainted divs are dropped; ≤ 200 elements per slide, ≤ 24 positioned children
per container; one border style and colour per element; no text inside SVG.

## Client material

This repository is public. Client names, store names and real figures stay out of it: templates and
samples use invented data, and client decks live in their own private repositories or artifacts.
