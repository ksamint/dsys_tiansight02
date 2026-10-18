Ink-field action button with a gold hairline — use for every CTA (进入平台 / 服务与价格 / 更多伙伴), one `primary` per view.

```jsx
<Button variant="primary" size="lg" icon={<Icon name="arrow-right" />}>进入平台</Button>
<Button variant="secondary">服务与价格</Button>
<Button variant="ghost" size="sm">更多伙伴</Button>
```

Variants: `primary` (素墨 #EFE6D2 fill, 玄墨 text, 1px 土金 hairline — gold is never the fill), `secondary` (宣纸 + card hairline, text and border darken along the gold ramp on hover), `ghost` (gold text, hover/press step the ramp), `inverse` (gold fill for the single charcoal card). No shadows on any button. Sizes sm/md/lg. Press translates 1px down — never scales. Labels stay imperative and ≤6 characters.
