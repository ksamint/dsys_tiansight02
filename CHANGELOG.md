# Changelog

Versions follow the published brand guide. The system version is in `brand/VERSION`.

## v0.7 · 2026-10-18 · New public repository

- The design system moves to `ksamint/dsys_tiansight02`, starting from the consolidated v0.7 release with fresh history; `ksamint/dsys_tiansight01` becomes a private archive.
- Rule: never push sensitive data to the public repository (`AGENTS.md`, `docs/maintaining.md` §6, with the list of what counts and where it lives instead). `scripts/check.py` 8k blocks spreadsheets, databases and data dumps outside the invented sample folder.
- Addresses: official website https://tiansight.apuch.cn; brand design system https://apuch.art/tiansight; repository preview https://ksamint.github.io/dsys_tiansight02/ (no custom domain, `CNAME` removed); CSS for external sites from jsDelivr.

## v0.7 · 2026-10-17 · Consolidated release

One version of the system, built from the brand guide v0.7 rulings (2026-09-09) through the report-skill update (2026-10-17). Tagged `v0.7` on `main`.

### Brand and identity
- Brand snapshot 5c7c158 (2026-09-27) with the IPTrust identity in `brand/source.json`, confirmed against the live apuch.art record.
- One display name, **侍天 TIANSIGHT**, in code headers, site footers, generators, people data and token headers; the three verbatim guide copies and the preserved proposal folders keep their wording. Lockups pair the mark with the Latin caption only.
- Official website tiansight.apuch.cn; the brand design system is published at apuch.art/tiansight.
- 边江's title is 前海底捞品牌负责人 everywhere.
- Rulings Q1, Q2, Q3, Q10, Q11 (2026-09-09): ink-field primary button, deep-gold tagline at every size, `--gold-deep` kept, pale deck grounds with one charcoal card.

### Foundation
- Tokens: gold ramp 100–700 with hover / press, four shadow steps, interface type steps, report-only semantic chart set, inverse surface. Gold focus and control borders.
- `.ts-badge-outline` text in deep gold on pale grounds (bright gold only on charcoal).
- `Tiansight.chartTheme()` reads `--chart-1..3` and the translucent `--chart-benchmark`, plus `benchmarkSolid`.
- Product distribution: namespaced, content-addressed bundles; self-hosted WOFF2 subsets with OFL licences; versioned CSS pins frozen.

### Reports
- Report kit `templates/report-kit/` (`tsk`): 27 page types for 1920×1080 Slides decks, render / lint / colour / PDF checks, `build.sh`. Kit options: label titles (`label_pages`, `title_style`), expected inventory (`expect`), numbered quadrants with actual counts, `table_pages()` with repeated headers.
- Report template `deliverables/report-template/`: 39 pages (standards and every page type with invented data), viewer, clickable PDF (166 links).
- Handbook `docs/report-handbook.md` v1.1 and skill `skills/ts-slides-report` with the repurchase profile `repurchase.md`: completeness, title rule, scales, appendix, readability, acceptance record. `skills/ts-data-quality`: reconciliation table, auxiliary formula columns, pre-generation gate.
- Report colours only from `brand/tokens.json` (report kit and company intro v3).

### Deliverables and people
- Company intro v3 (47 pages) on tokens; lifecycle map; partner logos and photos in `assets/intro/`.
- Co-founder profiles (边江, 郭峰): library, builder, full and one-page versions, run-time editor; client cases anonymised; figures graded E4 until confirmed.

### Quality gate (`scripts/check.py`)
- Contrast audit of 41 colour pairings (WCAG 2.1, waivers with reasons), chart-theme check, profile freshness, report-kit tests and template freshness, public-reference guard, v0.7 ruling checks.

### Public repository
- Client deliverables and real figures removed from `reference/`, `ui_kits/samples/` and `html-system/sample/`; catalogue and inventory anonymised; `reference/source/` local-only.
- `docs/maintaining.md`: order of authority, one branch and one PR per topic, brand refresh, artifact sync.

### Known follow-ups
- `deliverables/company-intro-v3/company-intro-v3.pdf` predates the token colours; rebuild with the Slides runtime.
- The report-template Slides artifact needs a re-export by its owner to show the v1.1 standards pages.

## v0.6 · 2026-09-07 · Distribution

- `dist/`: one-file bundle `tiansight.css` (latest channel) and `tiansight-v0.6.css` (pinned), plus `tokens.json`, `icons.svg` and a working `example.html`, built by `scripts/build_dist.py` and verified by the gate.
- Long code lines wrap instead of overflowing on narrow screens (`pre { overflow-wrap: anywhere }`).

## v0.6 · 2026-09-07 · Solidity pass

- Tokens exported to `brand/tokens.json` (Design Tokens Community Group format, mobile mode as an extension); `scripts/export_tokens.py --check` keeps it in step.
- New components: skip link, visually-hidden helper, tag, notice (default, key, warn), disclosure, tabs (line and pill), tooltip, breadcrumb, pagination, progress, dialog, sortable header affordance. Explicit focus, pressed, disabled, read-only and selected states for buttons, fields and cards.
- Specimen section 05b: interaction, states and motion, with live tabs, dialog and the three motion durations.
- Accessibility lint `scripts/lint_html.py` over every page; pages fixed to one `h1`, a `<main>` landmark, no skipped heading levels, skip links on the website, team page and specimen.
- Layout regression harness `scripts/snapshot.mjs` with the committed baseline `snapshots/layout.json`; `python3 scripts/check.py --render` runs it.
- Hatch pattern for design values emitted once per report page instead of once per chart (no duplicate ids).
- Documentation: `docs/principles.md`, `docs/quickstart.md`, `docs/contributing.md`.

## v0.6 · 2026-09-06 · HTML report system

- `html-system/`: manifest-driven report and deck builder, eleven chart families, data roles, provenance appendix, evidence grades E1 to E4, quality checks, version diff.
- `skills/`: six skills for agents producing reports on this system.
- `reference/`: inventory of the three reviewed decks.

## v0.6 · 2026-09-05 · People layer and refinement

- Co-founder profiles across website, deck, blocks, name cards and social sizes from `people/people.json`.
- Self-hosted font declarations, inline icon sprite, charcoal ground scope, hub page.

## v0.6 · 2026-09-04 · Foundation and consumers

- `brand/tokens.css`, `base.css`, `components.css`, specimen, check script.
- Sales deck, website and A4 diagnostic report on the foundation.
