Dimension analysis — the spec's F32 example (配菜带率 × 市别 × 区域) in one call: give it the fact rows and two dimension keys, it rolls up, keeps one scale across facets, sorts bars, and prints n.

```jsx
<FacetBars caption="配菜带率 · 市别 × 区域" rows={facts} dims={["市别", "区域"]} measure="带率" agg="mean" percent columns={3}
  highlight="城北" scope="堂食账单，带配菜账单数 ÷ 全部账单数" grade="E1" />
```

One dimension (`dims={["区域"]}`) gives a single ranked panel; two give facet × bar. `highlight` follows one category across all facets — the fastest way to show "晚市是午市的 5.8 倍". Pass `facets` when the aggregation already happened upstream (mart layer).
