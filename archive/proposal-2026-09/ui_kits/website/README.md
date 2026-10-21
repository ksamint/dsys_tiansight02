# UI kit · 官网 (marketing site)

Single long-scroll site recreated from the supplied 侍天 page copy. Open `index.html`.

| File | Surface |
|---|---|
| `SiteHeader.jsx` | Sticky translucent header: seal lockup + 报告样张 / 经营五问 / 服务与价格 + 进入平台 |
| `HomeHero.jsx` | 拍板之前，问侍天 — hero, proof stats, three report-sheet thumbnails (决策维度 / 分析维度 / 方法论地图) |
| `ReportProof.jsx` | 以样张为证 — 经营洞察图谱 chapter switcher (5 matrices) + 90 天行动清单 |
| `FiveQuestions.jsx` | 经营五问 interactive stepper + 看得清/改得动/留得下 |
| `ServiceLadder.jsx` | 三层 + X plan grid + 增长与止损，皆可量化 |
| `Partners.jsx` | Partner chips (verbatim list) + three anonymized testimonials |
| `PartnersPage.jsx` | 伙伴案例 (before→after metrics, actions, quote) + 专家顾问团 roster — its own page at `partners.html` |
| `ClosingCTA.jsx` | Ink band: 携手侍天，持续领先 + 经营诊断申请 form + footer |

**Interactions:** header nav smooth-scrolls; 经营洞察图谱 tags swap the chart; 经营五问 steps
swap the detail card; the contact form submits to a local success state.

**Pages.** `index.html` (home) and `partners.html` (伙伴与专家).

**Notes / gaps.** The report-sheet thumbnails are abstract placeholders — the real 样张
pages were described by name only. The WeChat QR is represented by the seal plus the
微信扫码联系侍天 caption; drop in the real QR image when available. Pricing figures are
absent from the source copy, so the plan cards carry 老板得到 deliverables and engagement
mode only — no prices were invented. Partner case metrics are sample data pending the
brands' sign-off; expert names and portraits are placeholders.
