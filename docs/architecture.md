# Slide library and export architecture

The foundation remains authoritative in `brand/`. The supported runtime is selected by
`dist/components/current.json`. Current content lives once in `content/`, canonical visual
assets in `assets/`, and generated review artifacts in `build/`. Historical exports live in
`archive/` and are excluded from the public preview.

## Content contracts

`content/slides/<uuid>.json` is the permanent slide record: `id`, verbatim `label`, `owner`,
`component`, `props`, `publish`, `cat`, `type`, `tags`, `purpose`, optional `evidence` and
`note`, and `status`. Maintained slides have props; planned slides have none and never render.
Registry UUIDs and order are preserved. Sales-only UUIDs use UUIDv5 with the documented
`tiansight:sales:<label>` namespace input. Shared profiles, contact, partners and case slides
are owned by intro and referenced by every consuming deck. Never copy a slide to compose a deck.

`content/decks/<id>.json` lists slide UUIDs in order, with optional layout-only overrides
(`page`, `active`, `highlight`, `figure`), params, profile publish filters, transforms and status.
The four decks are intro, exhibit, sales and planned kitchen. Planned kitchen builds nothing.
Page numbers are assigned after profile filtering. No authored copy belongs in overrides.
`keep-words` applies the exhibit source's wrapping helpers during build, preserving plain data.

`content/cases/<id>.json` holds approved case study props in `summary`, galleries, assets and
approval references. Case slides use `$case` plus layout props. Case names and narratives must
not be copied inline into slide records. The eight approved source records are retained,
including the source's two distinct engagements for 石头先生.

`scripts/content_lib.py` implements reference resolution once:

| Reference | Canonical source |
| --- | --- |
| `$team: name` | Person in `content/team.json` |
| `$contact: true` | `content/contact.json` |
| `$case: id` | `summary` of `content/cases/<id>.json` |
| `$partners: true` | `content/partners.json` |
| `$asset: path` | Hash-checked entry in `assets/index.json`, relative to output |

References may occur in arrays or objects. Resolved records are inserted once; recursive
reference chains are rejected. Layout siblings merge with reference props. Serializable
`$element` descriptors preserve the original exhibit SVG chart without executable content in
slide JSON. The boot script revives descriptors as React elements. `ext:PhotoPoints` is in
`content/extensions/exhibit.js`; extension code is subject to token/font/offline checks.

## Build, version and approval

Run `python3 scripts/build_deck.py --all` for HTML, or
`python3 scripts/build_deck.py intro --profile client --param date=2026-11 --pdf`.
A temporary manifest can be passed with `--manifest`. Build output is
`build/<deck>/<profile>/index.html` and `build.json`; reproducible timestamps use the source
commit date. The pinned runtime and deck stage are local; DC templating is only for specimen cards.

`contentVersion` hashes resolved slide content and referenced asset hashes; shared edits
invalidate every consuming deck. `systemVersion` separately identifies the supported runtime.
`scripts/build_deck_catalog.mjs` generates `content/deck-catalog.json` and
`content/slides.index.json`. `--check` rejects stale generated data.

`python3 scripts/release.py intro` builds and verifies each profile's PDF, then records
`latestBuilt` and `build/intro/RELEASE.md`. Repeat for exhibit and sales. Release means a local
review artifact; it does not publish or approve it. `latestApproved` remains null until owner
production review. Production consumers use `latestApproved`; staging uses `latestBuilt`.
Approval is recorded in `content/approvals.json` (`schema tiansight.approvals/1`, one entry per
deck with `contentVersion`, `systemVersion`, `approvedAt`, `by`) by
`python3 scripts/release.py <deck> --approve [--by owner|production-review]`, which copies the
current `latestBuilt` versions and refuses an unbuilt or stale release. The catalog builder sets
`latestApproved` only while the entry matches the deck's current versions; any content or runtime
change returns it to null until the production review approves again. Only that review runs
`--approve`.

Slides with `publish: hold` (待确认后发布) stay in the library with their note but belong to no
profile filter: the gate rejects a manifest profile that lists `hold` and any committed
`build/*/*/index.html` containing a hold slide id, so the public repository ships none.
PDF identity is checked using content/system versions in metadata and verification records;
Chromium byte hashes are recorded as provenance rather than used for rebuild equality.

PDF checks bind deck/profile, content/runtime versions, HTML hash and actual page count.
Text checks preserve every non-whitespace character/sign/punctuation (NFKC, U+2060 removed),
and compare numeric tokens in their browser rectangles to preserve digit order. They also check, text bounds, font embedding and raster difference against
the HTML screenshot. This catches omissions and clipping; it does not establish text reading
order. Browser migration comparison checks ordered per-slide rendered text separately.

## Assets and historical sources

`assets/index.json` records canonical paths, SHA-256, kinds, source paths and approval
provenance. `assets/path-map.json` maps former paths/runtime aliases to canonical files.
The pinned runtime resolves canonical image bytes directly from the repository asset root; no version-local image duplicates remain.
Foundation assets and allowed report-kit/person-photo inputs remain separate by policy.
`scripts/build_assets.py --check` checks inventory, references and duplicate image policy.
The ZIP preserves original approval bytes; the runtime builder decodes resources in memory.

The gate is `python3 scripts/check.py --render`, followed by
`node scripts/test_component_runtime.mjs` and `python3 scripts/build_preview.py`.
Use `node scripts/snapshot.mjs --update` for intended layout changes. Browser tools reuse
`PLAYWRIGHT_MODULE`, global Playwright, or the existing local Codex cache. PDF verification
uses `uv run --with pillow --with pymupdf python scripts/verify_pdf.py <deck> <profile>`.

## MCP

A future web app reads files at a git tag: `content/deck-catalog.json`,
`content/slides.index.json`, `content/slides/*.json`, `assets/index.json` and
`dist/components/current.json`. It uses the same repository build commands as an agent or CI.
Tools to implement later: `list_decks`, `get_deck`, `search_slides`, `compose_deck`,
`build_deck`, `get_asset`. Composition writes only references/params to a manifest and invokes
`build_deck.py`; it never creates or rewrites slide copy. No service, MCP implementation,
automatic sync, approval, tag, deployment or cloud mutation is part of this consolidation.

PDF optimisation recompresses embedded raster streams at 120dpi/quality88 and removes
duplicate PDF objects; text stays vector. Each optimised output must pass the same original
HTML raster comparison, text/number, glyph embedding and bounds checks. Canonical image bytes
are preserved. Fonts have one canonical source in `brand/fonts/`; specimen token stylesheets
reference that source rather than keeping an identical `assets/fonts/` tree.
