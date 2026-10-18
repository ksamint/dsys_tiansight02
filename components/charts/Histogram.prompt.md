Histogram — where do values concentrate, how many peaks (人均消费双峰, 账单分布). Bars from zero, optional density curve, dashed marks for mean / thresholds.

```jsx
<Histogram caption="人均消费分布" unit="元" bins={24} values={apc} grade="E1" scope="堂食账单 ÷ 登记人数"
  marks={[{ label: "均值", value: 86 }, { label: "预算上限", value: 120, tone: "loss" }]} />
```

Bin edges snap to nice values; state n in the legend (automatic). Use `BoxPlot` when comparing distributions across categories.
