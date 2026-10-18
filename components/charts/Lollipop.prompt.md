Lollipop rank — the same channel as a bar (position on a common scale) with a fraction of the ink. Right for ranks of 8–30 items such as the 高毛利样本 (Q2f).

```jsx
<Lollipop caption="毛利率 · 高毛利样本" unit="%" threshold={65} thresholdLabel="加权均值" highlight={["蟹粉豆腐"]}
  rows={skus.map(s => ({ label: s.name, value: s.gm }))} />
```

Sorted by value by default. Use `BarSeries` when the values are the message and need the visual weight; use this when the order is.
