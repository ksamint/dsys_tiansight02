Calendar heatmap — 153 days of daily 实收 as weeks × weekdays, for rhythm and anomalies (假日窗口, 停业, 周中低谷). Colour is coarse: this is for pattern, not for reading values.

```jsx
<CalendarHeatmap caption="日度实收 · 2025-03 → 08" unit=" 元" values={days} grade="E1" scope="堂食 + 外卖净收入" />
<CalendarHeatmap caption="同比" diverging values={yoy} />
```

Single-hue gold ramp by default; `diverging` for change around zero. Pair with a `TrendLine` when the numbers matter.

---
Source: `components/charts/CalendarHeatmap.jsx` · types in `components/index.d.ts` (`CalendarHeatmapProps`). Available as `window.TIANSIGHT.CalendarHeatmap`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
