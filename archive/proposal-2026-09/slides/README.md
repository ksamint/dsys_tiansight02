# Slides · 侍天 销售提案 (16:9)

Eleven slide templates for pitching 侍天 to a restaurant owner. `index.html` is the deck,
built on the `deck-stage` shell — arrow keys / space, thumbnail rail, slide counter and
print-to-PDF come from the shell. **Do not hand-roll a fit-to-window scaler**; `deck-stage`
owns slide scaling (four attempts at a custom scaler produced blank or clipped decks).

| Template | Slide |
|---|---|
| `SlideFrame` | The 1280×720 shell — ground, margins, footer seal, page number. Plus `SlideTitle` and `SlidePlaceholder`. |
| `TitleSlide` | 封面 — ink ground, seal, two-tone wordmark, 拍板之前，问侍天 |
| `PromiseSlide` | 承诺 — 交 6 个月数据，7 日内取得诊断 + mono stat ledger |
| `SectionSlide` | 节首 — Chinese numeral + oversized outline-seal ornament |
| `FiveQuestionsSlide` | 经营五问 — five-step loop, one step bronze |
| `ProofSlide` | 样张为证 — 结论 card with 证据 / 利润影响 / 执行动作 / 验收指标 |
| `ChartSlide` | 图谱 — graphic left, 结论 + 先改这件 right; takes any data component |
| `LadderSlide` | 三层 + X — four tiers, recommended one raised |
| `PartnerWallSlide` | 伙伴背书 — partner grid + one testimonial |
| `ExpertTeamSlide` | 专家顾问团 — circular portrait, name, 头衔, 专长 |
| `ContactSlide` | 联系 — 携手侍天，持续领先 + WeChat QR + Latin tagline |

**Deck rules.** Two grounds only: parchment/paper for content, ink for the opener and
closer. Every slide carries `page`. Minimum text size is 19px so it survives projection.
Charts come from `components/data/` — never draw a slide-only chart.

**Pending assets.** `ExpertTeamSlide` portraits and `ContactSlide`'s WeChat QR render as
labelled dashed placeholders until real images are supplied; pass `photo` / `qr` to replace
them. Partner names are set in type — no logo artwork was provided.
