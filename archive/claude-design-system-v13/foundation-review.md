# Foundation review · 基础层评审

Per-token register of the export-vs-published conflict, with the ruling of 2026-09-07: **the published guide (v0.6) wins every conflict**; layers the guide leaves open keep the export's proposal and are marked PROPOSED until the brand directory publishes them.

Sources: `brand/guide.md` v0.6, `brand/source.json` (snapshot 5c7c158), `TIANSIGHT 侍天 Design System/tokens/*.css`.

## Verdict

The export and the published guide differ on more than values. `#EFE6D2` is the **primary brand color** in the guide (fields, key actions, ≈7% of a view) and the **whole page ground** in the export. That one role decision drives every other color relation in the export, so it is ruled first and everything else follows.

`brand/` already implements the ruling. This document records why, row by row, so the decisions are auditable when the guide moves.

## Register

| Token | Export | Published | Ruling | Note |
|---|---|---|---|---|
| page ground | `#EFE6D2` parchment-200 | `#F4F0E7` 淡墨纸 | published | Using the primary color as the ground leaves fields and actions nowhere to sit |
| role of `#EFE6D2` | page ground (~78%) | primary field (≈7%) | published | The one decision that must come first |
| body text | `#4A4136` ink-700 (titles `#241F19`) | `#17130D` 玄墨 | published | `#17130D` did not exist in the export |
| secondary text | `#8B8072` | `#706758` | published | Export value is ~3.3:1 on the canvas; published is ~4.7:1 |
| accent | `#76551F` | `#76551F` | agree | Export's bronze 100–700 scale offered as PROPOSED gold ramp |
| highlight | absent (nearest: caution `#B98B2A`) | `#D4A862` 明金 | published + constraint | ~2.1:1 on canvas: 28px+, strokes and active states only |
| seal | absent | `#8C3228` 朱红 | published | ≤5%, never a field, never a positive datum |
| wordmark gold | `#A8842F` / `#C0A052`, two-tone TIAN**SIGHT** | no such rule | retired | Not in the guide; mark is the published asset |
| chart palette | 4 semantic hues (growth/loss/caution/datum) | by series count: gold-hi → charcoal → seal | published | Cost: 增长 and 关注 share 明金; separate by label. Warm semantic set offered as PROPOSED |
| hairline | `rgba(118,85,31,.16)` gold-toned | `rgba(23,19,13,.18)` ink-toned; card border `rgba(118,85,31,.34)` | published | Dividers ink, card edges gold |
| paper | `#FFFDF8` | `#FFFDF8` | agree | |
| body font | Noto Sans SC | Noto Serif SC, no sans fallback | published | Largest change; re-check every button/input line-height |
| Latin font | Spectral (+italic) | Noto Serif, caps `.3–.34em` | published | One family fewer |
| body size | 16 / 1.62 | 18 / 1.7 | published | 18px is the floor for a CJK serif |
| heading weight | 500 (no 600 token) | 600 / 400 / 300 | published | |
| caption tracking | `.18em` 12px sans | `.34em` 13px serif deep gold | published | The most visible tell between the two systems |
| type scale | 1.25 ratio, 11→88px, 14 steps | display 84–96 · h1 56 · h2 40 · h3 28 | both | Published values on the export's ladder; 11–16px UI steps PROPOSED |
| mono usage | every numeral | hex, tokens, data, prices only | published | |
| radius | 4px default | 2px, never round | published | |
| container | 1200px | 1280px | published | |
| gutter | 24px | 48px / 24px @640 | published | Export lacked a mobile breakpoint |
| section rhythm | 96 / 56 | 96 / 64 | agree | |
| shadow | 4-step warm-ink | none defined | export only (PROPOSED) | Guide is silent |
| motion | 220ms base, 700ms reveal, reduced-motion | none defined | export only (PROPOSED) | Guide is silent |
| mark | circular brush seal 侍天, 240×240, `#5B4A3F` | compass ring + 侍 / vermillion 朱印; asset `brand/logo.png` 601×640 | published | Different marks, not a value difference; official asset only |

## Beyond the foundation

Recorded, not resolved here: two product narratives (经营五问 · 三层+X vs 海图/罗盘/航线/校正 · L1–L5), two price ladders (export unpriced; guide's four tiers), and the fact that `scripts/check.py` originally never compared the export to the guide.

## Answers to README open questions, from the ruling

- **Q4 mark** — published asset; compass drawn only as watermark. Agrees with `brand/`.
- **Q5 semantic chart colors** — no, until published. Three-series rule; 增长/关注 separated by label. A warm semantic set (`--growth #4E6B3F`, `--caution #B98B2A`, `--datum #6E6355`) is the submission if the report needs it.
- **Q7 first consumer** — website.
- **Q9 offer** — guide's four tiers.
- **Q11 charcoal deck grounds** — under "published wins", the guide allows `--surface` + `--paper` only. Both resolutions are rendered side by side in `Q11 Deck Grounds.dc.html`: **A** keeps the charcoal opener/closer and needs a §7 amendment (charcoal permitted for deck cover and close only, ≤ 2 slides, mark on an `--ink-primary` tile, plus a `check.py` assertion); **B** returns slides 01/13 to `--surface` with the compass watermark, drops `.mark-tile` except inside `.ts-card-charcoal`, and refreshes `snapshots/layout.json`. Recommendation: B, so deck, website and report share one ground rule. **Ruled 2026-09-08: B.** Commit-ready changes in `repo-patch/Q11-B-deck-pale-grounds.md`.

## Slogan set

Primary: 拍板之前，问侍天. Supporting lines per register — 领航: 侍天领航，老板掌舵 · 看清海图，方可拍板 · 决策在你，航图在侍天; 证据: 算清之前，不谈策略 · 结论有据，不靠猜 · 每一判断，皆可证伪; 复利: 单店跑通，体系连锁 · 一店之验，百店之法.

## Still open

Q6 font hosting and Q8 verification of prices, quotes and partner names.

## Ruling 2026-09-09 · mark lockup

The mark already reads 侍天; the CN name is never set beside it. Header lockup = mark + Latin caption "Tiansight"; footers = mark + "Tiansight". Applied across tiansight-ds; for the repo: website/index.html, website/team.html, brand/index.html, report/index.html, deck/index.html footers, guide §6.

## Rulings 2026-09-08

Q1 **1a** ink field + gold hairline kept · Q2 **2b** tagline in deep gold at every size, bright gold reserved for 28px+ and charcoal · Q3 **3a** `--gold-deep` kept at the same hex · Q10 **10a** 增长 verbatim in the promise · Q11 **B** pale grounds · Proposed layers p1–p6 all published (p6 limited to one card). Renders: `Remaining Rulings.dc.html`; commit-ready changes: `repo-patch/rulings-2026-09-08.md`.
