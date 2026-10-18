# 侍天 TIANSIGHT 企业介绍 · v3（47 页）

Content source: `guidelines/company-intro-v3.md` (draft v3, 2026-09-27, confirmed by the owner 2026-10-01).

| File | What it is |
|---|---|
| `index.html` | Browser viewer. Serve the repo root (`python3 -m http.server`) and open `/deliverables/company-intro-v3/`. Arrow keys page; speaker notes show in the bar. |
| `slides/*.html` | One `<section>` per page, 1920×1080, inline styles on the design-system tokens. Images point at `assets/intro/` and `assets/logo-seal.png`. |
| `deck.json` | Page order, sections, fonts. Same shape as a Claude Slides artifact. |
| `company-intro-v3.pdf` | Rendered PDF for sharing with partners (1920×1080 pages). |
| `gen/` | Generator. `cd gen && python3 gen.py` rewrites `../slides/` and `../deck.json` from `vals.json` (content) and `assets.json` (image paths). |

Rules carried by the generator (see README §7 of `docs/claude-design-system/README.md`):

- Cover states the positioning: 「从一道菜，到一家家店的好生意。」 + 「AI + 专家的餐饮经营参谋」 + 「拍板之前，问侍天。」
- No explanatory small print on pages; subtitles, step descriptions, 口径 and sources sit in each page's `<aside>` (speaker notes).
- Two-tone wordmark in every footer; nothing below 24px; titles broken by hand so no line ends with an orphan character.

To rebuild the Claude Slides artifact from this folder, ask Claude to create a Slides artifact from `slides/` + `deck.json` and upload `assets/intro/**` as blobs (`gen/gen.py` accepts a `blobs.json` with the same keys).
