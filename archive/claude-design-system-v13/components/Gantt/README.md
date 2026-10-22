Gantt — when did it start, how long did it last (148 SKU 生命跨度, 菜单版本, 试点窗口). Horizontal, so it is the natural 21:9 chart.

```jsx
<Gantt caption="SKU 在售跨度" today="2025-08-31" groupTone={{ 招牌: "key", 时令: "gold", 已下架: "muted" }}
  rows={[{ label: "狮子头", start: "2025-03-01", end: "2025-08-31", group: "招牌" }, { label: "春笋步鱼", start: "2025-03-10", end: "2025-05-20", group: "时令" }]} />
```

Above `canvasThreshold` rows the bars paint to canvas at 4px each and only every k-th label is drawn — the shape of the whole catalogue stays readable in one frame. Zero sales while 下架 is supply, not demand: keep 在售 spans honest.

---
Source: `components/charts/Gantt.jsx` · types in `components/index.d.ts` (`GanttProps`). Available as `window.TIANSIGHT.Gantt`. Charts draw with d3 v7 (`window.d3`, loaded before the bundle here); they render empty until d3 is present and never throw.
