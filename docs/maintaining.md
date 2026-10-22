# Maintaining the design system · 维护规程

This repository is the single source of truth for 侍天 TIANSIGHT: foundation, consumers, report
kit, deliverables and the Claude artifacts exported from them. Follow these steps so it stays one
consolidated system instead of parallel copies.

## 1. Order of authority

Each layer derives from the one above it. Never edit a lower layer to change a value that belongs higher up.

| # | Layer | Where | Changed by |
|---|---|---|---|
| 1 | Live brand record (IPTrust) | https://apuch.art/api/brands/tiansight.json | the brand owner |
| 2 | Checked-in snapshot | `brand/source.json` (version, theme, logo, `ip`), `brand/guide.md` | §3 below |
| 3 | Foundation | `brand/tokens.css` → `brand/tokens.json` (`scripts/export_tokens.py`), `brand/base.css`, `brand/components.css` | PR, gate |
| 4 | Content | `content/` (slides, decks, cases, shared data) | PR, gate |
| 5 | Distribution | `dist/` (`scripts/build_dist.py`); component runtime `dist/components/current.json` (`scripts/build_component_runtime.py`) | generated |
| 6 | Consumers | `deck/`, `website/`, `report/`, `people/`, `html-system/`, `templates/`, `deliverables/` | PR, gate; colours only from tokens |
| 7 | Claude exports | Design System artifact, Slides artifacts (see `github.md`) | re-exported from the repo, never edited first |

Fixed decisions (owner-confirmed 2026-10-14):
- Display name: **侍天 TIANSIGHT** everywhere. 侍天 - 智慧餐饮 and tiansight are registry values in `brand/source.json` → `ip`; they are not display copy.
- Official website: https://tiansight.apuch.cn. Brand design system: https://apuch.art/tiansight. This repository's preview (GitHub Pages, no custom domain): https://ksamint.github.io/dsys_tiansight02/.
- Report colours come only from `brand/tokens.json`. The benchmark is the `chart-benchmark` token (translucent); its print reference on 淡墨纸 is `#B9B2A7`, documented, never coded.

## 2. One change, one branch, one PR

1. Before starting, list open PRs (`gh api repos/ksamint/dsys_tiansight02/pulls`). If one already touches the same area, continue on that branch or fold it in. Do not open a second branch next to it.
2. Branch from the latest `main` as `claude/<topic>-<YYYY-MM-DD>`. A shallow clone is fine; run `git fetch origin main` before pushing.
3. Make the change in the highest layer it belongs to, then regenerate the layers below (§4).
4. Run the gate (§4). It must PASS before you push.
5. Open the PR with: what changed, which layers, the checks run, and anything the owner must decide.
6. When a PR is replaced by another, comment "superseded by #N" and close it. Keep the branch until the replacement is merged.
7. After merge, re-export the affected Claude artifacts (§5) and record the sync in `github.md`.

Never push to `main` directly. Never leave two open PRs that change `brand/` at the same time.

## 3. Refreshing the brand snapshot

1. Fetch the live record: `https://apuch.art/api/brands/tiansight.json`. The container shell is blocked by the network policy (403), so use the web-fetch tool, or ask the owner to paste the JSON.
2. Copy into `brand/source.json`:
   - `version.{hash, shortHash, date, message, url}`;
   - `guidePath` (= `primaryGuide`);
   - `ip` (assetKey, name, nativeName);
   - `theme`;
   - `logo`.
   Set `retrieved` to today and say in `syncNote` how the record was fetched.
3. If `theme` changed, update `brand/tokens.css` section 1 and `brand/guide.md` §1 to match. Then run `python3 scripts/export_tokens.py` and `python3 scripts/build_dist.py`.
4. If the guide changed, replace `brand/guide.md` verbatim and record the version in `brand/VERSION` and `CHANGELOG.md`.
5. Run the gate. `scripts/check.py` compares tokens.css with `source.json`'s theme and the guide's colour table.

## 4. Gate and builds

```sh
python3 scripts/check.py                       # foundation, consumers, a11y, dist, report kit, template freshness
python3 scripts/check_contrast.py              # colour pairings against WCAG 2.1 (also in check.py)
python3 scripts/check.py --render              # + layout snapshots (needs global Playwright)
python3 scripts/build_preview.py               # what CI runs (.github/workflows/pages.yml)
python3 deliverables/report-template/gen/template_deck.py         # regenerate the report template
bash templates/report-kit/build.sh <deck.py> <deck dir> [out.pdf] # Slides deck: rules, lint, render, colour, PDF
python3 scripts/build_deck.py --all              # canonical library → maintained decks
python3 scripts/build_deck.py --all --check
python3 scripts/build_assets.py --check
python3 scripts/content_lib.py --check
node scripts/build_deck_catalog.mjs --check
python3 scripts/release.py intro                 # verified PDFs + latestBuilt; not approval
node scripts/test_component_runtime.mjs
```

A deliverable is fresh only when its generator reproduces the committed files: `check.py` fails otherwise.
Rebuild PDFs with `build.sh` whenever slides change. It needs the patched Slides runtime in
`templates/report-kit/runtime/`; see that kit's README.

## 5. Claude artifacts

- **Design System artifact 「侍天 TIANSIGHT」**: https://claude.ai/artifact/3HezHydMsfPFPqnbSbxv7K. Snapshot and import steps are in `archive/claude-design-system-v13/` (`SYNC.md`).
- **Slides 「侍天 TIANSIGHT 报告模板」**: https://claude.ai/artifact/3diuZp85itTBg8knhmuG5P. To refresh it, regenerate with `TSK_BLOBS=<blobs.json>` into a scratch folder, then publish `deck.json` plus `slides/*.html` as `project/…` together with the design-system tokens entry (see `templates/report-kit/README.md`).
- After each re-export, add a dated entry to `github.md`: what changed and which artifact versions.
- Artifacts are private until their owner shares them.

## 6. Public repository

**Never push sensitive data to this public repository.** It is public and its history is permanent: a file removed later stays readable in old commits, pull requests and forks.

Sensitive data means: client deliverables (reports, decks, dashboards, exports), raw or derived client data (POS, member, sales, review exports; spreadsheets; databases), real store-level figures, prices or results, personal data (phone numbers, IDs, addresses, customer names), credentials and tokens, and unpublished contracts or pricing.

Allowed: the approved partner list and logos, owner-approved client references (case names and summaries already published in the company intro), founders' public profiles, and templates and samples with invented or desensitised data marked 「样张 · 虚构数据」 or 「数据已脱敏」.

Where sensitive material lives instead: private repositories or artifacts per client; local folders such as `reference/source/` (git-ignored). Before every push, check the diff for the items above; `scripts/check.py` step 8k blocks raw data files and client folders, but it cannot judge content, so the author still reads the diff. If something sensitive is pushed, stop, tell the owner, and do not try to hide it with a follow-up commit: history must be cleaned or the repository made private.

## 7. Release notes

Every merged PR adds a `CHANGELOG.md` entry under the current `brand/VERSION`. New commands go in `README.md` (§6 Index) and, for skills, in `skills/README.md`.

## 8. Slide library workflow

Edit canonical slides, cases or shared records, then rebuild consuming manifests with
`python3 scripts/build_deck.py --all`. Never copy shared content. Register source and approval
for every asset; run `python3 scripts/build_assets.py`. Regenerate the catalog, then run the
gate and runtime checks. Prepare local review PDFs using `python3 scripts/release.py <deck>`.
The catalog separates `latestBuilt` from `latestApproved`; only production review sets approval,
with `python3 scripts/release.py <deck> --approve --by production-review` (or `--by owner`), which
writes `content/approvals.json`; an approval lapses to null as soon as the deck's content or runtime
version changes. Slides on hold (`publish: hold`) are never listed in a profile filter and never
appear under `build/`.
Historical source snapshots are in `archive/`, excluded from preview. See `docs/architecture.md`.
