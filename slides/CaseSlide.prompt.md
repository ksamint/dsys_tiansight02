伙伴案例 — one engagement as 现状 → 动作 → 结果. The result panel is the 验收 read: the 主指标's monthly path (d3 `TrendLine`, 动作落地 mark, 约定目标 line) plus before → after pairs for it and the 护栏指标. Keep `sample` on until the partner confirms; `brand` only takes verbatim partner names.

```jsx
<CaseSlide brand="清水亭" stage="经营之中 · 运营业绩优化落地辅导" sample={false} page={11}
  situation="…" actions={["…", "…", "…"]}
  metrics={[{ label: "午市套餐渗透率", before: "34%", after: "51%", delta: "+17 pt", tone: "growth" }, /* 护栏 × 2 */]}
  trend={{ unit: "%", points: months, mark: { label: "动作落地", at: "06月" }, target: { label: "约定目标", value: 50 } }}
  scope="口径：…；前后为 … 两个窗口的月均。" />
```

`metrics[0]` is the 主指标; `trend={null}` falls back to the text-only ledger. The page must load d3 v7.
