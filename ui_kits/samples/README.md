# Samples · 三份推演页面

Copied verbatim from `uploads/` (user-supplied, 2026-09-19) as reference screens. Each `*.card.html`
wraps the original in an iframe so the page renders unmodified in the Design System tab.

| Card | Original | Built on |
|---|---|---|
| `bakery.card.html` | `bakery-inventory-console.html` (烘焙门店进销存决策台) | d3 7.8 + simple-statistics, brand tokens inline |
| `site.card.html` | `site-simulation.html` (侍天 · 地点推演台) | inline SVG, brand tokens inline |
| `seat.card.html` | `seat-revenue-forecast.html` (席位推演) | inline SVG, Google Fonts |

These are **references, not components**: their figure families are mapped to the chart kit in
`guidelines/viz-sample-review.md`. They keep their own inline styles and do not load `styles.css`.
`seat-revenue-forecast.html` expects a vision API and `window.storage`; those calls fail quietly
in the card and the page still renders.

A fourth sample, a store operating-model long scroll built on one client's real data, was removed on
2026-10-14 (public-repo rule, `docs/maintaining.md` §6); its figure families stay mapped in
`guidelines/viz-sample-review.md` §4. The seat sample's store name is replaced by 示例店.
