# Changelog

Versions follow the published brand guide. The system version is in `brand/VERSION`.

## v0.7 · 2026-11-07 · Intro: native figures only, 三不 and fee copy removed

- Owner: the 三不 line (侍天不替老板拍板…) and the result-linked fee copy (服务费用可与双方确认的改善结果挂钩…) are removed. `ValueSlide` and `ServiceModelSlide` pass `note: ""`; 服务模式 keeps the 服务内容 and 客户价值 rows and drops 核心优势, which repeated both. Both slides are shared, so the sales deck changes too. README rules updated.
- Owner: the intro uses native figures only, no images. Photographs are removed from the cover, statement, section and module slides (`image: null`); the four screenshot slides (报告样张, 产品界面, 价格带与菜品矩阵, 商圈供需与复购分层) leave the manifest; partner logos give way to names set in type (`$partners` view `names`, also on the sales wall); case slides use `$case` view `native` and the index `index:native`; team seats and four new photo-less profile records (the photo versions stay in exhibit and kitchen) take no portraits. Remaining images: the brand seal and the WeChat QR on 联系. Intro: 53 internal, 48 client, 44 web.
- Runtime patches (`scripts/runtime_patches.py`): without a photo, ProfileSlide and ExpertTeamSlide draw a seal monogram and CaseStudySlide a service-module track instead of a grey placeholder; PartnerWallSlide uses shorter cells for names so the quote no longer runs into the footer. Photo paths render as before, but the runtime bytes changed, so every deck's content version changed: intro, sales and exhibit PDFs rebuilt, and the exhibit approval returns to null until production review.
- `scripts/content_lib.py` gains the views above, with contract tests; `snapshots/migration-text.json` records each intended difference with its cause.

## v0.7 · 2026-11-07 · Intro follows the official homepage

- Intro deck recomposed in the order of the live homepage https://tiansight.apuch.cn (fetched 2026-11-07): 主张 (菜单是什么) → 问题 → 经营 · 利润 · 能力 → 一 从概念到连锁 (四个阶段, 四个服务模块, 模块与节点, 交付节奏, 可选专项) → 二 餐饮第二大脑 (四个部分, 三个模型, 底座 · 基座, 样张为证 and the insight pages) → 伙伴 (伙伴背书, 实证, 八个案例) → 三 团队 → 老板看到的价值 → 服务模式 (合作从一份经营诊断开始) → 拍板之前，问侍天 → 联系. Manifest only: no slide copy edited.
- Three intro slides whose copy had drifted from the homepage (主张 `a34bdc46`, 第二大脑 · 四个部分 `7bdbce6f`, 老板看到的价值 `b8fbe927`) are replaced by the shared sales records that render the homepage copy verbatim (`4908fa67`, `bf0552b6`, `4e47be0a`). The superseded records stay in the library, unreferenced. 57 slides internal, 52 client, 48 web; cover date 2026-11-07. Intro PDFs rebuilt and verified; `latestApproved` stays a production-review step.
- Migration text gate: `scripts/test_migration.mjs` applies every recorded difference for a slide (not only the first) and maps 第二大脑 · 四个部分 to its replacement 餐饮第二大脑; `snapshots/migration-text.json` records the four intended differences (cover date, 主张, 餐饮第二大脑, 老板看到的价值) with their cause.
- Brand snapshot: the IPTrust record moved to iptrust01 `7797344`; theme, official logo and published guide (v0.6, equal to the archived copy) are unchanged, so the foundation is untouched. `brand/source.json` version and sync note refreshed.

## v0.7 · 2026-11-07 · 1 + 3 + 3

- Owner: the "1 + 3 + 3" formula is internal only. No slide, deck or website shows it; the overview slide is labelled 经营 · 利润 · 能力 and the website rows read 模型 · 底座 · 基座 without numbers. The record keeps `lead.formula` as its structural name.
- The positioning record becomes 1 + 3 + 3 (schema `tiansight.positioning/2`, owner brief 2026-11-07): one base (Table AI + OPC Global, 全球专家与联盟生态基座), three models with outcomes (经营模型 → 赚到钱, 利润模型 → 留下利润, 能力模型 → 持续发展; 能力模型 replaces 人才模型 and covers 人和组织的评估 · 发展 · 协同), three foundations (知识库, 决策树, 能力表), labels only. The validator rejects sentences.
- Intro deck: five slides on five views (`system:matrix`, `operating:steps`, `profit:steps`, `capability:steps`, `foundations:cards`); the two 2026-11-06 slides for 利润节奏升级 and 人才招选预留 are removed. PDFs rebuilt; `latestApproved` stays a production-review step.
- Sales deck references the same five slides (overview after 主张, the model, foundation and base slides after 餐饮第二大脑): 19 slides internal, 18 client and web. Sales PDFs rebuilt; `latestApproved` stays a production-review step.
- Website `#models`: a 1 + 3 + 3 pillar diagram (outcomes, models, foundations, base) and three chapter infographics, generated from the record. ADR 0002 rewritten for the new structure.

## v0.7 · 2026-11-06 · Positioning record

- Owner approved the record's wording (`status: approved`, `approval` filled); the website review note is gone and the intro PDFs are rebuilt. Deck production approval (`latestApproved`) is still a separate production-review step.
- `content/positioning.json` (schema `tiansight.positioning/1`): the one record of 三大模型 (经营 · 利润 · 人才, with their scenarios, dimensions, roles and shifts) and 三大基础 (知识库 · 决策树 · 能力表), status `draft` until the owner confirms the wording. `scripts/positioning_lib.py` validates it and builds seven slide views; `$positioning` is a new content reference (`scripts/content_lib.py`, contract tests).
- Intro deck: seven slides reference the record (overview after 问题; 经营模型 matrix, 利润模型 tiers and 节奏升级, 人才模型 roles and 招选预留, 三大基础 after 第二大脑 · 四个部分). `latestApproved` lapses until production review approves the new content.
- Website: the retired 经营五问 section is replaced by `#models` (three-model tabs + three foundations), generated by `scripts/build_positioning.py` between `positioning:start/end` markers; `--check` joins `scripts/check.py` 8d.
- `docs/adr/`: ADR 0001 records the existing one-source-of-truth order of authority; ADR 0002 the positioning record and how the platform repository pins to it.

## v0.7 · 2026-11-06 · Skills

- `tiansight-contract-annex` 1.2.0 from upstream 2026-11-06 03:20: project workload estimate (on-site / remote person-days) replaces the residency plan; five matplotlib infographics (phase timeline, service framework, method logic, scope mind map, delivery Gantt) inserted into the docx.

- Add `pitch-art` and `tiansight-contract-annex` under `skills/`, with `skills/registry.json` (versions, upstream source and hashes) and `scripts/skills_registry.py` for check, compare and record.
- `tiansight-contract-annex` 1.1.0 from upstream 2026-11-06: acceptance covers delivered work only; no operating-result commitments.
- `pitch-art` 2.0.0 for review: infographic-first slide anatomy with text limits, figure-choice table and recipes 14–21, a delete list for AI-style phrasing, reading-comfort rules, Tiansight token binding. Registry hashes now cover whole skill folders.

## v0.7 · 2026-10-18 · New public repository

### Consolidation: slide library, deck manifests, one export path

- Canonical UUID slide library and intro/exhibit/sales manifests, shared case/team/contact/partner data; kitchen planned.
- Registered canonical assets and in-memory ZIP recovery; historical exports archived.
- One offline HTML/PDF builder, content/system versions, verification and separate build/approval pointers.
- Contract, migration, offline runtime, PDF and layout gates; architecture/MCP contract documented.

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

## Component runtime 2026.10.21-e0a760 (review candidate)

- Recover the approved ZIP: 32 entries, 11 embedded resources, 155 image/font assets; retain full provenance and compiled-source limitation.
- Support 105 exports (50 additions, no removed names), local React/d3/Babel, foundation token mapping, pale slide styling and existing chart correctness fixes.
- Migrate active cards/loaders; preserve historical JSX/export directories as archives.
- Add the editable 41-page exhibit, shared canonical team/contact, verified research wording and original slide IDs/images.
- Add distribution/deck/artifact manifests and one versioned content → HTML → PDF export contract. No web/MCP service, merge or deployment.

### 2026-11-07 · Local release review

- Refreshed the two brand specimen heading positions measured identically on main and the positioning branch; no specimen styling changed.
