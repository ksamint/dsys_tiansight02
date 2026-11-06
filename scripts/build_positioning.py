"""Generate the website's 三大模型 · 三大基础 section from content/positioning.json.

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


def operating_panel(m):
    cards = []
    for s in m['scenarios']:
        cards.append(
            f'<div class="dim"><span class="ts-caption">{e(s["verb"])} · {e(s["name"])}</span>'
            f'<b>{e(s["question"])}</b>'
            f'<p><span class="k">输入</span>{e(s["inputs"])}</p>'
            f'<p><span class="k">产出</span>{e(s["output"])}</p>'
            f'<p><span class="k">节奏</span>{e(s["cadence"])}</p>'
            f'<p><span class="k">验收</span>{e(s["acceptance"])}</p></div>')
    return f'<div class="dims dims-3">{"".join(cards)}</div>'


def profit_panel(m):
    cards = ''.join(
        f'<div class="dim"><span class="ts-caption">{e(d["en"])}</span><b>{e(d["name"])}</b><p>{e(d["body"])}</p></div>'
        for d in m['dimensions'])
    shift = m['shift']
    return (f'<div class="dims dims-4">{cards}</div>'
            f'<p class="shift"><span class="k">节奏升级</span>由「{e(shift["from"])}」升级为「{e(shift["to"])}」。'
            f'{e(shift["by"])} {e(m["effect"])}</p>')


def talent_panel(m):
    roles = ''.join(
        f'<div class="dim"><span class="ts-caption">{e(r["holds"])}</span><b>{e(r["name"])}</b><p>{e(r["needs"])}</p></div>'
        for r in m['roles'])
    dims = ''.join(f'<li><b>{e(d["name"])}</b> {e(d["body"])}</li>' for d in m['dimensions'])
    shift = m['shift']
    return (f'<div class="dims dims-3">{roles}</div>'
            f'<ul class="ways">{dims}</ul>'
            f'<p class="shift"><span class="k">组织转型</span>{e(shift["from"])} → {e(shift["to"])}。{e(shift["by"])}</p>')


PANELS = {'operating': operating_panel, 'profit': profit_panel, 'talent': talent_panel}


def render(record):
    lead, foundations = record['lead'], record['foundations']
    tabs, panels = [], []
    for i, m in enumerate(record['models']):
        on = 'true' if i == 0 else 'false'
        hidden = '' if i == 0 else ' hidden'
        tabs.append(
            f'<button role="tab" id="model-{m["id"]}" aria-controls="model-panel-{m["id"]}" aria-selected="{on}">'
            f'<span class="ts-step">{e(m["numeral"])}</span><span><b>{e(m["name"])}</b><small>{e(m["tagline"])}</small></span></button>')
        panels.append(
            f'<div id="model-panel-{m["id"]}" class="step-panel" role="tabpanel" aria-labelledby="model-{m["id"]}"{hidden}>'
            f'<span class="ts-caption">{e(m["numeral"])} · {e(m["en"])}</span><h3>{e(m["aim"])}</h3>{PANELS[m["id"]](m)}</div>')
    cards = ''.join(
        f'<div><span class="ts-caption">{e(f["en"])} · {e(f["state"])}</span><b>{e(f["name"])}</b><p>{e(f["body"])}</p></div>'
        for f in foundations['items'])
    status = '' if record['status'] == 'approved' else '<p class="ledger-note">文案为审阅稿，待业主确认后发布。</p>'
    return f'''{START}
<!-- Generated from content/positioning.json by scripts/build_positioning.py ({e(record["version"])}); edit the record, not this block. -->
<section id="models" class="ts-section">
  <div class="ts-container">
    <div class="ts-heading reveal">
      <span class="ts-caption">{e(lead["eyebrow"])}</span>
      <h2>{e(lead["title"])}</h2>
      <p class="ts-sub">{e(lead["body"])}</p>
    </div>
    <div class="models-grid reveal">
      <div class="steps" role="tablist" aria-label="三大模型" aria-orientation="vertical">
        {"".join(tabs)}
      </div>
      <div class="ts-card" style="padding:var(--card-pad-lg)">
        {"".join(panels)}
      </div>
    </div>
    <div class="foundations reveal">
      <span class="ts-caption">{e(foundations["eyebrow"])}</span>
      <h3>{e(foundations["title"])}</h3>
      <p class="ts-sub">{e(foundations["body"])}</p>
      <div class="three">{cards}</div>
      {status}
    </div>
  </div>
</section>
{END}'''


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
