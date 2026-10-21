# Compiled runtime compatibility audit

Audit date: 2026-10-21. Scope: the received format-4 runtime versus the preserved proposal bundle, plus the current repository callers and corporate template. This is a recovery compatibility assessment, not permission to promote recovered styling above `brand/` (see `AGENTS.md` and `docs/maintaining.md`). Findings describe the received bytes before distribution patches.

## Result and evidence

The new runtime preserves **all 55 old exports** and adds **50** (105 total). It is export-name compatible after namespace routing, but it changes defaults, shared helper behavior, DOM and assets. A direct file replacement is insufficient. Current sales/corporate templates require the newer behavior; legacy content that depends on old defaults needs explicit props rather than blanket rollback.

| Input | Namespace | SHA-256 |
|---|---|---|
| `TIANSIGHT 侍天 Design System/_ds_bundle.js` | `TIANSIGHTDesignSystem_bb63dc` | `80327da3fba9b647ca1f265bd6c73fdd602b73c082f1897e1fdf3dc63675aada` |
| Received `1f4751c8-8e15-4470-b341-08f5273e4987.js` | `TIANSIGHTDesignSystem_e0a760` | `11eb75c367ce5e683c3f34f6df1e4f207597e4a2b063bdb405beecb25aa1b821` |

Both manifest `format` values are 4 and `inlinedExternals` is empty. Source hashes are the first 12 SHA-256 hex digits of original source, not full integrity hashes or compiled-module hashes. Of 59 old source hash entries, 57 match the preserved source tree; `ui_kits/report/DecisionPage.jsx` and `TrendPage.jsx` do not. Do not treat that tree as a reproducible build of every old module.

For shared exports: 26 are in byte-identical compiled module bodies; comparing individual function text/constant values raises the unchanged count to **29** (adds `CHART_MARGIN`, `SlideTitle`, `SlidePlaceholder`). The remaining **26** have direct function/value changes. Unchanged chart function text does not imply unchanged rendering: it calls changed chartKit helpers. No React/D3/browser implementation is embedded in either bundle.

## Namespace, loading and host contract

The received bundle creates only `window.TIANSIGHTDesignSystem_e0a760`; it does not automatically create `703ad4` or `bb63dc` aliases. At audit baseline, root `slides/`, `ui_kits/` and sales template consumers used `703ad4`, while the preserved compiled bundle used `bb63dc`. Corporate `CompanyIntro.dc.html` already uses `e0a760`. Route active consumers to the new namespace or create a deliberate loader alias; aliasing alone cannot preserve old defaults. Preserve the proposal directory as historical evidence.

At baseline root `_ds_bundle.js` did not exist, so root card/deck references could not work standalone. The sales deck shell exists at `templates/sales-deck/deck-stage.js`; no substitute scaler is needed. Corporate HTML is a template fragment containing `<helmet>`, `<x-import>`, `<sc-for>`, `<sc-if>` and interpolation. It requires the DC host/runtime and evaluated `.dc.js` logic; loading the component bundle does not turn the raw fragment into a standalone browser deck. Its relative `./ds-base.js`/`./deck-stage.js` also require correct destination routing.

React must exist before bundle evaluation: default ProofSlide chart construction calls `React.createElement` at module initialization. ReactDOM is required to mount views. D3 v7 is required for actual chart marks. `useD3()` waits for D3, so a module can initialize without D3 while a chart remains empty. Sankey additionally requires `d3.sankey`; load d3-sankey for that export. Retain `__errors` inspection: top-level wrappers catch failures and can leave undefined exports instead of failing the entire script.

## All shared exports: source and contract coverage

Hashes below come from each bundle's `sourceHashes` manifest. `=` means source hash unchanged; individual notes distinguish helper effects and the two unchanged functions inside a changed module. Source paths are from bundle metadata.

| Export | Source | Old → new source hash | Contract / behavior finding |
|---|---|---|---|
| `Donut` | `components/charts/Donut.jsx` | `9325a1e2e7f0` = | Same props and module; inherited chart palette/frame changes apply. |
| `Funnel` | `components/charts/Funnel.jsx` | `45d9c91e0122` = | Same stages, dimensions, units and drop labels; inherited chart helper changes apply. |
| `Gauge` | `components/charts/Gauge.jsx` | `58279ab30d9a` = | Same value/target/max/autoTone contract; inherited tone values change. |
| `Heatmap` | `components/charts/Heatmap.jsx` | `86290e8d0a51` = | Same rows/columns/values/diverging contract; inherited colour ramps and label colours change. |
| `Sparkline` | `components/charts/Sparkline.jsx` | `079ed4f38924` = | Same values/width/height/toneName/area/showLast; datum colour changes through helper. |
| `StackedBars` | `components/charts/StackedBars.jsx` | `f53b6d78c3a8` = | Same data/keys/tones/normalize contract; inherited Axes/frame changes apply. |
| `TrendLine` | `components/charts/TrendLine.jsx` | `2efd8243b78a` → `c231269a3183` | Adds scope, grade, refs=[], marks=[]; refs enter y-domain, marks match period labels. Old props retained. |
| `Waterfall` | `components/charts/Waterfall.jsx` | `110a405d352e` → `08875db2a170` | Adds scope/grade; same start + signed steps shape. Received arithmetic omits current repo rounding fix; distribution patch required. |
| `CHART_TONES` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Adds key/charcoal/seal/gold; bronze CSS alias changes bronze-500 → gold. All old keys retained. |
| `CHART_HEX` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Adds keys; changes loss/datum/grid/rule/ink/mutedInk. See palette details below. |
| `CHART_MARGIN` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Value identical: {top:16,right:20,bottom:34,left:52}. Module hash changes because chartKit expands. |
| `AXIS_LABEL` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Same font-family/size/spacing; fill follows changed mutedInk. |
| `VALUE_LABEL` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Same font-family/size; fill follows changed ink. |
| `ChartFrame` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Adds scope/grade/degraded/layers; SVG now inside positioned div. Update direct-child SVG selectors; caption/note DOM changes. |
| `ChartLegend` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Same items/style props; new item.band renders translucent interval swatch. Existing line/swatch inputs retained. |
| `Axes` | `components/charts/chartKit.jsx` | `cb605a37cab0` → `c1b408bba5ce` | Adds yBand=false; existing props retained. Continuous x tick font changes from body to numeral; yBand suppresses grid. |
| `Badge` | `components/core/Badge.jsx` | `3868b3efd818` → `9c40c2a47f59` | Default tone bronze → gold (bronze retained alias); adds mono=false. Solid fill/text/radius/type change. |
| `Button` | `components/core/Button.jsx` | `2a38388bec08` → `6d2c902e210e` | Props, disabled/href/onClick and type contract retained; palettes/radius/shadows change. See interaction note. |
| `Card` | `components/core/Card.jsx` | `f10e5e85df22` → `593da8267882` | Props retained; removes hover translation/shadow; stronger border uses gold. interactive/onClick retained. |
| `Divider` | `components/core/Divider.jsx` | `ddcf90b37364` = | Identical module and props. |
| `Eyebrow` | `components/core/Eyebrow.jsx` | `a6d1652abcd6` = | Identical module and props. |
| `Icon` | `components/core/Icon.jsx` | `9df1164d2bb9` → `b622fa8e376c` | Adds strokeWidth=1.5; mapped names now inline SVG, others keep Lucide mask span/CDN. Tag-name selectors may break. |
| `IconButton` | `components/core/IconButton.jsx` | `e980f3ae5ff7` → `968f1fc47019` | Props retained; primary/outline/quiet now distinct palettes; adds pressed state/1px translation. |
| `PlanCard` | `components/core/PlanCard.jsx` | `5cb5875b2771` = | Identical module and props; nested Button sees new palette. |
| `Quote` | `components/core/Quote.jsx` | `284949a31609` = | Identical module and props. |
| `Wordmark` | `components/core/Seal.jsx` | `9b5227a91624` = | Identical Seal module; fontSize/inverse retained. |
| `Seal` | `components/core/Seal.jsx` | `9b5227a91624` = | Identical module; size/src/wordmark/subtitle/inverse/align retained. Existing asset-location mechanism remains. |
| `SectionHeading` | `components/core/SectionHeading.jsx` | `393969ae835a` = | Identical module and props. |
| `Stat` | `components/core/Stat.jsx` | `c2c655986c7a` = | Identical module and props. |
| `StepMarker` | `components/core/StepMarker.jsx` | `af18357d3e4a` = | Identical module and props. |
| `Tag` | `components/core/Tag.jsx` | `334405f72db1` = | Identical module and props; nested Icon now changes DOM. |
| `BarSeries` | `components/data/BarSeries.jsx` | `553708210d17` = | Identical module/data contract; own TONES, not chartKit. |
| `LedgerTable` | `components/data/LedgerTable.jsx` | `fafdc2698c44` = | Identical columns/rows/caption/dense/footer contract. |
| `Matrix2x2` | `components/data/Matrix2x2.jsx` | `36470aa3e0e0` = | Identical old module/xAxis/yAxis/quadrants/points/height; misses current repo muted-colour fix; distribution patch required. |
| `MetricRow` | `components/data/MetricRow.jsx` | `245f7e628168` = | Identical label/value/unit/delta/deltaTone/note/dense contract. |
| `Checkbox` | `components/forms/Checkbox.jsx` | `9d4135ca7b90` = | Identical props including controlled/uncontrolled checked and onChange. |
| `Input` | `components/forms/Input.jsx` | `20e1d3e577a4` = | Identical label/hint/error/prefix/suffix/disabled/required/id/rest contract. |
| `Radio` | `components/forms/Radio.jsx` | `8532f7c0133d` = | Identical label/description/name/value/checked/onChange/disabled/id/rest contract. |
| `Select` | `components/forms/Select.jsx` | `699837d8c515` = | Identical label/hint/error/options/size/disabled/id/style/rest contract. |
| `Switch` | `components/forms/Switch.jsx` | `c1f822a60d67` = | Identical label/description/checked/onChange/disabled/id contract. |
| `ExpertCard` | `components/people/ExpertCard.jsx` | `77f510f8adb8` = | Identical name/title/field/photo/tags/layout/size/interactive/onClick; photo stays direct (unlike ExpertTeamSlide). |
| `PartnerCase` | `components/people/PartnerCase.jsx` | `1597f23562dc` → `1d2a3813ec92` | Same brand/kind/stores/since/summary/metrics/quote/actions/logo; border/radius/shadow only change. |
| `ChartSlide` | `slides/ChartSlide.jsx` | `8735e6dcef31` → `285db0842bc3` | Adds figure/grade; retains custom chart and all text props. chart null/undefined now means built-in sample figure; false is empty. |
| `ContactSlide` | `slides/ContactSlide.jsx` | `a2b947a52030` → `45b8dccd621c` | Adds motto/url; default title/body change. qr bare paths now resolve through slideSrc. |
| `ExpertTeamSlide` | `slides/ExpertTeamSlide.jsx` | `149b8c23c594` → `96c82c6f068c` | Same props; new defaults; ≤2 people lay out portrait-left; grid count follows roster; photo paths use slideSrc. |
| `FiveQuestionsSlide` | `slides/FiveQuestionsSlide.jsx` | `40efe82fef88` → `fe035683aaf5` | Same main props; defaults become 4 stages, not 5 questions; columns follow steps.length; adds step.numeral. |
| `LadderSlide` | `slides/LadderSlide.jsx` | `88b8907ab42d` → `5c22b64707f6` | Adds gotLabel="作用"; default tiers become 4 brain parts; highlight 1 → -1; adds tier.numeral and dynamic columns. |
| `PartnerWallSlide` | `slides/PartnerWallSlide.jsx` | `c76fd1573dea` → `b1b82f81bea2` | Adds columns=4; old partners/logos/quote retained; cell sizing/names under logos change; logos use slideSrc. |
| `PromiseSlide` | `slides/PromiseSlide.jsx` | `b467144c0538` → `b107648e25b3` | Adds points; stats no longer defaulted. Omitted stats renders 3 narrative points; explicit nonempty stats keeps numeric ledger. |
| `ProofSlide` | `slides/ProofSlide.jsx` | `2144162fd803` → `d9d3ff42b7a7` | Adds subtitle/chart/chartTitle/grade/scope; default Histogram + E1/sample source; chart=null remains explicit text-only opt-out. |
| `SectionSlide` | `slides/SectionSlide.jsx` | `e159e29dc625` → `71b0cf6d0574` | Adds image via slideSrc; image narrows text to half and replaces ornament. Other props retained. |
| `SlideFrame` | `slides/SlideFrame.jsx` | `95bd8a404aa1` → `1745d5d707f5` | Adds raiseFooter=false; existing 1280×720 shell/72px pad/page/ground/footer/grain/seal retained. |
| `SlideTitle` | `slides/SlideFrame.jsx` | `95bd8a404aa1` → `1745d5d707f5` | Function body and props identical; container module hash changes only. |
| `SlidePlaceholder` | `slides/SlideFrame.jsx` | `95bd8a404aa1` → `1745d5d707f5` | Function body and props identical; container module hash changes only. |
| `TitleSlide` | `slides/TitleSlide.jsx` | `2b2c6f07a752` → `df1fa38cf804` | Adds clientLabel="提案对象" and image; default title/subtitle change; image narrows title, adds overlay; title honors newlines. |

## Required adapters and behavior decisions

1. **Preserve repository fixes in distribution.** The received Waterfall uses raw `run + s.value` and prints raw `b.value`; current `components/charts/Waterfall.jsx` rounds accumulated values to six decimals and displayed labels to one decimal. For example, `41.2 + (-3.4)` produces `37.800000000000004`; a simpler `0.1 + 0.2` exposes the total-label issue. The received Matrix2x2 retains muted `var(--parchment-400)` while current `components/data/Matrix2x2.jsx` uses `var(--ink-muted)`. `scripts/runtime_patches.py:patch_bundle()` preserves these three replacements within their compiled module boundaries, alongside the foundation and initialization adapters below. It rejects drift and must run on the distribution copy; keep archived input bytes unchanged.
2. **Choose defaults per consumer.** Current sales slides explicitly ask for four stages and the four brain parts, so new defaults are correct there. Legacy five-question material must pass its original `steps`, title, eyebrow and note. Legacy 3+X material must pass original `tiers`, `highlight=1`, `gotLabel="老板得到"`, and `numeral:"X"` on the last tier. A legacy PromiseSlide numeric offer must pass `stats`; otherwise its right column becomes points. Pin title/body/subtitle when reproducing old copy. No old prop is removed, but preserving omissions is not content compatibility.
3. **Use correct chart opt-outs.** `ChartSlide` uses `chart != null`: both absent chart and `chart:null` choose the built-in `figure` (`scatter` fallback), including sample claim/action/source defaults. `chart:false` is treated as a custom empty body and suppresses built-in caption/grade/action/source defaults. `ProofSlide` uses a default parameter: absent/undefined chart selects its Histogram; `chart:null` suppresses it. These two components deliberately have different null semantics.
4. **Keep slide chart typography.** New built-in charts use `SlideChart`, which scales report-sized marks and axes for the 19px slide floor; `SlideGrade` carries slide-sized EGA labels. Custom `chart` is passed through untouched, so the caller must wrap kit charts in `SlideChart` and provide caption, grade, source, takeaway and action as applicable. The full corporate template uses figure selectors `waterfall` and `corridor`; replacing them with empty placeholders would drop meaningful content.
5. **Resolve assets from the bundle.** `slideSrc` passes `http:`, `https:`, `data:`, `blob:`, `/`, `./` and `../` paths through; a bare path such as `deck/cover.jpg`, `people/name.png`, `logos/name.png` or `wechat-qr.png` is now DS-relative. It affects new image props and existing QR/photos/partner logos. To preserve a page-relative path, pass `./name.png`. `dsAsset()` searches the first script URL containing `_ds_bundle.js`; keep that filename, a single intended bundle per document and matching `assets/` layout. Arbitrarily renaming the runtime or loading two differently located bundles can resolve assets to the wrong directory. `ExpertCard.photo` itself still uses its input directly.
6. **Ship matching CSS.** The received runtime references legacy typography/layout aliases plus new `gold`, `charcoal`, `ink-primary`, `line-card`, `text-caption`, `type-badge` and other tokens. All referenced variable names exist in root `tokens/*.css` at audit time. The three `brand/` foundation stylesheets alone do not define every compatibility alias. This runtime does not override the authority of `brand/tokens.json`. In particular, incoming `--text-display`, `--text-body` and `--text-caption` mean colours, while the foundation defines those exact names as font sizes. Keeping only the foundation definitions makes incoming colour declarations invalid and headings inherit the surrounding viewer colour (near-white in the observed cover/thumbnail screenshot). The distribution adapter rewrites all 47/17/5 respective compiled references to `--charcoal`, `--text`, `--color-caption`, without changing foundation typography. Generated compatibility CSS must disambiguate its own references too. Do not import recovered proposal CSS into unrelated foundation pages.
7. **Review DOM assumptions.** ChartFrame now nests SVG in a positioned wrapper, and Icon changes from a masked span to inline SVG for brand names/aliases (`x`/`close`, `line-chart`/`trending-up`, `chevron-right`, `target`, `circle-dot`/`shield`, `clock`, `layers`, `database`). Unknown icon names still request Lucide over CDN; supplying React/D3 locally does not make arbitrary icons offline. Update any direct-child/tag-specific selectors. Preserve accessible labels on containing buttons; Icon remains decorative.

Palette drift is intentional in the recovered chart helper, but must be visible to reviewers: `loss #A34A2C → #8C3228`, `datum #3F5A6B → #6E6355`, `ink #4A4136 → #3A332A`, `mutedInk #8B8072 → #706758`; grid/rule move from bronze alpha to charcoal alpha. `CHART_MARGIN` remains 16/20/34/52. Badge solid becomes `ink-primary` fill with charcoal text; Button primary becomes pale ink field/gold border instead of bronze fill. Button/Card/PartnerCase shadows are removed. Card no longer lifts on hover; IconButton adds explicit pressed behavior. Event/data contracts remain, but pixel snapshots and color assertions require intentional updates.

## Current source and template requirements

The received manifest covers 93 sources. Against the root source tree at audit baseline, **62 source hashes match, 22 differ and 9 sources are absent**. Thus this is not a compiled artifact reproducible from current root source. The nine absent sources are `CardGridSlide`, `CaseStudySlide`, `MatrixTableSlide`, `ModuleDetailSlide`, `ProfileSlide`, `ScreensSlide`, `StatColumnsSlide`, `StatementSlide`, `TimelineSlide`. Recover their compiled modules as provenance-marked compiled evidence; do not present transpiled JSX reconstruction as original author source. Existing root Waterfall/Matrix2x2 fixes above must survive recovery.

`templates/sales-deck/SalesDeck.dc.html` requires 13 distinct components. The old bundle lacks **ServiceModelSlide, ValueSlide and CaseSlide**; all are in the new bundle. Its `chartFigure` enum (`scatter`, `waterfall`, `corridor`), `activeStage` range 0–3, `proposedTier` range -1–2, founders roster and sample flag align with the new contracts.

The corporate template `docs/claude-design-system/templates/company-intro/CompanyIntro.dc.html` requires **19** distinct components. All exist in the received 105 exports. Ten were absent from the old 55: **CardGridSlide, CaseStudySlide, MatrixTableSlide, ModuleDetailSlide, ProfileSlide, ScreensSlide, StatColumnsSlide, StatementSlide, TimelineSlide, ValueSlide**. The other nine are shared: ChartSlide, ContactSlide, ExpertTeamSlide, FiveQuestionsSlide, LadderSlide, PartnerWallSlide, PromiseSlide, SectionSlide, TitleSlide. Corporate props depend on new features: bare DS asset paths, `TitleSlide.clientLabel/image`, `SectionSlide.image`, narrative `PromiseSlide.points`, four module steps, logo columns, two figure types, and `ContactSlide.url`.

The corporate logic produces repeated module/timeline/case/profile pages; export count is not page coverage. A full browser check must exercise its default 47-page expansion, timeline opt-out, the conditional sections and all referenced images. Its approved content source and page-count history remain documented in `docs/claude-design-system/company-intro-v3.md`; this audit does not edit that content.

Report/website modules are compiled into the bundle and have updated source hashes, but are not public entries in either manifest. They assign page functions to real `window`. The received 13 wrappers destructure `window.TIANSIGHTDesignSystem_e0a760` before the final public export assignments execute, capturing undefined component references without a module initialization error. The first AnalysisPage render reproduces an undefined React element type. The distribution helper binds exactly these 13 destructuring statements to already populated `__ds_scope`; each module must contain precisely one expected statement. The page globals remain available, and this does **not** provide a namespace alias to external callers. Avoid a broad `Object.assign(window, namespace)` export as a recovery shortcut.


## Foundation adaptation applied to distribution

The runtime recovery originally exposed two independent visual defects: text-token colour/size collisions and deliberate inverse full-page slide styling. `SlideFrame`'s parchment and paper titles did not incorrectly select an inverse ground: they selected the incoming `--text-display` colour alias, whose foundation value is a size. Fix the semantic collision globally, not the PromiseSlide/SectionSlide callers one by one.

`TitleSlide` and `ContactSlide` explicitly requested `ground="ink"`; `StatementSlide` selected ink whenever an image existed. Those are proposal rules superseded by the foundation rule that inverse is permitted for one card per view, never a page ground. Distribution patches keep the `ink` input accepted but make its SlideFrame surface pale, normalise shared heading/footer/seal colours and remove inverse handling from the frame. Incoming assets, content, page numbering, dimensions and padding remain.

The TitleSlide photograph remains at the original right-side 34% width and uses the original src/objectFit; its gradient overlay node is removed. The logo has its normal colours, wordmark uses charcoal/official wordmark gold, and direct subtitle/meta values become readable foundation roles. StatementSlide retains its approved photograph on the right at 38% width, reserves the left 58% for text and reduces image-variant heading size from 76 to 60px; its full-bleed wash/gradient node is removed. ContactSlide retains QR and logo assets while its direct text uses foundation muted/gold colours. SectionSlide's existing right-side image stays intact and receives the shared title/body role fix.

No CSS `linear-gradient(...)` remains in the patched JavaScript. Generated CSS also needs removal of `.ts-paper` radial-gradient texture; the builder owns that stylesheet repair. Sankey's SVG `linearGradient` links remain an existing specialized chart behavior, outside the current sales/corporate slide paths; a strict foundation-wide release of every chart should replace/review them. Its tooltip shadow is overlay elevation; existing form focus rings are not card elevation. New shared Button/Card/IconButton/PartnerCase have no card shadows. Existing Switch thumb shadow is unchanged from the old component and is outside this slide adaptation.

The helper performs exact-count replacements globally for the three colliding colour roles, then exact module-boundary/count replacements for repository fixes, slide adaptation and the 13 page-module bindings. The archived upstream manifest/source hashes continue to describe received source provenance; distribution integrity must use the build manifest's hash of the **patched output bytes**. The helper intentionally rejects an already-patched bundle or an upstream source whose expected strings/counts change.

## Verification performed and limits

- Parsed both format-4 manifests, checked old/new symbol sets, compared all 45 shared source-module bodies and all 55 individual runtime export function texts/constant values.
- Read old/new changed module bodies, all shared destructured prop signatures and existing sales/corporate callers. Verified source-hash comparisons against actual files, not only names.
- Executed Node VM assertions on received bytes with a minimal React element stub: all 55 symbols retained; no implicit namespace aliases; margins unchanged; palette drift; Icon DOM/fallback; four-stage default copy; ChartSlide null/false distinction; ProofSlide explicit null opt-out; bare/relative portrait paths; 1280×720 frame. New bundle had zero initialization errors under this stub. The old bundle's included deck-stage wrapper had one expected DOM-stub error; this is not a browser failure claim.
- Applied distribution adapters to a temporary copy, checked original text unchanged and drift rejected, and passed `node --check`. Patched VM assertions verify pale ink ground, charcoal headings for both ground modes, right-side Title/Statement image source and position retained, gradient overlays removed, readable direct subtitle/meta/contact colours and no PartnerCase shadow. Reproduced original AnalysisPage undefined-element failure; recursively rendered all 13 patched report/website page functions with no undefined React element types. Integration should additionally include a real D3-backed label assertion (`0.1 + 0.2` displays `0.3`) and muted Matrix2x2 token assertion.

No production source was changed by this audit. The only implementation addition is the small distribution patch helper requested during integration. Browser/D3 rendering, full corporate expansion, visual snapshots, keyboard controls, print and offline-network checks belong to the parent integration gate; stub assertions do not establish those passes.

The distribution builder also maps default `logos/` paths to the existing approved `partners/` assets, derives concrete chart colors from foundation tokens, and supplies local d3-sankey and all 1,528 Lucide 0.441.0 icons. Active UI-kit HTML uses the recovered compiled globals and no longer loads archived JSX via Babel XHR (which fails for file URLs).
