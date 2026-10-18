Two-state comparison — use when the question is "how much did each item move between P1 and P2" (KPI before/after, 试点 vs 对照). Position on a shared scale beats a grouped-bar pair.

```jsx
<Dumbbell caption="六项 KPI · P1 → P2" unit="%" grade="E1" scope="同口径净收入，可比门店"
  rows={[{ label: "毛利率", before: 58.2, after: 61.4 }, { label: "折扣率", before: 12.1, after: 8.3 }]} />
```

`semantic` (default) colours the change 增长 green / 利润流失 朱红; set false for brand gold. Rows are drawn in the order given — sort them yourself when the reader should rank.
