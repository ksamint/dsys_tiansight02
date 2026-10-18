# Profile architecture

How a co-founder profile goes from data to page, how every parameter stays adjustable, and where another system plugs in.

## One object, three ways to change it

```
people/profiles.json  ──build──▶  people/profile-<id>.html  ──print──▶  PDF
        ▲                              │  ▲
        │ 导出 JSON                    │  │ 导入 JSON · ?data=URL · postMessage
        └──────────────────────────────┘  │
                                 host system (CRM, CMS, an agent)
```

| Layer | What it owns | Changes how |
|---|---|---|
| **Data** `people/profiles.json` | Every claim, its category, its source, its grade | Edit the file, or write a validated payload from another system |
| **Build** `scripts/build_profiles.py` | Structure: which pages, which blocks, which order | Run it after a structural change (a new case, a new category) |
| **Page** `profile-<id>.html` + `profile-edit.js` | Values at run time: any number, title, sentence, logo | Edit in place, import JSON, or push from a host |

The rule: **values move at run time; structure moves at build time.** A page can change 100+ to 120+ on the spot, swap an auxiliary title, or accept a whole new profile object; adding a fourth case, a new category, or a page needs the builder. This keeps the printed document and the live page the same artefact.

## Addressing: every value has a path

Each list entry carries a stable `id`. A path walks the profile object by key, by id, or by index:

```
figures.bj-fig-brands.value          →  "100+"
titles_aux.1.zh                       →  "Table AI 生态合伙人"
cases.bj-case-a.facts.2.v            →  "火锅"
cases.bj-case-a.results.bj-r-a-1.value  →  "+15.3%"
brands.bj-br-hotpot.items            →  ["6 个品牌"]   (a list, printed joined by 、)
branding.logo                         →  "../brand/logo.png"      (library level, not profile)
```

The builder writes each path onto the element that prints it (`data-bind="…"`). The same path can appear several times on a page, and an edit to one updates all of them. Derived displays declare their inputs: the before-and-after strip carries `data-before` and `data-after` paths and redraws when either changes.

## Integration points

**Build-time, for a system of record.** Produce a document that validates against `people/profiles.schema.json`, write it to `people/profiles.json`, run `python3 scripts/build_profiles.py`, then `python3 scripts/check.py`. The gate refuses an unknown category or source, a number without provenance, or a fourth shown title.

**Run-time, for a preview or a live view.**

- `profile-<id>.html?data=https://…/profile.json` — the page fetches the payload on load and applies it. Needs http and CORS on the source.
- From a host page or an iframe parent:

  ```js
  frame.contentWindow.postMessage({ type: 'tiansight:profile', payload: profile }, '*');
  // the page answers { type: 'tiansight:profile:applied', id } once it has rendered
  ```

- From script on the page itself: `window.tiansightProfile.get()`, `.set(payload)`, `.apply()`.
- By hand: 后台 → 导入 JSON, paste or choose a file. A payload can be one profile object, `{ profile }`, or the whole library (the page picks its own id).

**Outbound.** 导出 JSON gives the current state in the same shape the builder reads. Write it back to `profiles.json` to make a run-time change permanent.

**PDF.** 导出 PDF opens the browser's print dialog; the stylesheet already sets A4 pages, page breaks and print colours. For files without a browser, `node scripts/export_profiles.mjs` renders every profile page to `people/export/*.pdf` and also writes a single-file HTML per profile with all styles, script and the mark inlined, which opens anywhere and still carries its backstage.

## What run-time edits cannot do, on purpose

- Change a number's **evidence grade or source**. Those are properties of where a claim came from, not of the claim. A new source is registered in `profiles.json`.
- Show a **fourth auxiliary title**. The boxes disable at three.
- **Add or remove** a case, a brand group, a capability. Structure needs the builder so that page count, pagination and the provenance table stay right.

## Logo positions

Every page prints the 侍天 mark from `branding.logo` in the lockup and the footer. Every cover and the one-page version reserve a **co-brand slot** (`cobrand.logo`, dashed outline on screen, invisible in print when empty). Set `cobrand.logo` to a path or URL and the slot shows it; set `cobrand.label` to print a name instead.

## Versioning

`version` and `issued` print on every cover. Bump `version` when claims change, not when styling does. A run-time edit does not change them; an export carries the version it started from, so a reviewer can tell an edited preview from an issued document.
