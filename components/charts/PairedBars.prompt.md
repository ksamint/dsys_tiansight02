Paired bars — 版面 vs 产出: SKU 占比 (muted) and 营收占比 (gold) per 价格带 on one shared scale, with the gap printed in 增长 / 朱红. The biggest misalignment is the menu real estate being mis-spent.

```jsx
<PairedBars caption="价格带 · SKU 占比 vs 营收占比" aLabel="SKU 占比" bLabel="营收占比" grade="E1"
  rows={[{ label: "<40 元", a: .31, b: .18 }, { label: "40–69", a: .28, b: .27 }, { label: "60–80", a: .09, b: .089 }, { label: "80+", a: .32, b: .46 }]} />
```

Both bars start at zero on one scale — the independent-scale variant is refused (it fakes alignment). Keep the categories in their natural order for bands.
