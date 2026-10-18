# 可视化样本评审 · 四份推演 / 长卷 HTML → 图表库

Reviewed 2026-09-19. All four samples are hand-written d3 v7 (or inline SVG) on the brand palette
(gold · charcoal · 朱红 / jade). Below, every figure family they use is mapped to this kit:
**covered** (a component already renders it), **added** (built from the sample), or **not a
component** (page-specific, or a diagram rather than a data figure).

## 1 · 烘焙门店进销存决策台 (24 boards · 70 views · d3 + simple-statistics)

| Sample figure | Verdict | Kit |
|---|---|---|
| KPI tiles, 数据缎带 (three-segment ribbon) | covered | `Stat`, `MetricRow`, `StackedBars normalize` |
| 逐日销售额 + 报废率, 假期底色, brush | covered | `TrendLine` (+ `CalendarHeatmap` for the window) |
| 区域单店产出 ranking, 门店排行榜 | covered | `BarSeries`, `Lollipop` |
| 区域 × 品类 Mekko | **added** | `Mekko` |
| 门店 × 假日弹性 scatter, 价格弹性 fit | covered | `Scatter` (`trend`) |
| 帕累托 / ABC 分级 | covered | `Pareto` |
| 洛伦兹曲线 · 货盘集中度 | **added** | `Lorenz` |
| 单品 × 门店 铺货热力 | covered | `Heatmap` |
| 覆盖门店数 分布 | covered | `Histogram` |
| 菜单工程四象限 | covered | `Matrix2x2`, `Scatter quadrants` |
| 价格带 SKU 数 vs 营收 | **added** | `PairedBars` |
| 面团条线负载 | covered | `BarSeries`, `StackedBars` |
| 报废金额分解瀑布, 利润桥 | covered | `Waterfall` |
| 报废 门店 × 日期 热力 | covered | `Heatmap` |
| 平衡式流向图 (Sankey), 钱的流向 | covered | `Sankey` |
| 每 100 件去向 Waffle | **added** | `Waffle` |
| 报童临界分位曲线, 需求分布箱线 | covered / not a component | `BoxPlot`; the critical-fractile curve is model-specific |
| 新品爬坡 | covered | `TrendLine`, `Sparkline` |
| 预测走廊 A/B/C 情景, 驱动流, 累计回本 | covered | `ForecastCorridor`, `StackedBars`, `TrendLine` |
| 敏感度龙卷风, 缺货截断校正 | **added** / not a component | `Tornado`; censor correction is a table |
| 门店分群 (相似度矩阵 + 切分) | not a component | clustering output; render with `Heatmap` |
| 假日 / 平日 斜率图 | covered | `SlopeChart` |
| 数据质量 / 字段流向 / 方法出处 tables | covered | `LedgerTable`; field flow via `Sankey` |

## 2 · 侍天 · 地点推演台 (inline SVG, 六模块)

| Sample figure | Verdict | Kit |
|---|---|---|
| 十二要素评分罗盘 (hero) | **added** | `ScoreCompass` |
| 需求捕获 stacked-area 时序 | covered | `TrendLine` (`area`), `StackedBars` |
| 周 × 小时 客流热力 | covered | `Heatmap` |
| 品类 需求 − 供给 缺口 diverging | covered | `DivergingBars` |
| 竞品 价格 × 评分 气泡 | covered | `Scatter` (`r`) |
| 席位仿真 占桌 / 放弃率 | covered | `TrendLine`, `Gauge` |
| 首年营收 P10/P50/P90, 亏损概率 | covered | `ForecastCorridor`, `Histogram` |
| 敏感性排序 | **added** | `Tornado` |
| 宜 / 慎 / 否 stamp | covered | `Badge outline` / `Seal` |

## 3 · 席位推演 · 产能与营收预测模型 (inline SVG)

| Sample figure | Verdict | Kit |
|---|---|---|
| 平面图读图 / 席位台账 / 容客画像 | not a component | floor-plan tooling, tables → `LedgerTable` |
| 就餐人数 / 到店时点 / 停留时长 / 星期月份指数 | covered | `BarSeries`, `Histogram`, `BoxPlot`, `TrendLine` |
| 单日演练 时间轴 (占桌 + 排队) | covered | `TrendLine` two series, `Gantt` per table |
| 月度营收带 P10–P90 | covered | `ForecastCorridor` |
| 产能瓶颈 月 × 时段 | covered | `Heatmap` |
| 损益表 / 保本线 | covered | `LedgerTable`, `Gauge` |
| 敏感性 tornado | **added** | `Tornado` |
| 菜单工程 四口径 散点 (K-S / Pavesic / Miller / LeBruto) | covered | `Scatter quadrants` |

## 4 · 门店经营模式长卷 (d3 inline, 十二项洞察; client sample, removed from the repo)

| Sample figure | Verdict | Kit |
|---|---|---|
| 三指数 (客流 / 客单 / 营收) 月线 | covered | `TrendLine` |
| 日序列 + 7 日均线 | covered | `TrendLine` (add MA series) |
| 渠道 占比 bars + 渠道按月 stacked area | covered | `BarSeries`, `StackedBars normalize` |
| 渗透率 × 营收占比 log-log 气泡 | covered | `Scatter` (pass log-transformed values; add `scale` prop if needed) |
| 价格带 SKU 数 vs 营收 paired | **added** | `PairedBars` |
| 星期 × 小时 矩阵 | covered | `Heatmap` |
| 客单价分布 直方 (中位 / 均值 / P99 marks) | covered | `Histogram` (`marks`) |
| 折让率 趋势 | covered | `TrendLine` |
| 点菜员 客单价 方差 | covered | `Lollipop`, `BoxPlot` |
| 数据缺口 清单, 五层大脑 layer diagram | not a component | `LedgerTable`; the layer diagram is a static figure |

## What was added and why

Six families recur across the samples and had no home in the kit: `Waffle` (share as a count),
`Mekko` (构成 × two categoricals — the B6 matrix's 马赛克图 cell), `PairedBars` (版面 vs 产出
misalignment, also `pairedBars` in the platform's v42-charts), `Lorenz` (concentration in one
number), `Tornado` (in three of four samples), `ScoreCompass` (the 地点推演 hero and the brand's
compass motif). Everything else either maps onto an existing component or is page-specific model
output better rendered as a table.

## Conventions the samples confirm

- Every chart carries a 口径 footnote and, in the 烘焙 sample, an explicit 设计值 / 实测 flag —
  exactly what `ChartFrame`'s `scope` and `grade` encode.
- Brushing, drill-down and tooltips are page behaviours, not chart props; the kit keeps charts
  static and lets the page own interaction.
- Motion: one reveal, `easeCubicOut`, ≤560 ms, honours `prefers-reduced-motion` — matches
  `--dur-reveal` / `--ease-out`.
