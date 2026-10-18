Marimekko — two categoricals in one composition: 区域 × 品类, 渠道 × 价格带. Column width is the outer category's share of the total; segment height is the inner share within it.

```jsx
<Mekko caption="销售额 · 区域 × 品类" grade="E1" columns={regions.map(r => ({ label: r.name, parts: r.cats.map(c => ({ label: c.name, value: c.amt })) }))} />
```

Areas read coarsely, so large segments print their share; put the total in the caption. ≤6 inner parts, or the gold ramp runs out of steps.
