The brand lockup. Use in the sticky header (row, 32px) and the closing CTA (column, 96px).

```jsx
<Seal size={32} wordmark subtitle="智慧餐饮" src="../../assets/logo-seal.png" />
<Seal size={96} align="column" wordmark inverse />
```

`src` must be re-pointed to the correct relative path per page. There is no Latin wordmark asset — the component sets TIANSIGHT in type by rule.

The Latin wordmark is two-tone by rule — **INSIGHT in bronze, the T and the A in ink** — so the
word reads as TIANSIGHT and as INSIGHT at once. Use the exported `Wordmark` wherever the seal
isn't wanted; never flatten it to one color.

```jsx
<Wordmark fontSize="var(--text-4xl)" />
<Wordmark fontSize="var(--text-md)" inverse />
```
