逐店逐月 heatmap — rows × columns keyed `"<row>|<column>"`; `diverging` splits loss↔growth around zero.

```jsx
<Heatmap caption="逐店逐月 · 同比" diverging unit="%"
  rows={["旗舰店","C 店","D 店"]} columns={["03","04","05","06","07","08"]}
  values={{ "旗舰店|03": 4.2, "C 店|03": -1.8 }} />
```

Tones are semantic, not decorative: `growth` for gains, `loss` for leakage, `caution` for
watch items, `bronze` for totals, `muted` for benchmarks. The consuming page must load
**d3 v7 from CDN**; the chart renders empty until d3 arrives.
