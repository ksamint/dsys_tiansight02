# Quickstart

## Open the system

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/> for the hub. Every page also opens directly from disk; nothing is fetched from the network.

## Build a page on the foundation

```html
<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>页面标题 · 侍天 TIANSIGHT</title>
<link rel="stylesheet" href="brand/fonts.css">
<link rel="stylesheet" href="brand/tokens.css">
<link rel="stylesheet" href="brand/base.css">
<link rel="stylesheet" href="brand/components.css">
</head>
<body>
<a class="ts-skip" href="#top">跳到正文</a>
<!-- icons:start -->
<!-- icons:end -->
<main id="top" class="ts-container ts-section">
  <div class="ts-heading">
    <span class="ts-caption">Caption · 题注</span>
    <h1>标题</h1>
    <p class="ts-sub">副题。</p>
  </div>
</main>
</body>
</html>
```

Run `python3 scripts/sync_icons.py` to fill the icon markers, then use icons as `<svg class="ts-icon"><use href="#ts-arrow-right"/></svg>`.

## Consume the system from another site

```html
<link rel="stylesheet" href="https://fengurt.github.io/dsys_tiansight01/dist/tiansight.css">
```

One file carries the font faces, tokens, element defaults and every component. Link `tiansight.css` to follow every push, or `tiansight-v0.6.css` to pin. `dist/example.html` is a working page to copy. Details and the jsDelivr alternative are in [dist/README.md](../dist/README.md).

## Use the tokens elsewhere

`brand/tokens.json` is the same token set in Design Tokens Community Group format, with the mobile overrides under `$extensions.tiansight.modes`. It is generated; edit `brand/tokens.css` and run `python3 scripts/export_tokens.py`.

## Produce a report or deck from data

```sh
python3 html-system/build_deck.py html-system/sample      # manifest + CSV → slides
python3 html-system/check_report.py html-system/sample    # provenance, grades, headline numbers
```

Copy `html-system/sample/manifest.json` as the starting point. The skills in `skills/` describe every chart family, data role and quality check an agent must follow.

## Verify before committing

```sh
python3 scripts/check.py            # guide conformance, build freshness, tokens.json, a11y lint
python3 scripts/check.py --render   # plus headless layout regression against snapshots/layout.json
```

If a layout change is intended, refresh the baseline with `node scripts/snapshot.mjs --update` and commit `snapshots/layout.json`.
