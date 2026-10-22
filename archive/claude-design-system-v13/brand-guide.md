# tiansight 侍天 — Design System

> Build-ready brand & visual spec for agents producing on-brand 侍天 work.
> 一句话：**素墨为纸、玄墨为字、土金为骨；沉稳敢言、有据可依。**
> Ink is the paper, charcoal is the voice, gold is the structure — composed, forthright, evidence-based.

**tiansight 侍天** — 智慧领航者 · *Wisdom Navigator* for premium F&B chains.
We equip every valuable mid-to-high-end F&B chain with a "see-clearly, move-betably, compound-easily" smart navigation system: 海图 Chart · 罗盘 Compass · 航线 Route · 校正 Correction.

> A Member of the Table AI Alliance · 数字员工 · 餐饮陪跑

---

## 0. Operating rules / 总则

- **Always pale.** Base canvas is 淡墨纸 `#F4F0E7`; raised content uses `#FFFDF8`. Avoid pure white.
- **Ink `#EFE6D2` is the primary brand color.** It carries fields and key actions; deep charcoal carries text. Gold provides structure; vermillion is the seal. 朱红仅作印记，≤ 5% of any view.
- **Serif everywhere** (Noto Serif SC / Noto Serif). Mono (IBM Plex Mono) **only** for hex, tokens, data, prices.
- **Bilingual.** CN primary in 思源宋体 (600 / 400 / 300). EN as UPPERCASE, letter-spaced captions/labels.
- **Density follows content.** Ceremonial / low-density for foundations & covers; technical / high-density for tokens & data.
- **No slop.** No stock gradients-as-decoration, no emoji, no rounded-corner+left-accent cards, no Inter/Roboto. Hand-draw nothing more complex than circles + lines (compass, seal).
- **No font-fallback drift.** If a target environment lacks Noto Serif SC, fall back to `Source Han Serif SC` → `Songti SC` → `STSong` — never sans-serif. If a system lacks Noto Serif, fall back to `Source Han Serif` → `Songti SC` — never a default serif like Times.
- **凡判断皆可被客户真实数据证伪并修订.** This spec is a living document — falsifiable, iterable. Any claim is open to revision the moment real shop data disproves it.

---

## 1. Color tokens / 色彩

| token | name 名称 | hex | usage 用途 |
|---|---|---|---|
| `--surface` | 淡墨纸 Pale Manuscript | `#F4F0E7` | base background / canvas 页面底色 |
| `--paper` | 宣纸 Paper | `#FFFDF8` | raised content / image surround 内容层 |
| `--ink-primary` | 素墨 Ink | `#EFE6D2` | **primary brand color** — fields, key actions, highlights 主色·色块·关键操作 |
| `--charcoal` | 玄墨 Charcoal | `#17130D` | titles and primary text 标题·正文 |
| `--gold` | 土金 Earth Gold | `#76551F` | structural accent — rules, strokes, navigation 描边·结构·导航 |
| `--gold-hi` | 明金 Bright Gold | `#D4A862` | highlight — active state, key numbers 高光·关键数字 |
| `--gold-deep` | 深金 Deep Gold | `#76551F` | captions, EN labels, muted gold 题注·英文标识 |
| `--ink-muted` | 素墨灰 Ink Muted | `#706758` | secondary / supporting text 辅助文字 |
| `--seal` | 朱红 Vermillion | `#8C3228` | seal, negation (✕), warnings — ≤5% 印章·否定 |

**Gold ramp (v0.7):** `--gold-100` `#F3E7CF` · `--gold-300` `#D4A862` · `--gold-400` `#A8842F` · `--gold-500` `#76551F` · `--gold-600` `#5C4218` · `--gold-700` `#3F2D0F`. Hover sets one step darker than the base (`--gold-hover` = 600), press two (`--gold-press` = 700). `--gold-deep` stays its own token at the same hex as `--gold` (Q3).

**Inverse surface (v0.7):** `--surface-inverse` = 玄墨, `--text-on-inverse` = 淡墨纸, `--muted-on-inverse`, `--line-inverse`. One card per view (the 百年共创 tier); never a page ground.

**Surfaces (derived, on pale manuscript):**
- panel / raised: `#FFFDF8`
- primary field: `#EFE6D2`
- hairline: `rgba(23,19,13,0.18)` · hairline-strong: `rgba(23,19,13,0.34)`
- card border: `rgba(118,85,31,0.34)`
- shadow (dialogs and overlays only, cards stay bordered — v0.7): `--shadow-1` `0 1px 2px rgba(23,19,13,.08)` · `--shadow-2` `0 2px 6px .10` · `--shadow-3` `0 6px 18px .12` · `--shadow-4` `0 14px 40px .16`

**Rule ratios (≈ ):**
- pale surfaces ≈ 78% of any view.
- deep charcoal text ≈ 12%.
- `--ink-primary` fields and key actions ≈ 7%.
- `--gold` strokes / rules ≈ 3%.
- `--seal` (vermillion) ≤ 5%, the seal spark, never a field.

---

## 2. Typography / 字体

- **CN:** Noto Serif SC (思源宋体) — 600 titles, 400 body, 300 aux (500 / 700 available).
- **EN:** Noto Serif — UPPERCASE, `letter-spacing: 0.3–0.34em`, for captions & labels.
- **Mono:** IBM Plex Mono — hex, tokens, data, prices only.

**Scale** (px / line-height / weight):

| token | size / lh | weight | notes |
|---|---|---|---|
| `display` | 84–96 / 1.0 | 600 | 侍天 lockup, `letter-spacing: 0.14em` |
| `h1` | 56 / 1.1 | 600 | section titles |
| `h2` | 40 / 1.15 | 600 | sub-heads |
| `h3` | 28 / 1.3 | 600 | block heads |
| `body` | 18 / 1.7 | 400 | running text |
| `small` | 14 / 1.8 | 300 | supporting |
| `caption` | 13 / 1.4 | 400 | UPPERCASE, `+0.34em`, color `--gold-deep` |
| `mono` | 13 / 1.5 | 400 | IBM Plex Mono |
| `ui` · `table` · `badge` · `tick` | 16 · 14 · 12 · 11 | 400 | interface steps for dense data surfaces (v0.7); never for running text |

**Signature patterns:**
- Tagline 智慧领航者 — `letter-spacing: 0.5em`, color `--gold-deep` at every size (Q2, v0.7). Bright gold `--gold-hi` is 1.9:1 on pale and is reserved for figures at 28px and above, active states, and charcoal grounds.
- Pair every CN heading with a small UPPERCASE EN caption in `--gold-deep`.

**Bilingual display rules:**
- CN never uses italic; use weight or color (`--gold-hi`) for emphasis.
- Latin headings in Noto Serif can carry italic for editorial quotes; numerals stay mono.
- Line length: target **28–38 CN characters** per line, **60–72 EN chars** per line.

---

## 3. The Mark / 标志

- **主标志 — 罗盘印:** compass ring + 侍. Concentric circles + crosshair lines, `--charcoal` on `--ink-primary` or `--paper`.
- **朱印:** vermillion square seal containing 侍 / 侍天 — covers, back covers, sign-offs only.
- **Archived logo files:** `Sidera/assets/brand-images/sidera-logo.png` (2000×2000) · `Sidera/assets/brand-images/sidera-logo-small.jpeg` (320×320). Prefer the PNG for print/web; small JPEG for avatars / favicon-adjacent use.
- **Misuse ✕:** never rotate, never recolor, never stretch.
- **Clear space:** at least one full compass-ring radius on all sides.
- **Minimum size:** 24px height for inline; 64px for hero placement.
- **Lockup (v0.7):** the published mark already reads 侍天. Never set the CN name beside it; a lockup pairs the mark with the Latin caption `Tiansight` (UPPERCASE-tracked, `--charcoal`) and, where needed, the Table AI Alliance line behind a 1px `--gold` rule.
- **No third-party mark coupling** in a single lockup; pair tiansight marks only with Table AI Alliance wordmark, separated by a 1px `--gold` rule.

---

## 4. Voice & tone / 话术

**Pillars:** 沉稳 Composed · 专业 Professional · 敢言 Forthright · 克制 Restrained · 有据可依 Evidence-based.
**Rule:** 领航而非替决策 — *navigate, don't decide for the client.*

- ✓ **Say:** 「先把账算清，再谈策略。」·「你这家店每天差 18 桌才不亏。」·「这个判断的边界条件是……」·「我们领航，你掌舵；决策权在你。」
- ✕ **Don't:** 「跟着我们一定爆火。」·「现在不做就晚了。」·「我们的方法包治百病。」·「先上系统，数据慢慢补。」

**总纲:** treat every message as a *trust-compounding machine*, not an adversarial game. 战略走王道，战术用霸道。

**Lexicon (preferred / avoided):**

| 优先 / Say | 避免 / Avoid |
|---|---|
| 领航 / 导航 | 赋能 / 抓手 / 闭环 |
| 复利 / 长效 | 包治百病 / 颠覆 |
| 模型 / 体系 | 解决方案 / 打法 |
| 数据校准 | 数据补全 |
| 单店跑通 → 模型锁定 → 体系连锁 → 智能领航 | 增长 / 爆款 / 裂变 (增长 survives only verbatim in the promise line 「增长在何处、利润失于何处」 — Q10) |

---

## 5. Components / 组件

- **Card:** panel `#FFFDF8`, border `1px` charcoal@18%, **radius 2px** (never round), pad 20–28px. Title 18–20 / 600 `--charcoal`; meta = caption in `--gold-deep`. Optional 天干 index (壹 / 贰 / 叁…) in `--seal`, top-right.
- **Token / table row:** hairline top border, swatch 30–34px (radius 2), mono hex in `--gold-hi`, usage in `--ink-muted`.
- **Badge — filled:** `--ink-primary` fill, `--charcoal` text, radius 2, mono — for prices / tiers (`¥1,999 / 月`).
- **Badge — outline:** gold border + `--gold-hi` text, pill — for status (`现役 10 / 28`).
- **✓ / ✕ list:** ✓ in `--gold-hi`, ✕ in `--seal`.
- **Framing:** thin gold rules, double-rule borders, and corner ticks for "manuscript" gravitas. Low-opacity compass-ring watermark behind heroes / section heads.
- **Print/PDF-ready:** pale manuscript background bleeds full-page; all glyphs converted to outline at export.

**Charts / data viz:**
- 1 color series = `--gold-hi`; 2 = `--gold-hi` + `--charcoal`; 3 = `--gold-hi` + `--charcoal` + `--seal`.
- Semantic set (v0.7, reports only, when 增长 must be told from 关注): `--chart-growth` `#4E6B3F` · `--chart-caution` `#B98B2A` · `--chart-benchmark-solid` `#6E6355` · `--chart-loss` = `--seal`. Decks and the website keep the three-series rule.
- Always label axis ticks in `--ink-muted`; never use `--seal` for positive data points.

---

## 6. Brand foundations / 纲领

- **Positioning:** 中高端餐饮连锁的**智慧领航者** / Wisdom Navigator for premium F&B chains.
- **One-liner:** 给中高端连锁装一套「**看得清、改得动、能复利**」的智能领航系统。
- **Mission 使命:** 让每一家有价值的中高端连锁，用数据与方法穿越周期、长效盈利。
- **Vision 愿景:** 携手 10,000 位餐饮老板，打造穿越周期的百年老店。
- **Values 价值观 (5):** 真相优先 · 客户主权 · 效率即良知 · 复利思维 · 敢于证伪。
- **Creeds 信条:** 12 条 (e.g. 模型未锁，扩张即放大亏损 · 现金流先于利润 · 没有数据，你在盲飞 · 这本书，可以被推翻).
- **导航四件套:** 海图 Chart · 罗盘 Compass · 航线 Route · 校正 Correction.
- **Maturity 成熟度:** L1 游击 → L2 单店跑通 → L3 模型锁定 → L4 体系连锁 → L5 智能领航.
- **Product 产品:** 数字员工 (星宿编制, 四象二十八宿, 现役 10 / 28); tiers 经营体检版 ¥8,888 / 90 天 → 增利版 ¥6,888/月 (12个月起签) → 常胜版 ¥11,888/月 (12个月起签) → 百年共创版 (36个月起签 · 基础领航费 ¥29,888/月起 · 增量经营利润成功费 10%–15% · 月度总额封顶 ¥68,888 · 深度共创 · 无增量不收成功费).

---

## 7. Layout / 版式

- Generous negative space on pale manuscript; center key lockups, left-align dense spec content.
- 1–2 background tones max (`--surface` + `--paper`) — decks included: opener and closer sit on pale with the compass watermark (Q11, v0.7). Charcoal appears only as `.ts-card-charcoal`, one card per view. Vermillion is a spark, never a field.
- Cover pattern: EN caption → 侍天 display lockup → gold divider → tagline (0.5em) → CN sub-line, compass watermark behind.
- Print/PDF-ready: fixed canvas, pale manuscript background bleeds full-page.
- Grid: 12-column; max content width 1280px; side gutter 48px desktop / 24px mobile.
- Section rhythm: 96px desktop / 64px mobile; card inner padding 24–32px.

---

## 8. Do's & Don'ts / 行止

**Do:**
- Use serif end-to-end. Pair CN headings with UPPERCASE EN captions in `--gold-deep`.
- Let pale manuscript dominate; charcoal speaks first and gold gives structure.
- Cite real numbers, real shop names (with permission), and the boundary conditions of every claim.
- Treat every chart as a decision aid, not decoration — every series labeled, every axis tick visible.
- Keep vermillion to the seal and to negation/warning moments.

**Don't:**
- No emoji, no gradient-as-decoration, no Inter/Roboto.
- No rounded-corner cards with a colored left accent strip.
- No stock SaaS hero illustrations; if an image is needed, use real restaurant interiors, POS data, or hand-drawn compass/seal elements.
- Don't repaint tiansight into "warm" sunset palettes or "futuristic" neon — the register is manuscript, not UI.

---

## 9. The world-class bar / 验收标尺

A tiansight artifact is "done" when:

1. **Ink first.** `#EFE6D2` carries identity as the primary field and key action color; `#17130D` carries legibility. Gold remains structure, never a crutch.
2. **Manuscript feel.** It looks at home on a fine-paper spread — generous margins, hairline rules, handcrafted seal moments.
3. **Numbered honesty.** Every claim has a boundary and a source. The book is open to being overturned.
4. **Calm authority.** The voice is patient, precise, forthright — never a hype deck.
5. **Falsifiable.** Any judgment in here is open to revision the moment a real shop's data proves it wrong.

> 凡判断皆可被客户真实数据证伪并修订。This spec is a living document — falsifiable, iterable.

---

*tiansight 侍天 Design System · 数字员工 · 餐饮陪跑 · A Member of the Table AI Alliance · v0.7 · Hong Kong*
