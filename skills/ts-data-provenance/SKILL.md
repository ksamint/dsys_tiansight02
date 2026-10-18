---
name: ts-data-provenance
description: Declare and grade every data source, write 口径 and formulas, and generate the explanation panel and data appendix for a Tiansight report. Use before any number is placed on a slide, and when auditing an existing deck for provenance gaps.
---

# Data provenance · 数据出处、口径、公式

The rule from the reviewed decks, kept verbatim: **任何一个数字，都要能同时说出它的查询区间、门店范围和分母。三者缺一，这个数字就不能进决策会。**

## What to declare (manifest keys)

**sources[]** one per file or derived table: `id` (used by `data-src`), `group` (appendix heading, by
file type), `name`, `file` + `sheet`, `grade`, `rows`, `window {from, to, type, months}`,
`caliber` (what one row is, denominators, exclusions), `cleaning[]` (the cleaning log lines),
`table` (CSV under `data/` rendered into the appendix), `key_column` (drill-down key).
Derived tables are sources too: name the parent in `file` ("由 items 按门店聚合").

**fields[]** the unified field dictionary: name, type, source, 口径 in one sentence.

**metrics[]** every rate or amount that appears on a slide: `id`, `name`, `formula` written as
分子 ÷ 分母 (or Σ, ×, =), `numerator`, `denominator`, `unit`, `grade`, `sources`, `window_rule`
(which windows may be compared), `threshold` (what counts as an anomaly), `verified` (how you
recomputed it against the system export, with the max deviation).

**glossary[]** terms that carry a 口径: 查询窗口, 门店范围, 主品名, 实收口径 …

## Evidence grades · EGA (unified; the two reference decks disagreed)
| Grade | Definition | Colour |
|---|---|---|
| E1 直接计量 | 系统实测或全量交易数据直接计算，可复算 | charcoal |
| E2 抽样推算 | 在实测值上做抽样或代数分解；方式影响数值，不影响方向 | muted |
| E3 外部参照 / 设计值 | 公开外部数据、商圈采集，或含目标假设的设计值 | earth gold |
| E4 未验证推断 | 未经数据验证的推断，须经试点验证 | vermillion |

One grade per source and per metric; a slide's `ega` is the weakest grade among what it uses (the
gate enforces this). Aggregating E1 rows stays E1; decomposing or projecting makes E2; targets
are E3; a design value drawn in a chart is hatched, never solid.

## Where provenance appears
1. **Top strip** of every content slide: EGA badge + ⊞ 数据出处 button → appendix section `src-<id>`.
2. **Footer** of every content slide: `口径：<caliber>` one line (window · scope · denominator).
3. **Explanation panel** (`meta`, screen only, toggled with M): SOURCE · FORMULA 公式与出处 ·
   DERIVATION 推导逻辑 · GLOSSARY · CONCLUSION · CONFIDENCE (高 / 中 / 低 with the reason).
4. **Chart caption**: the encoding rule and the exclusions.
5. **Generated slides**: 证据底盘 (sources as KPI tiles, 口径 panels, EGA legend and page counts),
   结论索引, 附录 SOURCE LOG (files, rows, windows, cleaning, reproducibility line), 附录 GLOSSARY
   (metrics with formulas and thresholds).
6. **Appendix overlay**: every source table in full, caption `E? · 来源 · 窗口 · 共 N 行 ｜ 口径`,
   rows keyed for drill-down.

## Writing 口径
- Window first: 月窗 / 累计窗 and its length; state that different windows are not comparable and by how much they differ if known (月窗 7.59% vs 累计窗 15.58%).
- Scope second: stores included and excluded, with the reason (停业、新开).
- Denominator third: exactly which count, with exclusions (剔除 101 行 Excel 合计行).
- Known bias last: 平台端让利不进 POS 优惠字段，故 POS 端优惠率系统性低估.
- For a derived value: the derivation in one line and whether the method changes the direction.

## Auditing an existing deck
Run `python3 scripts/inventory_reference.py --print` on a copy under `reference/source/`; every
slide with an EGA but no `src`, or with numbers but no `meta`, is a gap. Rebuild it through the
manifest rather than patching.

## Files
`html-system/manifest.schema.json` · `html-system/build_deck.py` (`evidence_base`, `source_log`, `glossary`, `appendix`) · `reference/catalogue.md` §1, §3.2, §4.
