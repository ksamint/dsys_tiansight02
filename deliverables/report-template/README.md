# 侍天 TIANSIGHT 报告模板 · v1（39 页）

The standards and every page type for 1920×1080 report decks, built with `templates/report-kit/`.
Rules in full: `docs/report-handbook.md`.

| File | What it is |
|---|---|
| `index.html` | Browser viewer. Serve the repo root (`python3 -m http.server`) and open `/deliverables/report-template/`. Arrow keys page; speaker notes show in the bar. |
| `slides/*.html` | One `<section>` per page, inline styles on the design-system tokens. Images point at `assets/`. |
| `deck.json` | Page order, sections, fonts, design-system record. Same shape as a Claude Slides artifact. |
| `.tsk.json` | Page order and the pages without a footer, for the render check. |
| `report-template.pdf` | Clickable PDF: table of contents, footer 目录 / 术语, 「→ 第 N 页」 and badges jump between pages (166 links), bookmarks by part. |
| `gen/template_deck.py` | Generator and worked example: one call per page type. |

Pages 3–14 are the standards (principles, workflow, voice, colour, type, layout, charts, evidence
badges, do / don't, pre-publish checklist, renderer constraints, page-type catalogue). Pages 15–39
are samples: the eyebrow names the page type and its function, the speaker notes give use, capacity
and cautions, and the badge 「样张 · 虚构数据」 marks every figure as invented. The team page uses the
seat titles from `guidelines/company-intro-v3.md`.

```sh
python3 deliverables/report-template/gen/template_deck.py                 # regenerate slides, deck.json, viewer
bash templates/report-kit/build.sh deliverables/report-template/gen/template_deck.py \
     deliverables/report-template deliverables/report-template/report-template.pdf   # checks + PDF
```

`scripts/check.py` fails when the committed slides differ from the generator's output.

The published Slides artifact 「侍天 TIANSIGHT 报告模板」 is https://claude.ai/artifact/3diuZp85itTBg8knhmuG5P
(private to its owner until shared). To rebuild it in another account, create a Slides artifact,
upload the eight images listed in `configure(images=…)` and regenerate with `TSK_BLOBS=blobs.json`.
