Slope chart — two time points, many items; the slope shows who rose and who fell. Best for "which SKUs changed rank between last month and this month".

```jsx
<SlopeChart caption="渗透率 · 07 → 08" leftLabel="07月" rightLabel="08月" unit="%" highlight={["清炒河虾仁", "蟹粉豆腐"]}
  items={[{ label: "清炒河虾仁", a: 31, b: 38 }, { label: "蟹粉豆腐", a: 22, b: 17 }, { label: "狮子头", a: 28, b: 29 }]} />
```

Highlight at most three items; the rest are muted so the eye lands on what moved. Values label both ends in mono.

---
Source: `components/charts/SlopeChart.jsx` · types in `components/index.d.ts` (`SlopeChartProps`). Available as `window.TIANSIGHT.SlopeChart`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
