# Connected product foundation

The published guide remains authoritative. Product applications consume a tested dependency rather than the mutable public preview URL.

## Ownership

- `brand/tokens.css`: brand values, typography, layout and semantic chart tokens.
- `brand/components.css`: reusable controls and interactive states; demonstrate additions in `brand/index.html`.
- `brand/product.css`: opt-in application defaults, not another component library.
- `brand/runtime.js`: safe DOM builders, feedback, notifications, tabs, dialogs and chart theme access. `mount(root)` is idempotent and returns its disposer. Business routes, authorization and data remain in consumers.
- `brand/fonts/`: same-origin WOFF2 subsets, provenance and OFL licenses. No third-party font request is needed.

## Build and verify

```sh
python3 scripts/export_tokens.py
python3 scripts/build_dist.py
python3 scripts/test_product.py
python3 scripts/check.py --render
```

Set `PLAYWRIGHT_MODULE` to an installed Playwright module if it is not installed globally. Update layout baselines only after inspecting intentional changes.

`dist/product/manifest.json` records each asset's SHA-256 and size. Its fingerprint is SHA-256 of sorted UTF-8 records `path + NUL + sha256 + NUL + decimal bytes + newline`; paths sort lexically by ASCII. Timestamps and source commits are excluded for determinism. Consumers record the exact upstream commit separately.

The bundle namespaces variables to `--ts-*`, retains `.ts-*` components and scopes element rules under `.ts-root`. Add `data-design-system="tiansight"` to HTML and `ts-root` to body. Never copy palette values into product components. `globalThis.Tiansight` does not fetch data or bypass permissions.

Legacy `dist/tiansight.css` remains mutable. Existing `dist/tiansight-v*.css` files are frozen, including v0.7. A content-addressed `dist/tiansight-<sha256>.css` is emitted for new builds. Historical pins must never be regenerated in place.

## Consumer upgrades

1. Commit and merge source plus generated distribution through the upstream gate.
2. The consumer resolves that commit, downloads and verifies the complete manifest, and stores immutable assets under their content fingerprint.
3. One dependency PR updates the lock and generated entrypoints. Consumer contracts, browser checks, integrity and drift gates must pass before review and merge.
4. Roll back lock and entrypoints together. Retain published immutable directories for old references.

`vanahom-fb-hom01` implements this with `npm run design:sync -- --ref=<full-commit-sha>`. Its scheduled workflow proposes updates but never auto-merges or deploys. A local `--source=<directory>` preview is explicitly marked `working-tree`, not a release pin.
