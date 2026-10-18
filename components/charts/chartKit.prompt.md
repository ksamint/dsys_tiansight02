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


## Grammar (spec Part B)

Pick the reader's **task** first, then the mark, then the chart — `chartFor(task, shape)` encodes the decision matrix; `TASK_CHARTS` lists first choices per task. Channel precision (Cleveland–McGill): position > length > angle > area > colour — put the important number on position or length, use colour for categories only. Anti-patterns are refused here: no 3D, no dual axes (use `FacetGrid`), no truncated bar baselines, no rainbow ramps, no pie above 5 items.

Every real figure carries `scope` (口径) and a `grade` (EGA.E1–E4) — `ChartFrame` renders both. `rollupDims` does dimension breakdowns; `CanvasLayer` is the fast path for 10k+ marks (Scatter, Gantt use it automatically).
