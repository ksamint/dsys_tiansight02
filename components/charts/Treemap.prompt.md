Treemap — hierarchy plus share (菜单结构树: 大类 → 系列 → 品项). Area reads with 2–3× error, so tiles print their value and the legend prints group totals.

```jsx
<Treemap caption="菜单结构 · 净收入" unit=" 元" data={{ name: "菜单", children: [
  { name: "热菜", children: [{ name: "狮子头", value: 48200 }, { name: "清炒河虾仁", value: 39100 }] },
  { name: "凉菜", children: [{ name: "烫干丝", value: 12800 }] } ] }} />
```

Depth-1 groups share one gold step each (never a rainbow). When the reader must compare precisely, use a sorted `BarSeries` instead.
