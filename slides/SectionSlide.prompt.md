Section divider with a Chinese numeral and the oversized outline-seal ornament.

```jsx
<SectionSlide index={1} title="从概念到连锁" subtitle="开店之前 · 经营之中 · 每月复盘 · 复制扩张" page={3} />
```

Wraps `SlideFrame` (1280×720, footer seal, page number) — pass `page` so the deck numbers
itself. All slide text sits at 19px+ so it stays readable projected; never shrink below that.
