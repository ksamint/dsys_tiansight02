Forecast corridor — history, a P10–P90 band with its P50, a dashed baseline and 实测 points side by side, as the methodology requires (预测卡并排显示基线、情景与实测).

```jsx
<ForecastCorridor caption="预测走廊 · 月度净收入" unit=" 万" grade="E4" scope="滚动原点回测，样本外"
  history={[{ label: "05", value: 82 }, { label: "06", value: 85 }, { label: "07", value: 88 }]}
  forecast={[{ label: "08", p10: 84, p50: 90, p90: 96 }, { label: "09", p10: 83, p50: 92, p90: 101 }]}
  baseline={[{ label: "08", value: 86 }, { label: "09", value: 87 }]} actual={[{ label: "08", value: 91 }]} />
```

The band is the message — never narrow it to look confident, and never label a P50 as 已节省. Grade forecasts E4.
