# Reference review · 已有 HTML 报告资产盘点

Three delivered client assets, catalogued by `scripts/inventory_reference.py` into
`reference/inventory.json` and anonymised for this public repository (client names, headlines and
findings removed; the originals are kept outside the repository, see `reference/source/README.md`). This document is the human
reading of that inventory: what the assets are made of, which parts are worth standardizing,
and where they disagree with each other or with the published brand guide.

| File | Deliverable | System | Size | Slides / sections | Charts | Tables | Appendix |
|---|---|---|---|---|---|---|---|
| `asset-a-strategy-deck.html` | 客户 A · 品类战略提案 V6 | slide deck 1280×720 | 1.5 MB | 109 slides in 8 卷 + 附录 | 66 SVG | 101 | 27 sections |
| `asset-b-member-repurchase-deck.html` | 客户 B · 会员菜品复购数据分析 V1 | slide deck 1280×720 | 386 KB | 57 slides | 13 SVG | 59 | 21 sections |
| `asset-c-operating-model-scroll.html` | 客户 A 门店 · 经营模式长卷 v1.0 | long scroll, d3 v7 bundled | 420 KB | 11 sections | 15 d3 charts | 2 | none |

## 1. Two systems

**Slide-deck system** (two files, identical CSS and JS, 15 KB + 6 KB). Static HTML, zero dependencies,
charts as inline SVG generated offline. Everything below is worth keeping and is what
`html-system/` re-implements on the brand tokens.

- `#wb` workbench bar: 全屏播放 · 数据附录 · 显示解释面板 · keyboard hints. `#stage > #deck > .row > section.slide (+ aside.meta)`; JS scales the 1280 px deck to the window.
- Slide anatomy: `.s-top` (`.chip` section id, `.ega` evidence grade, `.srcbtn` ⊞ 数据出处, `.s-tag`) → `.s-title` (the conclusion with its number; `<em>` key number, `<b>`/`<s>` negative) → `.s-body` (`g2 g3 g4 sp sp2 rows` layouts, `hstack vstack grow`) → `.s-foot` (report id · page). Fixed heights (74 / 498 / 26 px) so print never overflows.
- Atoms: `.lead .txt .note .q`, `.panel` (+ `tw vw gw pl` tints, `.hd` mono heading), `.kpi` (`.l .v .d`, `.a` positive, `.b` negative), `table.t` (+ `c d` densities, `n m s k` cell roles, `tr.hi warn sum`), `ul.ls`, `ol.ns`, `.legend`, `.badge b-hi/md/lo`, `.chip`, `.ega e1–e4`.
- Provenance: per-slide `aside.meta` with keys SOURCE · FORMULA 公式与出处 · DERIVATION 推导逻辑 · GLOSSARY · CONCLUSION · CONFIDENCE (hidden by default, never printed); `#srcov` overlay with `#srcnav` grouped by source file (xlsx / csv) and `#srcbody section#src-<key>` each with `h3`, `.cap` (来源 · summary · 共 N 行) and the full table; `.srcbtn[data-src]` jumps to the section.
- Navigation: `[data-go]` jumps from TOC rows and mind-map nodes; keys ← → F O Esc; print `@page 1280px 720px`.
- Fitting: `deOrphan()` shrinks a heading until its last line holds more than one character; per-slide `layout-fix-NN` classes record post-audit height overrides.

**Scroll system** (one file). d3 v7 bundled (280 KB), receipt / 长卷 metaphor: `.tape` column with torn edges, `.receipt-head`, `.ledger` (dotted leader rows), `.stat-grid` (+ `.alert`), `.eyebrow .no`, `.chart` + `.legend`, `#tip` tooltip, `.reveal` on scroll. Charts are drawn from an inline `const D = {...}` data object, so the numbers are already machine-readable, and every mark has a hover tooltip. Worth keeping: the data object, the ledger, the stat grid, tooltips. Not kept: the sans body face and the second palette.

## 2. Module catalogue (all of it)

### 2.1 Page-level modules
| Module | Where | Notes |
|---|---|---|
| Cover | deck | client · title · version · date; gold bar |
| 目录 CONTENTS | deck | `.toc-row` with page numbers, clickable |
| 导览 MIND MAP | strategy | five main lines → leaves with page jumps (SVG, `data-node`) |
| 证据底盘 EVIDENCE BASE | strategy | four KPI tiles per source (rows, window, known bias) + 口径 panels + EGA legend + page counts per grade |
| 执行摘要 ONE PAGE | strategy | one-slide summary |
| 结论索引 EVIDENCE MAP | strategy | 14 conclusions × metric × value × grade × page (SVG table, clickable) |
| 卷首 · V5 → V6 的九处变更 | strategy | version change log slide |
| 口径 CALIBRATION | member | source files × window type × store count; three hard constraints; what the report does about them |
| 质量异常 DATA QUALITY | member | anomaly classes A–D with thresholds, handling, consequence of not handling |
| 清洗结论 · 字段字典 SCHEMA · 名称归一 · 门店口径 · 口径陷阱 | member | data preparation chapter, five slides |
| 看板规范 DASHBOARD SPEC | member | ten field rules to freeze the caliber in the system; one-line rule |
| 分析局限 LIMITATIONS | member | three limitations with effect on conclusions and what to fix |
| 附录 A GLOSSARY · B STORE DETAIL · C SOURCE LOG | member | glossary; per-store detail; source files with cleaning log and reproducibility statement |
| 数据附录 overlay | both decks | full tables behind every ⊞ button |
| Divider | deck | chapter number + title + rule |
| 数据缺口 · 字段支撑边界 | scroll | field availability vs what each analysis needs (bullet bars) |

### 2.2 Chart families (94 SVGs classified; counts strategy / member / scroll)
| Family | Count | Typical use in the assets | Standard module in `charts.py` |
|---|---|---|---|
| Horizontal bars, ranked | 32 / 7 / 2 | 高频招牌菜, 提及率, 门店排行, 渠道占比, 处置动作支数 | `bars_h` (roles, n-small flag, notes) |
| Vertical bars, grouped or stacked, with line | 9 / 0 / 3 | 促销覆盖率 × 评分, 月销量 × 折让率, SKU vs 营收占比 by 价格带 | `bars_v` (+ `line` overlay by composing) |
| Step ladder (levels with deltas) | 1 / 0 / 0 | 人均价格阶梯，逐级标注差值 | `stairs` |
| Line with points, multi-series | 2 / 2 / 2 | 月窗趋势 6 点, 评论提及率 4 期, 三指数 | `line` (threshold, dashed reference) |
| Scatter | 7 / 0 / 0 | 单量同比 × 桌均, 提及率 × 分差, 溢价 × 评分 | `scatter` |
| Bubble (area ∝ √n) | 4 / 1 / 1 | 赛道供给 × 评分, 销量 × 复购率 with median lines, 菜单工程 log-log | `scatter` with `r`, `medians`, `log_x` |
| Quadrant | 2 / 0 / 0 | 点单率 × 单桌消费; 溢价 × 团购 | `scatter` with `quadrants` |
| Matrix / heat table | 8 / 1 / 0 | 相关矩阵, 四季 × 四语言 slot grid, 供应日历, 价格带 × 复购 | `matrix` kind heat |
| Dot matrix (n=94) | 0 / 1 / 0 | 门店 × 品项 dispersion | `matrix` kind dot |
| Timeline / gantt | 3 / 0 / 0 | 换季运营日历, 四批动作时间关系, 水域接入阶段 | `timeline` |
| Mind map / navigation | 1 / 0 / 0 | 导览 | `mindmap` |
| Evidence map table | 1 / 0 / 0 | 结论索引 | `evidence_map` |
| Bullet / availability | 0 / 1 / 1 | 字段可用率 vs need, 月表加总 vs 累计窗 | `bullet` |
| Waterfall | 0 / 0 / 0 | not in these assets; present in `report/` | `waterfall` |
| Pareto / cumulative area, stacked area (channels by month), daily bars + 7-day mean, hour-of-day double peak, price-band histogram | 0 / 0 / 5 | scroll only, d3 | compose `bars_v` + `line`; interactive versions belong to the web app |

Encoding conventions observed and kept: numbers in mono, tick labels muted, one highlight colour for the point being argued, warning colour only for the negative or threshold-breaching item, bubble area ∝ √count with the rule written under the chart, medians as dashed lines, "n" flag on small samples, source line under every chart.

### 2.3 Data and text modules
KPI tile (`.kpi` with label · value · one-line 口径), 一本账 ledger (指标 · 当前 · 目标 · 差距), ranked ledger table with `hi / warn / sum` rows, conclusion block with four elements (证据 · 利润影响 · 执行动作 · 验收指标), 四要素 table for actions (动作 · 责任人 · 期限 · 验收 · 利润影响), ✓/✗ lists, numbered findings (26 条核心发现 in two slides), "reading note" panel, one-line rule callout, 三条硬约束 / 三件要补的事 triads, source caption `来源：… 共 N 行`.

## 3. What to standardize (decisions carried into `html-system/`)
1. One manifest per report (`manifest.schema.json`): sources, fields, metrics with formulas, slides with their sources and meta, quality results, versions. The builder derives the cover, TOC, evidence base, evidence map, change log, quality, limitations, source log, glossary and the appendix overlay from it, so none of these can drift from the body.
2. One EGA legend. The two decks define the levels differently (strategy: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断; member: E1 系统实测 · E2 推算值 · E3 设计值 · E4 未验证, and mis-tags several E2/E3 badges with the `e1` class). The unified definition is in the provenance skill: E1 直接计量（系统实测，可复算） · E2 抽样或推算（在实测上做分解或抽样） · E3 外部参照或设计值（公开数据、目标值） · E4 未验证推断.
3. Brand tokens instead of the two ad hoc palettes (teal / gold / slate / vermillion on `#F8F4E9`; gold / vermillion / sage / slate on `#F7F2E4`) and serif instead of the scroll's sans body. Data roles are named (measured · accent · structure · sampled · reference · warn · design) and mapped once in `report.css`; the legacy hues can be re-mapped there without touching a chart.
4. Charts carry `data-src` and `data-key`, so clicking a bar opens the appendix filtered to the rows behind it; the data appendix becomes the drill-down surface of the web app instead of a read-only attachment.
5. Fixed slide heights stay; the post-audit `layout-fix-NN` overrides are replaced by an overflow check in `check_report.py` that fails the build instead of patching the CSS.
6. The scroll mode keeps the ledger, stat grid and tooltips, but reads the same manifest and uses the same static charts; d3 is optional and only for the interactive web build.

## 4. Gaps found in the assets
- No machine-readable data: numbers live in SVG text and table cells; only the scroll file has a data object. Reproducibility claims (a cleaned table of stated rows × fields) cannot be checked from the deliverable.
- Source appendix tables are complete but not linked from chart elements, only from the slide-level button.
- 口径 lines are inconsistent in placement: sometimes a panel, sometimes the footer, sometimes only in the hidden meta panel. The system puts a one-line 口径 in every content slide's footer and the full text in the meta panel.
- Version identity appears only in the file name and the cover; the footer carries the report title but not the version. The system stamps `report.id · version` in every footer.
- Evidence grade is per slide; two decks mix grades on one slide with combined labels (E1＋E2). The manifest allows one grade per slide and one per metric; mixed slides take the weaker grade.
- Fonts: the decks fall back to Georgia and the scroll to PingFang; neither loads a font file. The system loads `brand/fonts.css`.
