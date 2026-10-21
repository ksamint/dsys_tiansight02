利润流失归因 waterfall — start value, signed contributions, end value. Gains green, losses red, totals bronze.

```jsx
<Waterfall caption="利润流失归因" start={486} unit="万"
  steps={[{ label: "折扣叠加", value: -24.6 }, { label: "食材损耗", value: -12.1 },
          { label: "套餐结构", value: 18.2 }]} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
