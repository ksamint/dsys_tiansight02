The brand lockup. Use in the sticky header (row, 32px) and the closing CTA (column, 96px).

```jsx
<Seal size={32} wordmark subtitle="智慧领航者" src="../../assets/logo-seal.png" />
<Seal size={96} align="column" wordmark inverse />
```

`src` must be re-pointed to the correct relative path per page. There is no Latin wordmark asset — the component sets TIANSIGHT in type by rule.

The Latin wordmark is two-tone by rule — **INSIGHT in gold-400 at weight 400, the T and the A in ink at weight 700** — so the
word reads as TIANSIGHT and as INSIGHT at once. Use the exported `Wordmark` wherever the seal
isn't wanted; never flatten it to one color.

```jsx
<Wordmark fontSize="var(--text-4xl)" />
<Wordmark fontSize="var(--text-md)" inverse />
```

---
Source: `components/core/Seal.jsx` · types in `components/index.d.ts` (`SealProps`). Available as `window.TIANSIGHT.Seal`.
