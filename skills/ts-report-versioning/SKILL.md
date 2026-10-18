---
name: ts-report-versioning
description: Manage report versions and the mapping from source files to fields, metrics and slides for Tiansight reports - numbering, change log slide, caliber-fix log, data refreshes, diffs between manifests. Use when a report is revised, data is re-exported, or a 口径 is corrected.
---

# Report versioning and data mapping

A report is identified by `report.id` and `report.version` in every footer and in the file name
(`<id>-<version>.html` when exported). The manifest is the version record; `versions[]` is the
change log; the builder renders the 卷首 · Vn → Vn+1 变更 slide from the last entry.

## Numbering
- `V1, V2 …` for deliveries; `V2.1` for corrections that change no conclusion.
- Bump when any of these change: a source (re-export, new window), a metric formula or threshold
  (口径), a conclusion headline, a slide added or removed, a quality status.
- Never overwrite a delivered version's directory; copy it, bump, rebuild.

## The change log entry
```json
{"version": "V2", "date": "2026-09-06", "author": "侍天 TIANSIGHT", "changes": [
  {"kind": "口径", "what": "门店排名改为 9 店口径，剔除停业期门店", "why": "E 店 7 个月窗口内仅 3.3 个月在营", "affects": ["store-ranking", "gap"]}]}
```
Kinds: 新增 · 修正 · 口径 · 数据 · 删除 · 重排. A 口径 change must name the affected slides and is
highlighted on the change slide, because it makes numbers "凭空变好".

Generate the draft with `python3 html-system/version_diff.py old/manifest.json new/manifest.json --json`
and then add the `why`.

## Data mapping (source → field → metric → slide)
The manifest carries the whole chain: `sources[].id` → `fields[].source` → `metrics[].sources`
→ `slides[].src` / `slides[].metrics` → `conclusion.metric`. The gate refuses dangling references.
To answer "which pages change if this export changes", grep the id: every slide listing it in
`src` and every metric listing it in `sources`.

Keep the field dictionary (`fields[]`) as the single naming authority; the member deck's SCHEMA
slides showed why: 统一字段名 · 类型 · 来源 · 计算口径. Name normalisation rules live in
`dq_checks.normalize_name`.

## Freezing a 口径 in the customer's system (看板规范 pattern)
When a report finds a 口径 trap, emit the ten-line dashboard spec as a slide: 查询区间 必填,
门店口径 必填, each rate with its formula, 主品名 rule, 样本量 n mark, 考核清单版本号, 口径修复日志,
促销标记. These become metrics `threshold` / `window_rule` values in the next manifest.

## Refresh procedure
1. Copy the report directory; replace `data/*.csv`; update `sources[].rows/window` and record the
   import batch id and time.
2. Run `ts-data-quality`, including its pre-generation gate: after a monthly import, a period view
   that comes back empty or a batch mismatch stops the refresh; update `quality`.
3. Rebuild; compare headlines; update `conclusion.value` where numbers moved.
4. `version_diff` old vs new → `versions[]` entry with reasons; bump `report.version`.
5. Gate, deliver, keep both directories.

## Files
`html-system/version_diff.py` · `html-system/build_deck.py` (`changes`) · `html-system/manifest.schema.json` (`versions`).
