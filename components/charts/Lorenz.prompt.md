Lorenz curve — how concentrated the 货盘 is, in one number (Gini) and one marker (前 20% SKU → x% 销售额). Complements `Pareto`, which names the A items.

```jsx
<Lorenz caption="货盘集中度" values={skus.map(s => s.amt)} topShare={0.2} itemLabel="SKU" valueLabel="销售额" grade="E1" />
```

Items are sorted ascending internally. A Gini near 0.8 with a thin middle means a catalogue of 全国统一款 plus 单店特供款 — say so in the note.
