The 九宫格 — a dimension × dimension matrix of the SKU roster. Cell shade = SKU count (or a measure), "·" marks an empty cell as a 研发补缺 candidate, and clicking a cell lists the SKUs behind it. Row/column keys come from the dimension contract (`DIMENSION_LABELS`); the seven structure presets live in `STRUCTURE_PRESETS`.

```jsx
<NineGrid items={dishes} rowDim="flavor" colDim="craft" grade="E1" scope="analysis_cohort = 菜品；酒水不进分母" />
<NineGrid items={dishes} rowDim="ingredient" colDim="price_band" measure="amt" unit=" 元" />
```

Feed it the 菜品 cohort only — 外购酒水 / 现制饮品 / 茶水 carry no 味型 or 工艺 and must be filtered upstream. Colour is ordinal: read patterns and gaps here, precise values in the detail list or a `BarSeries`.
