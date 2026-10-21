Loads a Lucide glyph from CDN and masks it to `currentColor` — set color on the parent, never inside.

```jsx
<span style={{ color: "var(--bronze-500)" }}><Icon name="trending-up" size={20} /></span>
<Button icon={<Icon name="arrow-right" size={16} />}>进入平台</Button>
```

Substituted set (not the brand's own). Stick to the approved name list in `Icon.d.ts`; never swap in emoji or a hand-drawn SVG.
