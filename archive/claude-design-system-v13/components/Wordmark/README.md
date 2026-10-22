The TIANSIGHT wordmark set in type, two-tone by rule: T and A in ink at weight 700, I · NSIGHT in gold at weight 400, so the name reads as TIANSIGHT and INSIGHT at once.

```jsx
<Wordmark fontSize="var(--text-4xl)" />
<Wordmark fontSize="var(--text-md)" inverse />
```

**Colour and weight, by token**

| Letters | Light ground | Charcoal or photo ground | Weight |
|---|---|---|---|
| T · A | `text-wordmark-ink` (= `charcoal` #17130D) | `text-wordmark-ink-inverse` (= `parchment-100` #F6F1E4) | 700 |
| I · N S I G H T | `text-wordmark-gold` (= `gold-400` #A8842F) | `text-wordmark-gold-inverse` (= `bronze-300` #B0925A) | 400 |

Type style `wordmark`: Noto Serif, uppercase, `.34em` tracking.

**Rules**
- Never set the wordmark in one flat colour, and never split the letters differently.
- The seal already reads 侍天, so a lockup pairs the seal with the wordmark only; the CN name is not set beside the seal.
- `gold-400` holds 3.1:1 on `surface`: use the wordmark at 14px and up, where the weight contrast carries the split.
- Where a component cannot be used (a slide, an email), write one span per letter with the two token colours above.

Props: `fontSize` (any CSS length or token), `inverse` (charcoal or photo grounds).

---
Source: `components/core/Seal.jsx` (exported beside `Seal`). Available as `window.TIANSIGHT.Wordmark`.
