# Report profile · 会员菜品复购

Rules for member repurchase reports on top of `SKILL.md` and `docs/report-handbook.md`. Worked
structure with neutral sample data: `html-system/sample/` (HTML) and the B4 / C-series pages of
`deliverables/report-template/` (Slides). Real client figures never go in this repository.

## Completeness (generate and check against this list)

| Block | Contents | Count to check |
|---|---|---|
| 总览 | KPIs (sales, repurchase quantity, weighted 复购点击率, 会员渗透率, 会员内复购占比), store comparison, monthly trend, quadrant, price bands | one set |
| 每店一套 | the same chart set per store as in the overview, scoped to that store | stores × charts |
| 明细 | every chart has its complete list (items, values, quadrant, rank) in the appendix | one list per chart |
| 附录 | period, generation time, fields, formulas, sources, scope, limits, reconciliation, error detail | one each |

Write the expected counts (stores, charts per store, lists, items by spec and after merging specs)
into `01_数据事实与字段定义.md` before generating, and compare after. Shortening copy never drops
a store, a chart or a list.

## Titles

Data pages use noun phrases: 字段说明 · 门店对比 · 月度趋势 · 四象限 · 价格带 · 明细. The conclusion
(e.g. which store leads, by how much) goes in the callout or the first body line, with its number.
A client who asks for short titles gets them on every page.

## Metrics

- 复购点击率 = Σ 复购数量 ÷ Σ 总销售数量 over the scope (weighted; never the mean of row rates).
- 会员渗透率 and 会员内复购占比 as declared in the manifest; same window type for anything on one chart.
- Items are counted twice in the inventory: by spec (大份 / 小份 …) and after merging specs to the
  main item name. Say which count a chart uses.

## Quadrant matrix (two outputs)

1. **Component chart** in the deck (B4 or scatter page): both axes labelled with unit and scale,
   quadrant split lines, Top 5 per quadrant numbered.
2. **Standalone quadrant image**, larger than the slide (e.g. 3200 × 1800 for print and sharing):
   every quadrant lists its Top 5 with number, leader line to the point, and value; a quadrant
   with fewer than 5 items shows its actual count (「本象限 3 项」). The numbers match a detail table
   on the next page or in the appendix.

Quadrant boundaries (medians or thresholds) are computed on the raw data. When the distribution is
skewed, offer a uniform and a log / density view; the scale is named on the chart, ticks show real
values, and points, splits and callouts stay in the same quadrant in both views.

## Data checks specific to repurchase exports

- Reconcile rows, stores, items (by spec and merged), Σ repurchase quantity, Σ sales and the
  weighted rate with the source; any row whose source rate differs from the recomputed rate is
  listed and the check is a fail.
- Helper columns such as a price lookup are judged apart from the core repurchase fields: count
  `#N/A` and empty caches per column, keep the original sheet, the column mapping and the error
  rows.
- After a monthly import, every period in the window must have rows; an empty period view stops
  generation. Monthly and cumulative exports are never added together.

## Exports and acceptance

- PNG set: one file per chart as defined for the project, plus the standalone quadrant image at
  its own size. Every PNG in the ZIP must open (decode) and match the expected count.
- PDF: no clipped pages, every link resolves, per-store sections complete.
- Sharing shows only the authorised import batch.
- `03_验收记录.md` lists passed, failed and not checked. A deck exported by a web app (Chart.js,
  html2canvas, jsPDF) states the checks it ran; it does not inherit the kit's acceptance.
