# Claude Design System — import and keep in sync

This folder is a snapshot of the Claude Design System artifact 「侍天 TIANSIGHT」 (version 13, 2026-10-02): the brand book (`README.md`), `tokens.json`, the component cards (`components/*/README.md`, `preview.html`, `bundle.js`, `bundle.css`, `index.d.ts`), `company-intro-v3.md` and the asset-group READMEs. Fonts (`brand/fonts/`) and libraries are not duplicated here.

## Asset groups → repo paths

| Claude asset group | Repo path |
|---|---|
| Logos | `assets/logo.png`, `assets/logo-seal.png` |
| Icons | `assets/icons.svg` (17 glyphs, split one SVG per glyph on import) |
| Deck | `assets/intro/deck/*.jpg` (33) |
| Partners | `assets/intro/partners/*.png` (8) |
| People | `assets/intro/people/*.png` (4 portraits + WeChat QR) |

`design-system.json` keeps the blob ids of the original account; they do not carry over. A new import re-uploads the files above.

## Set up in another Claude account

In a new Claude conversation (Cowork or claude.ai with the Artifact tool), connect GitHub access to `ksamint/dsys_tiansight01` and say:

> Sync this design system from my GitHub repository https://github.com/ksamint/dsys_tiansight01 — use docs/claude-design-system/ as the brand book and component cards, brand/fonts for fonts, and the asset groups listed in docs/claude-design-system/SYNC.md.

Then, for the two deliverables:

> Create a Slides artifact from deliverables/company-intro-v3 (slides/ + deck.json), uploading assets/intro as images.
> Publish deliverables/lifecycle-map/index.html as an artifact.
> Create a Slides artifact from deliverables/report-template (slides/ + deck.json), uploading the images listed in gen/template_deck.py and regenerating with TSK_BLOBS (see templates/report-kit/README.md).

## Keep GitHub as the source of truth

1. Every change made in Claude ends with an export into these paths and a pull request (branch `claude/<topic>-<date>`).
2. `github.md` records each sync (date, what changed, which artifact versions).
3. Before editing in Claude, sync from the latest `main` so no one edits a stale copy.
