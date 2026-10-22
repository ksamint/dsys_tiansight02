转化漏斗 — stage widths proportional to value, with per-stage drop-off on the right.

```jsx
<Funnel caption="到店转化漏斗" stages={[
  { label: "曝光", value: 12400 }, { label: "进店", value: 3180 },
  { label: "下单", value: 2260 }, { label: "复购", value: 705 }]} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
