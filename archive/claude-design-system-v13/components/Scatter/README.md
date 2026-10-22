Scatter / bubble — is X related to Y (千单点击 × 毛利率, 价格 × 渗透率). The two important quantities go on position; `r` is only a coarse third magnitude.

```jsx
<Scatter caption="千单点击 × 毛利率" xLabel="千单点击" yLabel="毛利率 %" quadrants quadrantLabels={["高利低点", "明星", "问题", "高点低利"]}
  emphasis={["清炒河虾仁"]} points={skus.map(s => ({ x: s.clicks, y: s.gm, r: s.revenue, label: s.name }))} />
```

Above `canvasThreshold` (1,500) the marks paint to a canvas layer in one frame while axes, quadrant rules and emphasised labels stay in SVG — 10k+ rows remain instant. `trend` adds a dashed least-squares line; it is a description, not causation.

---
Source: `components/charts/Scatter.jsx` · types in `components/index.d.ts` (`ScatterProps`). Available as `window.TIANSIGHT.Scatter`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
