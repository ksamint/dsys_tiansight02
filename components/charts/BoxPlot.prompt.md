Box plot — compare distributions and spot outliers across categories (出品时长 by 档口, 账单 by 桌型). Box Q1–Q3, median rule, 1.5 IQR whiskers, outliers as hollow 朱红 points.

```jsx
<BoxPlot caption="出品时长 · 按档口" unit="min" horizontal
  groups={[{ label: "热菜档", values: hot }, { label: "凉菜档", values: cold }, { label: "点心档", values: dim }]} />
```

Prints n per group. Pair with `Histogram` when one distribution's shape matters more than the comparison.
