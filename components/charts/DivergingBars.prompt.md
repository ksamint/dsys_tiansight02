Diverging bars — who sits above and below a target (3-4-2-1 结构偏离, 门店 vs 均值). Bars start at the zero rule on both sides.

```jsx
<DivergingBars caption="价格带占比 · 与目标偏离" unit="pp" targetLabel="目标"
  rows={[{ label: "20–38 元", value: 6.2 }, { label: "38–58 元", value: -4.1 }, { label: "58–88 元", value: -1.3 }]} />
```

Sorted by value by default; pass `sorted={false}` only when the categories are themselves ordered (price bands, months).
