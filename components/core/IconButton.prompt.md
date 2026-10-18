Square icon-only button for headers, table rows and dismissals — always with an aria label.

```jsx
<IconButton icon={<Icon name="menu" />} label="菜单" />
<IconButton icon={<Icon name="cross" />} label="关闭" variant="outline" />
<IconButton icon={<Icon name="print" />} label="打印" variant="primary" />
```

Variants: `quiet` (bare glyph, hover steps to gold), `outline` (宣纸 + card hairline), `primary` (素墨 field + gold hairline — never a gold fill). Sizes sm 28 / md 34 / lg 42. Use brand glyphs only; press stamps 1px down, no shadow.
