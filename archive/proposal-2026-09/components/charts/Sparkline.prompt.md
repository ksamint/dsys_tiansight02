表内微图 — a bare inline trend for a table cell or MetricRow. No axes, no labels, no tooltip.

```jsx
<Sparkline values={[112, 118, 109, 124, 131, 132]} toneName="growth" />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
