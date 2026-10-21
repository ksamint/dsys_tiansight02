Lollipop rank — the same channel as a bar (position on a common scale) with a fraction of the ink. Right for ranks of 8–30 items such as the 高毛利样本 (Q2f).

```jsx
<Lollipop caption="毛利率 · 高毛利样本" unit="%" threshold={65} thresholdLabel="加权均值" highlight={["蟹粉豆腐"]}
  rows={skus.map(s => ({ label: s.name, value: s.gm }))} />
```

Sorted by value by default. Use `BarSeries` when the values are the message and need the visual weight; use this when the order is.

---
Source: `components/charts/Lollipop.jsx` · types in `components/index.d.ts` (`LollipopProps`). Available as `window.TIANSIGHT.Lollipop`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
