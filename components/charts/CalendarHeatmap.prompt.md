Calendar heatmap — 153 days of daily 实收 as weeks × weekdays, for rhythm and anomalies (假日窗口, 停业, 周中低谷). Colour is coarse: this is for pattern, not for reading values.

```jsx
<CalendarHeatmap caption="日度实收 · 2025-03 → 08" unit=" 元" values={days} grade="E1" scope="堂食 + 外卖净收入" />
<CalendarHeatmap caption="同比" diverging values={yoy} />
```

Single-hue gold ramp by default; `diverging` for change around zero. Pair with a `TrendLine` when the numbers matter.
