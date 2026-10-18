---
name: ts-data-quality
description: Run and document the data-quality checks a Tiansight report needs before any number is used - window consistency, denominators, rate recomputation, small samples, name normalization, duplicate keys, coverage, reconciliation - and produce the 质量异常 slide. Use on every source table, and when a number looks too good.
---

# Data quality · 数据质量检查

Order of work from the reviewed decks: **先修数据，再评结论**. Every table goes through the checks
below; results are written to `manifest.quality` and become the generated 质量异常 slide.

```sh
python3 html-system/dq_checks.py data/items.csv --key 品项名称 --value 总销量 \
    --rate 复购点击率 --num 复购数量 --den 总销售数量 --small 300 --group 门店 \
    --window 累计窗 --months 7 --total 224744 --json
```

## The checks and their thresholds
| Check | Status rule | Action |
|---|---|---|
| 查询窗口已声明 | fail if the window type and length are unknown | declare in `sources[].window`; never mix 月窗 with 累计窗 in one chart |
| 比率分母已声明 | fail if a rate has no numerator / denominator field | write the formula in `metrics` |
| 比率复算 | warn if any row differs from 分子 ÷ 分母 by more than 0.01 | if the deviation is export rounding (≈ 3×10⁻³) record it in `verified`; otherwise re-export |
| 小样本 | warn for rows below `--small` (default 300 份) | mark n on the chart, keep out of rankings |
| 名称归一后重复 | warn when a main name appears as several rows | aggregate by 主品名, recompute rates |
| 促销衍生 SKU | warn for 会员活动 / 半价 suffixes | list separately; an 85% rate from a promo mechanism is not natural repurchase |
| 规格拆分 SKU | warn for 大份 / 小份 / 半例 suffixes | aggregate before ranking |
| 完全重复键 | fail for identical (group, key) rows | sum, recompute rates |
| 必填字段缺失 | warn | empty denominator → null, never zero |
| 分组覆盖不均 | warn when a group has < 50% of the mean rows | closed or newly opened stores stay out of same-period rankings |
| 与系统合计对账 | fail beyond 0.5% | explain the difference before use (月表加总 vs 累计窗 2.05× was such a case) |

Add report-specific classes the way the member deck did: **A 会员归属异常** (渗透率 < 15% 且销量 ≥ 500),
**B 小样本**, **C 促销衍生**, **D 规格拆分**, each with 对象 · 实测表现 · 判断依据 · 处理方式 and the
**CONSEQUENCE 不处理的后果** paragraph (what wrong ranking would be published).

## Windows and comparability
- Same window type and length for anything on one chart. State the difference between windows once (口径 slide) and never again.
- Month series need equal-length points; missing months are shown as gaps, not interpolated.
- Year-on-year avoids holiday shifts (2–7 月对 2–7 月).
- A store that was closed for part of the window is reported but not ranked.

## Reconciliation
Recompute every published rate from its declared fields over the full table; record the maximum
deviation and its cause in `metrics[].verified`. Sum the value column and compare with the system
total; if the export was queried in pieces, prove the pieces add up (they often do not).

Write a reconciliation table before any page is generated: rows, stores, items (by spec and after
merging specs), every published total, and every weighted rate computed as Σ numerator ÷ Σ
denominator (never the mean of row rates). Each line shows source value, computed value,
difference and status. A source rate column that disagrees in even one row is a `fail` with the
rows listed, not "通过". Keep the real figures in the project's private repository: this public
repository carries the method only.

## Auxiliary formula columns
Spreadsheet exports often carry helper columns (price lookups, VLOOKUP / XLOOKUP results, cached
formulas). Judge them separately from the core fields: count `#N/A`, empty caches and other errors
per helper column, and never let them fail or pass the core metric (e.g. repurchase quantity). Keep
the original workbook untouched, a column mapping (source column → field), and an error detail
table (sheet, row, column, value) in the appendix.

## Pre-generation gate
Before generating pages, stop unless all hold:
- every period in the report window has non-empty data (an import that leaves a period view empty
  is a fail, not a zero);
- all tables come from the same import batch, with batch id and import time recorded;
- totals and amounts reconcile across tables (detail sums = summary sums);
- fact tables are never stacked and counted twice (monthly and cumulative exports describe the
  same sales; pick one per metric and say which).

## Output
`manifest.quality[]` entries `{check, result, status, affected, action}`; the builder renders the
质量异常 slide and the gate fails on any `fail` without an `action`. Put anomaly rows in the
appendix with a 处理方式 column so a reader can find them.

## Files
`html-system/dq_checks.py` (library + CLI; `normalize_name()` implements the cleaning log rules) · `reference/catalogue.md` §2.1 (质量异常, 口径陷阱, 看板规范).
