Pareto for ABC analysis (A2f · m4.pareto): SKUs ranked by 额, bars shaded by class, and the cumulative share as a charcoal line on a right axis fixed at 0–100%. Dashed rules mark the A (80%) and B (95%) cuts.

```jsx
<Pareto caption="SKU 累计销售额 · ABC" unit=" 元" rows={skus.map(s => ({ label: s.name, value: s.amt }))} grade="E1" scope="W1 当前窗；核心 SKU" />
```

This is the one two-axis figure the grammar tolerates, because the right axis is a fixed percentage and both axes are labelled. The legend prints how many items fall in each class. True ABC on contribution margin needs cost coverage ≥98% — otherwise say ABC-额.
