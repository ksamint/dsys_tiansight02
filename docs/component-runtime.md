# Supported component runtime

The supported component distribution is `dist/components/2026.10.21-e0a760/` (105 named exports). `dist/components/current.json` points to its manifest. It replaces the 55-export bb63dc runtime for active component cards, slides and source templates. The CSS/product runtime in `dist/product/` remains a separate foundation consumer.

The owner approved the import of **Template review and fixes (1).zip**, including the supplied logos, hotel marks, brand wall and case photographs, in the task approved on 2026-10-21. These are company/service introductions, not new private client deliverables. No new customer permission or third-party endorsement is inferred. The complete supplied package is preserved at `archive/approved-2026-10-21/source.zip`; its SHA-256 and every ZIP entry, embedded resource and nested image/font are recorded in `archive/approved-2026-10-21/inventory.json`.

The package contains **compiled components, not their original JSX sources**. The runtime manifest's `sourcePath` and `sourceHashes` describe the upstream build; they do not imply those source files were recovered. The old `TIANSIGHT 侍天 Design System/`, `TIANSIGHT 侍天 Design System v0.7/`, `docs/claude-design-system/`, and root JSX are historical source/export material. They remain intact for provenance. Editing them does not rebuild the new runtime. Current HTML cards beside the historical JSX consume the pinned distribution.

## Loading

For HTML with ordered scripts, load `styles.css`, `vendor/react.min.js`, `vendor/react-dom.min.js`, `vendor/d3.min.js`, `vendor/d3-sankey.min.js`, `vendor/lucide-icons.js`, then `_ds_bundle.js` from the same version directory. The public namespace is `window.TIANSIGHTDesignSystem_e0a760`; enumerate supported names from `manifest.json.components`. Babel is local and only needed for JSX-based cards. Design Component documents preload local `deck-stage.js` as a normal script and boot support only after the runtime is ready. The two editable sales/exhibit templates are tested directly through `file://`; DC fetch-based imports must not be used for their deck stage.

For programmatic loading, insert `loader.js` and await `window.TIANSIGHT_READY` after its load event. The loader resolves resources relative to its own URL and loads dependencies sequentially. Do not use historical namespace names, a nonexistent root `_ds_bundle.js`, or CDN URLs. Copy the repository-relative distribution plus its manifest's external foundation/font assets together; the component directory is not a self-contained npm package.

`components/`, `slides/` and `ui_kits/` HTML cards now load this distribution directly. `templates/sales-deck/ds-base.js` and the exhibit source loader use the same pinned path. The archived Claude documentation bundle is not an active loader.

## Foundation and corrections

The brand was resolved through https://apuch.art/ and https://apuch.art/api/brands/tiansight.json on 2026-10-21. The live record is 53340b5; palette and official logo hash are unchanged. A verbatim record and live guide are archived with the approved package. The live guide still labels itself v0.6; `brand/guide.md` retains the repository's owner-confirmed v0.7 accessibility/foundation rulings, documented in `docs/foundation-review.md`.

`brand/tokens.css`, `brand/fonts.css` and the official mark remain authoritative. Incoming color ramps and concrete d3 color constants are generated from published tokens, and decorative CSS gradients are removed. The recovered runtime's color aliases `text-display`, `text-body`, and `text-caption` conflict with foundation typography tokens; maintained compiled references use `charcoal`, `text`, and `color-caption`. Pale slide grounds and readable text are restored without replacing approved images.

Small source-bound patches in `scripts/runtime_patches.py` retain the existing Waterfall rounding and Matrix2x2 contrast fixes, fix slide styling, and bind recovered UI-kit dependencies correctly. Every patch asserts its original source text, so a changed upstream bundle fails rather than silently applying an incorrect patch. See `docs/runtime-compatibility.md` for the props/defaults audit. All original recovered bytes remain in the archive.

## Rebuild and verify

```sh
python3 scripts/build_component_runtime.py         # recover and build; no network access
python3 scripts/build_content.py                   # shared team/contact browser data
python3 scripts/build_exhibit.py                   # maintained source → HTML + build identity
node scripts/build_deck_catalog.mjs                # ordered deck metadata
node scripts/test_component_runtime.mjs --pdf       # offline runtime, cards, decks; HTML → PDF
uv run --with pillow --with pymupdf python scripts/verify_exhibit_pdf.py
python3 scripts/check.py --render                  # gate, artifact freshness, layout snapshots
python3 scripts/build_preview.py                   # isolated preview staging; does not deploy
```

The four builders accept `--check`. Vendored d3 7.9.0, d3-sankey 0.12.3, Lucide static 0.441.0 (1,528 SVG mask icons embedded as local data URIs), and Babel standalone 7.29.0 were downloaded from their pinned npm distributions; React/ReactDOM 18.3.1 were recovered from the supplied HTML. License notices are under `vendor/`; exact installed bytes are in the distribution manifest. Fonts retain the repository's OFL licenses. Runtime reconstruction and normal verification need no CDN.

## Shared export contract (web app and MCP later)

One generation path is **versioned content + design-system version → HTML → PDF**. `content/deck-catalog.json` records stable IDs, explicit order, source relationships and content hashes. The supplied intro/kitchen registries each have 52 entries but no accompanying editable deck export in this ZIP; they are marked `supplied-metadata-only`, not advertised as generated artifacts. The actual canonical corporate introduction retains its 47 existing slide IDs and static generator. The exhibit has 41 original UUIDs and editable source. Neither derivative may write back into canonical corporate content.

`content/team.json` and `contact.json` are shared canonical data; generated JS and the existing corporate generator read them. See `docs/content-provenance.md` for the source mapping and research corrections. The catalog distinguishes the existing foundation-v0.7 corporate build from the current component-runtime exhibit; it never relabels an old PDF as a new-runtime build.

Each new artifact identifies the exact content hash and component-system version in HTML metadata and `build.json`; the PDF title carries both, and the PDF verification record hashes its final bytes. A content change requires an HTML rebuild and a PDF rebuild from that HTML, not a separate PDF implementation.

“Latest” means the latest **explicitly approved, successfully built release**. This branch is a review candidate: `supported` selects the implementation under review, while `latestApprovedBuilt` remains null until release approval is recorded. A version number, PR merge or passing build alone must not create an approved release. Future web downloads and MCP exports must resolve approved catalog versions and run the same build path. Web-app synchronization, hosted export services, MCP tools and deployment are out of scope here.
