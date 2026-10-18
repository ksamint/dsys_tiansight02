"""Render report/index.html from report/template.html and report/data.json.

python3 scripts/build_report.py          # write report/index.html
python3 scripts/build_report.py --check  # exit 1 if report/index.html is stale

Pure stdlib. Charts are inline SVG using the .ts-chart classes from brand/components.css:
series-1 bright gold, series-2 charcoal, series-3 vermillion (warnings only), 0 = benchmark.
"""
from pathlib import Path
import html
import json
import math
import sys

root = Path(__file__).resolve().parents[1]
report = root / 'report'
DATA = json.loads((report / 'data.json').read_text())
MONTHS = DATA['meta']['months']

SERIES = {0: 'benchmark-fill', 1: 'series-1', 2: 'series-2', 3: 'series-3'}
TONE_CLASS = {'positive': 'tone-positive', 'negative': 'tone-negative', 'watch': 'tone-watch', 'charcoal': 'ts-charcoal', 'muted': 'ts-muted'}


def esc(s):
    return html.escape(str(s), quote=True)


def fmt(v):
    return f'{v:g}'


# ── charts ──────────────────────────────────────────────────────────────

def bars_h(items, maximum, unit='', width=560, row=40, label_w=118):
    h = len(items) * row + 8
    x0, track = label_w + 12, width - label_w - 84
    out = [f'<svg viewBox="0 0 {width} {h}" role="img" aria-label="条形图">',
           f'<line class="axis-base" x1="{x0}" y1="4" x2="{x0}" y2="{h - 4}"/>']
    for i, it in enumerate(items):
        y = 8 + i * row
        w = round(track * it['value'] / maximum)
        note = f" · {it['note']}" if it.get('note') else ''
        out.append(f'<text class="bar-label" x="{label_w}" y="{y + 18}" text-anchor="end">{esc(it["label"])}</text>'
                   f'<rect class="{SERIES[it["series"]]}" x="{x0}" y="{y + 5}" width="{w}" height="18"/>'
                   f'<text class="bar-value" x="{x0 + w + 8}" y="{y + 18}">{fmt(it["value"])}{esc(unit)}{esc(note)}</text>')
    out.append('</svg>')
    return ''.join(out)


def matrix(m, width=560, height=360):
    px0, py0, px1, py1 = 60, 20, width - 20, height - 40
    pw, ph = px1 - px0, py1 - py0
    mx, my = px0 + pw / 2, py0 + ph / 2
    q = m['quadrants']
    out = [f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="{esc(m["y"])} × {esc(m["x"])} 四象限">',
           f'<g class="axis"><line x1="{px0}" y1="{py0}" x2="{px0}" y2="{py1}"/><line x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/>'
           f'<line x1="{mx}" y1="{py0}" x2="{mx}" y2="{py1}" stroke-dasharray="3 4"/><line x1="{px0}" y1="{my}" x2="{px1}" y2="{my}" stroke-dasharray="3 4"/></g>',
           f'<g class="quad"><text x="{px0 + 10}" y="{py0 + 16}">{esc(q[0])}</text><text x="{px1 - 10}" y="{py0 + 16}" text-anchor="end">{esc(q[1])}</text>'
           f'<text x="{px0 + 10}" y="{py1 - 8}">{esc(q[2])}</text><text x="{px1 - 10}" y="{py1 - 8}" text-anchor="end">{esc(q[3])}</text></g>',
           f'<g class="tick"><text x="{mx}" y="{height - 12}" text-anchor="middle">{esc(m["x"])} →</text>'
           f'<text x="20" y="{my}" text-anchor="middle" transform="rotate(-90 20 {my})">{esc(m["y"])} →</text></g>']
    for p in m['points']:
        cx, cy = round(px0 + p['x'] * pw), round(py1 - p['y'] * ph)
        out.append(f'<circle class="{SERIES[p["series"]]}" cx="{cx}" cy="{cy}" r="8"/>'
                   f'<text class="pt-label" x="{cx + 13}" y="{cy + 4}">{esc(p["label"])}</text>')
    out.append('</svg>')
    return ''.join(out)


def trend(t, width=560, height=250):
    px0, py0, px1, py1 = 48, 16, width - 16, height - 36
    lo, hi = t['min'], t['max']
    n = len(MONTHS)
    xs = [px0 + i * (px1 - px0) / (n - 1) for i in range(n)]
    ys = lambda v: py1 - (v - lo) / (hi - lo) * (py1 - py0)
    out = [f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="逐月走势">', '<g class="axis">']
    for k in range(5):
        v = lo + (hi - lo) * k / 4
        out.append(f'<line x1="{px0}" y1="{ys(v):.0f}" x2="{px1}" y2="{ys(v):.0f}"/>')
    out.append('</g><g class="tick">')
    for k in range(5):
        v = lo + (hi - lo) * k / 4
        out.append(f'<text x="{px0 - 8}" y="{ys(v) + 4:.0f}" text-anchor="end">{fmt(v)}</text>')
    for i, m in enumerate(MONTHS):
        out.append(f'<text x="{xs[i]:.0f}" y="{height - 14}" text-anchor="middle">{m}月</text>')
    out.append('</g>')
    for s in t['series']:
        pts = ' '.join(f'{xs[i]:.0f},{ys(v):.0f}' for i, v in enumerate(s['values']))
        cls = 'benchmark' if s['kind'] == 'benchmark' else SERIES[s['kind']]
        sw = 1 if cls == 'benchmark' else 2
        out.append(f'<polyline class="{cls}" stroke-width="{sw}" points="{pts}"/>')
        last = s['values'][-1]
        out.append(f'<text class="label" x="{xs[-1]:.0f}" y="{ys(last) - 8:.0f}" text-anchor="end">{esc(s["name"])} {fmt(last)}{esc(t["unit"])}</text>')
    out.append('</svg>')
    return ''.join(out)


def stacked(c, width=560, height=250):
    px0, py0, px1, py1 = 48, 16, width - 16, height - 36
    n = len(c['rows'])
    slot = (px1 - px0) / n
    bw = slot * 0.56
    mid = (py0 + py1) / 2
    out = [f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="渠道结构占比">',
           f'<g class="axis"><line x1="{px0}" y1="{py0}" x2="{px1}" y2="{py0}"/><line x1="{px0}" y1="{mid:.0f}" x2="{px1}" y2="{mid:.0f}"/></g>',
           f'<line class="axis-base" x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/>',
           f'<g class="tick"><text x="{px0 - 8}" y="{py0 + 4}" text-anchor="end">100%</text><text x="{px0 - 8}" y="{mid + 4:.0f}" text-anchor="end">50%</text><text x="{px0 - 8}" y="{py1 + 4}" text-anchor="end">0</text></g>']
    for i, row in enumerate(c['rows']):
        total = sum(row)
        x = px0 + slot * i + (slot - bw) / 2
        y = py1
        for k, v in enumerate(row):
            hgt = (py1 - py0) * v / total
            y -= hgt
            out.append(f'<rect class="{SERIES[c["kinds"][k]]}" x="{x:.0f}" y="{y:.0f}" width="{bw:.0f}" height="{hgt:.0f}"/>')
        out.append(f'<text class="tick" x="{x + bw / 2:.0f}" y="{height - 14}" text-anchor="middle">{MONTHS[i]}月</text>')
    lx = px0
    for k, key in enumerate(c['keys']):
        out.append(f'<rect class="{SERIES[c["kinds"][k]]}" x="{lx}" y="{height - 6}" width="10" height="4"/>'
                   f'<text class="tick" x="{lx + 14}" y="{height - 1}">{esc(key)}</text>')
        lx += 64
    out.append('</svg>')
    return ''.join(out)


def waterfall(w, width=640, height=300):
    px0, py0, px1, py1 = 56, 20, width - 16, height - 40
    steps = w['steps']
    start = w['start']['value']
    running, levels = start, [start]
    for s in steps:
        running += s['value']
        levels.append(running)
    base = math.floor(min(levels) / 10) * 10 - 10
    hi = max(levels) + 10
    ys = lambda v: py1 - (v - base) / (hi - base) * (py1 - py0)
    n = len(steps) + 2
    slot = (px1 - px0) / n
    bw = slot * 0.62
    out = [f'<svg viewBox="0 0 {width} {height}" role="img" aria-label="利润流失归因">',
           f'<g class="axis"><line x1="{px0}" y1="{ys(start):.0f}" x2="{px1}" y2="{ys(start):.0f}" stroke-dasharray="3 4"/></g>',
           f'<line class="axis-base" x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/>',
           f'<g class="tick"><text x="{px0 - 8}" y="{ys(start) + 4:.0f}" text-anchor="end">{fmt(start)}</text><text x="{px0 - 8}" y="{py1 + 4}" text-anchor="end">{fmt(base)}</text></g>']

    def bar(i, top, bottom, cls, label, value):
        x = px0 + slot * i + (slot - bw) / 2
        y1, y2 = ys(max(top, bottom)), ys(min(top, bottom))
        out.append(f'<rect class="{cls}" x="{x:.0f}" y="{y1:.0f}" width="{bw:.0f}" height="{max(2, y2 - y1):.0f}"/>'
                   f'<text class="tick" x="{x + bw / 2:.0f}" y="{height - 14}" text-anchor="middle">{esc(label)}</text>'
                   f'<text class="pt-label" x="{x + bw / 2:.0f}" y="{y1 - 6:.0f}" text-anchor="middle">{value}</text>')

    bar(0, start, base, 'series-2', w['start']['label'], fmt(start))
    level = start
    for i, s in enumerate(steps, 1):
        nxt = level + s['value']
        bar(i, level, nxt, 'series-3' if s['value'] < 0 else 'series-1', s['label'], ('+' if s['value'] > 0 else '−') + fmt(abs(s['value'])))
        level = nxt
    bar(n - 1, level, base, 'series-2', w['end'], fmt(round(level, 1)))
    out.append('</svg>')
    return ''.join(out)


def heatmap(h):
    rows, cols = h['rows'], MONTHS
    big = max(abs(v) for r in h['values'] for v in r)
    out = ['<table class="heat"><thead><tr><th></th>']
    out += [f'<th class="ts-num">{c}月</th>' for c in cols]
    out.append('</tr></thead><tbody>')
    for r, vals in zip(rows, h['values']):
        out.append(f'<tr><td>{esc(r)}</td>')
        for v in vals:
            cls = 'up' if v > 0 else 'down' if v < 0 else ''
            op = 0.12 + 0.7 * abs(v) / big
            out.append(f'<td class="ts-num {cls}" style="--op:{op:.2f}">{"+" if v > 0 else ""}{fmt(v)}</td>')
        out.append('</tr>')
    out.append('</tbody></table>')
    return ''.join(out)


def donut(d, size=200, thick=26):
    cx = cy = size / 2
    r = size / 2 - 4
    ri = r - thick
    total = sum(i['value'] for i in d['items'])
    a = -math.pi / 2
    out = [f'<svg viewBox="0 0 {size} {size}" role="img" aria-label="客群构成">']
    for it in d['items']:
        b = a + 2 * math.pi * it['value'] / total
        large = 1 if b - a > math.pi else 0
        p = (f'M{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f} A{r},{r} 0 {large} 1 {cx + r * math.cos(b):.1f},{cy + r * math.sin(b):.1f} '
             f'L{cx + ri * math.cos(b):.1f},{cy + ri * math.sin(b):.1f} A{ri},{ri} 0 {large} 0 {cx + ri * math.cos(a):.1f},{cy + ri * math.sin(a):.1f} Z')
        out.append(f'<path class="{SERIES[it["kind"]]} slice" d="{p}"/>')
        a = b
    out.append(f'<text class="pt-label donut-value" x="{cx}" y="{cy + 2}" text-anchor="middle">{esc(d["center"])}</text>'
               f'<text class="tick" x="{cx}" y="{cy + 20}" text-anchor="middle">{esc(d["center_label"])}</text></svg>')
    legend = ''.join(f'<li><span class="sw {SERIES[i["kind"]]}"></span>{esc(i["label"])} <span class="ts-num">{fmt(i["value"])}%</span></li>' for i in d['items'])
    return f'<div class="donut">{"".join(out)}<ul class="legend">{legend}</ul></div>'


def funnel(stages, width=560, row=36):
    h = len(stages) * row + 6
    top = stages[0]['value']
    x0, track = 70, width - 70 - 110
    out = [f'<svg viewBox="0 0 {width} {h}" role="img" aria-label="转化漏斗">']
    for i, s in enumerate(stages):
        w = track * s['value'] / top
        y = 4 + i * row
        cls = 'series-1' if i == len(stages) - 1 else 'series-2'
        rate = '' if i == 0 else f' · {s["value"] / stages[i - 1]["value"] * 100:.0f}%'
        out.append(f'<text class="bar-label" x="{x0 - 10}" y="{y + 18}" text-anchor="end">{esc(s["label"])}</text>'
                   f'<rect class="{cls}" x="{x0 + (track - w) / 2:.0f}" y="{y + 4}" width="{max(w, 4):.0f}" height="{row - 12}"/>'
                   f'<text class="bar-value" x="{x0 + track + 8}" y="{y + 18}">{s["value"]:,}{rate}</text>')
    out.append('</svg>')
    return ''.join(out)


def gauge(g, size=150):
    cx, cy, r = size / 2, size / 2 + 12, size / 2 - 10
    pct = min(g['value'] / g['target'], 1.0)
    a0, a1 = math.pi, math.pi + math.pi * pct
    arc = lambda a, b, rr: f'M{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f} A{rr},{rr} 0 {1 if b - a > math.pi else 0} 1 {cx + rr * math.cos(b):.1f},{cy + rr * math.sin(b):.1f}'
    cls = 'series-1' if g['value'] >= g['target'] else 'series-2'
    return (f'<svg viewBox="0 0 {size} {size / 2 + 34}" role="img" aria-label="{esc(g["label"])} 达成 {g["value"]}%">'
            f'<path class="gauge-track" d="{arc(math.pi, 2 * math.pi - 0.001, r)}" stroke-width="10"/>'
            f'<path class="{cls} arc" d="{arc(a0, a1 - 0.001, r)}" stroke-width="10"/>'
            f'<text class="pt-label donut-value" x="{cx}" y="{cy - 6}" text-anchor="middle">{g["value"]}%</text>'
            f'<text class="tick" x="{cx}" y="{cy + 16}" text-anchor="middle">{esc(g["label"])}</text></svg>')


# ── tables and blocks ─────────────────────────────────────────────────

def kpis(items):
    out = ['<div class="kpis">']
    for k in items:
        out.append(f'<div class="ts-stat"><span class="ts-caption">{esc(k["label"])}</span>'
                   f'<span class="ts-value {TONE_CLASS[k["tone"]]}">{esc(k["value"])}<small>{esc(k["unit"])}</small></span>'
                   f'<span class="ts-boundary">{esc(k.get("note", ""))}</span></div>')
    out.append('</div>')
    return ''.join(out)


def conclusions(items):
    out = []
    nums = ['一', '二', '三', '四', '五']
    for i, c in enumerate(items):
        anomaly = ' data-anomaly' if c['tone'] != 'positive' else ''
        boundary = f'<span class="ts-muted small">边界：{esc(c["boundary"])}</span>' if c['boundary'] else ''
        out.append(f'<article class="conclusion"{anomaly}><span class="ts-step">{nums[i]}</span><div>'
                   f'<div class="head"><h3>{esc(c["head"])}</h3><span class="ts-badge badge-{c["tone"]}">{esc(c["tag"])}</span></div>'
                   f'<div class="elements">'
                   f'<div><span class="ts-caption">证据</span><span>{esc(c["evidence"])}</span></div>'
                   f'<div><span class="ts-caption">利润影响</span><span class="num {TONE_CLASS[c["tone"]]}">{esc(c["impact"])}</span>{boundary}</div>'
                   f'<div><span class="ts-caption">执行动作</span><span>{esc(c["action"])}</span></div>'
                   f'<div><span class="ts-caption">验收指标</span><span>{esc(c["kpi"])}</span></div>'
                   f'</div></div></article>')
    return ''.join(out)


def ledger(rows):
    out = ['<table class="ts-table-ledger"><thead><tr><th>指标</th><th class="ts-num">当前</th><th class="ts-num">目标</th><th class="ts-num">差距</th></tr></thead><tbody>']
    for r in rows:
        out.append(f'<tr{" data-anomaly" if r["tone"] != "positive" else ""}><td>{esc(r["label"])}<small>{esc(r["sub"])}</small></td>'
                   f'<td class="ts-num">{esc(r["value"])}</td><td class="ts-num">{esc(r["target"])}</td>'
                   f'<td class="ts-num {TONE_CLASS[r["tone"]]}">{esc(r["gap"])}</td></tr>')
    out.append('</tbody></table>')
    return ''.join(out)


def actions(rows):
    out = ['<table class="ts-table-ledger actions"><thead><tr><th>序</th><th>动作</th><th>责任人</th><th>期限</th><th>验收指标</th><th class="ts-num">利润影响</th></tr></thead><tbody>']
    for r in rows:
        out.append(f'<tr><td class="seq">{esc(r["n"])}</td><td>{esc(r["action"])}</td><td>{esc(r["owner"])}</td>'
                   f'<td class="ts-num">{esc(r["due"])}</td><td>{esc(r["kpi"])}</td><td class="ts-num {TONE_CLASS[r["tone"]]}">{esc(r["impact"])}</td></tr>')
    out.append('</tbody></table>')
    return ''.join(out)


def render():
    b, m = DATA['bars'], DATA['matrices']
    blocks = {
        'kpis': kpis(DATA['kpis']),
        'conclusions': conclusions(DATA['conclusions']),
        'store_index': bars_h(DATA['store_index'], 100, row=34, label_w=90),
        'ledger': ledger(DATA['ledger']),
        'actions': actions(DATA['actions']),
        'penetration': matrix(m['penetration'], height=300),
        'market': matrix(m['market']),
        'repurchase': matrix(m['repurchase']),
        'sensitivity': bars_h(b['sensitivity']['items'], b['sensitivity']['max'], b['sensitivity']['unit'], row=36),
        'priceband': bars_h(b['priceband']['items'], b['priceband']['max'], b['priceband']['unit'], row=36),
        'trend': trend(DATA['trend']),
        'channels': stacked(DATA['channels']),
        'waterfall': waterfall(DATA['waterfall']),
        'heatmap': heatmap(DATA['heatmap']),
        'donut': donut(DATA['donut']),
        'funnel': funnel(DATA['funnel']),
        'gauges': ''.join(gauge(g) for g in DATA['gauges']),
    }
    page = (report / 'template.html').read_text()
    for key, value in DATA['meta'].items():
        if isinstance(value, (str, int)):
            page = page.replace('{{meta:' + key + '}}', esc(value))
    for key, value in blocks.items():
        page = page.replace('{{block:' + key + '}}', value)
    leftovers = [p for p in ('{{block:', '{{meta:') if p in page]
    if leftovers:
        raise SystemExit(f'unresolved placeholders in template: {leftovers}')
    return page


if __name__ == '__main__':
    out = render()
    target = report / 'index.html'
    if '--check' in sys.argv:
        if not target.exists() or target.read_text() != out:
            print('report/index.html is stale: run python3 scripts/build_report.py')
            sys.exit(1)
        print('report/index.html is up to date')
    else:
        target.write_text(out)
        print(f'wrote {target.relative_to(root)} ({len(out)} bytes)')
