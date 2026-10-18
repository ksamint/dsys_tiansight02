The 四象限 chart used across 经营洞察图谱. Quadrant labels go in reading order: TL, TR, BL, BR.

```jsx
<Matrix2x2 xAxis="复购频次" yAxis="客单价"
  quadrants={[{ label: "高价低频 · 待激活", tone: "caution" }, { label: "核心客群 · 守住", tone: "growth" },
              { label: "低价低频 · 观察", tone: "muted" }, { label: "低价高频 · 提升客单", tone: "bronze" }]}
  points={[{ label: "会员 A 层", x: .72, y: .78, tone: "growth" }]} />
```

Keep to 4–8 points per matrix; every point label must exist in the data, never as decoration.
