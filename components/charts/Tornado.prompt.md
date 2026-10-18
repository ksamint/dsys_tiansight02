Tornado — which assumption moves the answer most. Each row is one variable swung ±x% with its effect on the target (年净利, 毛利) drawn around the base; rows sorted by total swing, so the top bar is the thing to watch.

```jsx
<Tornado caption="年净利敏感性 · ±10%" unit=" 万" grade="E4" scope="蒙特卡洛 1,600 次；其余变量固定在 P50"
  rows={[{ label: "客流", low: -48, high: 46 }, { label: "客单价", low: -31, high: 31 }, { label: "食材成本率", low: 19, high: -19 }, { label: "租金", low: 8, high: -8 }]} />
```

`low`/`high` are the target's deltas when the variable goes down / up — a cost variable therefore has a positive `low`. Always E4: it is a model, not a measurement.
