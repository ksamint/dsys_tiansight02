占比环 — a share breakdown with an optional center figure and a value legend.

```jsx
<Donut caption="客群构成" centerValue="31.2%" centerLabel="会员占比"
  data={[{ label: "会员", value: 31.2, tone: "growth" },
         { label: "平台新客", value: 44.1, tone: "caution" },
         { label: "散客", value: 24.7, tone: "muted" }]} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
