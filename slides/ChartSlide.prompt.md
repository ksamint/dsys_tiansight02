图谱 slide: one d3 figure left, 结论 + 先改这件 right. Three built-in figures (样张 data, kit charts through `SlideChart`) — pick with `figure`; each brings its own title, 结论, 动作, kit caption, EGA badge and 口径 line.

```jsx
<ChartSlide figure="scatter" page={9} />     // 渗透率矩阵 — Scatter, quadrants at the 全店中位数, 气泡 = 月均销量
<ChartSlide figure="waterfall" page={9} />   // 利润归因 — Waterfall, 去年同期 → 当期 by driver
<ChartSlide figure="corridor" page={9} />    // 菜单推演 — ForecastCorridor, P10–P90 band, 基线, 实测 (E4)
```

For a real figure pass `chart` (wrap a kit chart in `SlideChart`) with your own `takeaway`,
`action` and `source`. The page must load d3 v7. Wraps `SlideFrame` (1280×720, footer seal,
page number) — pass `page`. All slide text sits at 19px+; the adapter keeps chart type there too.
