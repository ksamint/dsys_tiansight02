Not a chart — the shared grammar all 侍天 charts draw through. Reach for it before restyling anything.

```jsx
const d3 = useD3();
const [wrapRef, width] = useWidth(560);
// ... build scales with d3, then:
<ChartFrame caption="逐月走势" note="数据来源：收银流水" width={width} height={260}>
  <Axes x={x} y={y} width={width} height={260} grid />
  {/* marks */}
</ChartFrame>
```

Legends are HTML (`ChartLegend`), never SVG `<g>` elements — an in-SVG legend with a fixed
stride overflows narrow containers, and `ChartFrame`'s svg is `overflow: visible` so it
spills past the panel instead of clipping. Reserve chart gutters as a FRACTION of the
measured width, never a fixed pixel budget, or the marks collapse in a two-column layout.

Rules: tones come from `tone("growth" | "loss" | "caution" | "bronze" | "datum" | "muted")`;
axis ticks are mono; no gridlines unless `grid`; no legends unless a series is genuinely
ambiguous. **d3 v7 must be loaded from CDN** by the consuming page.
