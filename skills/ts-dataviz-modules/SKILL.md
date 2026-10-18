---
name: ts-dataviz-modules
description: Choose and draw charts, tables, KPI tiles and ledgers for Tiansight reports with html-system/charts.py, using the brand's data roles and the drill-down hooks. Use whenever a slide or web page needs a figure.
---

# Data visualization modules

Every figure is an inline SVG from `html-system/charts.py` (stdlib, offline, no d3 needed for the
static build). Marks carry `data-key` for drill-down and `data-tip` for tooltips; the slide's
first source id becomes `data-src` on the figure.

## Choose the family (mirrors the 94 charts in the reviewed decks)

| Question the slide answers | Family | Notes |
|---|---|---|
| Who ranks where | `bars_h` | sorted as given; `n_small` flags samples below threshold; `note` for 停业期 |
| How two or three series compare across groups | `bars_v` | `series` with roles; deltas=True for a step ladder (`stairs`) |
| How it moved over time | `line` | `threshold` draws the alert line; `dashed` + role reference for peers |
| Where items sit on two measures | `scatter` | `r` for bubble (area ∝ √n, say so in the caption), `log_x` for skewed counts (label the scale, ticks in real values; quadrant splits and medians computed on the raw data), `quadrants` for the four labels, `medians` for the dashed split; for a quadrant deliverable number the Top 5 per quadrant and list them in a detail table |
| Row × column intensity or a slot grid | `matrix` kind heat / dot | diverging=True colours + accent, − warn; None renders — |
| How a total decomposes | `waterfall` | losses warn, gains accent, ends measured |
| When things happen | `timeline` | spans with roles; design values hatched |
| What the deck contains | `mindmap`, `evidence_map` | built by the deck builder, `data-go` jumps |
| Attainment or availability against a target | `bullet` | threshold tick; below 50% turns warn |
| Share of a whole | avoid donuts; use `bars_h` with a 合计 row | the brand draws no pies |

## Data roles (the only colours)
`measured` charcoal · `accent` bright gold (the item being argued) · `structure` earth gold ·
`sampled` muted · `reference` faint (peers, benchmarks, dashed) · `warn` vermillion (negative,
threshold breach, only) · `design` hatched gold (targets, E3/E4 values never solid).
Rules: one accent per chart; warn never for positive data; a design value is hatched or outlined;
peers are dashed; ticks in mono muted; label the axes with the unit; put the rule of the encoding
under the chart (e.g. 气泡面积 ∝ √销量).

## Tables, KPIs, ledgers
- `kpis` block: label · value (mono) · one-line 口径; tone `a` for the positive anchor, `b` for the negative.
- `table.t` with `c` (compact) / `d` (dense); cell classes `n` (number, right) `m` (centre) `k` (key); row classes `hi`, `warn`, `sum`; `<i>` negative, `<u>` positive, `<b>` key.
- 一本账 ledger: 指标 · 当前 · 目标 · 差距 with the gap coloured by direction.
- Four-element action table: 动作 · 责任人 · 期限 (mono D+n) · 验收指标 · 利润影响.

## Calling
```python
{"type": "chart", "family": "bars_h",
 "pos": [[{"label": "A 店", "value": 20.71, "role": "accent", "key": "A 店", "tip": "**A 店**|复购 20.71%"}]],
 "args": {"unit": "%", "vmax": 25, "title": "复购点击率 · 累计窗"},
 "caption": "来源见 ⊞ 数据出处；停业店不进排名"}
```
`pos` are positional arguments, `args` keyword arguments of the family; `key` must equal a value
in the source's `key_column` so the click filters the appendix. Compose (bars + line) by placing two
figures in a `g2` body rather than drawing a combined chart.

## Interactive web build
The same SVG works in the web app: `report.js` binds `data-key` → appendix filter and `data-tip` →
tooltip. Only when a page needs recomputation on the client (filters, pareto sliders, daily series
with thousands of bars) use d3 v7 loaded locally, keep the data in a `const D = {...}` object as the
reference scroll did, and keep the roles and chrome classes identical.

## Files
`html-system/charts.py` · `html-system/report.css` (`.fig` chrome) · `reference/catalogue.md` §2.2 · `brand/guide.md` §5.
