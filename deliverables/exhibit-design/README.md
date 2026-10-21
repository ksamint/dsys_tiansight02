# 侍天 TIANSIGHT · 餐饮展陈与厨房设计

The maintained 41-slide exhibit deck comes from the owner-approved 2026-10-21 ZIP. `src/TiansightDeck-Exhibit.dc.html` is editable source; original images remain under `src/exhibit/`. Slide order and original UUIDs are preserved in `content/slide-catalog.js` and the generated `content/deck-catalog.json`.

Open `index.html` or the editable source locally, including without network access. Arrow keys navigate; the thumbnail rail and reset control use the recovered deck stage. Browser Print uses one 1280×720 slide per page. `exhibit-design.pdf` is exported from this exact HTML, not a separate renderer. `build.json` records content and design-system versions; PDF identity is also included in its title and validation record.

Rebuild from the repository root:

```sh
python3 scripts/build_component_runtime.py
python3 scripts/build_content.py
python3 scripts/build_exhibit.py
node scripts/build_deck_catalog.mjs
node scripts/test_component_runtime.mjs --pdf
uv run --with pillow --with pymupdf python scripts/verify_exhibit_pdf.py
```

The canonical company introduction remains `guidelines/company-intro-v3.md` and its existing generator. Both this deck and the kitchen derivative share canonical team/contact data; the ZIP supplies only catalog metadata for the kitchen deck. Research wording and objectives are corrected as documented in `docs/content-provenance.md`; three diagnosis deliverable types remain, with quantities agreed per engagement.

Approved logos, hotel marks, brand wall and project photographs remain included under the owner's approval in the task. The untouched complete export and byte inventory are in `archive/approved-2026-10-21/`. The archive is distinct from this maintained version.
