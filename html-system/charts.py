"""Static SVG chart library for the Tiansight HTML report system (stdlib only).

Every function returns an SVG string that relies on the .fig classes in html-system/report.css:
role classes measured / accent / structure / sampled / reference / warn / design colour the marks,
tick / label / value / callout set the type. Marks carry data-key (drill-down into the appendix)
and data-tip (tooltip, '|' = line break, **bold**). Pass src=... to stamp data-src on the root <g>
so the runtime can open the matching appendix section.

Families (from the reference review): bars_h, bars_v (grouped, deltas), line, scatter (bubble,
quadrants), matrix (heat / dot), waterfall, stairs, timeline, mindmap, bullet, evidence_map.
"""
import html
import math

ROLES = ('measured', 'accent', 'structure', 'sampled', 'reference', 'warn', 'design')


def esc(s):
    return html.escape(str(s), quote=True)


def fmt(v, d=None):
    if v is None:
        return '—'
    if d is not None:
        return f'{v:,.{d}f}'
    return f'{v:,.0f}' if abs(v) >= 100 else f'{v:g}'


def _attrs(d):
    out = ''
    if d.get('key'):
        out += f' data-key="{esc(d["key"])}"'
    if d.get('tip'):
        out += f' data-tip="{esc(d["tip"])}"'
    return out


def hatch_defs():
    """Pattern used by data-role "design" (hatched). Emit ONCE per page (build_deck puts it in a hidden <svg>);
    url(#ts-hatch) resolves document-wide, so charts do not carry their own copy and ids stay unique."""
    return ('<defs><pattern id="ts-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
            '<rect width="2.2" height="6" fill="#D4A862"/></pattern></defs>')


def _svg(width, height, body, src=None, label=''):
    root = f'<svg viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="{esc(label)}">'
    return root + '<g' + (f' data-src="{esc(src)}"' if src else '') + '>' + body + '</g></svg>'


def _nice(vmax, n=5):
    if vmax <= 0:
        return 1, [0]
    raw = vmax / n
    mag = 10 ** math.floor(math.log10(raw))
    for m in (1, 2, 2.5, 5, 10):
        step = m * mag
        if step >= raw:
            break
    top = math.ceil(vmax / step) * step
    ticks = [round(i * step, 10) for i in range(int(top / step) + 1)]
    return top, ticks


def bars_h(items, *, vmax=None, unit='', width=790, height=None, row=36, label_w=150, src=None, title=''):
    """Horizontal bars. items: [{label, value, role, key, tip, note, n_small}]. Sorted as given."""
    h = height or len(items) * row + 24
    x0, x1 = label_w + 12, width - 90
    top, ticks = _nice(vmax or max((i['value'] for i in items), default=1))
    sx = lambda v: x0 + (x1 - x0) * v / top
    out = [f'<text class="label-muted" x="{x0}" y="14">{esc(title)}</text>' if title else '']
    out.append('<g class="grid">' + ''.join(f'<line x1="{sx(t):.1f}" y1="20" x2="{sx(t):.1f}" y2="{h - 6}"/>' for t in ticks[1:]) + '</g>')
    out.append(f'<line class="axis-base" x1="{x0}" y1="20" x2="{x0}" y2="{h - 6}"/>')
    for i, it in enumerate(items):
        y = 24 + i * row
        role = it.get('role', 'measured')
        w = sx(it['value']) - x0
        note = f' · {it["note"]}' if it.get('note') else ''
        flag = ' n' if it.get('n_small') else ''
        out.append(f'<text class="label" x="{label_w}" y="{y + row * 0.55:.1f}" text-anchor="end">{esc(it["label"])}</text>'
                   f'<rect class="{role}" x="{x0}" y="{y + 4}" width="{max(w, 1):.1f}" height="{row - 12}"{_attrs(it)}/>'
                   f'<text class="value" x="{x0 + w + 8:.1f}" y="{y + row * 0.55:.1f}">{fmt(it["value"], it.get("d"))}{esc(unit)}{esc(note)}{flag}</text>')
    return _svg(width, h, ''.join(out), src, title or '条形图')


def bars_v(groups, series, *, unit='', width=790, height=420, src=None, title='', deltas=False, vmax=None):
    """Grouped vertical bars. groups: [{label, values: [..], keys: [..], tips: [..]}], series: [{name, role}].
    deltas=True draws step connectors and the difference between consecutive single-series groups (stairs)."""
    px0, py0, px1, py1 = 56, 30, width - 16, height - 44
    n, k = len(groups), len(series)
    top, ticks = _nice(vmax or max(v for g in groups for v in g['values'] if v is not None))
    sy = lambda v: py1 - (py1 - py0) * v / top
    slot = (px1 - px0) / n
    bw = slot * 0.7 / k
    out = ['<g class="grid">' + ''.join(f'<line x1="{px0}" y1="{sy(t):.1f}" x2="{px1}" y2="{sy(t):.1f}"/>' for t in ticks[1:]) + '</g>',
           f'<line class="axis-base" x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/>',
           '<g class="tick">' + ''.join(f'<text x="{px0 - 8}" y="{sy(t) + 4:.1f}" text-anchor="end">{fmt(t)}{esc(unit)}</text>' for t in ticks) + '</g>']
    if title:
        out.append(f'<text class="label-muted" x="{px0}" y="18">{esc(title)}</text>')
    prev = None
    for gi, g in enumerate(groups):
        cx = px0 + slot * gi + slot / 2
        for si, s in enumerate(series):
            v = g['values'][si]
            if v is None:
                continue
            x = cx - (k * bw) / 2 + si * bw
            d = {'key': (g.get('keys') or [None] * k)[si] or g.get('key'), 'tip': (g.get('tips') or [None] * k)[si] or g.get('tip')}
            out.append(f'<rect class="{s.get("role", "measured")}" x="{x:.1f}" y="{sy(v):.1f}" width="{bw - 3:.1f}" height="{py1 - sy(v):.1f}"{_attrs(d)}/>'
                       f'<text class="value" x="{x + (bw - 3) / 2:.1f}" y="{sy(v) - 6:.1f}" text-anchor="middle">{fmt(v, g.get("d"))}</text>')
        out.append(f'<text class="tick" x="{cx:.1f}" y="{py1 + 18}" text-anchor="middle">{esc(g["label"])}</text>')
        if g.get('sub'):
            out.append(f'<text class="label-muted" x="{cx:.1f}" y="{py1 + 34}" text-anchor="middle" font-size="11">{esc(g["sub"])}</text>')
        if deltas and k == 1 and prev is not None:
            v0, v1 = prev, g['values'][0]
            out.append(f'<line class="threshold" style="stroke:var(--dv-structure)" x1="{cx - slot + bw / 2:.1f}" y1="{sy(v0):.1f}" x2="{cx - bw / 2:.1f}" y2="{sy(v0):.1f}"/>'
                       f'<text class="callout" x="{cx - slot / 2:.1f}" y="{sy(max(v0, v1)) - 22:.1f}" text-anchor="middle" fill="var(--gold)">{"+" if v1 >= v0 else "−"}{fmt(abs(v1 - v0))}</text>')
        prev = g['values'][0] if k == 1 else None
    if k > 1:
        lx = px1 - 8
        for s in reversed(series):
            out.append(f'<rect class="{s.get("role", "measured")}" x="{lx - 12}" y="{py0 - 22}" width="12" height="12"/><text class="tick" x="{lx - 16}" y="{py0 - 12}" text-anchor="end">{esc(s["name"])}</text>')
            lx -= 20 + 13 * len(s['name']) + 20
    return _svg(width, height, ''.join(out), src, title or '柱状图')


def line(series, xlabels, *, ymin=None, ymax=None, unit='', width=790, height=380, src=None, title='', threshold=None, points=True):
    """Line chart with optional points. series: [{name, values, role, dashed, keys, tips}]."""
    px0, py0, px1, py1 = 56, 28, width - 100, height - 40
    vals = [v for s in series for v in s['values'] if v is not None]
    lo = ymin if ymin is not None else min(vals)
    hi = ymax if ymax is not None else max(vals)
    if hi == lo:
        hi = lo + 1
    n = len(xlabels)
    sx = lambda i: px0 + (px1 - px0) * i / max(n - 1, 1)
    sy = lambda v: py1 - (py1 - py0) * (v - lo) / (hi - lo)
    ticks = [lo + (hi - lo) * i / 4 for i in range(5)]
    out = ['<g class="grid">' + ''.join(f'<line x1="{px0}" y1="{sy(t):.1f}" x2="{px1}" y2="{sy(t):.1f}"/>' for t in ticks) + '</g>',
           '<g class="tick">' + ''.join(f'<text x="{px0 - 8}" y="{sy(t) + 4:.1f}" text-anchor="end">{fmt(t, 1 if hi - lo < 10 else None)}{esc(unit)}</text>' for t in ticks)
           + ''.join(f'<text x="{sx(i):.1f}" y="{py1 + 20}" text-anchor="middle">{esc(x)}</text>' for i, x in enumerate(xlabels)) + '</g>']
    if title:
        out.append(f'<text class="label-muted" x="{px0}" y="16">{esc(title)}</text>')
    if threshold is not None:
        out.append(f'<line class="threshold" x1="{px0}" y1="{sy(threshold):.1f}" x2="{px1}" y2="{sy(threshold):.1f}"/>'
                   f'<text class="label-muted" x="{px1}" y="{sy(threshold) - 5:.1f}" text-anchor="end">阈值 {fmt(threshold)}{esc(unit)}</text>')
    for s in series:
        role = s.get('role', 'measured')
        pts = [(sx(i), sy(v)) for i, v in enumerate(s['values']) if v is not None]
        dash = ' stroke-dasharray="5 4"' if s.get('dashed') else ''
        pts_s = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
        out.append(f'<polyline class="{role}"{dash} points="{pts_s}"/>')
        if points:
            for i, v in enumerate(s['values']):
                if v is None:
                    continue
                d = {'key': (s.get('keys') or [None] * n)[i], 'tip': (s.get('tips') or [None] * n)[i] or f'{s["name"]} · {xlabels[i]}|{fmt(v, 1)}{unit}'}
                out.append(f'<circle class="{role}" cx="{sx(i):.1f}" cy="{sy(v):.1f}" r="4"{_attrs(d)}/>')
        last = [v for v in s['values'] if v is not None][-1]
        out.append(f'<text class="label" x="{px1 + 8}" y="{sy(last) + 4:.1f}">{esc(s["name"])} {fmt(last, 1)}{esc(unit)}</text>')
    return _svg(width, height, ''.join(out), src, title or '折线图')


def scatter(points, *, x_label='', y_label='', width=790, height=440, src=None, title='', quadrants=None, medians=False, log_x=False, r_max=40):
    """Scatter or bubble. points: [{label, x, y, r, role, key, tip}]; quadrants: [tl, tr, bl, br] labels."""
    px0, py0, px1, py1 = 62, 30, width - 30, height - 62
    xs = [p['x'] for p in points]
    ys = [p['y'] for p in points]
    tx = (lambda v: math.log10(max(v, 1e-9))) if log_x else (lambda v: v)
    xlo, xhi = min(tx(v) for v in xs), max(tx(v) for v in xs)
    ylo, yhi = min(ys), max(ys)
    xpad, ypad = (xhi - xlo or 1) * 0.12, (yhi - ylo or 1) * 0.15
    xlo, xhi, ylo, yhi = xlo - xpad, xhi + xpad, ylo - ypad, yhi + ypad
    sx = lambda v: px0 + (px1 - px0) * (tx(v) - xlo) / (xhi - xlo)
    sy = lambda v: py1 - (py1 - py0) * (v - ylo) / (yhi - ylo)
    rmax = max((p.get('r') or 0) for p in points) or 1
    out = [f'<line class="axis-base" x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/><line class="axis-base" x1="{px0}" y1="{py0}" x2="{px0}" y2="{py1}"/>']
    out.append('<g class="tick">' + ''.join(f'<text x="{px0 + (px1 - px0) * i / 4:.1f}" y="{py1 + 18}" text-anchor="middle">{fmt(10 ** (xlo + (xhi - xlo) * i / 4) if log_x else xlo + (xhi - xlo) * i / 4, 1)}</text>' for i in range(5))
               + ''.join(f'<text x="{px0 - 8}" y="{py1 - (py1 - py0) * i / 4 + 4:.1f}" text-anchor="end">{fmt(ylo + (yhi - ylo) * i / 4, 1)}</text>' for i in range(5)) + '</g>')
    out.append(f'<text class="label-muted" x="{px1}" y="{height - 8}" text-anchor="end">{esc(x_label)}</text><text class="label-muted" x="{px0}" y="18">{esc(y_label)}</text>')
    if medians or quadrants:
        mx = sorted(xs)[len(xs) // 2]
        my = sorted(ys)[len(ys) // 2]
        out.append(f'<line class="threshold" style="stroke:var(--dv-tick)" x1="{sx(mx):.1f}" y1="{py0}" x2="{sx(mx):.1f}" y2="{py1}"/><line class="threshold" style="stroke:var(--dv-tick)" x1="{px0}" y1="{sy(my):.1f}" x2="{px1}" y2="{sy(my):.1f}"/>')
    if quadrants:
        q = quadrants
        out.append(f'<g class="label-muted"><text x="{px0 + 8}" y="{py0 + 14}">{esc(q[0])}</text><text x="{px1 - 8}" y="{py0 + 14}" text-anchor="end">{esc(q[1])}</text>'
                   f'<text x="{px0 + 8}" y="{py1 - 8}">{esc(q[2])}</text><text x="{px1 - 8}" y="{py1 - 8}" text-anchor="end">{esc(q[3])}</text></g>')
    for p in sorted(points, key=lambda p: -(p.get('r') or 0)):
        r = 5 + (r_max - 5) * math.sqrt((p.get('r') or 0) / rmax) if p.get('r') else 6
        out.append(f'<circle class="{p.get("role", "measured")}" cx="{sx(p["x"]):.1f}" cy="{sy(p["y"]):.1f}" r="{r:.1f}" fill-opacity="0.75" stroke="var(--paper)"{_attrs(p)}/>')
        if p.get('label'):
            out.append(f'<text class="label" x="{sx(p["x"]) + r + 4:.1f}" y="{sy(p["y"]) + 4:.1f}">{esc(p["label"])}</text>')
    return _svg(width, height, ''.join(out), src, title or '散点图')


def matrix(rows, cols, values, *, kind='heat', fmt_d=1, unit='', width=790, src=None, title='', diverging=True, diverging_cols=None, row_h=34, label_w=120):
    """Heat matrix (kind='heat') or dot matrix (kind='dot'). values[r][c] numeric or None.
    diverging=True signs values and colours + accent / − warn; diverging_cols limits that to some column indexes,
    the rest are shaded by intensity without a sign."""
    x0, cw = label_w + 8, (width - label_w - 16) / len(cols)
    h = 30 + row_h * len(rows) + 8
    flat = [v for r in values for v in r if v is not None]
    big = max((abs(v) for v in flat), default=1) or 1
    out = ['<g class="tick">' + ''.join(f'<text x="{x0 + cw * i + cw / 2:.1f}" y="18" text-anchor="middle">{esc(c)}</text>' for i, c in enumerate(cols)) + '</g>']
    for ri, r in enumerate(rows):
        y = 30 + ri * row_h
        out.append(f'<text class="label" x="{label_w}" y="{y + row_h * 0.62:.1f}" text-anchor="end">{esc(r)}</text>')
        for ci, v in enumerate(values[ri]):
            x = x0 + cw * ci
            if v is None:
                out.append(f'<text class="label-muted" x="{x + cw / 2:.1f}" y="{y + row_h * 0.62:.1f}" text-anchor="middle">—</text>')
                continue
            div = diverging and (diverging_cols is None or ci in diverging_cols)
            role = ('warn' if v < 0 else 'accent') if div else 'measured'
            op = 0.15 + 0.75 * abs(v) / big if div else 0.08 + 0.42 * abs(v) / big
            key = {'key': f'{r}|{cols[ci]}', 'tip': f'**{r}** · {cols[ci]}|{fmt(v, fmt_d)}{unit}'}
            if kind == 'dot':
                rr = 3 + 11 * math.sqrt(abs(v) / big)
                out.append(f'<circle class="{role}" cx="{x + cw / 2:.1f}" cy="{y + row_h / 2:.1f}" r="{rr:.1f}" fill-opacity="0.8"{_attrs(key)}/>')
            else:
                out.append(f'<rect class="{role}" x="{x + 1:.1f}" y="{y + 1}" width="{cw - 2:.1f}" height="{row_h - 2}" fill-opacity="{op:.2f}" stroke="none"{_attrs(key)}/>'
                           f'<text class="value" x="{x + cw / 2:.1f}" y="{y + row_h * 0.62:.1f}" text-anchor="middle">{"+" if v > 0 and div else ""}{fmt(v, fmt_d)}</text>')
    return _svg(width, h, ''.join(out), src, title or '矩阵')


def waterfall(start, steps, end_label='结果', *, unit='', width=790, height=380, src=None, title=''):
    px0, py0, px1, py1 = 60, 30, width - 16, height - 44
    levels = [start['value']]
    for s in steps:
        levels.append(levels[-1] + s['value'])
    base = math.floor(min(levels) * 0.9 / 10) * 10
    hi = max(levels) * 1.06
    sy = lambda v: py1 - (py1 - py0) * (v - base) / (hi - base)
    n = len(steps) + 2
    slot = (px1 - px0) / n
    bw = slot * 0.62
    out = [f'<line class="axis-base" x1="{px0}" y1="{py1}" x2="{px1}" y2="{py1}"/>',
           f'<line class="grid" style="stroke:var(--dv-grid)" x1="{px0}" y1="{sy(start["value"]):.1f}" x2="{px1}" y2="{sy(start["value"]):.1f}" stroke-dasharray="3 4"/>']

    def bar(i, top, bottom, role, label, value, d=None):
        x = px0 + slot * i + (slot - bw) / 2
        y1, y2 = sy(max(top, bottom)), sy(min(top, bottom))
        out.append(f'<rect class="{role}" x="{x:.1f}" y="{y1:.1f}" width="{bw:.1f}" height="{max(2, y2 - y1):.1f}"{_attrs(d or {})}/>'
                   f'<text class="tick" x="{x + bw / 2:.1f}" y="{py1 + 18}" text-anchor="middle">{esc(label)}</text>'
                   f'<text class="value" x="{x + bw / 2:.1f}" y="{y1 - 6:.1f}" text-anchor="middle">{value}</text>')

    bar(0, start['value'], base, 'measured', start['label'], fmt(start['value']) + unit)
    level = start['value']
    for i, s in enumerate(steps, 1):
        nxt = level + s['value']
        bar(i, level, nxt, 'warn' if s['value'] < 0 else 'accent', s['label'], ('+' if s['value'] > 0 else '−') + fmt(abs(s['value'])) + unit, s)
        level = nxt
    bar(n - 1, level, base, 'measured', end_label, fmt(round(level, 1)) + unit)
    return _svg(width, height, ''.join(out), src, title or '瀑布图')


def stairs(levels, *, unit='', width=790, height=400, src=None, title=''):
    """Step ladder: consecutive levels with deltas (the 112 → 143 → 162 pattern)."""
    return bars_v([{'label': l['label'], 'values': [l['value']], 'sub': l.get('sub'), 'key': l.get('key'), 'tip': l.get('tip')} for l in levels],
                  [{'name': '', 'role': 'measured'}], unit=unit, width=width, height=height, src=src, title=title, deltas=True)


def timeline(lanes, periods, *, width=790, row_h=38, label_w=150, src=None, title=''):
    """Gantt-style lanes. lanes: [{label, spans: [{start, end, role, text, key}]}] with 0-based period indexes (end exclusive)."""
    x0, pw = label_w + 8, (width - label_w - 16) / len(periods)
    h = 30 + row_h * len(lanes) + 8
    out = ['<g class="tick">' + ''.join(f'<text x="{x0 + pw * i + pw / 2:.1f}" y="18" text-anchor="middle">{esc(p)}</text>' for i, p in enumerate(periods)) + '</g>',
           '<g class="grid">' + ''.join(f'<line x1="{x0 + pw * i:.1f}" y1="24" x2="{x0 + pw * i:.1f}" y2="{h - 6}"/>' for i in range(len(periods) + 1)) + '</g>']
    for li, lane in enumerate(lanes):
        y = 30 + li * row_h
        out.append(f'<text class="label" x="{label_w}" y="{y + row_h * 0.62:.1f}" text-anchor="end">{esc(lane["label"])}</text>')
        for sp in lane['spans']:
            x, w = x0 + pw * sp['start'], pw * (sp['end'] - sp['start'])
            out.append(f'<rect class="{sp.get("role", "measured")}" x="{x + 2:.1f}" y="{y + 6}" width="{w - 4:.1f}" height="{row_h - 14}"{_attrs(sp)}/>')
            if sp.get('text'):
                out.append(f'<text class="value" x="{x + w / 2:.1f}" y="{y + row_h * 0.6:.1f}" text-anchor="middle" fill="var(--paper)">{esc(sp["text"])}</text>')
    return _svg(width, h, ''.join(out), src, title or '时间线')


def mindmap(center, branches, *, width=1150, height=490, src=None):
    """Navigation map: center node, branches with leaves that jump to pages (data-go)."""
    cx, cy = 130, height / 2
    total = sum(len(b['leaves']) for b in branches)
    out = [f'<rect class="structure" x="20" y="{cy - 40}" width="220" height="80" fill="var(--ink-primary)" stroke-width="1.5" rx="2"/>'
           f'<text class="callout" x="{cx}" y="{cy - 6}" text-anchor="middle" font-size="17">{esc(center[0])}</text>'
           f'<text class="label-muted" x="{cx}" y="{cy + 18}" text-anchor="middle">{esc(center[1] if len(center) > 1 else "")}</text>']
    y = 24
    for b in branches:
        span = max(len(b['leaves']), 1) * (height - 48) / max(total, 1)
        by = y + span / 2
        out.append(f'<path class="reference" d="M240 {cy:.1f} C 320 {cy:.1f}, 300 {by:.1f}, 370 {by:.1f}" fill="none" stroke-width="1.2"/>'
                   f'<rect class="structure" x="370" y="{by - 16:.1f}" width="150" height="32" fill="var(--ink-primary)" stroke-width="1.2" rx="2"/>'
                   f'<text class="callout" x="445" y="{by + 5:.1f}" text-anchor="middle">{esc(b["label"])}</text>')
        step = span / max(len(b['leaves']), 1)
        for li, leaf in enumerate(b['leaves']):
            ly = y + step * li + step / 2
            out.append(f'<path class="reference" d="M520 {by:.1f} C 560 {by:.1f}, 560 {ly:.1f}, 600 {ly:.1f}" fill="none" stroke-width="1"/>'
                       f'<g class="jump" data-go="{leaf.get("page", "")}"><rect x="600" y="{ly - 11:.1f}" width="{width - 620}" height="22" fill="transparent" data-node="1"/>'
                       f'<text class="label" x="612" y="{ly + 4:.1f}">{esc(leaf["label"])}</text>'
                       f'<text class="value" x="{width - 30}" y="{ly + 4:.1f}" text-anchor="end" fill="var(--gold)">P {leaf.get("page", "")}</text></g>')
        y += span
    return _svg(width, height, ''.join(out), src, '导览')


def evidence_map(rows, *, width=1150, row_h=30, src=None):
    """结论索引: each conclusion with its metric, value, grade and page. rows: [{no, text, metric, value, grade, page}]."""
    h = 30 + row_h * len(rows) + 6
    cols = [(0, '#'), (44, '结论'), (600, '支撑指标'), (880, '取值'), (1010, '等级'), (1090, '页')]
    out = ['<g class="tick">' + ''.join(f'<text x="{x}" y="16">{c}</text>' for x, c in cols) + '</g>', f'<line class="axis-base" x1="0" y1="22" x2="{width}" y2="22"/>']
    for i, r in enumerate(rows):
        y = 30 + i * row_h + row_h * 0.62
        g = r.get('grade', 'E1')
        out.append(f'<g class="jump" data-go="{r.get("page", "")}"><rect x="0" y="{30 + i * row_h}" width="{width}" height="{row_h}" fill="transparent"/>'
                   f'<text class="value" x="0" y="{y:.1f}">{r.get("no", i + 1):02d}</text><text class="label" x="44" y="{y:.1f}">{esc(r["text"])}</text>'
                   f'<text class="label-muted" x="600" y="{y:.1f}">{esc(r.get("metric", ""))}</text><text class="value" x="880" y="{y:.1f}">{esc(r.get("value", ""))}</text>'
                   f'<text class="value" x="1010" y="{y:.1f}" fill="var(--ega-{g[-1]})">{esc(g)}</text><text class="value" x="1090" y="{y:.1f}" fill="var(--gold)">P {r.get("page", "")}</text></g>'
                   f'<line class="grid" style="stroke:var(--dv-grid)" x1="0" y1="{30 + (i + 1) * row_h}" x2="{width}" y2="{30 + (i + 1) * row_h}"/>')
    return _svg(width, h, ''.join(out), src, '结论索引')


def bullet(items, *, width=790, row=34, label_w=150, src=None, title='', unit='%'):
    """Availability / attainment bars against a target (the 字段可用率 pattern). items: [{label, value, target, role}] in 0–100."""
    h = len(items) * row + 20
    x0, x1 = label_w + 12, width - 80
    sx = lambda v: x0 + (x1 - x0) * v / 100
    out = [f'<line class="axis-base" x1="{x0}" y1="10" x2="{x0}" y2="{h - 6}"/>']
    for i, it in enumerate(items):
        y = 12 + i * row
        role = it.get('role') or ('warn' if it['value'] < it.get('target', 100) * 0.5 else 'measured')
        out.append(f'<text class="label" x="{label_w}" y="{y + row * 0.55:.1f}" text-anchor="end">{esc(it["label"])}</text>'
                   f'<rect class="reference" x="{x0}" y="{y + 6}" width="{x1 - x0}" height="{row - 16}" stroke="none"/>'
                   f'<rect class="{role}" x="{x0}" y="{y + 6}" width="{max(sx(it["value"]) - x0, 1):.1f}" height="{row - 16}"{_attrs(it)}/>'
                   f'<text class="value" x="{x1 + 8}" y="{y + row * 0.55:.1f}">{fmt(it["value"], 1)}{esc(unit)}</text>')
        if it.get('target') is not None:
            out.append(f'<line class="threshold" x1="{sx(it["target"]):.1f}" y1="{y + 3}" x2="{sx(it["target"]):.1f}" y2="{y + row - 7}"/>')
    return _svg(width, h, ''.join(out), src, title or '达成条')


FAMILIES = {'bars_h': bars_h, 'bars_v': bars_v, 'line': line, 'scatter': scatter, 'matrix': matrix, 'waterfall': waterfall,
            'stairs': stairs, 'timeline': timeline, 'mindmap': mindmap, 'evidence_map': evidence_map, 'bullet': bullet}
