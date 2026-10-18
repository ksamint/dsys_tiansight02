# Slides · 侍天 销售提案 (16:9)

Fourteen slides for pitching 侍天 to a restaurant owner. `index.html` is the deck, built on
the `deck-stage` shell (`templates/sales-deck/deck-stage.js` — kept in the template folder so
it stays out of `_ds_bundle.js`). Arrow keys / space, thumbnail rail, slide counter and
print-to-PDF come from the shell. **Do not hand-roll a fit-to-window scaler**; `deck-stage`
owns slide scaling (four attempts at a custom scaler produced blank or clipped decks).

All default copy is lifted from `guidelines/company-intro-2026-09.md`.

| Template | Slide |
|---|---|
| `SlideFrame` | The 1280×720 shell — ground, margins, footer seal, page number. Plus `SlideTitle` and `SlidePlaceholder`. |
| `SlideChart` | Adapter for the d3 chart kit — renders a `components/charts` figure at report scale and enlarges it 1.9× so 10px ticks land at 19px; every kit chart on a slide goes through it. `SlideGrade` is the EGA badge at slide type; slides print caption and 口径 themselves at 19px (no kit chrome on slides) |
| `TitleSlide` | 封面 — ink ground, seal, two-tone wordmark, 从一道菜，到一家家店的好生意。 / 拍板之前，问侍天。 |
| `PromiseSlide` | 主张 — the menu thesis + the three beats 让顾客愿意点 / 让团队做得稳 / 让经营留下收益 (`stats` for a numeric ledger) |
| `SectionSlide` | 节首 — Chinese numeral + oversized outline-seal ornament |
| `FiveQuestionsSlide` (= `StagesSlide`) | 四个阶段 — 开店之前 → 复制扩张 as a numbered step row, one stage bronze; five steps still render the older 经营五问 |
| `ServiceModelSlide` | 服务模式 — 经营诊断 · 运营业绩优化落地辅导 · 第二大脑陪跑 as columns, 服务内容 / 客户价值 / 核心优势 as rows; proposed tier raised; fee line conditional |
| `LadderSlide` | 餐饮第二大脑 — 菜单推演 · 经营看板 · 教练式督导 · 持续复盘 four across; `tiers` + `highlight` for a service ladder |
| `ProofSlide` | 样张为证 — one report page: 证据 / 利润影响 / 执行动作 / 验收指标 ledger left, the 结论 card right with its d3 evidence figure (default `Histogram` of 午市 tickets, 38–58 元 band + share, E1); `chart={null}` for text only |
| `ChartSlide` | 图谱 — d3 figure left, 结论 + 先改这件 right. `figure`: `scatter` 渗透率矩阵 (quadrants at the 全店中位数) · `waterfall` 利润归因 · `corridor` 菜单推演 (E4); each brings title, 结论, 动作, kit caption, EGA badge and 口径. Or pass `chart` (SlideChart-wrapped) with `takeaway` / `action` / `source` |
| `ValueSlide` | 老板看到的价值 — four checkable changes, the 三不 line, the proof line |
| `CaseSlide` | 伙伴案例 — 现状 → 动作 → 验收: the 主指标's monthly `TrendLine` (动作落地 mark, 约定目标 line) with its before → after pair, 护栏指标 pairs beneath, 口径 line; `metrics[0]` is the 主指标, `trend={null}` gives the text ledger; `sample` badge stays on until the partner confirms |
| `PartnerWallSlide` | 伙伴背书 — partner grid + one testimonial |
| `ExpertTeamSlide` | 创始团队 / 专家顾问团 — portrait, name, 头衔, 专长; ≤2 people lay out portrait-left |
| `ContactSlide` | 联系 — 拍板之前，问侍天。 + the diagnosis entry (6 个月 / 7 日内) + WeChat QR + Latin tagline |

**Deck order** (`index.html`, `templates/sales-deck/`): 封面 → 主张 → 节首·服务内容 → 四个阶段 →
服务模式 → 节首·方法论 → 餐饮第二大脑 → 样张为证 → 图谱 → 老板看到的价值 → 伙伴案例 → 伙伴背书 →
创始团队 → 联系. Methodology, value and cases sit at the end by the client's request; the
service content and service model come right after the 主张.

**Deck rules.** Two grounds only: parchment/paper for content, ink for the opener and
closer. Every slide carries `page`. Minimum text size is 19px so it survives projection.
Cards carry no shadow — emphasis is a gold top rule on a paper ground. Charts come from
`components/charts/` (d3 v7) and reach a slide only through `SlideChart`, which enlarges the
kit's report-scale type to the 19px floor — never draw a slide-only chart, never place an
unscaled kit chart. The deck page loads `https://unpkg.com/d3@7.9.0/dist/d3.min.js`; the
template's `ds-base.js` does the same. The three figures follow the 三部曲 — 现状 (`ProofSlide`
histogram), 动作 (`ChartSlide` scatter / waterfall / corridor), 验收 (`CaseSlide` trend) — and
every one states its 口径 and EGA grade; a forecast is E4 and shows its band. Fees are always
"可与…挂钩", never a guarantee; results are shown as before → after pairs, never as a bare uplift.

**Pending assets.** Portraits and `ContactSlide`'s WeChat QR render as labelled dashed
placeholders until real images are supplied; pass `photo` / `qr` to replace them. Partner
names are set in type — no logo artwork was provided. `CaseSlide` ships sample numbers with a
visible 样例数据 badge; replace with a confirmed partner case and set `sample={false}`. The
`ProofSlide` and `ChartSlide` figures run on 样张 data (deterministic, labelled 样张 in their
口径) until a real report figure replaces them.
