Renders one of 侍天's own hairline icons (stroke 1.5, round caps, no fill, currentColor) — use it anywhere a glyph is needed instead of inlining SVG.

```jsx
<Icon name="compass" size={20} />
<Icon name="arrow-right" style={{ color: "var(--gold)" }} />
```

Brand set: `arrow-right` `arrow-up-right` `arrow-left` `arrow-down` `chevron-down` `check` `cross` `menu` `external` `print` `chart` `compass` `route` `correction` `store` `data` `seal`.

Common Lucide names are aliased onto the brand set (`x`→cross, `line-chart`/`trending-up`→chart, `target`→compass, `shield`/`circle-dot`→seal, `layers`→route). Anything else falls back to a Lucide CDN mask — that fallback is a flagged substitution, so prefer a brand name where one fits. Never emoji.
