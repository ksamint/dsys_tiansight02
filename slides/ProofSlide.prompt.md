样张为证 — one report page as the 三部曲 prescribes: one sentence, four elements, one chart. The 结论 card (right) carries the finding and its d3 evidence figure; the 证据 / 利润影响 / 执行动作 / 验收指标 ledger sits left.

```jsx
<ProofSlide page={8} />
<ProofSlide page={8} conclusion="…" elements={four} chartTitle="午市订单客单分布 · 2026-03 至 05" grade="E1" scope="口径：…"
  chart={<SlideChart><Histogram height={120} legend={false} bands={[{ from: 38, to: 58, label: "61% 的订单" }]} values={tickets} /></SlideChart>} />
```

`chart={null}` gives the text-only card. Caption, EGA grade and 口径 are printed by the slide at 19px
(`chartTitle` / `grade` / `scope`) — pass the kit chart without its own. The default figure is a
deterministic 样张 sample and says so in its 口径. The page must load d3 v7. Wraps `SlideFrame` (1280×720) — pass `page`.
