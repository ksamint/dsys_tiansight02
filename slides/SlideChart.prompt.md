Slide adapter for the d3 chart kit — renders a `components/charts` figure at report scale and enlarges it 1.9× so its 10–11px ticks and labels land at ≥19px on a 1280×720 slide. Every kit chart on a slide goes through this; never re-draw a chart with bigger fonts.

```jsx
<SlideChart padRight={24}>
  <Scatter height={180} points={pts} quadrants={{ x: 35, y: 55 }} quadrantLabels={["值得推", "招牌 · 守住", "下架候选", "改配方"]} />
</SlideChart>
```

Pass the kit chart **without** `caption` / `scope` / `grade` — the kit's 10–12px chrome wraps badly
at 1.9×. The slide prints the caption and 口径 itself at 19px and the EGA grade with `SlideGrade`
(`<SlideGrade grade="E4" />`, 朱红 for E4 / degraded). `height` on the chart is in rendered px — the
slide sees ×1.9 (180 → 342). A slide body is ~480px: caption row + 180px svg + two-line 口径 is the
ceiling. `padRight` keeps rendered px free for labels that hang off the right edge
(ForecastCorridor's P10/P50/P90). The page must load d3 v7
(`https://unpkg.com/d3@7.9.0/dist/d3.min.js`); the deck and the sales-deck template already do.
