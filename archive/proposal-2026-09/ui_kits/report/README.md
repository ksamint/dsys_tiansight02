# UI kit · 报告样张 (经营诊断报告 reader)

The deliverable itself — a three-page report reader. Open `index.html`.

| File | Surface |
|---|---|
| `ReportShell.jsx` | Left rail (seal, 决策维度 / 分析维度 / 方法论地图, 仅看异常项 switch, 真实报告 · V4.2, 导出 PDF) + `PageHead` and `Panel` page furniture |
| `DecisionPage.jsx` | 决策维度 — KPI band, 先改这三件 with the mandatory 证据 / 利润影响 / 执行动作 / 验收指标 quartet, 门店经营指数, 一本账 ledger, 90 天行动清单 |
| `AnalysisPage.jsx` | 分析维度 — 经营洞察图谱 switcher across all five named charts (渗透率矩阵, 商圈供需洞察, 复购分层四象限, 利润敏感性矩阵, 价格带断层洞察) |
| `TrendPage.jsx` | 趋势与归因 — the d3 layer: 逐月走势, 渠道结构, 利润流失归因 waterfall, 逐店逐月 heatmap, 客群 donut + funnel, 达成 gauges, sparkline rows |
| `MethodMapPage.jsx` | 方法论地图 — 经营五问 loop with per-step outputs, plus the 三层 + X ladder |

**Requires d3 v7 from CDN** (loaded in `index.html`) for `TrendPage`.

**Interactions:** rail switches pages; 仅看异常项 filters the 决策维度 conclusion list;
chart tags swap the 分析维度 graphic.

**Notes / gaps.** All figures are plausible **sample data** — the real 样张 was described by
name only, so axis definitions, chart types and thresholds must be confirmed against an
actual 侍天 report before this kit is treated as reference. 导出 PDF is decorative.
