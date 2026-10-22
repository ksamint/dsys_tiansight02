指标达成 gauge — a 200° arc with the target ticked; the fill tones itself by attainment.

```jsx
<Gauge caption="午市客单达成" value={92} target={100} unit="%" label="午市客单" />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.

---
Source: `components/charts/Gauge.jsx` · types in `components/index.d.ts` (`GaugeProps`). Available as `window.TIANSIGHT.Gauge`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
