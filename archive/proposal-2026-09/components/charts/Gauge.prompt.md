指标达成 gauge — a 200° arc with the target ticked; the fill tones itself by attainment.

```jsx
<Gauge caption="午市客单达成" value={92} target={100} unit="%" label="午市客单" />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
