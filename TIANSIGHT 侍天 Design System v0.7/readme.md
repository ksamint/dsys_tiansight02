# Tiansight 侍天 design system · v0.7

> 素墨为纸、玄墨为字、土金为骨；沉稳敢言、有据可依。

Tiansight 侍天 is the 智慧领航者 (Wisdom Navigator) for premium F&B chains: 海图 Chart · 罗盘 Compass · 航线 Route · 校正 Correction. A Member of the Table AI Alliance · 数字员工 · 餐饮陪跑 · Hong Kong.

Sources: repo `github.com/fengurt/dsys_tiansight01` (main, tree bb089c0d, v0.6) — `brand/` is the published foundation, mirrored here unchanged; `ui_kits/` are the repo's own `website/`, `deck/`, `report/` with paths repointed. Published brand API: https://apuch.art/api/brands/tiansight.json (snapshot in `brand/source.json`). Rulings of 2026-09-08 (v0.7) come from `docs/foundation-review.md` in the review project and are applied in `tokens/v07-rulings.css`.

## Files

- `styles.css` — entry; imports webfonts → brand/fonts → brand/tokens → v0.7 rulings → base → components → people.
- `brand/` — guide.md (published spec v0.6), tokens.css, base.css, components.css, fonts.css, icons.svg, logo.png, index.html specimen, source.json, tokens.json, VERSION.
- `tokens/` — `webfonts.css` (interim Google Fonts, see Caveats), `v07-rulings.css` (Q2 tagline, gold ramp, shadows, UI type steps, semantic chart set, inverse surface).
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand) plus principles.md, quickstart.md, example.html.
- `components/` — React wrappers over the `.ts-` CSS classes: core (Button, Badge, Tag, Card, HeadingPair, Stat, Quote, Step, CheckList, SealStamp, Mark), forms (Field), navigation (Nav, Tabs, Breadcrumb, Pagination), feedback (Notice, Progress, Dialog, Tooltip, Disclosure), data (LedgerTable, TokenRow). Every class also works as plain HTML.
- `ui_kits/website`, `ui_kits/deck`, `ui_kits/report` — the three consumers; `people/` drives the founder surfaces.
- `assets/` — logo.png, icons.svg (17 line icons, 1.5 stroke, currentColor).

## Content fundamentals

Bilingual, CN primary. Voice: 沉稳 · 专业 · 敢言 · 克制 · 有据可依; rule 领航而非替决策 — navigate, don't decide for the client. Every claim states a source and a boundary condition; sample data is labelled 样张. Say 领航/导航, 复利/长效, 模型/体系, 数据校准, 单店跑通 → 模型锁定 → 体系连锁 → 智能领航. Avoid 赋能/抓手/闭环, 包治百病/颠覆, 解决方案/打法, 数据补全, 增长/爆款/裂变 (增长 survives only verbatim in the promise line "增长在何处、利润失于何处" — Q10). No emoji. EN appears as UPPERCASE letter-spaced captions paired under CN headings; sentences like "Time is money. With TIANSIGHT, lose neither." may sit in italic Noto Serif. Address the owner as 老板/你; the brand speaks as 侍天/我们.

## Visual foundations

- **Ground** 淡墨纸 #F4F0E7 ≈78% of any view; 宣纸 #FFFDF8 for raised content. Two tones only (Q11: decks included). Pure white never.
- **Primary color** 素墨 #EFE6D2 is a field, not a ground: buttons, recommended tier, filled badges, ≈7%.
- **Text** 玄墨 #17130D ≈12%; secondary 素墨灰 #706758; captions 深金 #76551F (same hex as gold, own token — Q3).
- **Gold** 土金 #76551F for rules, strokes, nav, card edges (≈3%). 明金 #D4A862 only at 28px+ figures, active states and on charcoal (1.9:1 on pale). Tagline 智慧领航者 sets in deep gold at every size (Q2). Hover/press darken one/two steps on the gold ramp (p1).
- **Seal** 朱红 #8C3228 ≤5%: seal stamp, ✕, warnings, negative data, 天干 card index. Never a field, never a positive datum.
- **Type** Noto Serif SC 600/400/300 · Noto Serif for EN caps (.3–.34em) · IBM Plex Mono for hex, tokens, data, prices only. Body 18/1.7. Display 84–96 with .14em tracking. CN never italic. Measure 28–38 CN chars.
- **Shape** radius 2px, never round (pill only for the outline status badge). Cards bordered, not shadowed; shadows (p2) only on dialogs. Framing: hairlines, double rules, corner ticks, compass-ring watermark at 10% gold.
- **Layout** 12 columns, 1280 container, 48/24 gutters, 96/64 section rhythm, card pad 24–32.
- **Motion** 120 / 220 / 700ms, ease-out, ≤12px rise, once; reduced-motion respected. No bounce.
- **States** hover: gold edge or paper fill; press: 1px down (stamp); focus: 2px gold ring; disabled 40%.
- **Mark lockup** the logo already reads 侍天; never set the CN name beside it. The lockup pairs the mark with the Latin caption "Tiansight" (and optionally the Alliance line) only.
- **Imagery** none in the foundation. If needed: real restaurant interiors, POS data, hand-drawn compass/seal; never stock SaaS illustration, gradients or neon.
- **Charts** 1 series 明金; 2 adds 玄墨; 3 adds 朱红. Ticks in ink-muted, every series labelled. p5 semantic set (增长/关注/基准/亏损) for reports only.

## Iconography

`brand/icons.svg`: seventeen line icons (arrows, chevron, check, cross, menu, external, print, chart, compass, route, correction, store, data, seal), circles and lines only, 1.5 stroke, currentColor, inlined as a sprite and used via `<svg class="ts-icon"><use href="#ts-compass"/></svg>`. No icon font, no emoji. Unicode ✓ ✕ · ↕ are used as glyphs in lists, breadcrumbs and sort headers.

## Intentional additions

Component React wrappers (the repo is CSS-only) so consumers can mount `Button`, `Card` etc.; `tokens/webfonts.css` as the interim font source.

## Caveats

- Fonts: `brand/fonts.css` expects self-hosted woff2 in `brand/fonts/` (not bundled). Google Fonts is loaded meanwhile — Q6 (hosting) is open.
- 朱印 seal stamp is a CSS placeholder; real calligraphy pending. Portraits, partner logos, WeChat QR are placeholders.
- Q8: prices, quotes and partner names need verification before publication.
