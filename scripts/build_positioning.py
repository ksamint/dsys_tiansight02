"""Generate the website's 1 + 3 + 3 section from content/positioning.json.

python3 scripts/build_positioning.py [--check]

The section sits between `<!-- positioning:start -->` and `<!-- positioning:end -->` in
website/index.html. The record is the only copy of the wording (docs/adr/0002); this builder
owns the markup, and the gate fails when the committed page differs from the builder's output.
"""
from html import escape
from pathlib import Path
import sys

import positioning_lib

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'website/index.html'
START, END = '<!-- positioning:start -->', '<!-- positioning:end -->'


def e(text):
    return escape(str(text), quote=True)


# Brand hairline glyphs from brand/icons.svg (globe and up-arrow drawn in the same style).
ICONS = {
    'store': '<path d="M4 10l1.5-5h13L20 10M5 10v10h14V10M10 20v-6h4v6"/>',
    'chart': '<path d="M4 20h16M6 16l4-5 4 3 5-7"/>',
    'route': '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h6a4 4 0 0 0 0-8H11a4 4 0 0 1 0-8"/>',
    'data': '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    'compass': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1"/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4"/>',
    'check': '<path d="M4 12.5l5 5L20 6.5"/>',
    'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5M12 3.5C9.6 5.8 8.4 8.6 8.4 12s1.2 6.2 3.6 8.5"/>',
    'up': '<path d="M12 20V5M6 11l6-6 6 6"/>',
}
MODEL_ICON = {'operating': 'store', 'profit': 'chart', 'capability': 'route'}
FOUNDATION_ICON = {'knowledge-base': 'data', 'decision-tree': 'compass', 'capability-table': 'check'}
SPARKS = {
    'new-store': ('M6 50 C44 50 58 16 92 13 S140 10 158 9', []),
    'review': ('M6 22 H40 L48 31 L56 22 H96 L104 33 L112 22 H158', [(48, 31), (104, 33)]),
    'turnaround': ('M6 13 C34 16 52 42 76 45 C98 47 112 30 128 20 S150 10 158 9', [(76, 45)]),
}


def icon(name, extra=''):
    return (f'<svg class="icon{extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{ICONS[name]}</svg>')


def spark(sid):
    path, marks = SPARKS[sid]
    dots = ''.join(f'<circle class="spark-mark" cx="{x}" cy="{y}" r="3.5"/>' for x, y in marks)
    return (f'<svg class="spark" viewBox="0 0 164 56" aria-hidden="true" focusable="false"><path class="spark-base" d="M6 52H158"/>'
            f'<path class="spark-line" pathLength="1" d="{path}"/>{dots}</svg>')


def stack(record):
    models, foundations, base = record['models'], record['foundations'], record['base']
    outcomes = ''.join(f'<li>{icon("up", " out-icon")}<b>{e(m["outcome"])}</b></li>' for m in models)
    pillars = ''.join(f'<li><a class="pillar" href="#model-{m["id"]}">{icon(MODEL_ICON[m["id"]])}<span class="p-num">{e(m["numeral"])}</span>'
                      f'<b>{e(m["name"])}</b><span class="p-keys">{" · ".join(e(k) for k in m["keys"])}</span></a></li>' for m in models)
    strata = ''.join(f'<li>{icon(FOUNDATION_ICON[f["id"]])}<b>{e(f["name"])}</b><span>{e(f["full"])}</span></li>' for f in foundations)
    members = '<i> + </i>'.join(e(m) for m in base['members'])
    return f"""<div class="stack reveal" role="group" aria-label="{e(record['lead']['formula'])}">
      <div class="stack-tag" aria-hidden="true"><span>结果</span></div>
      <ul class="stack-row outcomes" aria-label="结果">{outcomes}</ul>
      <div class="stack-tag" aria-hidden="true"><b>3</b><span>模型</span></div>
      <ul class="stack-row pillars" aria-label="三个模型">{pillars}</ul>
      <div class="stack-tag" aria-hidden="true"><b>3</b><span>底座</span></div>
      <ul class="stack-row strata" aria-label="三个底座">{strata}</ul>
      <div class="stack-tag tag-base" aria-hidden="true"><b>{e(base['numeral'])}</b><span>基座</span></div>
      <div class="stack-base">{icon('globe')}<b>{members}</b><span>{e(base['name'])}</span></div>
    </div>"""


def chapter_head(m):
    return (f'<header class="ch-head"><span class="ch-num" aria-hidden="true">{e(m["numeral"])}</span>'
            f'<h3 id="model-{m["id"]}-title"><span class="ch-name">{e(m["name"])}</span><span class="ts-visually-hidden">：</span>'
            f'<span class="ch-out">{e(m["outcome"])}</span></h3><span class="ts-caption">{e(m["en"])}</span></header>')


def operating(m):
    items = ''.join(f'<li class="scenario"><span class="sc-verb">{e(s["verb"])}</span><span class="sc-name">{e(s["name"])}</span>'
                    f'<div class="sc-figure">{spark(s["id"])}<span class="sc-tick">示意</span></div></li>' for s in m['scenarios'])
    return f'<ol class="scenarios">{items}</ol>'


def profit(m):
    steps = ''.join(f'<li class="flow-step{" leak" if f.get("loss") else ""}"><span class="flow-no">0{i + 1}</span><b>{e(f["name"])}</b></li>'
                    for i, f in enumerate(m['flow']))
    cells = lambda filled: ''.join('<i class="on"></i>' if filled(i) else '<i></i>' for i in range(30))
    r = m['rhythm']
    return (f'<div class="flow" role="group" aria-label="{" × ".join(e(s) for s in m["sources"])} → {e(m["flow"][-1]["name"])}">'
            f'<ul class="flow-src">{"".join(f"<li>{e(s)}</li>" for s in m["sources"])}</ul><ol class="flow-steps">{steps}</ol></div>'
            f'<figure class="rhythm" aria-label="{e(r["from"])} → {e(r["to"])}">'
            f'<div class="rh-row"><span class="rh-label">{e(r["from"])}</span><span class="rh-cells" aria-hidden="true">{cells(lambda i: i == 29)}</span></div>'
            f'<div class="rh-row now"><span class="rh-label">{e(r["to"])}</span><span class="rh-cells" aria-hidden="true">{cells(lambda i: True)}</span></div>'
            f'<div class="rh-axis" aria-hidden="true"><span>D1</span><span>D30</span></div></figure>')


def capability(m):
    pos = ((50, 9), (85.5, 70.5), (14.5, 70.5))
    nodes = ''.join(f'<li style="--x:{x}%;--y:{y}%"><span class="cy-no">0{i + 1}</span><b>{e(k)}</b></li>' for i, (k, (x, y)) in enumerate(zip(m['keys'], pos)))
    roles = ''.join(f'<li class="agent">{e(r["name"])}</li>' if r.get('agent') else f'<li>{e(r["name"])}</li>' for r in m['roles'])
    ring = ('<svg class="cycle-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><marker id="cy-arrow" viewBox="0 0 10 10" refX="7" refY="5" '
            'markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="cy-head" d="M1 1L8 5L1 9"/></marker></defs>'
            '<path class="cy-arc" marker-end="url(#cy-arrow)" d="M128 29A82 82 0 0 1 172 120"/><path class="cy-arc" marker-end="url(#cy-arrow)" d="M150 161A82 82 0 0 1 50 161"/>'
            '<path class="cy-arc" marker-end="url(#cy-arrow)" d="M28 120A82 82 0 0 1 72 29"/></svg>')
    s = m['shift']
    return (f'<div class="capability"><div class="cycle" role="group" aria-label="{" → ".join(e(k) for k in m["keys"])}">{ring}'
            f'<div class="cycle-core"><b>{" · ".join(e(x) for x in m["focus"])}</b></div><ol class="cycle-nodes">{nodes}</ol></div>'
            f'<div class="cap-side"><ul class="roles" aria-label="角色">{roles}</ul>'
            f'<div class="shift-line"><span>{e(s["from"])}</span><i aria-hidden="true"></i><span class="to">{e(s["to"])}</span></div></div></div>')


BODIES = {'operating': operating, 'profit': profit, 'capability': capability}


def render(record):
    chapters = '\n    '.join(
        f'<article class="chapter reveal" id="model-{m["id"]}" aria-labelledby="model-{m["id"]}-title">{chapter_head(m)}{BODIES[m["id"]](m)}</article>'
        for m in record['models'])
    note = '' if record['status'] == 'approved' else '\n    <p class="ledger-note">文案为审阅稿，待业主确认后发布。</p>'
    return f"""{START}
<!-- Generated from content/positioning.json by scripts/build_positioning.py ({e(record["version"])}); edit the record, not this block. -->
<section id="models" class="ts-section">
  <div class="ts-container">
    <div class="ts-heading reveal"><span class="ts-caption">{e(record['lead']['formula'])}</span><h2>{e(record['lead']['title'])}</h2></div>
    {stack(record)}
    {chapters}{note}
  </div>
</section>
{END}"""


def build(check=False):
    record = positioning_lib.load(ROOT)
    page = PAGE.read_text()
    start, end = page.find(START), page.find(END)
    if start < 0 or end < 0 or end < start:
        raise SystemExit('website/index.html: positioning markers missing')
    fresh = page[:start] + render(record) + page[end + len(END):]
    if fresh != page:
        if check:
            raise SystemExit('Stale positioning section: run python3 scripts/build_positioning.py')
        PAGE.write_text(fresh)
    print(f"Positioning section {'checked' if check else 'built'} ({record['version']}, {record['status']})")


if __name__ == '__main__':
    build('--check' in sys.argv)
