# Consolidation execution log · 2026-10-21

Base: PR #3 head `3bd4d2d`, because `main` does not yet contain the approved runtime.
Branch: `claude/consolidation-2026-10-21`; target `main`, stacked on PR #3.
Plan source: `3d78ab9:docs/consolidation-plan.md` (the plan branch predates PR #3;
only the plan is applied, never that branch's unrelated reverse diff).

## Baseline

- `node scripts/test_component_runtime.mjs`: PASS using the existing cached Playwright:
  105 exports, 41 exhibit slides, 47 corporate slides (19 component types), 33 cards;
  offline images/fonts/navigation/clipping.
- Default invocation initially failed because global Playwright is absent. The existing
  Codex cached Playwright and Chromium were reused; no replacement installation.
  `scripts/playwright.mjs` centralises discovery for ordinary invocations.
- Foundation gate is rerun in an immutable worktree at `3bd4d2d` to avoid racing asset migration.

## Implementation and acceptance

Implementation complete and ready for production review. Approval pointers stay null; no merge, tag or deployment.

Baseline foundation gate: PASS on immutable `3bd4d2d`, including 24 layout renders,
official palette, tokens, dist, accessibility, contrast, profiles, report kit,
105 current exports and 55 archived exports / 40 cards. Existing missing founder
portrait placeholders remain documented by the gate.

## Phases A–B · library and manifests

141 unique records: 94 maintained, 47 planned. Intro/exhibit/sales manifests contain
52/41/14 entries; kitchen has 52 registry entries but builds nothing. Intro client is 47.
Approved `vals.json` and extracted corporate props had zero wording differences.
Registry labels are preserved even where source template labels differ (section/team aliases).

Fallback: §0's one-source principle takes precedence over the sales UUID minting detail:
four more identical slides (四个阶段, 服务模式, 样张为证, 图谱) reuse intro UUIDs.
Six sales-only UUIDs are minted instead of ten. The five pre-existing cross-deck UUIDs remain.

Migration comparison: exhibit 41/41 exact, intro 46/47 exact after whitespace/U+2060
normalisation and generated page-number removal. The one exact exception is intro cover
`提案对象` → `文件`: the old HTML parser lowercased `clientLabel` and dropped the approved
literal prop; the library retains approved copy. The baseline permits only that exact change.
The original exhibit's footer observer is preserved as a declarative manifest footer.
Source captures are in `snapshots/migration-text.json`; `scripts/test_migration.mjs` rejects
any additional difference. The one-time migrator can read retired inputs from `3bd4d2d`.

## Phase C · canonical assets

211 registered files, including 79 unique images. `assets/path-map.json` records every legacy
path and runtime alias. ZIP image approvals cite `docs/component-runtime.md`; original
repository assets cite CHANGELOG v0.7. Hotel marks and brand wall retain owner approval.
Direct consumer/report-template paths were changed mechanically and the report template
regenerated; no report-kit behavior or copy changed.

Fallback: existing generated foundation distributions `dist/icons.svg` and `dist/product/`
retain their published self-contained assets. They are verified by the unchanged foundation
builders and are explicit exceptions to the image-location gate, alongside the planned
runtime-generated copies. No new duplicate source images are allowed.

## Phases D–E · catalog and export

One builder resolves references, filters profiles and mounts runtime components; one PDF path
verifies text, bounds, embedded fonts and screenshot difference. `latestBuilt` is staging;
`latestApproved` remains null. Planned kitchen produces no output.

Fallback: build timestamps use the original ZIP source-package commit date, rather than the
latest derived-artifact commit, avoiding generated outputs that become stale immediately upon
commit. Eight contract regressions cover reference resolution, paths/temporary manifests,
shared dependency invalidation, override/case-copy rules and ordering.

## Phase F · retirement and moves

Moved intact: `TIANSIGHT 侍天 Design System/` → `archive/proposal-2026-09/`,
`TIANSIGHT 侍天 Design System v0.7/` → `archive/proposal-v0.7/`,
`docs/claude-design-system/` → `archive/claude-design-system-v13/`.
Deleted after text verification: `deliverables/company-intro-v3/`,
`deliverables/exhibit-design/`, `templates/sales-deck/`, `scripts/build_exhibit.py`,
`scripts/verify_exhibit_pdf.py`, the decoded `archive/approved-2026-10-21/resources/` and
`template.html`, and three active `RUNTIME-STATUS.md` stubs. Original source ZIP retained.
Lifecycle preview PNGs moved to `assets/screens/`; superseded `assets/intro/` copies removed.
Individual asset moves/deletions are enumerated in `assets/path-map.json` and the Git diff.
The obsolete JS slide registry is replaced by manifests, slide records and generated indices.

PDF-tooling fallback: dependency resolution stalled despite installed wheel bytes. A portable
launcher probes active interpreters and the existing unpacked uv wheel cache with an ABI
import check, then falls back to normal uv resolution. No private paths or dependency bytes
are committed. PyMuPDF checks embedded font streams; Chromium Type3 fonts are checked for
CharProcs and Unicode maps. `pdffonts` is absent on this host and that limitation is recorded
in each verification record.

Final asset cleanup removed 132 byte-identical font/support copies under `assets/fonts/`;
`tokens/fonts.css` now references `brand/fonts/` directly (all 132 files compared equal before
removal). The final asset register contains 79 canonical files/images. Two existing case-name
mentions are now canonical `$case` snippet views; the guard rejects raw case names in every
props string, not only a `name` field. Cover date params retain source defaults and resolve
explicit `$param` descriptors; custom dates now affect rendered covers.

Review fixes: footer/namespace JSON is escaped for HTML script contexts; PDF identity includes
profile and actual page count, rejecting internal/client substitutions; text comparison keeps
signs and punctuation, and numeric range checks preserve digit order. Twelve contract
regressions pass. Review PDFs are optimised at 120dpi/quality88, preserving vector text and
source image bytes; every final output still has to pass the original screenshot threshold.

Size-gate fallback: keeping all nine profile PDFs plus version-local image duplicates would
exceed the PR#3 baseline even after PDF optimisation. The runtime now resolves registered
canonical assets directly through the repository root, alongside its existing shared brand
stylesheet/font dependency. Generated image copies under `dist/components/<ver>/assets/`
are removed; the runtime manifest lists canonical external asset hashes instead. This
strengthens §0 one-copy provenance and preserves every profile PDF. It is deliberately a
repository-coupled distribution, not a standalone directory. Offline runtime/card/deck tests
verify every resolved image. No source image is compressed or removed.

Build timestamp provenance is recorded in `content/provenance.json` from the original source
commit, so shallow CI checkouts reproduce the same `builtAt` without requiring older Git
history. The timestamp matches all existing final build metadata exactly.

Final behavioral review added a bare-default Seal regression: explicit specimen props had
hidden its obsolete version-local path. Both asset resolver helpers now point at canonical
images. The sales PDF comparison also exposed CSS uppercase text transformation; browser
capture now records rendered casing per text node (including SVG), rather than weakening
case-sensitive PDF comparison. Final artifacts are regenerated after these fixes.

<details>
<summary>File-level retirement and move inventory</summary>

- Deleted `archive/approved-2026-10-21/resources/1f4751c8-8e15-4470-b341-08f5273e4987.js`.
- Deleted `archive/approved-2026-10-21/resources/2036ea6e-a232-4d20-9a79-caf2e0655195.js`.
- Deleted `archive/approved-2026-10-21/resources/234d8b4d-17cc-44a3-9f85-4fac7cab7208.js`.
- Deleted `archive/approved-2026-10-21/resources/713f77dd-15c9-4397-8686-652b1844acb5.css`.
- Deleted `archive/approved-2026-10-21/resources/896e52ab-35f2-46fb-9caa-7d0af96b322d.js`.
- Deleted `archive/approved-2026-10-21/resources/98a96e64-f60b-4792-a97f-945388efc590.js`.
- Deleted `archive/approved-2026-10-21/resources/9af7b91b-ab7d-4300-a3a8-7b28d0cecb28.js`.
- Deleted `archive/approved-2026-10-21/resources/ab1aca59-3344-4783-84e8-82eca66e346e.js`.
- Deleted `archive/approved-2026-10-21/resources/be4b1983-03d5-4510-ba72-c4f50e26d23a.js`.
- Deleted `archive/approved-2026-10-21/resources/f2184463-fc36-40f7-98c8-8cba137ac857.js`.
- Deleted `archive/approved-2026-10-21/resources/fee4ee04-e8ed-4c64-ab59-74f453976612.js`.
- Deleted `archive/approved-2026-10-21/template.html`.
- Moved `docs/claude-design-system/README.md` → `archive/claude-design-system-v13/README.md`.
- Moved `docs/claude-design-system/SYNC.md` → `archive/claude-design-system-v13/SYNC.md`.
- Moved `docs/claude-design-system/assets/Deck/README.md` → `archive/claude-design-system-v13/assets/Deck/README.md`.
- Moved `docs/claude-design-system/assets/Icons/README.md` → `archive/claude-design-system-v13/assets/Icons/README.md`.
- Moved `docs/claude-design-system/assets/Logos/README.md` → `archive/claude-design-system-v13/assets/Logos/README.md`.
- Moved `docs/claude-design-system/assets/Partners/README.md` → `archive/claude-design-system-v13/assets/Partners/README.md`.
- Moved `docs/claude-design-system/assets/People/README.md` → `archive/claude-design-system-v13/assets/People/README.md`.
- Moved `docs/claude-design-system/brand-guide.md` → `archive/claude-design-system-v13/brand-guide.md`.
- Moved `docs/claude-design-system/chart-kit.md` → `archive/claude-design-system-v13/chart-kit.md`.
- Moved `docs/claude-design-system/company-intro-v3.md` → `archive/claude-design-system-v13/company-intro-v3.md`.
- Moved `docs/claude-design-system/company-intro.md` → `archive/claude-design-system-v13/company-intro.md`.
- Moved `docs/claude-design-system/components/Badge/README.md` → `archive/claude-design-system-v13/components/Badge/README.md`.
- Moved `docs/claude-design-system/components/Badge/preview.html` → `archive/claude-design-system-v13/components/Badge/preview.html`.
- Moved `docs/claude-design-system/components/BarSeries/README.md` → `archive/claude-design-system-v13/components/BarSeries/README.md`.
- Moved `docs/claude-design-system/components/BarSeries/preview.html` → `archive/claude-design-system-v13/components/BarSeries/preview.html`.
- Moved `docs/claude-design-system/components/BoxPlot/README.md` → `archive/claude-design-system-v13/components/BoxPlot/README.md`.
- Moved `docs/claude-design-system/components/BoxPlot/preview.html` → `archive/claude-design-system-v13/components/BoxPlot/preview.html`.
- Moved `docs/claude-design-system/components/Button/README.md` → `archive/claude-design-system-v13/components/Button/README.md`.
- Moved `docs/claude-design-system/components/Button/preview.html` → `archive/claude-design-system-v13/components/Button/preview.html`.
- Moved `docs/claude-design-system/components/CalendarHeatmap/README.md` → `archive/claude-design-system-v13/components/CalendarHeatmap/README.md`.
- Moved `docs/claude-design-system/components/CalendarHeatmap/preview.html` → `archive/claude-design-system-v13/components/CalendarHeatmap/preview.html`.
- Moved `docs/claude-design-system/components/Card/README.md` → `archive/claude-design-system-v13/components/Card/README.md`.
- Moved `docs/claude-design-system/components/Card/preview.html` → `archive/claude-design-system-v13/components/Card/preview.html`.
- Moved `docs/claude-design-system/components/Checkbox/README.md` → `archive/claude-design-system-v13/components/Checkbox/README.md`.
- Moved `docs/claude-design-system/components/Checkbox/preview.html` → `archive/claude-design-system-v13/components/Checkbox/preview.html`.
- Moved `docs/claude-design-system/components/Cover/preview.html` → `archive/claude-design-system-v13/components/Cover/preview.html`.
- Moved `docs/claude-design-system/components/DivergingBars/README.md` → `archive/claude-design-system-v13/components/DivergingBars/README.md`.
- Moved `docs/claude-design-system/components/DivergingBars/preview.html` → `archive/claude-design-system-v13/components/DivergingBars/preview.html`.
- Moved `docs/claude-design-system/components/Divider/README.md` → `archive/claude-design-system-v13/components/Divider/README.md`.
- Moved `docs/claude-design-system/components/Divider/preview.html` → `archive/claude-design-system-v13/components/Divider/preview.html`.
- Moved `docs/claude-design-system/components/Donut/README.md` → `archive/claude-design-system-v13/components/Donut/README.md`.
- Moved `docs/claude-design-system/components/Donut/preview.html` → `archive/claude-design-system-v13/components/Donut/preview.html`.
- Moved `docs/claude-design-system/components/Dumbbell/README.md` → `archive/claude-design-system-v13/components/Dumbbell/README.md`.
- Moved `docs/claude-design-system/components/Dumbbell/preview.html` → `archive/claude-design-system-v13/components/Dumbbell/preview.html`.
- Moved `docs/claude-design-system/components/ExpertCard/README.md` → `archive/claude-design-system-v13/components/ExpertCard/README.md`.
- Moved `docs/claude-design-system/components/ExpertCard/preview.html` → `archive/claude-design-system-v13/components/ExpertCard/preview.html`.
- Moved `docs/claude-design-system/components/Eyebrow/README.md` → `archive/claude-design-system-v13/components/Eyebrow/README.md`.
- Moved `docs/claude-design-system/components/Eyebrow/preview.html` → `archive/claude-design-system-v13/components/Eyebrow/preview.html`.
- Moved `docs/claude-design-system/components/FacetBars/README.md` → `archive/claude-design-system-v13/components/FacetBars/README.md`.
- Moved `docs/claude-design-system/components/FacetBars/preview.html` → `archive/claude-design-system-v13/components/FacetBars/preview.html`.
- Moved `docs/claude-design-system/components/FacetGrid/README.md` → `archive/claude-design-system-v13/components/FacetGrid/README.md`.
- Moved `docs/claude-design-system/components/FacetGrid/preview.html` → `archive/claude-design-system-v13/components/FacetGrid/preview.html`.
- Moved `docs/claude-design-system/components/ForecastCorridor/README.md` → `archive/claude-design-system-v13/components/ForecastCorridor/README.md`.
- Moved `docs/claude-design-system/components/ForecastCorridor/preview.html` → `archive/claude-design-system-v13/components/ForecastCorridor/preview.html`.
- Moved `docs/claude-design-system/components/Funnel/README.md` → `archive/claude-design-system-v13/components/Funnel/README.md`.
- Moved `docs/claude-design-system/components/Funnel/preview.html` → `archive/claude-design-system-v13/components/Funnel/preview.html`.
- Moved `docs/claude-design-system/components/Gantt/README.md` → `archive/claude-design-system-v13/components/Gantt/README.md`.
- Moved `docs/claude-design-system/components/Gantt/preview.html` → `archive/claude-design-system-v13/components/Gantt/preview.html`.
- Moved `docs/claude-design-system/components/Gauge/README.md` → `archive/claude-design-system-v13/components/Gauge/README.md`.
- Moved `docs/claude-design-system/components/Gauge/preview.html` → `archive/claude-design-system-v13/components/Gauge/preview.html`.
- Moved `docs/claude-design-system/components/Heatmap/README.md` → `archive/claude-design-system-v13/components/Heatmap/README.md`.
- Moved `docs/claude-design-system/components/Heatmap/preview.html` → `archive/claude-design-system-v13/components/Heatmap/preview.html`.
- Moved `docs/claude-design-system/components/Histogram/README.md` → `archive/claude-design-system-v13/components/Histogram/README.md`.
- Moved `docs/claude-design-system/components/Histogram/preview.html` → `archive/claude-design-system-v13/components/Histogram/preview.html`.
- Moved `docs/claude-design-system/components/Icon/README.md` → `archive/claude-design-system-v13/components/Icon/README.md`.
- Moved `docs/claude-design-system/components/Icon/preview.html` → `archive/claude-design-system-v13/components/Icon/preview.html`.
- Moved `docs/claude-design-system/components/IconButton/README.md` → `archive/claude-design-system-v13/components/IconButton/README.md`.
- Moved `docs/claude-design-system/components/IconButton/preview.html` → `archive/claude-design-system-v13/components/IconButton/preview.html`.
- Moved `docs/claude-design-system/components/Input/README.md` → `archive/claude-design-system-v13/components/Input/README.md`.
- Moved `docs/claude-design-system/components/Input/preview.html` → `archive/claude-design-system-v13/components/Input/preview.html`.
- Moved `docs/claude-design-system/components/LedgerTable/README.md` → `archive/claude-design-system-v13/components/LedgerTable/README.md`.
- Moved `docs/claude-design-system/components/LedgerTable/preview.html` → `archive/claude-design-system-v13/components/LedgerTable/preview.html`.
- Moved `docs/claude-design-system/components/Lollipop/README.md` → `archive/claude-design-system-v13/components/Lollipop/README.md`.
- Moved `docs/claude-design-system/components/Lollipop/preview.html` → `archive/claude-design-system-v13/components/Lollipop/preview.html`.
- Moved `docs/claude-design-system/components/Lorenz/README.md` → `archive/claude-design-system-v13/components/Lorenz/README.md`.
- Moved `docs/claude-design-system/components/Lorenz/preview.html` → `archive/claude-design-system-v13/components/Lorenz/preview.html`.
- Moved `docs/claude-design-system/components/Matrix2x2/README.md` → `archive/claude-design-system-v13/components/Matrix2x2/README.md`.
- Moved `docs/claude-design-system/components/Matrix2x2/preview.html` → `archive/claude-design-system-v13/components/Matrix2x2/preview.html`.
- Moved `docs/claude-design-system/components/Mekko/README.md` → `archive/claude-design-system-v13/components/Mekko/README.md`.
- Moved `docs/claude-design-system/components/Mekko/preview.html` → `archive/claude-design-system-v13/components/Mekko/preview.html`.
- Moved `docs/claude-design-system/components/MetricRow/README.md` → `archive/claude-design-system-v13/components/MetricRow/README.md`.
- Moved `docs/claude-design-system/components/MetricRow/preview.html` → `archive/claude-design-system-v13/components/MetricRow/preview.html`.
- Moved `docs/claude-design-system/components/NineGrid/README.md` → `archive/claude-design-system-v13/components/NineGrid/README.md`.
- Moved `docs/claude-design-system/components/NineGrid/preview.html` → `archive/claude-design-system-v13/components/NineGrid/preview.html`.
- Moved `docs/claude-design-system/components/PairedBars/README.md` → `archive/claude-design-system-v13/components/PairedBars/README.md`.
- Moved `docs/claude-design-system/components/PairedBars/preview.html` → `archive/claude-design-system-v13/components/PairedBars/preview.html`.
- Moved `docs/claude-design-system/components/Pareto/README.md` → `archive/claude-design-system-v13/components/Pareto/README.md`.
- Moved `docs/claude-design-system/components/Pareto/preview.html` → `archive/claude-design-system-v13/components/Pareto/preview.html`.
- Moved `docs/claude-design-system/components/PartnerCase/README.md` → `archive/claude-design-system-v13/components/PartnerCase/README.md`.
- Moved `docs/claude-design-system/components/PartnerCase/preview.html` → `archive/claude-design-system-v13/components/PartnerCase/preview.html`.
- Moved `docs/claude-design-system/components/PlanCard/README.md` → `archive/claude-design-system-v13/components/PlanCard/README.md`.
- Moved `docs/claude-design-system/components/PlanCard/preview.html` → `archive/claude-design-system-v13/components/PlanCard/preview.html`.
- Moved `docs/claude-design-system/components/Quote/README.md` → `archive/claude-design-system-v13/components/Quote/README.md`.
- Moved `docs/claude-design-system/components/Quote/preview.html` → `archive/claude-design-system-v13/components/Quote/preview.html`.
- Moved `docs/claude-design-system/components/Radio/README.md` → `archive/claude-design-system-v13/components/Radio/README.md`.
- Moved `docs/claude-design-system/components/Radio/preview.html` → `archive/claude-design-system-v13/components/Radio/preview.html`.
- Moved `docs/claude-design-system/components/Sankey/README.md` → `archive/claude-design-system-v13/components/Sankey/README.md`.
- Moved `docs/claude-design-system/components/Sankey/preview.html` → `archive/claude-design-system-v13/components/Sankey/preview.html`.
- Moved `docs/claude-design-system/components/Scatter/README.md` → `archive/claude-design-system-v13/components/Scatter/README.md`.
- Moved `docs/claude-design-system/components/Scatter/preview.html` → `archive/claude-design-system-v13/components/Scatter/preview.html`.
- Moved `docs/claude-design-system/components/ScoreCompass/README.md` → `archive/claude-design-system-v13/components/ScoreCompass/README.md`.
- Moved `docs/claude-design-system/components/ScoreCompass/preview.html` → `archive/claude-design-system-v13/components/ScoreCompass/preview.html`.
- Moved `docs/claude-design-system/components/Seal/README.md` → `archive/claude-design-system-v13/components/Seal/README.md`.
- Moved `docs/claude-design-system/components/Seal/preview.html` → `archive/claude-design-system-v13/components/Seal/preview.html`.
- Moved `docs/claude-design-system/components/SectionHeading/README.md` → `archive/claude-design-system-v13/components/SectionHeading/README.md`.
- Moved `docs/claude-design-system/components/SectionHeading/preview.html` → `archive/claude-design-system-v13/components/SectionHeading/preview.html`.
- Moved `docs/claude-design-system/components/Select/README.md` → `archive/claude-design-system-v13/components/Select/README.md`.
- Moved `docs/claude-design-system/components/Select/preview.html` → `archive/claude-design-system-v13/components/Select/preview.html`.
- Moved `docs/claude-design-system/components/SlopeChart/README.md` → `archive/claude-design-system-v13/components/SlopeChart/README.md`.
- Moved `docs/claude-design-system/components/SlopeChart/preview.html` → `archive/claude-design-system-v13/components/SlopeChart/preview.html`.
- Moved `docs/claude-design-system/components/Sparkline/README.md` → `archive/claude-design-system-v13/components/Sparkline/README.md`.
- Moved `docs/claude-design-system/components/Sparkline/preview.html` → `archive/claude-design-system-v13/components/Sparkline/preview.html`.
- Moved `docs/claude-design-system/components/StackedBars/README.md` → `archive/claude-design-system-v13/components/StackedBars/README.md`.
- Moved `docs/claude-design-system/components/StackedBars/preview.html` → `archive/claude-design-system-v13/components/StackedBars/preview.html`.
- Moved `docs/claude-design-system/components/Stat/README.md` → `archive/claude-design-system-v13/components/Stat/README.md`.
- Moved `docs/claude-design-system/components/Stat/preview.html` → `archive/claude-design-system-v13/components/Stat/preview.html`.
- Moved `docs/claude-design-system/components/StepMarker/README.md` → `archive/claude-design-system-v13/components/StepMarker/README.md`.
- Moved `docs/claude-design-system/components/StepMarker/preview.html` → `archive/claude-design-system-v13/components/StepMarker/preview.html`.
- Moved `docs/claude-design-system/components/Switch/README.md` → `archive/claude-design-system-v13/components/Switch/README.md`.
- Moved `docs/claude-design-system/components/Switch/preview.html` → `archive/claude-design-system-v13/components/Switch/preview.html`.
- Moved `docs/claude-design-system/components/Tag/README.md` → `archive/claude-design-system-v13/components/Tag/README.md`.
- Moved `docs/claude-design-system/components/Tag/preview.html` → `archive/claude-design-system-v13/components/Tag/preview.html`.
- Moved `docs/claude-design-system/components/Tornado/README.md` → `archive/claude-design-system-v13/components/Tornado/README.md`.
- Moved `docs/claude-design-system/components/Tornado/preview.html` → `archive/claude-design-system-v13/components/Tornado/preview.html`.
- Moved `docs/claude-design-system/components/Treemap/README.md` → `archive/claude-design-system-v13/components/Treemap/README.md`.
- Moved `docs/claude-design-system/components/Treemap/preview.html` → `archive/claude-design-system-v13/components/Treemap/preview.html`.
- Moved `docs/claude-design-system/components/TrendLine/README.md` → `archive/claude-design-system-v13/components/TrendLine/README.md`.
- Moved `docs/claude-design-system/components/TrendLine/preview.html` → `archive/claude-design-system-v13/components/TrendLine/preview.html`.
- Moved `docs/claude-design-system/components/Waffle/README.md` → `archive/claude-design-system-v13/components/Waffle/README.md`.
- Moved `docs/claude-design-system/components/Waffle/preview.html` → `archive/claude-design-system-v13/components/Waffle/preview.html`.
- Moved `docs/claude-design-system/components/Waterfall/README.md` → `archive/claude-design-system-v13/components/Waterfall/README.md`.
- Moved `docs/claude-design-system/components/Waterfall/preview.html` → `archive/claude-design-system-v13/components/Waterfall/preview.html`.
- Moved `docs/claude-design-system/components/Wordmark/README.md` → `archive/claude-design-system-v13/components/Wordmark/README.md`.
- Moved `docs/claude-design-system/components/Wordmark/preview.html` → `archive/claude-design-system-v13/components/Wordmark/preview.html`.
- Moved `docs/claude-design-system/components/bundle.css` → `archive/claude-design-system-v13/components/bundle.css`.
- Moved `docs/claude-design-system/components/bundle.js` → `archive/claude-design-system-v13/components/bundle.js`.
- Moved `docs/claude-design-system/components/index.d.ts` → `archive/claude-design-system-v13/components/index.d.ts`.
- Moved `docs/claude-design-system/design-system.json` → `archive/claude-design-system-v13/design-system.json`.
- Moved `docs/claude-design-system/foundation-review.md` → `archive/claude-design-system-v13/foundation-review.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/principles.md` → `archive/claude-design-system-v13/principles.md`.
- Moved `docs/claude-design-system/templates/company-intro/CompanyIntro.dc.html` → `archive/claude-design-system-v13/templates/company-intro/CompanyIntro.dc.html`.
- Moved `docs/claude-design-system/templates/company-intro/CompanyIntro.dc.js` → `archive/claude-design-system-v13/templates/company-intro/CompanyIntro.dc.js`.
- Moved `docs/claude-design-system/tokens.json` → `archive/claude-design-system-v13/tokens.json`.
- Moved `docs/claude-design-system/viz-sample-review.md` → `archive/claude-design-system-v13/viz-sample-review.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/RUNTIME-STATUS.md` → `archive/proposal-2026-09/RUNTIME-STATUS.md`.
- Moved `TIANSIGHT 侍天 Design System/SKILL.md` → `archive/proposal-2026-09/SKILL.md`.
- Moved `TIANSIGHT 侍天 Design System/_adherence.oxlintrc.json` → `archive/proposal-2026-09/_adherence.oxlintrc.json`.
- Moved `TIANSIGHT 侍天 Design System/_ds_bundle.js` → `archive/proposal-2026-09/_ds_bundle.js`.
- Moved `TIANSIGHT 侍天 Design System/_ds_manifest.json` → `archive/proposal-2026-09/_ds_manifest.json`.
- Moved `TIANSIGHT 侍天 Design System/assets/logo-seal.png` → `archive/proposal-2026-09/assets/logo-seal.png`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Donut.d.ts` → `archive/proposal-2026-09/components/charts/Donut.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Donut.jsx` → `archive/proposal-2026-09/components/charts/Donut.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Donut.prompt.md` → `archive/proposal-2026-09/components/charts/Donut.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Funnel.d.ts` → `archive/proposal-2026-09/components/charts/Funnel.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Funnel.jsx` → `archive/proposal-2026-09/components/charts/Funnel.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Funnel.prompt.md` → `archive/proposal-2026-09/components/charts/Funnel.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Gauge.d.ts` → `archive/proposal-2026-09/components/charts/Gauge.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Gauge.jsx` → `archive/proposal-2026-09/components/charts/Gauge.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Gauge.prompt.md` → `archive/proposal-2026-09/components/charts/Gauge.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Heatmap.d.ts` → `archive/proposal-2026-09/components/charts/Heatmap.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Heatmap.jsx` → `archive/proposal-2026-09/components/charts/Heatmap.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Heatmap.prompt.md` → `archive/proposal-2026-09/components/charts/Heatmap.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Sparkline.d.ts` → `archive/proposal-2026-09/components/charts/Sparkline.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Sparkline.jsx` → `archive/proposal-2026-09/components/charts/Sparkline.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Sparkline.prompt.md` → `archive/proposal-2026-09/components/charts/Sparkline.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/StackedBars.d.ts` → `archive/proposal-2026-09/components/charts/StackedBars.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/StackedBars.jsx` → `archive/proposal-2026-09/components/charts/StackedBars.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/StackedBars.prompt.md` → `archive/proposal-2026-09/components/charts/StackedBars.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/TrendLine.d.ts` → `archive/proposal-2026-09/components/charts/TrendLine.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/TrendLine.jsx` → `archive/proposal-2026-09/components/charts/TrendLine.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/TrendLine.prompt.md` → `archive/proposal-2026-09/components/charts/TrendLine.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Waterfall.d.ts` → `archive/proposal-2026-09/components/charts/Waterfall.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Waterfall.jsx` → `archive/proposal-2026-09/components/charts/Waterfall.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/Waterfall.prompt.md` → `archive/proposal-2026-09/components/charts/Waterfall.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/attribution.card.html` → `archive/proposal-2026-09/components/charts/attribution.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/chartKit.d.ts` → `archive/proposal-2026-09/components/charts/chartKit.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/chartKit.jsx` → `archive/proposal-2026-09/components/charts/chartKit.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/chartKit.prompt.md` → `archive/proposal-2026-09/components/charts/chartKit.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/share.card.html` → `archive/proposal-2026-09/components/charts/share.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/charts/trend.card.html` → `archive/proposal-2026-09/components/charts/trend.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Badge.d.ts` → `archive/proposal-2026-09/components/core/Badge.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Badge.jsx` → `archive/proposal-2026-09/components/core/Badge.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Badge.prompt.md` → `archive/proposal-2026-09/components/core/Badge.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Button.d.ts` → `archive/proposal-2026-09/components/core/Button.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Button.jsx` → `archive/proposal-2026-09/components/core/Button.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Button.prompt.md` → `archive/proposal-2026-09/components/core/Button.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Card.d.ts` → `archive/proposal-2026-09/components/core/Card.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Card.jsx` → `archive/proposal-2026-09/components/core/Card.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Card.prompt.md` → `archive/proposal-2026-09/components/core/Card.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Divider.d.ts` → `archive/proposal-2026-09/components/core/Divider.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Divider.jsx` → `archive/proposal-2026-09/components/core/Divider.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Divider.prompt.md` → `archive/proposal-2026-09/components/core/Divider.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Eyebrow.d.ts` → `archive/proposal-2026-09/components/core/Eyebrow.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Eyebrow.jsx` → `archive/proposal-2026-09/components/core/Eyebrow.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Eyebrow.prompt.md` → `archive/proposal-2026-09/components/core/Eyebrow.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Icon.d.ts` → `archive/proposal-2026-09/components/core/Icon.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Icon.jsx` → `archive/proposal-2026-09/components/core/Icon.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Icon.prompt.md` → `archive/proposal-2026-09/components/core/Icon.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/IconButton.d.ts` → `archive/proposal-2026-09/components/core/IconButton.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/IconButton.jsx` → `archive/proposal-2026-09/components/core/IconButton.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/IconButton.prompt.md` → `archive/proposal-2026-09/components/core/IconButton.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/PlanCard.d.ts` → `archive/proposal-2026-09/components/core/PlanCard.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/PlanCard.jsx` → `archive/proposal-2026-09/components/core/PlanCard.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/PlanCard.prompt.md` → `archive/proposal-2026-09/components/core/PlanCard.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Quote.d.ts` → `archive/proposal-2026-09/components/core/Quote.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Quote.jsx` → `archive/proposal-2026-09/components/core/Quote.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Quote.prompt.md` → `archive/proposal-2026-09/components/core/Quote.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Seal.d.ts` → `archive/proposal-2026-09/components/core/Seal.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Seal.jsx` → `archive/proposal-2026-09/components/core/Seal.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Seal.prompt.md` → `archive/proposal-2026-09/components/core/Seal.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/SectionHeading.d.ts` → `archive/proposal-2026-09/components/core/SectionHeading.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/SectionHeading.jsx` → `archive/proposal-2026-09/components/core/SectionHeading.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/SectionHeading.prompt.md` → `archive/proposal-2026-09/components/core/SectionHeading.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Stat.d.ts` → `archive/proposal-2026-09/components/core/Stat.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Stat.jsx` → `archive/proposal-2026-09/components/core/Stat.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Stat.prompt.md` → `archive/proposal-2026-09/components/core/Stat.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/StepMarker.d.ts` → `archive/proposal-2026-09/components/core/StepMarker.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/StepMarker.jsx` → `archive/proposal-2026-09/components/core/StepMarker.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/StepMarker.prompt.md` → `archive/proposal-2026-09/components/core/StepMarker.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Tag.d.ts` → `archive/proposal-2026-09/components/core/Tag.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Tag.jsx` → `archive/proposal-2026-09/components/core/Tag.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/core/Tag.prompt.md` → `archive/proposal-2026-09/components/core/Tag.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/core/core.card.html` → `archive/proposal-2026-09/components/core/core.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/data/BarSeries.d.ts` → `archive/proposal-2026-09/components/data/BarSeries.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/data/BarSeries.jsx` → `archive/proposal-2026-09/components/data/BarSeries.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/data/BarSeries.prompt.md` → `archive/proposal-2026-09/components/data/BarSeries.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/data/LedgerTable.d.ts` → `archive/proposal-2026-09/components/data/LedgerTable.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/data/LedgerTable.jsx` → `archive/proposal-2026-09/components/data/LedgerTable.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/data/LedgerTable.prompt.md` → `archive/proposal-2026-09/components/data/LedgerTable.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/data/Matrix2x2.d.ts` → `archive/proposal-2026-09/components/data/Matrix2x2.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/data/Matrix2x2.jsx` → `archive/proposal-2026-09/components/data/Matrix2x2.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/data/Matrix2x2.prompt.md` → `archive/proposal-2026-09/components/data/Matrix2x2.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/data/MetricRow.d.ts` → `archive/proposal-2026-09/components/data/MetricRow.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/data/MetricRow.jsx` → `archive/proposal-2026-09/components/data/MetricRow.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/data/MetricRow.prompt.md` → `archive/proposal-2026-09/components/data/MetricRow.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/data/data.card.html` → `archive/proposal-2026-09/components/data/data.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Checkbox.d.ts` → `archive/proposal-2026-09/components/forms/Checkbox.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Checkbox.jsx` → `archive/proposal-2026-09/components/forms/Checkbox.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Checkbox.prompt.md` → `archive/proposal-2026-09/components/forms/Checkbox.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Input.d.ts` → `archive/proposal-2026-09/components/forms/Input.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Input.jsx` → `archive/proposal-2026-09/components/forms/Input.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Input.prompt.md` → `archive/proposal-2026-09/components/forms/Input.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Radio.d.ts` → `archive/proposal-2026-09/components/forms/Radio.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Radio.jsx` → `archive/proposal-2026-09/components/forms/Radio.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Radio.prompt.md` → `archive/proposal-2026-09/components/forms/Radio.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Select.d.ts` → `archive/proposal-2026-09/components/forms/Select.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Select.jsx` → `archive/proposal-2026-09/components/forms/Select.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Select.prompt.md` → `archive/proposal-2026-09/components/forms/Select.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Switch.d.ts` → `archive/proposal-2026-09/components/forms/Switch.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Switch.jsx` → `archive/proposal-2026-09/components/forms/Switch.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/Switch.prompt.md` → `archive/proposal-2026-09/components/forms/Switch.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/forms/forms.card.html` → `archive/proposal-2026-09/components/forms/forms.card.html`.
- Moved `TIANSIGHT 侍天 Design System/components/people/ExpertCard.d.ts` → `archive/proposal-2026-09/components/people/ExpertCard.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/people/ExpertCard.jsx` → `archive/proposal-2026-09/components/people/ExpertCard.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/people/ExpertCard.prompt.md` → `archive/proposal-2026-09/components/people/ExpertCard.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/people/PartnerCase.d.ts` → `archive/proposal-2026-09/components/people/PartnerCase.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/components/people/PartnerCase.jsx` → `archive/proposal-2026-09/components/people/PartnerCase.jsx`.
- Moved `TIANSIGHT 侍天 Design System/components/people/PartnerCase.prompt.md` → `archive/proposal-2026-09/components/people/PartnerCase.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/components/people/people.card.html` → `archive/proposal-2026-09/components/people/people.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-elevation.card.html` → `archive/proposal-2026-09/guidelines/brand-elevation.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-icons.card.html` → `archive/proposal-2026-09/guidelines/brand-icons.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-motion.card.html` → `archive/proposal-2026-09/guidelines/brand-motion.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-seal.card.html` → `archive/proposal-2026-09/guidelines/brand-seal.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-states.card.html` → `archive/proposal-2026-09/guidelines/brand-states.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/brand-surfaces.card.html` → `archive/proposal-2026-09/guidelines/brand-surfaces.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-aliases.card.html` → `archive/proposal-2026-09/guidelines/color-aliases.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-brand.card.html` → `archive/proposal-2026-09/guidelines/color-brand.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-bronze.card.html` → `archive/proposal-2026-09/guidelines/color-bronze.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-ink.card.html` → `archive/proposal-2026-09/guidelines/color-ink.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-parchment.card.html` → `archive/proposal-2026-09/guidelines/color-parchment.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/color-semantic.card.html` → `archive/proposal-2026-09/guidelines/color-semantic.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/spacing-rhythm.card.html` → `archive/proposal-2026-09/guidelines/spacing-rhythm.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/spacing-scale.card.html` → `archive/proposal-2026-09/guidelines/spacing-scale.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-body.card.html` → `archive/proposal-2026-09/guidelines/type-body.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-display.card.html` → `archive/proposal-2026-09/guidelines/type-display.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-eyebrow.card.html` → `archive/proposal-2026-09/guidelines/type-eyebrow.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-latin.card.html` → `archive/proposal-2026-09/guidelines/type-latin.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-numerals.card.html` → `archive/proposal-2026-09/guidelines/type-numerals.card.html`.
- Moved `TIANSIGHT 侍天 Design System/guidelines/type-scale.card.html` → `archive/proposal-2026-09/guidelines/type-scale.card.html`.
- Moved `TIANSIGHT 侍天 Design System/readme.md` → `archive/proposal-2026-09/readme.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/ChartSlide.d.ts` → `archive/proposal-2026-09/slides/ChartSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/ChartSlide.jsx` → `archive/proposal-2026-09/slides/ChartSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/ChartSlide.prompt.md` → `archive/proposal-2026-09/slides/ChartSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/ContactSlide.d.ts` → `archive/proposal-2026-09/slides/ContactSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/ContactSlide.jsx` → `archive/proposal-2026-09/slides/ContactSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/ContactSlide.prompt.md` → `archive/proposal-2026-09/slides/ContactSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/ExpertTeamSlide.d.ts` → `archive/proposal-2026-09/slides/ExpertTeamSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/ExpertTeamSlide.jsx` → `archive/proposal-2026-09/slides/ExpertTeamSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/ExpertTeamSlide.prompt.md` → `archive/proposal-2026-09/slides/ExpertTeamSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/FiveQuestionsSlide.d.ts` → `archive/proposal-2026-09/slides/FiveQuestionsSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/FiveQuestionsSlide.jsx` → `archive/proposal-2026-09/slides/FiveQuestionsSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/FiveQuestionsSlide.prompt.md` → `archive/proposal-2026-09/slides/FiveQuestionsSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/LadderSlide.d.ts` → `archive/proposal-2026-09/slides/LadderSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/LadderSlide.jsx` → `archive/proposal-2026-09/slides/LadderSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/LadderSlide.prompt.md` → `archive/proposal-2026-09/slides/LadderSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/PartnerWallSlide.d.ts` → `archive/proposal-2026-09/slides/PartnerWallSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/PartnerWallSlide.jsx` → `archive/proposal-2026-09/slides/PartnerWallSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/PartnerWallSlide.prompt.md` → `archive/proposal-2026-09/slides/PartnerWallSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/PromiseSlide.d.ts` → `archive/proposal-2026-09/slides/PromiseSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/PromiseSlide.jsx` → `archive/proposal-2026-09/slides/PromiseSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/PromiseSlide.prompt.md` → `archive/proposal-2026-09/slides/PromiseSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/ProofSlide.d.ts` → `archive/proposal-2026-09/slides/ProofSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/ProofSlide.jsx` → `archive/proposal-2026-09/slides/ProofSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/ProofSlide.prompt.md` → `archive/proposal-2026-09/slides/ProofSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/README.md` → `archive/proposal-2026-09/slides/README.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/SectionSlide.d.ts` → `archive/proposal-2026-09/slides/SectionSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/SectionSlide.jsx` → `archive/proposal-2026-09/slides/SectionSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/SectionSlide.prompt.md` → `archive/proposal-2026-09/slides/SectionSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/SlideFrame.d.ts` → `archive/proposal-2026-09/slides/SlideFrame.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/SlideFrame.jsx` → `archive/proposal-2026-09/slides/SlideFrame.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/SlideFrame.prompt.md` → `archive/proposal-2026-09/slides/SlideFrame.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/TitleSlide.d.ts` → `archive/proposal-2026-09/slides/TitleSlide.d.ts`.
- Moved `TIANSIGHT 侍天 Design System/slides/TitleSlide.jsx` → `archive/proposal-2026-09/slides/TitleSlide.jsx`.
- Moved `TIANSIGHT 侍天 Design System/slides/TitleSlide.prompt.md` → `archive/proposal-2026-09/slides/TitleSlide.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System/slides/chart.card.html` → `archive/proposal-2026-09/slides/chart.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/contact.card.html` → `archive/proposal-2026-09/slides/contact.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/deck-stage.js` → `archive/proposal-2026-09/slides/deck-stage.js`.
- Moved `TIANSIGHT 侍天 Design System/slides/experts.card.html` → `archive/proposal-2026-09/slides/experts.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/five.card.html` → `archive/proposal-2026-09/slides/five.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/index.html` → `archive/proposal-2026-09/slides/index.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/ladder.card.html` → `archive/proposal-2026-09/slides/ladder.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/partners.card.html` → `archive/proposal-2026-09/slides/partners.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/promise.card.html` → `archive/proposal-2026-09/slides/promise.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/proof.card.html` → `archive/proposal-2026-09/slides/proof.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/section.card.html` → `archive/proposal-2026-09/slides/section.card.html`.
- Moved `TIANSIGHT 侍天 Design System/slides/title.card.html` → `archive/proposal-2026-09/slides/title.card.html`.
- Moved `TIANSIGHT 侍天 Design System/styles.css` → `archive/proposal-2026-09/styles.css`.
- Moved `TIANSIGHT 侍天 Design System/templates/sales-deck/SalesDeck.dc.html` → `archive/proposal-2026-09/templates/sales-deck/SalesDeck.dc.html`.
- Moved `TIANSIGHT 侍天 Design System/templates/sales-deck/ds-base.js` → `archive/proposal-2026-09/templates/sales-deck/ds-base.js`.
- Moved `TIANSIGHT 侍天 Design System/templates/sales-deck/support.js` → `archive/proposal-2026-09/templates/sales-deck/support.js`.
- Moved `TIANSIGHT 侍天 Design System/thumbnail.html` → `archive/proposal-2026-09/thumbnail.html`.
- Moved `TIANSIGHT 侍天 Design System/tokens/base.css` → `archive/proposal-2026-09/tokens/base.css`.
- Moved `TIANSIGHT 侍天 Design System/tokens/colors.css` → `archive/proposal-2026-09/tokens/colors.css`.
- Moved `TIANSIGHT 侍天 Design System/tokens/fonts.css` → `archive/proposal-2026-09/tokens/fonts.css`.
- Moved `TIANSIGHT 侍天 Design System/tokens/layout.css` → `archive/proposal-2026-09/tokens/layout.css`.
- Moved `TIANSIGHT 侍天 Design System/tokens/typography.css` → `archive/proposal-2026-09/tokens/typography.css`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/AnalysisPage.jsx` → `archive/proposal-2026-09/ui_kits/report/AnalysisPage.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/DecisionPage.jsx` → `archive/proposal-2026-09/ui_kits/report/DecisionPage.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/MethodMapPage.jsx` → `archive/proposal-2026-09/ui_kits/report/MethodMapPage.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/README.md` → `archive/proposal-2026-09/ui_kits/report/README.md`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/ReportShell.jsx` → `archive/proposal-2026-09/ui_kits/report/ReportShell.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/TrendPage.jsx` → `archive/proposal-2026-09/ui_kits/report/TrendPage.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/report/index.html` → `archive/proposal-2026-09/ui_kits/report/index.html`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/ClosingCTA.jsx` → `archive/proposal-2026-09/ui_kits/website/ClosingCTA.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/FiveQuestions.jsx` → `archive/proposal-2026-09/ui_kits/website/FiveQuestions.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/HomeHero.jsx` → `archive/proposal-2026-09/ui_kits/website/HomeHero.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/Partners.jsx` → `archive/proposal-2026-09/ui_kits/website/Partners.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/PartnersPage.jsx` → `archive/proposal-2026-09/ui_kits/website/PartnersPage.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/README.md` → `archive/proposal-2026-09/ui_kits/website/README.md`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/ReportProof.jsx` → `archive/proposal-2026-09/ui_kits/website/ReportProof.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/ServiceLadder.jsx` → `archive/proposal-2026-09/ui_kits/website/ServiceLadder.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/SiteHeader.jsx` → `archive/proposal-2026-09/ui_kits/website/SiteHeader.jsx`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/index.html` → `archive/proposal-2026-09/ui_kits/website/index.html`.
- Moved `TIANSIGHT 侍天 Design System/ui_kits/website/partners.html` → `archive/proposal-2026-09/ui_kits/website/partners.html`.
- Moved `TIANSIGHT 侍天 Design System/uploads/侍天-透明-页眉.png` → `archive/proposal-2026-09/uploads/侍天-透明-页眉.png`.
- Moved `TIANSIGHT 侍天 Design System/RUNTIME-STATUS.md` → `archive/proposal-v0.7/RUNTIME-STATUS.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/SKILL.md` → `archive/proposal-v0.7/SKILL.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/assets/icons.svg` → `archive/proposal-v0.7/assets/icons.svg`.
- Moved `TIANSIGHT 侍天 Design System v0.7/assets/logo.png` → `archive/proposal-v0.7/assets/logo.png`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/VERSION` → `archive/proposal-v0.7/brand/VERSION`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/base.css` → `archive/proposal-v0.7/brand/base.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/components.css` → `archive/proposal-v0.7/brand/components.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/fonts.css` → `archive/proposal-v0.7/brand/fonts.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/guide.md` → `archive/proposal-v0.7/brand/guide.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/icons.svg` → `archive/proposal-v0.7/brand/icons.svg`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/index.html` → `archive/proposal-v0.7/brand/index.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/logo.png` → `archive/proposal-v0.7/brand/logo.png`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/source.json` → `archive/proposal-v0.7/brand/source.json`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/tokens.css` → `archive/proposal-v0.7/brand/tokens.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/brand/tokens.json` → `archive/proposal-v0.7/brand/tokens.json`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Badge.d.ts` → `archive/proposal-v0.7/components/core/Badge.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Badge.jsx` → `archive/proposal-v0.7/components/core/Badge.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Badge.prompt.md` → `archive/proposal-v0.7/components/core/Badge.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Button.d.ts` → `archive/proposal-v0.7/components/core/Button.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Button.jsx` → `archive/proposal-v0.7/components/core/Button.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Button.prompt.md` → `archive/proposal-v0.7/components/core/Button.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Card.d.ts` → `archive/proposal-v0.7/components/core/Card.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Card.jsx` → `archive/proposal-v0.7/components/core/Card.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Card.prompt.md` → `archive/proposal-v0.7/components/core/Card.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/CheckList.d.ts` → `archive/proposal-v0.7/components/core/CheckList.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/CheckList.jsx` → `archive/proposal-v0.7/components/core/CheckList.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/CheckList.prompt.md` → `archive/proposal-v0.7/components/core/CheckList.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/HeadingPair.d.ts` → `archive/proposal-v0.7/components/core/HeadingPair.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/HeadingPair.jsx` → `archive/proposal-v0.7/components/core/HeadingPair.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/HeadingPair.prompt.md` → `archive/proposal-v0.7/components/core/HeadingPair.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Mark.d.ts` → `archive/proposal-v0.7/components/core/Mark.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Mark.jsx` → `archive/proposal-v0.7/components/core/Mark.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Mark.prompt.md` → `archive/proposal-v0.7/components/core/Mark.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Quote.d.ts` → `archive/proposal-v0.7/components/core/Quote.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Quote.jsx` → `archive/proposal-v0.7/components/core/Quote.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Quote.prompt.md` → `archive/proposal-v0.7/components/core/Quote.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/SealStamp.d.ts` → `archive/proposal-v0.7/components/core/SealStamp.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/SealStamp.jsx` → `archive/proposal-v0.7/components/core/SealStamp.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/SealStamp.prompt.md` → `archive/proposal-v0.7/components/core/SealStamp.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Stat.d.ts` → `archive/proposal-v0.7/components/core/Stat.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Stat.jsx` → `archive/proposal-v0.7/components/core/Stat.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Stat.prompt.md` → `archive/proposal-v0.7/components/core/Stat.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Step.d.ts` → `archive/proposal-v0.7/components/core/Step.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Step.jsx` → `archive/proposal-v0.7/components/core/Step.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Step.prompt.md` → `archive/proposal-v0.7/components/core/Step.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Tag.d.ts` → `archive/proposal-v0.7/components/core/Tag.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Tag.jsx` → `archive/proposal-v0.7/components/core/Tag.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/Tag.prompt.md` → `archive/proposal-v0.7/components/core/Tag.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/core/core.card.html` → `archive/proposal-v0.7/components/core/core.card.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/LedgerTable.d.ts` → `archive/proposal-v0.7/components/data/LedgerTable.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/LedgerTable.jsx` → `archive/proposal-v0.7/components/data/LedgerTable.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/LedgerTable.prompt.md` → `archive/proposal-v0.7/components/data/LedgerTable.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/TokenRow.d.ts` → `archive/proposal-v0.7/components/data/TokenRow.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/TokenRow.jsx` → `archive/proposal-v0.7/components/data/TokenRow.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/TokenRow.prompt.md` → `archive/proposal-v0.7/components/data/TokenRow.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/data/data.card.html` → `archive/proposal-v0.7/components/data/data.card.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Dialog.d.ts` → `archive/proposal-v0.7/components/feedback/Dialog.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Dialog.jsx` → `archive/proposal-v0.7/components/feedback/Dialog.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Dialog.prompt.md` → `archive/proposal-v0.7/components/feedback/Dialog.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Disclosure.d.ts` → `archive/proposal-v0.7/components/feedback/Disclosure.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Disclosure.jsx` → `archive/proposal-v0.7/components/feedback/Disclosure.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Disclosure.prompt.md` → `archive/proposal-v0.7/components/feedback/Disclosure.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Notice.d.ts` → `archive/proposal-v0.7/components/feedback/Notice.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Notice.jsx` → `archive/proposal-v0.7/components/feedback/Notice.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Notice.prompt.md` → `archive/proposal-v0.7/components/feedback/Notice.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Progress.d.ts` → `archive/proposal-v0.7/components/feedback/Progress.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Progress.jsx` → `archive/proposal-v0.7/components/feedback/Progress.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Progress.prompt.md` → `archive/proposal-v0.7/components/feedback/Progress.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Tooltip.d.ts` → `archive/proposal-v0.7/components/feedback/Tooltip.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Tooltip.jsx` → `archive/proposal-v0.7/components/feedback/Tooltip.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/Tooltip.prompt.md` → `archive/proposal-v0.7/components/feedback/Tooltip.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/feedback/feedback.card.html` → `archive/proposal-v0.7/components/feedback/feedback.card.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/forms/Field.d.ts` → `archive/proposal-v0.7/components/forms/Field.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/forms/Field.jsx` → `archive/proposal-v0.7/components/forms/Field.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/forms/Field.prompt.md` → `archive/proposal-v0.7/components/forms/Field.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/forms/forms.card.html` → `archive/proposal-v0.7/components/forms/forms.card.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Breadcrumb.d.ts` → `archive/proposal-v0.7/components/navigation/Breadcrumb.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Breadcrumb.jsx` → `archive/proposal-v0.7/components/navigation/Breadcrumb.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Breadcrumb.prompt.md` → `archive/proposal-v0.7/components/navigation/Breadcrumb.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Nav.d.ts` → `archive/proposal-v0.7/components/navigation/Nav.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Nav.jsx` → `archive/proposal-v0.7/components/navigation/Nav.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Nav.prompt.md` → `archive/proposal-v0.7/components/navigation/Nav.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Pagination.d.ts` → `archive/proposal-v0.7/components/navigation/Pagination.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Pagination.jsx` → `archive/proposal-v0.7/components/navigation/Pagination.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Pagination.prompt.md` → `archive/proposal-v0.7/components/navigation/Pagination.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Tabs.d.ts` → `archive/proposal-v0.7/components/navigation/Tabs.d.ts`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Tabs.jsx` → `archive/proposal-v0.7/components/navigation/Tabs.jsx`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/Tabs.prompt.md` → `archive/proposal-v0.7/components/navigation/Tabs.prompt.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/components/navigation/navigation.card.html` → `archive/proposal-v0.7/components/navigation/navigation.card.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/brand-lockup.html` → `archive/proposal-v0.7/guidelines/brand-lockup.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/brand-mark.html` → `archive/proposal-v0.7/guidelines/brand-mark.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/brand-seal.html` → `archive/proposal-v0.7/guidelines/brand-seal.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/brand-voice.html` → `archive/proposal-v0.7/guidelines/brand-voice.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-charts.html` → `archive/proposal-v0.7/guidelines/color-charts.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-gold-ramp.html` → `archive/proposal-v0.7/guidelines/color-gold-ramp.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-gold-seal.html` → `archive/proposal-v0.7/guidelines/color-gold-seal.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-lines.html` → `archive/proposal-v0.7/guidelines/color-lines.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-published.html` → `archive/proposal-v0.7/guidelines/color-published.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/color-ratios.html` → `archive/proposal-v0.7/guidelines/color-ratios.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/example.html` → `archive/proposal-v0.7/guidelines/example.html`.
- Moved `docs/claude-design-system/principles.md` → `archive/proposal-v0.7/guidelines/principles.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/quickstart.md` → `archive/proposal-v0.7/guidelines/quickstart.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/shadow-motion.html` → `archive/proposal-v0.7/guidelines/shadow-motion.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/spacing-layout.html` → `archive/proposal-v0.7/guidelines/spacing-layout.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/spacing-scale.html` → `archive/proposal-v0.7/guidelines/spacing-scale.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/type-cn.html` → `archive/proposal-v0.7/guidelines/type-cn.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/type-en-caption.html` → `archive/proposal-v0.7/guidelines/type-en-caption.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/type-mono.html` → `archive/proposal-v0.7/guidelines/type-mono.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/type-tagline.html` → `archive/proposal-v0.7/guidelines/type-tagline.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/guidelines/type-ui-steps.html` → `archive/proposal-v0.7/guidelines/type-ui-steps.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/people/blocks.html` → `archive/proposal-v0.7/people/blocks.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/people/people.css` → `archive/proposal-v0.7/people/people.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/people/people.json` → `archive/proposal-v0.7/people/people.json`.
- Moved `TIANSIGHT 侍天 Design System v0.7/readme.md` → `archive/proposal-v0.7/readme.md`.
- Moved `TIANSIGHT 侍天 Design System v0.7/styles.css` → `archive/proposal-v0.7/styles.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/tokens/v07-rulings.css` → `archive/proposal-v0.7/tokens/v07-rulings.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/tokens/webfonts.css` → `archive/proposal-v0.7/tokens/webfonts.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/deck/deck.css` → `archive/proposal-v0.7/ui_kits/deck/deck.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/deck/deck.js` → `archive/proposal-v0.7/ui_kits/deck/deck.js`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/deck/index.html` → `archive/proposal-v0.7/ui_kits/deck/index.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/report/index.html` → `archive/proposal-v0.7/ui_kits/report/index.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/report/report.css` → `archive/proposal-v0.7/ui_kits/report/report.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/report/report.js` → `archive/proposal-v0.7/ui_kits/report/report.js`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/website/index.html` → `archive/proposal-v0.7/ui_kits/website/index.html`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/website/site.css` → `archive/proposal-v0.7/ui_kits/website/site.css`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/website/site.js` → `archive/proposal-v0.7/ui_kits/website/site.js`.
- Moved `TIANSIGHT 侍天 Design System v0.7/ui_kits/website/team.html` → `archive/proposal-v0.7/ui_kits/website/team.html`.
- Moved `assets/intro/deck/case-01.jpg` → `assets/cases/case-01/case-01.jpg`.
- Moved `assets/intro/deck/case-02.jpg` → `assets/cases/case-02/case-02.jpg`.
- Moved `assets/intro/deck/case-03.jpg` → `assets/cases/case-03/case-03.jpg`.
- Moved `assets/intro/deck/case-04.jpg` → `assets/cases/case-04/case-04.jpg`.
- Moved `assets/intro/deck/case-05.jpg` → `assets/cases/case-05/case-05.jpg`.
- Moved `assets/intro/deck/case-06.jpg` → `assets/cases/case-06/case-06.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-1.jpg` → `assets/cases/case-06/yyjm-1.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-2.jpg` → `assets/cases/case-06/yyjm-2.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-3.jpg` → `assets/cases/case-06/yyjm-3.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-4.jpg` → `assets/cases/case-06/yyjm-4.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-5.jpg` → `assets/cases/case-06/yyjm-5.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/case/yyjm-6.jpg` → `assets/cases/case-06/yyjm-6.jpg`.
- Moved `assets/intro/deck/case-07.jpg` → `assets/cases/case-07/case-07.jpg`.
- Moved `assets/intro/deck/case-08.jpg` → `assets/cases/case-08/case-08.jpg`.
- Moved `assets/intro/deck/cover.jpg` → `assets/deck/cover.jpg`.
- Moved `assets/intro/deck/module-1.jpg` → `assets/deck/module-1.jpg`.
- Moved `assets/intro/deck/module-2.jpg` → `assets/deck/module-2.jpg`.
- Moved `assets/intro/deck/module-3.jpg` → `assets/deck/module-3.jpg`.
- Moved `assets/intro/deck/module-4.jpg` → `assets/deck/module-4.jpg`.
- Moved `assets/intro/deck/section-1.jpg` → `assets/deck/section-1.jpg`.
- Moved `assets/intro/deck/section-2.jpg` → `assets/deck/section-2.jpg`.
- Moved `assets/intro/deck/section-3.jpg` → `assets/deck/section-3.jpg`.
- Moved `assets/intro/deck/statement-data.jpg` → `assets/deck/statement-data.jpg`.
- Moved `assets/intro/deck/statement-decision.jpg` → `assets/deck/statement-decision.jpg`.
- Moved `assets/intro/deck/statement-problem.jpg` → `assets/deck/statement-problem.jpg`.
- Moved `assets/intro/deck/statement-proof.jpg` → `assets/deck/statement-proof.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/brand-wall.jpg` → `assets/exhibit/brand-wall.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-01-cover.jpg` → `assets/exhibit/ex-01-cover.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-03-sec-dining.jpg` → `assets/exhibit/ex-03-sec-dining.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-04-sec-display.jpg` → `assets/exhibit/ex-04-sec-display.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-05-sec-boh.jpg` → `assets/exhibit/ex-05-sec-boh.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-06-sec-equipment.jpg` → `assets/exhibit/ex-06-sec-equipment.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-07-sec-delivery.jpg` → `assets/exhibit/ex-07-sec-delivery.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/gen/ex-08-sec-team.jpg` → `assets/exhibit/ex-08-sec-team.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/hotels.jpg` → `assets/exhibit/hotels.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-boh1.jpg` → `assets/exhibit/m-boh1.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-boh2.jpg` → `assets/exhibit/m-boh2.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-detail.jpg` → `assets/exhibit/m-detail.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-island.jpg` → `assets/exhibit/m-island.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-mingdang.jpg` → `assets/exhibit/m-mingdang.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/m-pass.jpg` → `assets/exhibit/m-pass.jpg`.
- Moved `deliverables/exhibit-design/src/exhibit/src/p9-1.jpg` → `assets/exhibit/p9-1.jpg`.
- Deleted `assets/fonts/OFL-IBMPlexMono.txt`.
- Deleted `assets/fonts/OFL-NotoSerif.txt`.
- Deleted `assets/fonts/OFL-NotoSerifSC.txt`.
- Deleted `assets/fonts/README.md`.
- Deleted `assets/fonts/font-01d285447409c8a588692162.woff2`.
- Deleted `assets/fonts/font-039698b9bc16db3439b86528.woff2`.
- Deleted `assets/fonts/font-03de62bc4c94fcf00ad2a87e.woff2`.
- Deleted `assets/fonts/font-08949f728dc52d528e69b166.woff2`.
- Deleted `assets/fonts/font-09248b343e7220ab8786b907.woff2`.
- Deleted `assets/fonts/font-0a97bd54c22add0ce1fd5425.woff2`.
- Deleted `assets/fonts/font-0eb731d70aa1f4966dfffab3.woff2`.
- Deleted `assets/fonts/font-0f39f0bbe9a7a450b994c3c3.woff2`.
- Deleted `assets/fonts/font-106e18d90034e75630790ad2.woff2`.
- Deleted `assets/fonts/font-10d846c3e11659c57d906ae2.woff2`.
- Deleted `assets/fonts/font-1252037b6f1d6e86c49f59cd.woff2`.
- Deleted `assets/fonts/font-139765926260131beb5763bb.woff2`.
- Deleted `assets/fonts/font-1581af3bbb4e78f52db3b107.woff2`.
- Deleted `assets/fonts/font-158a0be2cbba07d17824a5ba.woff2`.
- Deleted `assets/fonts/font-1594e53f4ab5fe067f7ba108.woff2`.
- Deleted `assets/fonts/font-16b43b96dc859eaf9b6f2ee8.woff2`.
- Deleted `assets/fonts/font-1a6cc82f2ce03f8bbc6c78ad.woff2`.
- Deleted `assets/fonts/font-1bd7a4092909a57cf3f2df1f.woff2`.
- Deleted `assets/fonts/font-1d89462e86cb8e87e7e9d6f6.woff2`.
- Deleted `assets/fonts/font-2101d62af080d6803513f4fe.woff2`.
- Deleted `assets/fonts/font-2263f0841a3499dd34793a4b.woff2`.
- Deleted `assets/fonts/font-2392f5989457174e847cc69a.woff2`.
- Deleted `assets/fonts/font-24f7302e65f8adaec36d642a.woff2`.
- Deleted `assets/fonts/font-2654f8d1261a420fc8162812.woff2`.
- Deleted `assets/fonts/font-26b9dec17f125371d5f5089f.woff2`.
- Deleted `assets/fonts/font-28858c6c597253c4488e0ce1.woff2`.
- Deleted `assets/fonts/font-2a55b026bb206504dc94a3fa.woff2`.
- Deleted `assets/fonts/font-2ac76686e472db28292edcc2.woff2`.
- Deleted `assets/fonts/font-2db79fd3aa1d48c07e306645.woff2`.
- Deleted `assets/fonts/font-30691665669ee807f465d552.woff2`.
- Deleted `assets/fonts/font-3616d3502701dcdf867d0c85.woff2`.
- Deleted `assets/fonts/font-365512ffc9e2717c81cf5d9a.woff2`.
- Deleted `assets/fonts/font-373d1b4d724f4ee5fa02eb5e.woff2`.
- Deleted `assets/fonts/font-3f116c05fbb0abc3fba86bb8.woff2`.
- Deleted `assets/fonts/font-3febe5c7f22e4b07b4552738.woff2`.
- Deleted `assets/fonts/font-405f96fc00f5de66a1104587.woff2`.
- Deleted `assets/fonts/font-44c0c56034f2906014cd0082.woff2`.
- Deleted `assets/fonts/font-45cb9a16cbc13eff333b49bf.woff2`.
- Deleted `assets/fonts/font-45f3ed82e9bd8231532b58a0.woff2`.
- Deleted `assets/fonts/font-46281456234014ceb2a79bff.woff2`.
- Deleted `assets/fonts/font-4665f9383f65a4fb003c5380.woff2`.
- Deleted `assets/fonts/font-4851e60df7e67b489609516b.woff2`.
- Deleted `assets/fonts/font-4b59ce2a13d696b34950c628.woff2`.
- Deleted `assets/fonts/font-4e943fdd06982ac9a81d1928.woff2`.
- Deleted `assets/fonts/font-4fb8ac1d7a95c72aa66de767.woff2`.
- Deleted `assets/fonts/font-50751cd23b3787eff2af23d3.woff2`.
- Deleted `assets/fonts/font-52740303931d8b85ab952907.woff2`.
- Deleted `assets/fonts/font-5392252c91bd0707d647df33.woff2`.
- Deleted `assets/fonts/font-54e3bd0c4a002b0f76bf9c75.woff2`.
- Deleted `assets/fonts/font-585d109a9951bf6a99b13386.woff2`.
- Deleted `assets/fonts/font-5945538dcbfc11c1db2d573e.woff2`.
- Deleted `assets/fonts/font-5968dd127304a59f1e2ea36b.woff2`.
- Deleted `assets/fonts/font-5b42c53aa93cc2a7fd855c85.woff2`.
- Deleted `assets/fonts/font-5c818243ce70b138c5e7edd2.woff2`.
- Deleted `assets/fonts/font-60bae2b9a8bf65e1b4c1a06d.woff2`.
- Deleted `assets/fonts/font-60e71123f0b838bf4fd52cb5.woff2`.
- Deleted `assets/fonts/font-62632b6375305e70ddcafdd8.woff2`.
- Deleted `assets/fonts/font-675553f67dda471ccc684b73.woff2`.
- Deleted `assets/fonts/font-6b583a41d620c6b504ce9d45.woff2`.
- Deleted `assets/fonts/font-6b91a10abb4a03d31c63d528.woff2`.
- Deleted `assets/fonts/font-6bb06407c97584b0867a959e.woff2`.
- Deleted `assets/fonts/font-6bc0f226a5b7884a8170e3f6.woff2`.
- Deleted `assets/fonts/font-6e0e93e30ac6e513ffdb1e5d.woff2`.
- Deleted `assets/fonts/font-6f05dd92f2f040024ed6f401.woff2`.
- Deleted `assets/fonts/font-713d2bb29db38602e97e272b.woff2`.
- Deleted `assets/fonts/font-7635422bd10ddbbcb0e0caa1.woff2`.
- Deleted `assets/fonts/font-781633d95de88040fb77141d.woff2`.
- Deleted `assets/fonts/font-7bf7c8fd9809004cba36338a.woff2`.
- Deleted `assets/fonts/font-7c7afb20d33e30ec38245187.woff2`.
- Deleted `assets/fonts/font-7e94834579a87ac5bbeae3c8.woff2`.
- Deleted `assets/fonts/font-80938d29c0efdbd634308ac5.woff2`.
- Deleted `assets/fonts/font-8164af476b514e30654ecf3a.woff2`.
- Deleted `assets/fonts/font-854a14f63241e795bc8a17e6.woff2`.
- Deleted `assets/fonts/font-87fdad598fb7ab598784e43f.woff2`.
- Deleted `assets/fonts/font-8d51258200de4d85d209eac6.woff2`.
- Deleted `assets/fonts/font-90a9d9858975f1c073521af5.woff2`.
- Deleted `assets/fonts/font-91923c87f9f32c46056285e6.woff2`.
- Deleted `assets/fonts/font-92b93561d8af277543529189.woff2`.
- Deleted `assets/fonts/font-93daeb451edfe65dad18a468.woff2`.
- Deleted `assets/fonts/font-952351694a0ada3a721a73de.woff2`.
- Deleted `assets/fonts/font-9826143bb6278155de4f7691.woff2`.
- Deleted `assets/fonts/font-98eb7841a02d362b6b926466.woff2`.
- Deleted `assets/fonts/font-9a03bacc0425e420573fa8ba.woff2`.
- Deleted `assets/fonts/font-9b3f4c4ff3adefd2476a2ac2.woff2`.
- Deleted `assets/fonts/font-9d345b17ad128918a7d4eea6.woff2`.
- Deleted `assets/fonts/font-9fa23b6cf30829d06600bda4.woff2`.
- Deleted `assets/fonts/font-a1e18c863c00ab7e6f17fddc.woff2`.
- Deleted `assets/fonts/font-a4557ab88bbc6bb5272d3154.woff2`.
- Deleted `assets/fonts/font-a491a10a853d1fb3480d4471.woff2`.
- Deleted `assets/fonts/font-a5fdbb67e3dadebda5b447c1.woff2`.
- Deleted `assets/fonts/font-a7386f772de25b62a3a449fa.woff2`.
- Deleted `assets/fonts/font-a8e46481396f2a9e4ac4875b.woff2`.
- Deleted `assets/fonts/font-ab7aef1b30a10f6643f3271c.woff2`.
- Deleted `assets/fonts/font-aba77127699e71bc7d13fd80.woff2`.
- Deleted `assets/fonts/font-ae54f03733db84abcacd43c9.woff2`.
- Deleted `assets/fonts/font-b07e7e5e090ed9220e5fd4af.woff2`.
- Deleted `assets/fonts/font-b36a86aa9d07ae91a379ef06.woff2`.
- Deleted `assets/fonts/font-b677122aea77998b4b6c991c.woff2`.
- Deleted `assets/fonts/font-b9df2ce5d328a524975728c0.woff2`.
- Deleted `assets/fonts/font-ba142270184772c2bbc1985b.woff2`.
- Deleted `assets/fonts/font-ba9fbd7fdbf7cce92c1a9594.woff2`.
- Deleted `assets/fonts/font-bb4982fa7f34b1814c5c1add.woff2`.
- Deleted `assets/fonts/font-bca8897bbf2ee33d854e2d2c.woff2`.
- Deleted `assets/fonts/font-beb4eb845df30631a69e29a0.woff2`.
- Deleted `assets/fonts/font-bf628db08549cbf5090c3486.woff2`.
- Deleted `assets/fonts/font-c56fed07baa5368c483c00d7.woff2`.
- Deleted `assets/fonts/font-c5cbbb60e77f863af35524ec.woff2`.
- Deleted `assets/fonts/font-c940bed82b2192c9a436af93.woff2`.
- Deleted `assets/fonts/font-ca078411ddf19a164747d6e2.woff2`.
- Deleted `assets/fonts/font-cad6d79ef7a000ed533559c0.woff2`.
- Deleted `assets/fonts/font-cc967469ff60e3386f8fc664.woff2`.
- Deleted `assets/fonts/font-cfabb52e72825965ec66b18b.woff2`.
- Deleted `assets/fonts/font-d4a6aba2cb4636b371991a19.woff2`.
- Deleted `assets/fonts/font-d4ba29a42d58e9c71f523225.woff2`.
- Deleted `assets/fonts/font-d6e6ed7b0a14b508f94072ae.woff2`.
- Deleted `assets/fonts/font-d8f48bbf844eadbaa2e3db64.woff2`.
- Deleted `assets/fonts/font-dc5909d502de13c096a9d4b6.woff2`.
- Deleted `assets/fonts/font-e50204d9c99dee1b284a8f5c.woff2`.
- Deleted `assets/fonts/font-ebda2b19fc7a325ab200e073.woff2`.
- Deleted `assets/fonts/font-ef454fca50875c2536bfbcf4.woff2`.
- Deleted `assets/fonts/font-f0dbe158fa641cc4297af81a.woff2`.
- Deleted `assets/fonts/font-f0e12f7e577876bf2d554e92.woff2`.
- Deleted `assets/fonts/font-f402c381cb2eb5c6d1e65a8b.woff2`.
- Deleted `assets/fonts/font-f43c00b1e7e213add01d19ee.woff2`.
- Deleted `assets/fonts/font-f69a03144d47d4987530030e.woff2`.
- Deleted `assets/fonts/font-f8c22ec1804bd6966b70f43a.woff2`.
- Deleted `assets/fonts/font-fb6a5ed734c2fbe39794a1e1.woff2`.
- Deleted `assets/fonts/sources.json`.
- Deleted `assets/logo-seal.png`.
- Moved `assets/icons.svg` → `assets/logo/icons.svg`.
- Moved `assets/logo.png` → `assets/logo/logo.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/supplied-logo-seal.png` → `assets/logo/supplied-logo-seal.png`.
- Moved `assets/intro/partners/3699.png` → `assets/partners/3699.png`.
- Moved `assets/intro/partners/chaofa.png` → `assets/partners/chaofa.png`.
- Moved `assets/intro/partners/qingshuiting.png` → `assets/partners/qingshuiting.png`.
- Moved `assets/intro/partners/shitou.png` → `assets/partners/shitou.png`.
- Moved `assets/intro/partners/subangyuan.png` → `assets/partners/subangyuan.png`.
- Moved `assets/intro/partners/wuyutai.png` → `assets/partners/wuyutai.png`.
- Moved `assets/intro/partners/youyuanjingmeng.png` → `assets/partners/youyuanjingmeng.png`.
- Moved `assets/intro/partners/yun1980.png` → `assets/partners/yun1980.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/people/bianjiang.png` → `assets/people/bianjiang.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/people/guofeng.png` → `assets/people/guofeng.png`.
- Moved `assets/intro/people/bianjiang.png` → `assets/people/intro/bianjiang.png`.
- Moved `assets/intro/people/guofeng.png` → `assets/people/intro/guofeng.png`.
- Moved `assets/intro/people/liquanchao.png` → `assets/people/intro/liquanchao.png`.
- Moved `assets/intro/people/wechat-qr.png` → `assets/people/intro/wechat-qr.png`.
- Moved `assets/intro/people/yuxiangdong.png` → `assets/people/intro/yuxiangdong.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/people/liquanchao.png` → `assets/people/liquanchao.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/wechat-qr.png` → `assets/people/wechat-qr.png`.
- Moved `dist/components/2026.10.21-e0a760/assets/people/yuxiangdong.png` → `assets/people/yuxiangdong.png`.
- Moved `deliverables/lifecycle-map/previews/3d.png` → `assets/screens/3d.png`.
- Moved `assets/intro/deck/dashboard-1.jpg` → `assets/screens/dashboard-1.jpg`.
- Moved `assets/intro/deck/dashboard-2.jpg` → `assets/screens/dashboard-2.jpg`.
- Moved `assets/intro/deck/dashboard-3.jpg` → `assets/screens/dashboard-3.jpg`.
- Moved `assets/intro/deck/dashboard-4.jpg` → `assets/screens/dashboard-4.jpg`.
- Moved `deliverables/lifecycle-map/previews/gantt.png` → `assets/screens/gantt.png`.
- Moved `deliverables/lifecycle-map/previews/map.png` → `assets/screens/map.png`.
- Moved `assets/intro/deck/mobile-review.jpg` → `assets/screens/mobile-review.jpg`.
- Moved `assets/intro/deck/penetration-matrix.jpg` → `assets/screens/penetration-matrix.jpg`.
- Moved `assets/intro/deck/price-band-gap.jpg` → `assets/screens/price-band-gap.jpg`.
- Moved `assets/intro/deck/profit-sensitivity.jpg` → `assets/screens/profit-sensitivity.jpg`.
- Moved `assets/intro/deck/report-page-1.jpg` → `assets/screens/report-page-1.jpg`.
- Moved `assets/intro/deck/report-page-2.jpg` → `assets/screens/report-page-2.jpg`.
- Moved `assets/intro/deck/report-page-3.jpg` → `assets/screens/report-page-3.jpg`.
- Moved `assets/intro/deck/repurchase-quadrant.jpg` → `assets/screens/repurchase-quadrant.jpg`.
- Moved `assets/intro/deck/trade-area-supply.jpg` → `assets/screens/trade-area-supply.jpg`.
- Deleted `components/RUNTIME-STATUS.md`.
- Deleted `content/slide-catalog.js`.
- Deleted `deliverables/company-intro-v3/README.md`.
- Deleted `deliverables/company-intro-v3/company-intro-v3.pdf`.
- Deleted `deliverables/company-intro-v3/deck.json`.
- Deleted `deliverables/company-intro-v3/gen/assets.json`.
- Deleted `deliverables/company-intro-v3/gen/gen.py`.
- Deleted `deliverables/company-intro-v3/gen/vals.json`.
- Deleted `deliverables/company-intro-v3/index.html`.
- Deleted `deliverables/company-intro-v3/slides/brain.html`.
- Deleted `deliverables/company-intro-v3/slides/case-01.html`.
- Deleted `deliverables/company-intro-v3/slides/case-02.html`.
- Deleted `deliverables/company-intro-v3/slides/case-03.html`.
- Deleted `deliverables/company-intro-v3/slides/case-04.html`.
- Deleted `deliverables/company-intro-v3/slides/case-05.html`.
- Deleted `deliverables/company-intro-v3/slides/case-06.html`.
- Deleted `deliverables/company-intro-v3/slides/case-07.html`.
- Deleted `deliverables/company-intro-v3/slides/case-08.html`.
- Deleted `deliverables/company-intro-v3/slides/cases.html`.
- Deleted `deliverables/company-intro-v3/slides/chart-corridor.html`.
- Deleted `deliverables/company-intro-v3/slides/chart-waterfall.html`.
- Deleted `deliverables/company-intro-v3/slides/contact.html`.
- Deleted `deliverables/company-intro-v3/slides/cover.html`.
- Deleted `deliverables/company-intro-v3/slides/matrix.html`.
- Deleted `deliverables/company-intro-v3/slides/module-1.html`.
- Deleted `deliverables/company-intro-v3/slides/module-2.html`.
- Deleted `deliverables/company-intro-v3/slides/module-3.html`.
- Deleted `deliverables/company-intro-v3/slides/module-4.html`.
- Deleted `deliverables/company-intro-v3/slides/modules.html`.
- Deleted `deliverables/company-intro-v3/slides/options.html`.
- Deleted `deliverables/company-intro-v3/slides/partners.html`.
- Deleted `deliverables/company-intro-v3/slides/profile-bianjiang.html`.
- Deleted `deliverables/company-intro-v3/slides/profile-guofeng.html`.
- Deleted `deliverables/company-intro-v3/slides/profile-liquanchao.html`.
- Deleted `deliverables/company-intro-v3/slides/profile-yuxiangdong.html`.
- Deleted `deliverables/company-intro-v3/slides/promise.html`.
- Deleted `deliverables/company-intro-v3/slides/rhythm.html`.
- Deleted `deliverables/company-intro-v3/slides/scr-price.html`.
- Deleted `deliverables/company-intro-v3/slides/scr-product.html`.
- Deleted `deliverables/company-intro-v3/slides/scr-report.html`.
- Deleted `deliverables/company-intro-v3/slides/scr-trade.html`.
- Deleted `deliverables/company-intro-v3/slides/sec-1.html`.
- Deleted `deliverables/company-intro-v3/slides/sec-2.html`.
- Deleted `deliverables/company-intro-v3/slides/sec-3.html`.
- Deleted `deliverables/company-intro-v3/slides/stats-growth.html`.
- Deleted `deliverables/company-intro-v3/slides/stats-org.html`.
- Deleted `deliverables/company-intro-v3/slides/stmt-data.html`.
- Deleted `deliverables/company-intro-v3/slides/stmt-decision.html`.
- Deleted `deliverables/company-intro-v3/slides/stmt-problem.html`.
- Deleted `deliverables/company-intro-v3/slides/stmt-proof.html`.
- Deleted `deliverables/company-intro-v3/slides/team.html`.
- Deleted `deliverables/company-intro-v3/slides/timeline-1.html`.
- Deleted `deliverables/company-intro-v3/slides/timeline-2.html`.
- Deleted `deliverables/company-intro-v3/slides/timeline-3.html`.
- Deleted `deliverables/company-intro-v3/slides/timeline-4.html`.
- Deleted `deliverables/company-intro-v3/slides/value.html`.
- Deleted `deliverables/exhibit-design/README.md`.
- Deleted `deliverables/exhibit-design/build.json`.
- Deleted `deliverables/exhibit-design/exhibit-design.pdf`.
- Deleted `deliverables/exhibit-design/index.html`.
- Deleted `deliverables/exhibit-design/pdf-verification.json`.
- Deleted `deliverables/exhibit-design/src/TiansightDeck-Exhibit.dc.html`.
- Deleted `deliverables/exhibit-design/src/ds-base.js`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-01.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-02.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-03.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-04.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-05.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-06.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-07.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/case-08.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/cover.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/dashboard-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/dashboard-2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/dashboard-3.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/dashboard-4.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/mobile-review.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/module-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/module-2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/module-3.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/module-4.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/penetration-matrix.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/price-band-gap.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/profit-sensitivity.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/report-page-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/report-page-2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/report-page-3.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/repurchase-quadrant.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/section-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/section-2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/section-3.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/statement-data.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/statement-decision.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/statement-problem.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/statement-proof.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/deck/trade-area-supply.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/brand-wall.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-3.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-4.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-5.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/case/yyjm-6.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-01-cover.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-03-sec-dining.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-04-sec-display.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-05-sec-boh.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-06-sec-equipment.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-07-sec-delivery.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/gen/ex-08-sec-team.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/hotels.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-boh1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-boh2.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-detail.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-island.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-mingdang.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/m-pass.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/exhibit/src/p9-1.jpg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/icons.svg`.
- Deleted `dist/components/2026.10.21-e0a760/assets/logo-seal.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/logo.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/3699.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/chaofa.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/qingshuiting.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/shitou.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/subangyuan.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/wuyutai.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/youyuanjingmeng.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/partners/yun1980.png`.
- Deleted `dist/components/2026.10.21-e0a760/assets/people/wechat-qr.png`.
- Deleted `scripts/build_exhibit.py`.
- Deleted `scripts/verify_exhibit_pdf.py`.
- Deleted `slides/RUNTIME-STATUS.md`.
- Deleted `templates/sales-deck/SalesDeck.dc.html`.
- Deleted `templates/sales-deck/deck-stage.js`.
- Deleted `templates/sales-deck/ds-base.js`.
- Deleted `templates/sales-deck/support.js`.

</details>

CI readiness: Pages validation now installs pinned PDF metadata tooling because the previous
stdlib-only workflow cannot inspect PDF identities on a clean host. Workflow runner variables
provide reversible `PR_RUNNER_LABELS` and `PUBLISH_RUNNER_LABELS` routing, preserving the existing
hosted fallback. The repository runner list is empty and organization runner/group readback
returns 403 with the current authorized GitHub token; no scope expansion, registration or
infrastructure change is attempted. Self-hosted scheduling/isolation is therefore unverified;
the PR uses the established hosted route until a verified pool is selected. No deployment is
triggered by this task.

Workflow linter limitation: the existing deploy job binds `environment.name: github-pages`
plus its deployment URL. The runner skill linter incorrectly reports E4 for this mapping
form (it only recognises scalar environment declarations). The existing binding is preserved;
checkout credential persistence is disabled. This is not a missing environment.

Shared-record regression: content versions now hash complete referenced case/team/contact/
partner source records as well as resolved props. Changing case approval/gallery data marks
all case consumers stale, even a layout currently reading only the summary. The additional
regression passes (13 contract tests total); all profiles are released again using the final
hash contract.

## Final acceptance

- `python3 scripts/check.py --render`: PASS, including 27 layout snapshots, source text
  comparison and rendered-casing regression. Existing missing portrait placeholders are
  unchanged from baseline.
- `node scripts/test_component_runtime.mjs`: PASS: 105 exports, 52 intro/41 exhibit/14 sales,
  33 cards, offline images/fonts/navigation/clipping and bare-default Seal.
- `python3 scripts/test_content.py`: PASS: 13 regressions.
- `python3 scripts/build_deck.py --all --check`: PASS all nine profiles; kitchen planned.
- `python3 scripts/release.py intro`, `exhibit`, `sales`: PASS all nine PDFs (282 pages).
  Text/signs/digit order, actual PDF profile identity/page count, fonts and clipping pass;
  maximum HTML/PDF mean pixel difference is 4.446/255 (limit 12/255).
- `python3 scripts/build_preview.py`: PASS: 654 staged files; `archive/` absent from `_site/`.
- `git diff --check`: clean. New data/visuals are source-bound approved material; diff reviewed
  against the public-data policy, no raw client data or new model identifiers introduced.
- Tracked checkout size against PR#3: 126,201,518 → 119,306,617 bytes before this receipt
  (-6,894,901 bytes; net negative). Git history retains earlier commits by design.

Production review owns merge/deploy/tag/approval. `latestBuilt` is populated for intro,
exhibit and sales; all `latestApproved` fields remain null. Formal self-hosted runner
availability remains unverified because authorized organization readback returned 403; the
existing hosted CI fallback is preserved, with reversible runner variables ready.
