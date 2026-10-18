Bronze-stamped action button — use for every CTA (进入平台 / 服务与价格 / 更多伙伴), one `primary` per view.

```jsx
<Button variant="primary" size="lg" icon={<Icon name="arrow-right" />}>进入平台</Button>
<Button variant="secondary">服务与价格</Button>
<Button variant="ghost" size="sm">更多伙伴</Button>
```

Variants: `primary` (bronze #76551F fill), `secondary` (warm-white + hairline), `ghost` (bronze text, parchment hover), `inverse` (for the ink closing band). Sizes sm/md/lg. Press translates 1px down — never scales. Labels stay imperative and ≤6 characters.
