结构占比 stacked bars — composition across categories; `normalize` makes every bar 100%.

```jsx
<StackedBars caption="渠道结构占比" normalize keys={["堂食","外卖","团购"]}
  tones={{ 堂食: "growth", 外卖: "caution", 团购: "loss" }} data={rows} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
