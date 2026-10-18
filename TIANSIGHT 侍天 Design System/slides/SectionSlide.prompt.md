Section divider with a Chinese numeral and the oversized outline-seal ornament.

```jsx
<SectionSlide index={2} title="经营五问" subtitle="逐店逐月，循环推演。" page={3} />
```

Wraps `SlideFrame` (1280×720, footer seal, page number) — pass `page` so the deck numbers
itself. All slide text sits at 19px+ so it stays readable projected; never shrink below that.
