逐月走势 line chart — one or more series over labelled periods, the report's default time graphic.

```jsx
<TrendLine caption="逐月走势" unit="万" note="数据来源：收银流水 2025-03 至 2025-08。"
  series={[{ name: "本店", tone: "growth", area: true, emphasis: true, points: months },
           { name: "同业均值", tone: "muted", dashed: true, points: peer }]} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
