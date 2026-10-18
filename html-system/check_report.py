"""Quality gate for a Tiansight HTML report directory.

python3 html-system/check_report.py <dir> [--layout]

Manifest checks: required keys; every slide src, metric and conclusion.metric resolves; every
content slide has ega, src, caliber and meta.formula + meta.confidence; every metric has an explicit
formula (÷, =, Σ or ×) and grade; every source has window type, rows and grade; referenced tables
exist; versions[-1].version equals report.version; quality has no unhandled fail (fail without action).
Built-file checks: index.html fresh; every .fig data-src has an appendix section; every srcbtn resolves;
every content slide carries the version in its footer; no external resources; no emoji.
--layout renders with the bundled Chromium and fails on any slide whose body overflows 720px
(replacing the reference decks' hand-written layout-fix overrides).
"""
from pathlib import Path
import json
import re
import subprocess
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent


def check(folder, layout=False):
    folder = Path(folder).resolve()
    problems, notes = [], []
    m = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
    for k in ('report', 'sources', 'metrics', 'slides', 'versions'):
        if k not in m:
            problems.append(f'manifest: missing {k}')
    if problems:
        return problems, notes
    r = m['report']
    for k in ('id', 'title', 'client', 'version', 'issued', 'window'):
        if not r.get(k):
            problems.append(f'report.{k} missing')
    if m['versions'][-1].get('version') != r.get('version'):
        problems.append(f"versions[-1].version {m['versions'][-1].get('version')} != report.version {r.get('version')}")
    srcs = {s['id']: s for s in m['sources']}
    mets = {x['id']: x for x in m['metrics']}
    for s in m['sources']:
        for k in ('grade', 'rows'):
            if k not in s:
                problems.append(f'source {s.get("id")}: missing {k}')
        if not (s.get('window') or {}).get('type'):
            problems.append(f'source {s.get("id")}: window.type missing (月窗 / 累计窗 / 快照 / 外部 / 设计)')
        if s.get('table') and not (folder / 'data' / s['table']).is_file():
            problems.append(f'source {s["id"]}: table data/{s["table"]} not found')
        if s.get('table') and not s.get('key_column'):
            notes.append(f'source {s["id"]}: no key_column, drill-down matches by text')
    for x in m['metrics']:
        if not re.search(r'[÷=Σ×/]', x.get('formula', '')):
            problems.append(f'metric {x.get("id")}: formula must show the derivation (÷ = Σ ×)')
        if x.get('grade') not in ('E1', 'E2', 'E3', 'E4'):
            problems.append(f'metric {x.get("id")}: grade missing')
        for sid in x.get('sources', []):
            if sid not in srcs:
                problems.append(f'metric {x["id"]}: source {sid} not declared')
    for s in m['slides']:
        if s.get('kind') in ('divider', 'toc', 'cover'):
            continue
        sid = s.get('id')
        if s.get('ega') not in ('E1', 'E2', 'E3', 'E4'):
            problems.append(f'slide {sid}: ega missing')
        if not s.get('src'):
            problems.append(f'slide {sid}: src missing (every content slide opens its data)')
        for k in s.get('src', []):
            if k not in srcs:
                problems.append(f'slide {sid}: src {k} not declared')
        for k in s.get('metrics', []):
            if k not in mets:
                problems.append(f'slide {sid}: metric {k} not declared')
        c = s.get('conclusion')
        if c and c.get('metric') and c['metric'] not in mets:
            problems.append(f'slide {sid}: conclusion.metric {c["metric"]} not declared')
        meta = s.get('meta') or {}
        for k in ('formula', 'confidence'):
            if not meta.get(k) and not (k == 'formula' and s.get('metrics')):
                problems.append(f'slide {sid}: meta.{k} missing')
        if not s.get('caliber'):
            problems.append(f'slide {sid}: caliber (one-line 口径) missing')
        if not re.search(r'\d', re.sub(r'<[^>]+>', '', s.get('title', ''))):
            notes.append(f'slide {sid}: headline carries no number')
        grades = [mets[k]['grade'] for k in s.get('metrics', []) if k in mets] + [srcs[k]['grade'] for k in s.get('src', []) if k in srcs]
        if grades and s.get('ega') and s['ega'] < max(grades):
            problems.append(f'slide {sid}: ega {s["ega"]} stronger than its weakest source/metric {max(grades)}')
    for q in m.get('quality', []):
        if q.get('status') == 'fail' and not q.get('action'):
            problems.append(f'quality "{q.get("check")}": fail without action')
    # built file
    out = folder / 'index.html'
    if not out.exists():
        problems.append('index.html not built')
    else:
        res = subprocess.run([sys.executable, str(HERE / 'build_deck.py'), str(folder), '--check'], capture_output=True, text=True)
        if res.returncode != 0:
            problems.append(res.stdout.strip())
        html = out.read_text(encoding='utf-8')
        ids = set(re.findall(r'<section id="src-([^"]+)"', html))
        for k in set(re.findall(r'data-src="([^"]*)"', html)):
            if k and k not in ids:
                problems.append(f'index.html: data-src {k} has no appendix section')
        for url in re.findall(r'(?:src|href)="(https?://[^"]+)"', html):
            problems.append(f'index.html: remote resource {url}')
        if re.search(r'[\U0001F300-\U0001FAFF]', html):
            problems.append('index.html: emoji')
        foots = re.findall(r'<div class="s-foot"><span class="cal">([^<]*)</span>', html)
        for f in foots:
            if r['version'] not in f:
                problems.append('index.html: a footer lacks the version')
                break
        if layout:
            problems += layout_check(out)
    return problems, notes


def layout_check(out):
    npm = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    pw = Path(npm) / 'playwright' / 'index.mjs'
    if not pw.exists():
        return ['layout: playwright not available (npm i -g playwright)']
    script = f"""
import {{ chromium }} from '{pw}';
const b = await chromium.launch(); const p = await b.newPage({{ viewport: {{ width: 1300, height: 800 }} }});
await p.goto('file://{out}'); await p.waitForTimeout(400);
const bad = await p.evaluate(() => Array.from(document.querySelectorAll('section.slide')).map((s, i) => {{
  const r = s.getBoundingClientRect(); let over = [];
  for (const el of s.querySelectorAll('.s-body *')) {{ const q = el.getBoundingClientRect(); if (q.width && (q.bottom > r.bottom - 44 || q.right > r.right + 1)) over.push(el.tagName.toLowerCase() + '.' + el.className); }}
  const title = s.querySelector('.s-title'); const tOver = title && title.scrollHeight > title.clientHeight + 2;
  return (over.length || tOver) ? `slide ${{i + 1}}: ${{tOver ? 'headline overflows; ' : ''}}${{over.slice(0, 2).join(', ')}}` : null;
}}).filter(Boolean));
console.log(JSON.stringify(bad)); await b.close();
"""
    tmp = out.parent / '.layout_check.mjs'
    tmp.write_text(script)
    try:
        res = subprocess.run(['node', str(tmp)], capture_output=True, text=True, timeout=120)
    finally:
        tmp.unlink(missing_ok=True)
    if res.returncode != 0:
        return ['layout: ' + (res.stderr.strip().splitlines() or ['render failed'])[-1]]
    return ['layout: ' + x for x in json.loads(res.stdout.strip() or '[]')]


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    problems, notes = check(sys.argv[1], '--layout' in sys.argv)
    for n in notes:
        print('note:', n)
    if problems:
        print('FAIL')
        for p in problems:
            print(' -', p)
        sys.exit(1)
    print('PASS: manifest, provenance links, footer versions, appendix, offline' + (', layout' if '--layout' in sys.argv else ''))
