# UI kit · 官网 (marketing site)

Single long-scroll site recreated from the supplied 侍天 page copy. Open `index.html`.

| File | Surface |
|---|---|
| `SiteHeader.jsx` | Sticky translucent header: seal lockup + 报告样张 / 从概念到连锁 / 第二大脑 + 问侍天 |
| `HomeHero.jsx` | 从一道菜，到一家家店的好生意 — hero, three-beat promise, three report-sheet thumbnails (决策维度 / 分析维度 / 方法论地图) |
| `ReportProof.jsx` | 以样张为证 — 经营洞察图谱 chapter switcher (5 matrices) + 90 天行动清单 |
| `FiveQuestions.jsx` | 四阶段 stepper (开店之前 / 经营之中 / 每月复盘 / 复制扩张) + 有依据/有人落实/可以核对 |
| `ServiceLadder.jsx` | 餐饮第二大脑 four capabilities (点单模型 / 经营看板 / 教练式督导 / 持续复盘) + 老板看到的价值 & 结果挂钩 |
| `Partners.jsx` | Partner chips (verbatim list) + three anonymized testimonials |
| `PartnersPage.jsx` | 伙伴案例 (before→after metrics, actions, quote) + 创始团队 (边江 / 郭峰) — its own page at `partners.html` |
| `ClosingCTA.jsx` | Ink band: 拍板之前，问侍天 + contact form + footer |

**Interactions:** header nav smooth-scrolls; 经营洞察图谱 tags swap the chart; the four stage steps
swap the detail card; the contact form submits to a local success state.

**Pages.** `index.html` (home) and `partners.html` (伙伴与专家).

**Notes / gaps.** The report-sheet thumbnails are abstract placeholders — the real 样张
pages were described by name only. The WeChat QR is represented by the seal plus the
微信扫码联系侍天 caption; drop in the real QR image when available. Pricing figures are
absent from the source copy, so the plan cards carry 老板得到 deliverables and engagement
mode only — no prices were invented. Partner case metrics are sample data pending the
brands' sign-off; expert names and portraits are placeholders.
