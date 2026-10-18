Small multiples — when a chart needs one more dimension, add a panel, not an encoding channel. Same chart, same scale, one facet per value; the reader scans it like a table.

```jsx
<FacetGrid caption="日度实收 · 按门店" columns={4} panels={stores.map(s => ({ title: s.name, meta: "n=" + s.days, series: s.series }))}
  max={globalMax} render={(p, ctx) => <Sparkline points={p.series} width={ctx.width} height={ctx.height} max={ctx.max} />} />
```

For the common case — a measure broken down by 1–2 dimensions as bars — use `FacetBars`, which does the rollup and the shared scale for you. This is the 21:9 answer to "one chart, three tasks".
