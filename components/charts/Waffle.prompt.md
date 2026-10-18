Waffle — a share told as a count: "每 100 件出炉，71 件卖掉、9 件报废、20 件留到明天". One cell = 1 of the grid; largest-remainder rounding keeps the cells summing.

```jsx
<Waffle caption="每 100 件出炉的去向" unitLabel="件" totalLabel="口径：厨房烘焙渠道，6 天窗口"
  parts={[{ label: "卖给顾客", value: 71, tone: "key" }, { label: "当天报废", value: 9, tone: "seal" }, { label: "留到明天", value: 20, tone: "muted" }]} />
```

Use for one composition with ≤4 parts read by a non-analyst; `StackedBars` when composition changes over time; `Mekko` for two categoricals.
