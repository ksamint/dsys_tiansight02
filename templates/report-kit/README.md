# Report kit · 侍天报告幻灯片工具包 (`tsk`)

Builds 1920×1080 report decks in the Claude Slides format (`deck.json` + `slides/<id>.html`) on the
侍天 foundation, checks them in the Slides runtime, and exports a PDF whose table of contents, footer
links, page references and badges jump between pages. The rules it encodes are in
`docs/report-handbook.md`; every page type is shown in `deliverables/report-template/`.

Use it for client reports, supplements and proposal annexes delivered as Slides. For 1280×720
HTML decks and long-scroll web reports use `html-system/` and `skills/ts-html-report` instead.

## Layout

```
tsk/
  core.py        tokens (read from brand/tokens.json), page frame, fit() titles, page order and
                 「→ 第 N 页」 references, shared components, render / write_index / write_viewer
  pages.py       27 page types: A1–A5 structure, B1–B7 argument, C1–C8 data, D1–D4 tables,
                 E1–E2 appendix, F1 team. Capacity limits are in each docstring.
  export.py      build_links() → links.json, outline() bookmarks, verify_pdf()
tools/
  harness.js     shared by the three Node tools: runtime, image routing
  check_deck.py  static brand and renderer rules on any deck (see the table below); exit 1 on any
  lint.js        runtime syntax check (unsupported styles, element limits); exit 1 on errors
  render.js      layout check + screenshots: SHRINK OVERLAP HOVERFLOW TITLE2 ORPHAN LOW OUTX; exit 1 on any
  colour_check.py  朱红 ≤ 5% of each slide, measured on the screenshots
  pdf.js         PDF with the design-system fonts and page-jump links
  pdfmeta.py     links.json; bookmarks, metadata and link verification
  sheet.py       contact sheets of the screenshots
  patch_runtime.py  exposes the four runtime functions the tools call (see Runtime)
  t.html         host page for the runtime
build.sh         generate → lint → render → sheets → PDF, stops at the first failure
example/starter.py   12-page skeleton for a new report
tests/test_kit.py    stdlib tests; run by scripts/check.py
runtime/         the patched Slides runtime (not committed)
```

## Commands

```sh
python3 templates/report-kit/tests/test_kit.py                       # unit + static checks (also in scripts/check.py)
python3 deliverables/report-template/gen/template_deck.py            # regenerate the template deck
bash templates/report-kit/build.sh <deck script.py> <deck dir> [out.pdf]
node templates/report-kit/tools/render.js <deck dir> [id,id]         # re-check a few slides
python3 -m http.server   # at the repo root, then open /deliverables/report-template/ to page through
```

`build.sh` writes scratch output to `<deck dir>/.build/` (ignored by git): screenshots and
`_sheet*.png` contact sheets, `links.json`, `raw.pdf`.

## What is checked automatically

`build.sh` stops at the first failing step, so a deck that builds has passed all of these.

| Rule (handbook / brand QA) | Check | Code |
|---|---|---|
| No text box overlaps another | render.js | OVERLAP |
| No line that is only one or two characters (titles, cards, body) | render.js | ORPHAN |
| Page title on one line | render.js (fit() warns earlier) | TITLE2 |
| Nothing shrunk to fit, nothing wider than its box | render.js | SHRINK, HOVERFLOW |
| Body ends at y = 920; nothing past the side margins | render.js | LOW, OUTX |
| Nothing under 24px | check_deck.py | SIZE |
| Title is a sentence ending in 。 (argument pages) | check_deck.py | TITLE |
| Label title has no 。 and ≤ 16 characters (`label_pages`, or every page with `title_style='label'`) | check_deck.py | LABEL |
| Every page in the expected inventory (`expect()`) is in the deck; counts printed per group | check_deck.py | MISSING |
| No 我们 / 您; no avoided words (赋能 抓手 闭环 …); no emoji | check_deck.py | VOICE, LEXICON, EMOJI |
| One charcoal block per slide at most | check_deck.py | CHAR |
| Two-tone wordmark in every footer | check_deck.py | WORDMARK |
| Renderer subset: no margin / z-index / em / var(), one gap value, padding ≤ 256, no font on table cells, ≤ 200 elements | check_deck.py + lint.js | STYLE GAP PAD CELL ELEMS |
| 「→ 第 N 页」 inside the deck; every PDF link lands on the right page | check_deck.py, pdfmeta.py | REF, unresolved / misdirected |
| 朱红 ≤ 5% of a slide | colour_check.py | SEAL |

Still a human pass (handbook §六): whether a title states the right conclusion, numbers against
the results file, units and windows, 口径 in the notes, design / estimated values labelled, the same
term for the same thing across the deck, and names and titles against `guidelines/company-intro-v3.md`.
Pages that quote the rules themselves (a do / don't page) go in `configure(rule_exempt=[…])`.

## Setup

1. Python 3.10+ with `pillow` and `pypdf` (only `build.sh` needs them; the tests are stdlib).
2. Node 18+ with Playwright and its Chromium (`npm i -g playwright && npx playwright install chromium`,
   the same global install `scripts/snapshot.mjs` uses).
3. **Runtime.** The tools run the real Slides runtime so their verdicts match what the artifact will
   do. Copy `app.js` and `app.css` from the Claude Slides artifact type into `runtime/` and patch:
   ```sh
   python3 templates/report-kit/tools/patch_runtime.py templates/report-kit/runtime/app.js
   ```
   The runtime is minified and its internal names change between releases, so the script finds the
   parse, export, flatten and init functions by signature and fails loudly if one is not found. It is
   idempotent. Without the runtime the Python side (generation, tests, freshness) still works.
4. **Fonts.** `pdf.js` embeds the 127 WOFF2 subsets listed in
   `docs/claude-design-system/tokens.json` from `brand/fonts/`. Override with `TOKENS` and `FONTDIR`.

## Writing a deck

```python
from tsk import *
configure(deckname='[客户] · [报告名]', outdir=OUT, images={'seal': 'assets/logo-seal.png', …})
set_order(order, sections, short)        # page ids, (cn, name, ids) sections, short names
cover(…); toc(); exec_summary(…); kpi_cards(…); table(…); glossary('gloss', …); closing(…)
render(); write_index(title, sections_desc); write_viewer(title)
```

- `images` are repo paths; slides reference them relative to `slides/`, so the viewer, the checks and
  the PDF all use the checked-in files. For a Slides artifact, upload the images, write
  `{"seal": "/_blob/<id>", …}` to a `blobs.json` and regenerate with `TSK_BLOBS=blobs.json`.
- The glossary page id is `gloss` and the table of contents `toc`: the footer links point there
  (`configure(nav=…)` to change). Badges link to `configure(badge_target=…)`, default `gloss`.
- Page references come from `ref()` / `ref_line()`; never type a page number.
- `apply_terms([(id or '*', old, new)])` unifies wording; every rule must hit or the build stops.
- `render()` refuses ids in the order with no page, deletes slide files no longer in the order and
  prints warnings for titles that do not fit on one line and for link targets missing from the order.
- Titles: argument pages take a conclusion ending in 。; list data, comparison and appendix pages in
  `configure(label_pages=[…])` for noun-phrase titles (字段说明 · 门店对比 · 四象限), or set
  `title_style='label'` when the client wants short titles throughout.
- `expect(group, ids)` declares the expected inventory (e.g. every store × chart page, every detail
  list); `check_deck.py` fails on any id missing from the order and prints expected / present counts.
- `quadrant()` numbers items across the four cells (numbers match the detail table), shows the top 5
  per cell (`top=`), and prints 「本象限共 N 项」 when a cell has fewer, 「另 N 项见明细」 when it has
  more (pass the full count as a fifth tuple item).
- `table_pages(id, …, rows, notes, per_page=12)` splits a long table over pages with the header
  repeated and 「（续 k/n）」 in the eyebrow; it returns the page ids for the order.
- `TSK_CHECK=1` makes `render`/`write_index`/`write_viewer` compare instead of write; the template
  deck uses it for its freshness test.

## Publishing to a Slides artifact

Create a Slides artifact, upload the images the deck uses as assets, regenerate into a scratch folder
with `TSK_BLOBS`, then publish `deck.json` as the main file with `slides/*.html` mapped to
`project/slides/*.html` and the design-system tokens file
`"project/ds/tiansight/tokens.json": {"artifact": "https://claude.ai/artifact/3HezHydMsfPFPqnbSbxv7K", "path": "project/tokens.json"}`.

## Known limits

- The runtime patch depends on minified signatures; a new runtime release may need new patterns in
  `patch_runtime.py` (it says which one failed).
- `render.js` uses system CJK fonts for speed; the PDF uses the design-system subsets. Glyph widths
  differ slightly, so keep a margin on tight one-line labels.
- The runtime notes that `Noto Serif SC` has no basic face for PowerPoint export (it falls back to a
  serif). This affects only `.pptx` downloads of the artifact.
