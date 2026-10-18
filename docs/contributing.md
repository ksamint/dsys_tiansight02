# Contributing

## Where things live

| Path | Role | Edit? |
|---|---|---|
| `brand/guide.md`, `brand/source.json`, `brand/logo.png` | Published brand, snapshot of the source of truth | Only when the published guide changes |
| `brand/tokens.css` | Every colour, type, space, layout, motion token | Yes, then run `scripts/export_tokens.py` |
| `brand/base.css`, `brand/components.css` | Element defaults and `.ts-` components | Yes |
| `brand/index.html` | Specimen: every rule rendered | Yes, keep it in step with the CSS |
| `brand/tokens.json`, `dist/`, `brand/icons.svg` sprites in pages, `report/index.html`, `people/*.html`, `html-system/sample/index.html` | Generated | No, run the builder |
| `deck/`, `website/`, `report/`, `people/`, `html-system/` | Consumers | Yes |
| `people/profiles.json` | Co-founder profile library: classified entries, sources, grades; contract in `profiles.schema.json`. Public repo: no client or competitor names, prices or store counts | Yes, then run `scripts/build_profiles.py` |
| `TIANSIGHT 侍天 Design System/` | Supplied export, preserved | No |

## Rules the gate enforces

`python3 scripts/check.py` fails on any of these:

- A raw colour, gradient, sans-serif stack or radius other than `var(--radius)`, pill or 50% outside `brand/tokens.css`.
- A `var(--x)` that is not declared.
- Emoji, or a remote script, stylesheet, font or image.
- Guide lexicon on the website.
- A generated file that differs from its builder's output.
- `brand/tokens.json` or `dist/` out of step with the sources; `brand/VERSION` out of step with the guide.
- Any page failing `scripts/lint_html.py`: missing `lang`, `title`, `<main>`, exactly one `h1`, skipped heading levels, an image without `alt`, a control without a label, a button or link without a name, duplicate ids, broken anchors or file targets.
- Any pairing in `scripts/check_contrast.py` below the ratio its level requires, or a waiver without a reason. Add a pairing there when a component introduces a new text or boundary colour.
- A sample report failing `html-system/check_report.py`: a number without a source, a grade higher than its source allows, a headline without its number.

`python3 scripts/check.py --render` adds the layout snapshot comparison.

## Adding a component

1. Write it in `brand/components.css` under a `/* ── Name ── */` header, using tokens only. Write the five states: rest, hover, focus-visible, pressed or selected, disabled.
2. Add it to the specimen (`brand/index.html`) with a short code snippet, and to section 05b if it has states worth showing.
3. If it needs a charcoal variant, add the override under `.ts-ground-charcoal`.
4. Run `python3 scripts/check.py --render`, then `node scripts/snapshot.mjs --update` if the specimen height changed, and commit the baseline.
5. Run `python3 scripts/build_dist.py` so external sites get the component, and add a line to `CHANGELOG.md`. Sites on the latest channel receive it on the next push, so renaming or removing an existing class is a breaking change: keep the old selector working, or bump `brand/VERSION` and say so in the changelog.

## Adding a chart family

Add the function to `html-system/charts.py`, register the family in `html-system/build_deck.py`, add a slide to the sample manifest, and describe it in `skills/ts-dataviz-modules/SKILL.md` with its data roles and the evidence grade it may carry.

## Commits and pull requests

Work on the designated branch, keep generated files in the same commit as the source that produced them, and open a pull request against `main`. Do not merge a red gate.
