"""Catalogue every HTML report asset under reference/source into reference/inventory.json.

python3 scripts/inventory_reference.py          # rewrite reference/inventory.json
python3 scripts/inventory_reference.py --print  # also print a per-file summary

Stdlib only. For each file it records the system it belongs to, sections, slide headlines,
provenance markers, every substantial SVG classified into a chart family, tables with
headers, scripts and libraries, fonts and palette. Future assets dropped into
reference/source are catalogued the same way, so the skills can point at concrete examples.

reference/source/ is git-ignored: client deliverables never enter this public repository
(docs/maintaining.md §6). Put copies there locally, run this script, then anonymise the result
(client and file names, headlines, findings) before committing reference/inventory.json. With no
local sources the script leaves the committed, anonymised inventory untouched.
"""
from pathlib import Path
import collections
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
src = root / 'reference' / 'source'

MARKERS = ['数据来源', '来源', '口径', '公式', '方法论', '假设', '边界', '样本', '单位', '取数', '校验', '置信', '推算', '设计值', '版本']
FAMILIES = [
    ('mindmap', lambda e, s: 'data-node' in s or 'data-go' in s),
    ('bubble', lambda e, s: e['circle'] >= 5 and re.search(r'\br="(?:[2-9]\d|\d{3})(?:\.\d+)?"', s) is not None),
    ('dot-matrix', lambda e, s: e['circle'] >= 40),
    ('line-points', lambda e, s: e['circle'] >= 8 and e['path'] >= 1 and e['rect'] <= 2),
    ('scatter', lambda e, s: e['circle'] >= 6 and e['rect'] <= 3 and e['path'] == 0),
    ('bars-line', lambda e, s: e['path'] >= 1 and e['rect'] >= 4),
    ('matrix-heat', lambda e, s: e['rect'] >= 20 and e['circle'] == 0 and e['path'] == 0),
    ('bars', lambda e, s: e['rect'] >= 4 and e['path'] == 0 and e['circle'] == 0),
    ('timeline', lambda e, s: e['line'] >= 12 and e['rect'] == 0 and e['circle'] == 0),
]


def family(svg):
    e = collections.Counter({t: len(re.findall(r'<' + t + r'\b', svg)) for t in ('rect', 'circle', 'path', 'line', 'text', 'polyline', 'polygon')})
    for name, test in FAMILIES:
        if test(e, svg):
            return name, dict(e)
    return 'other', dict(e)


def catalogue(path):
    html = path.read_text(errors='replace')
    styles = ''.join(re.findall(r'<style[^>]*>(.*?)</style>', html, re.S))
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.S)
    system = 'slide-deck' if 'class="slide' in html and '#srcov' in styles else 'scroll' if 'd3.' in ''.join(scripts) else 'unknown'
    slides = []
    for m in re.finditer(r'<section class="slide([^"]*)"[^>]*>(.*?)</section>', html, re.S):
        body = m.group(2)
        chip = re.search(r'class="chip[^"]*">([^<]*)<', body)
        ega = re.search(r'class="ega[^"]*">([^<]*)<', body)
        srcs = re.findall(r'data-src="([^"]+)"', body)
        title = re.search(r'class="s-title"[^>]*>(.*?)</(?:h2|div)>', body, re.S)
        slides.append({'kind': m.group(1).strip() or 'content', 'chip': chip.group(1) if chip else '',
                       'ega': ega.group(1) if ega else '', 'src': srcs,
                       'title': re.sub(r'<[^>]+>', '', title.group(1)).strip()[:100] if title else '',
                       'svg': len(re.findall(r'<svg\b', body)), 'tables': len(re.findall(r'<table\b', body)),
                       'meta': bool(re.search(r'<aside class="meta">', html[m.end():m.end() + 400]))})
    sections = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.S) if system == 'scroll' else []
    charts = collections.Counter()
    chart_list = []
    for m in re.finditer(r'<svg\b.*?</svg>', html, re.S):
        if len(m.group(0)) < 1500:
            continue
        fam, elems = family(m.group(0))
        charts[fam] += 1
        chart_list.append({'family': fam, 'bytes': len(m.group(0)), 'elems': elems})
    d3 = collections.Counter(re.findall(r'd3\.([a-zA-Z]+)\(', ''.join(s for s in scripts if len(s) < 200000)))
    appendix = re.findall(r'<section id="src-([^"]+)"', html)
    meta_keys = collections.Counter(re.findall(r'<div class="k">([^<]{1,40})</div>', html))
    tables = []
    for m in re.finditer(r'<table[^>]*>(.*?)</table>', html, re.S):
        heads = [re.sub(r'<[^>]+>', '', h).strip() for h in re.findall(r'<th[^>]*>(.*?)</th>', m.group(1), re.S)]
        if heads:
            tables.append(heads[:8])
    return {
        'file': path.name, 'bytes': len(html), 'system': system,
        'title': (re.search(r'<title>([^<]*)</title>', html) or [None, ''])[1],
        'fonts': sorted(set(re.findall(r'--(?:f-)?(?:serif|sans|mono)[^:]*:\s*([^;]+);', styles)))[:6],
        'css_vars': re.findall(r'--([a-z0-9-]+):', styles)[:40],
        'markers': {k: html.count(k) for k in MARKERS if html.count(k)},
        'slides': slides, 'scroll_sections': [re.sub(r'<[^>]+>', '', s).strip() for s in sections],
        'ega_levels': collections.Counter(s['ega'] for s in slides if s['ega']).most_common(),
        'chart_families': charts.most_common(), 'charts': chart_list,
        'appendix_sections': appendix, 'meta_keys': meta_keys.most_common(),
        'tables': len(tables), 'table_headers_sample': tables[:12],
        'd3_calls': d3.most_common(15),
        'interactions': {k: (k in html) for k in ('srcOpen', 'data-go', 'meta-on', 'playOn', 'showTip', 'IntersectionObserver')},
    }


if __name__ == '__main__':
    files = sorted(src.glob('*.html'))
    if not files:
        print('no local sources in reference/source/; reference/inventory.json left as committed')
        sys.exit(0)
    inv = {'generated_from': [f.name for f in files], 'assets': [catalogue(f) for f in files]}
    (root / 'reference' / 'inventory.json').write_text(json.dumps(inv, ensure_ascii=False, indent=1))
    for a in inv['assets']:
        print(f"{a['file']}: {a['system']}, {len(a['slides'])} slides / {len(a['scroll_sections'])} sections, charts {dict(a['chart_families'])}, appendix {len(a['appendix_sections'])}, tables {a['tables']}")
        if '--print' in sys.argv:
            for s in a['slides']:
                print('  ', s['kind'][:8].ljust(8), s['ega'][:10].ljust(10), s['chip'][:34].ljust(34), s['title'][:60])
