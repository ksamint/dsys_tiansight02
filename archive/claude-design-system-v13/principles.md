# Principles

The rules behind every token, component and page in this repository. When a decision is not covered by `brand/guide.md`, decide by these, in order.

## 1. Evidence before ornament

Every number carries its source, its 口径 (definition) and its evidence grade (E1 直接计量, E2 抽样推算, E3 外部参照/设计值, E4 未验证). A page may hide that provenance behind a tooltip or an appendix, but never omit it. A chart that cannot name its data source is not published.

## 2. Ink is the paper, charcoal is the voice, gold is the structure

- Pale manuscript (`--surface`) and paper (`--paper`) are the ground. Ink (`--ink-primary`) is a field, never a text colour.
- Charcoal (`--charcoal`) speaks: titles, body, primary data series.
- Gold (`--gold`, `--gold-hi`) is skeleton and emphasis: rules, captions, the single highlighted series, the active state.
- Vermillion (`--seal`) is reserved for warnings, losses and the seal. It never marks a positive value.

Charcoal grounds (`.ts-ground-charcoal`) exist for an opener, a closer, or one card per page. Not for a whole surface.

## 3. Serif everywhere, mono for data

Noto Serif SC and Noto Serif carry all prose and headings. IBM Plex Mono carries numbers, codes, dates and file names, so that a reader can find the data at a glance. No sans-serif reaches the reader, even as a fallback.

## 4. One radius, one hairline, no gradients

Corners are 2px. Only status badges are pills and only step rings are circles. Borders are one hairline of `--line`; emphasis comes from a gold hairline or a charcoal field, not from shadows or gradients. The hatch pattern for design values is the one permitted texture.

## 5. Composed motion

Three durations (`--dur-fast` 120ms, `--dur-base` 220ms, `--dur-reveal` 700ms) and two curves. Elements move at most 12px, never scale or bounce. A reveal happens once. `prefers-reduced-motion` zeroes everything.

## 6. Reachable by everyone

Every page has a `lang`, one `h1`, a `<main>`, a skip link where there is a header, heading levels that never skip, labels on every control, names on every button and link, and a visible focus ring of 2px gold. Body text holds 4.5:1 against its ground; large gold display text is used only where it clears 3:1. `scripts/lint_html.py` enforces the structural part; the specimen shows the rest.

## 7. Offline and reproducible

No CDN, no webfont service, no analytics. Pages open from disk. Every generated file has a builder and the gate fails when the output is stale. Snapshots record the rendered layout so a change in one stylesheet cannot silently shift a page.

## 8. Say less, mean it

Composed, forthright, evidence-based. The guide's avoided lexicon (赋能, 抓手, 闭环, 包治百病, 颠覆, 爆款, 裂变, 解决方案, 打法) stays out of every surface. Prefer 增利 to 增长 except in the promise line. Numbers appear with units and windows, or not at all.
