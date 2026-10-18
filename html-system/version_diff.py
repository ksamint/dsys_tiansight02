"""Diff two report manifests and print the change log a version slide needs.

python3 html-system/version_diff.py old/manifest.json new/manifest.json [--json]

Reports: version and window changes; sources added, removed, regraded or re-windowed; metrics whose
formula, grade or threshold changed (口径 changes); slides added, removed, retitled or regraded;
quality checks whose status changed. Use the output to fill versions[].changes in the new manifest
(kind 新增 / 修正 / 口径 / 数据 / 删除 / 重排) and to write the 卷首 · 变更 slide.
"""
import json
import sys


def index(items, key='id'):
    return {i[key]: i for i in items}


def diff(a, b):
    out = []
    ra, rb = a['report'], b['report']
    if ra.get('version') != rb.get('version'):
        out.append(('版本', f"{ra.get('version')} → {rb.get('version')}", ''))
    if ra.get('window') != rb.get('window'):
        out.append(('数据', f"窗口 {ra.get('window')} → {rb.get('window')}", ''))
    sa, sb = index(a.get('sources', [])), index(b.get('sources', []))
    for k in sb.keys() - sa.keys():
        out.append(('新增', f"数据源 {k} · {sb[k].get('name', '')} · {sb[k].get('grade')}", ''))
    for k in sa.keys() - sb.keys():
        out.append(('删除', f"数据源 {k} · {sa[k].get('name', '')}", ''))
    for k in sa.keys() & sb.keys():
        for f in ('grade', 'window', 'rows', 'caliber'):
            if sa[k].get(f) != sb[k].get(f):
                out.append(('数据' if f in ('rows', 'window') else '口径', f"数据源 {k} {f}: {sa[k].get(f)} → {sb[k].get(f)}", ''))
    ma, mb = index(a.get('metrics', [])), index(b.get('metrics', []))
    for k in mb.keys() - ma.keys():
        out.append(('新增', f"指标 {k} · {mb[k].get('name', '')} = {mb[k].get('formula', '')}", ''))
    for k in ma.keys() - mb.keys():
        out.append(('删除', f"指标 {k} · {ma[k].get('name', '')}", ''))
    for k in ma.keys() & mb.keys():
        for f in ('formula', 'grade', 'threshold', 'window_rule'):
            if ma[k].get(f) != mb[k].get(f):
                out.append(('口径', f"指标 {k} {f}: {ma[k].get(f)} → {mb[k].get(f)}", 'affects slides ' + ', '.join(s['id'] for s in b.get('slides', []) if k in s.get('metrics', []))))
    pa, pb = index(a.get('slides', [])), index(b.get('slides', []))
    for k in pb.keys() - pa.keys():
        out.append(('新增', f"页 {k} · {strip(pb[k].get('title', ''))}", ''))
    for k in pa.keys() - pb.keys():
        out.append(('删除', f"页 {k} · {strip(pa[k].get('title', ''))}", ''))
    for k in pa.keys() & pb.keys():
        if strip(pa[k].get('title', '')) != strip(pb[k].get('title', '')):
            out.append(('修正', f"页 {k} 结论: {strip(pa[k].get('title', ''))} → {strip(pb[k].get('title', ''))}", ''))
        if pa[k].get('ega') != pb[k].get('ega'):
            out.append(('口径', f"页 {k} 证据等级 {pa[k].get('ega')} → {pb[k].get('ega')}", ''))
    order_a = [s['id'] for s in a.get('slides', []) if s['id'] in pb]
    order_b = [s['id'] for s in b.get('slides', []) if s['id'] in pa]
    if order_a != order_b:
        out.append(('重排', f"{sum(1 for x, y in zip(order_a, order_b) if x != y)} 页顺序变化", ''))
    qa = {q['check']: q['status'] for q in a.get('quality', [])}
    for q in b.get('quality', []):
        if qa.get(q['check']) not in (None, q['status']):
            out.append(('数据', f"质量检查 {q['check']}: {qa[q['check']]} → {q['status']}", ''))
    return out


def strip(s):
    import re
    return re.sub(r'<[^>]+>', '', s)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    a = json.load(open(sys.argv[1], encoding='utf-8'))
    b = json.load(open(sys.argv[2], encoding='utf-8'))
    changes = diff(a, b)
    if '--json' in sys.argv:
        print(json.dumps([{'kind': k, 'what': w, 'why': y} for k, w, y in changes], ensure_ascii=False, indent=1))
    else:
        for k, w, y in changes:
            print(f'{k}  {w}' + (f'  ({y})' if y else ''))
        print(f'{len(changes)} changes')
