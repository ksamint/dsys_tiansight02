---
name: ts-webapp-interactive
description: Serve a Tiansight HTML report as a web app with data drill-down, tooltips, filters, keyboard navigation and shareable URL state, using html-system/report.js. Use when the deliverable is viewed online rather than printed, or when a demo needs live exploration of the numbers.
---

# Web app interaction

The static deck already is the web app: the same `index.html` opened over http gains drill-down,
tooltips and URL state from `html-system/report.js`. Nothing is fetched; all data is in the page.

## Hooks (set by charts.py and the builder)
| Hook | Effect |
|---|---|
| `.fig[data-src=ID]` + mark `[data-key=K]` | click → appendix section `src-ID` opens, rows whose `key_column` equals K (or whose text contains K) are highlighted, others dimmed; filter bar shows hit count with 清除筛选 |
| `[data-tip="**title**|line|line"]` | hover tooltip, mono, `|` breaks lines, `**` bold |
| `.srcbtn[data-src]` | opens the section unfiltered |
| `[data-go=N]` | jumps to page N (TOC rows, mind-map leaves, evidence map rows) |
| `#pl` `#sv` `#mt` | play, appendix, explanation panel (keys F, O for TOC, M for the panel, Esc) |
| `body.mode-scroll` | scroll layout; the same hooks work per section |

URL state: `#p=7` current page, `#src=stores&q=D 店` an open, filtered appendix. Share a link
to the exact drill-down.

## Designing the drill-down
- The appendix table is the truth; the chart is a view. Every mark that represents rows must
  carry `key` = the value in `sources[].key_column`. For aggregated marks (a month, a price band)
  give the appendix a column with that value so the text match hits.
- Keep tables under ~2,000 rows in the page; above that, ship a summarized table and link the
  full file in `sources[].file`.
- Provide a `filter` bar per section (the builder does) and a 清除筛选 button.

## Live recomputation (only when needed)
For filters that change the numbers (store selector, window slider, pareto cut) use d3 v7 loaded
from a local file, keep the data object `const D = {...}` next to the code as the reference scroll
did, redraw into the same `.fig` with the same role classes, and update the caption's n and
window. Every recomputed number still needs its formula in `metrics`; do not compute anything on
the client that the manifest does not declare.

## Demo checklist
1. Open over http (`python3 -m http.server`), not only file://, to test fonts and sprites.
2. Click every ⊞ button and at least one mark per chart family; confirm hit counts.
3. Toggle the explanation panel (M) and read each slide's FORMULA aloud; it must be complete.
4. Print to PDF: the appendix, panels and workbench must disappear; every slide one page.
5. Share `#src=…&q=…` links in the walkthrough.

## Files
`html-system/report.js` · `html-system/report.css` (`.srcov`, `.tip`, `.filter`) · sample: `html-system/sample/index.html`.
