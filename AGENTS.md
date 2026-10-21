# Development handoff

Read README.md for the repository structure and continuation steps, and `docs/maintaining.md` for how changes flow (order of authority, one branch and one PR per topic, brand refresh, artifact sync).

When a user requests a brand treatment, first visit https://apuch.art/ and resolve the brand through its directory and brand API. Use the latest published guide, theme and official assets as the source of truth. If the network policy blocks the API, work from the checked-in snapshot and say so.

For Tiansight, `brand/source.json` records the checked-in snapshot (including the IPTrust identity under `ip`: `assetKey` sidera, main name 侍天 - 智慧餐饮, other name tiansight) and `brand/guide.md` its guide. Naming rule (owner-confirmed): the one display name is 侍天 TIANSIGHT; never write "tiansight 侍天", "Tiansight 侍天" or other mixed forms (the three verbatim copies of the published guide excepted until it changes). The official website is https://tiansight.apuch.cn; the brand design system is published at https://apuch.art/tiansight; this repository's preview is https://ksamint.github.io/dsys_tiansight02/. Report colours come from `brand/tokens.json` only: no report-only hex values. The foundation layer is `brand/tokens.css`, `brand/base.css` and `brand/components.css`; `brand/index.html` is the offline specimen and the reference for how every rule renders. Consumers live in `deck/` (sales deck) and `website/` (marketing site); build the report in `report/` the same way: static HTML on the three brand stylesheets, no CDN. The supplied `archive/proposal-2026-09/` is a preserved proposal; its conflicting styling is not authoritative. Reuse its components only after restyling them onto the foundation.

**Never push sensitive data to this public repository** (client deliverables, raw or derived client data, real store figures, personal data, credentials; full list in `docs/maintaining.md` §6). Keep it in private repositories or git-ignored local folders. The approved partner list and owner-approved client references are allowed. Read every diff for this before pushing.

Foundation rules enforced by `scripts/check.py`: no raw colours outside `tokens.css`, serif-only font stacks, radius 2px/pill/circle only, no gradients, no emoji, no remote resources in the specimen, `tokens.json` in step with `tokens.css`, and the accessibility lint in `scripts/lint_html.py` on every page (one `h1`, `<main>`, heading order, labels, names, ids, anchors). `python3 scripts/check.py --render` adds the layout snapshot comparison; run `node scripts/snapshot.mjs --update` and commit `snapshots/layout.json` when a layout change is intended. New components go in `brand/components.css` with all five states and a specimen entry; see `docs/contributing.md`. Run the gate after every change. For consumer work, also run the consumer's build and relevant interaction checks. Record newly introduced commands in README.md.

## Agent entry points

Read `docs/architecture.md`. The current corporate intro is `content/decks/intro.json`,
built at `build/intro/client/index.html`; staging versions are in `content/deck-catalog.json`.
Slides live once in `content/slides/<uuid>.json`; decks reference IDs, never copy content.
Cases, team, contact and partners are shared canonical data. Preserve verbatim approved copy.
Compose decks with manifests and layout overrides only; `python3 scripts/build_deck.py intro
--profile client --pdf` builds one, `--all` builds all maintained decks. Kitchen stays planned.

Register every visual asset with source/approval in `assets/index.json`; reuse existing bytes.
Use the supported runtime from `dist/components/current.json`; compiled source is recovered
from the original ZIP, historical JSX/exports remain in `archive/` for provenance.

Run `python3 scripts/content_lib.py --check`, `python3 scripts/build_assets.py --check`,
`python3 scripts/build_deck.py --all --check`, `python3 scripts/check.py --render`,
`node scripts/test_component_runtime.mjs` and `python3 scripts/build_preview.py`.
`python3 scripts/release.py <deck>` prepares PDFs and `latestBuilt` for review only.
Never set `latestApproved`, merge, tag or deploy without production review authorization.
