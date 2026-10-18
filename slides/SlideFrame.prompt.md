The 16:9 slide shell every 侍天 slide sits in — ground, margins, footer seal, page number.

```jsx
<SlideFrame ground="parchment" eyebrow="四个阶段" page={4} grain>
  <SlideTitle size="lg">从概念到连锁</SlideTitle>
</SlideFrame>
```

Grounds: `parchment` default, `paper` for content-dense slides, `muted` for section breaks,
`ink` for the opener and closer only — **max two grounds per deck**. `SlidePlaceholder` marks
imagery that hasn't been supplied yet (portraits, WeChat QR); replace it with a real `<img>`,
never with a drawn SVG.
