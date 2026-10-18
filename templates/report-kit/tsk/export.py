"""导出层：PDF 页内跳转链接表 + 书签 + 链接校验。

链接来源：页脚导航（目录 / 术语）、目录各行、正文中的「→ 第 N 页」、右上角标签（BADGES）。
讲稿（<aside>）不出现在 PDF 里，其中的「→ 第 N 页」不生成链接。
"""
import json
import re

from .core import ORDER, SECTIONS, SHORT, CFG, BADGES, pg

REF = re.compile(r'→ 第 (\d+) 页')


def build_links(path):
    """写 links.json，供 tools/pdf.js 叠加链接。返回链接条数。"""
    L = []

    def add(sid, needle, target, zone='body', up=0, last=False):
        L.append(dict(slide=sid, needle=needle, target=target, s=None, e=None, up=up, zone=zone, last=last))

    for sid in ORDER[1:]:
        for label, t in CFG['nav']:
            if t in ORDER:
                add(sid, label, t, zone='footer')
    if 'toc' in ORDER:
        for _, _, ids in SECTIONS:
            for sid in ids:
                add('toc', SHORT[sid], sid, up=1)
    D = CFG['outdir'] + 'slides/'
    for sid in ORDER:
        with open(D + sid + '.html', encoding='utf-8') as f:
            h = f.read()
        h = re.sub(r'<aside>.*?</aside>', '', h, flags=re.S)
        for m in sorted(set(REF.findall(h)), key=int):
            n = int(m)
            if not 1 <= n <= len(ORDER):
                raise ValueError(f'{sid}: 「→ 第 {n} 页」超出页数 {len(ORDER)}')
            add(sid, f'→ 第 {m} 页', ORDER[n - 1])
    for sid, (b, t) in BADGES.items():
        if sid in ORDER and t in ORDER and t != sid:
            add(sid, b, t, last=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(dict(order=ORDER, links=L), f, ensure_ascii=False)
    return len(L)


def outline(src, dst, title, author='侍天 TIANSIGHT', subject='', front=(('封面', 'cover'), ('目录', 'toc'))):
    """给 PDF 加书签（封面、目录、各部分及其各页）与元数据。"""
    import pypdf
    w = pypdf.PdfWriter(clone_from=pypdf.PdfReader(src))
    for name, sid in front:
        if sid in ORDER:
            w.add_outline_item(name, pg(sid) - 1)
    for n, name, ids in SECTIONS:
        par = w.add_outline_item(f'{n}　{name}', pg(ids[0]) - 1)
        for i in ids:
            w.add_outline_item(f'{pg(i):02d}　{SHORT[i]}', pg(i) - 1, parent=par)
    w.add_metadata({'/Title': title, '/Author': author, '/Subject': subject})
    w.page_mode = '/UseOutlines'
    with open(dst, 'wb') as f:
        w.write(f)


def verify_pdf(path, links_json=None):
    """统计链接与书签；链接目标页必须存在。给出 links_json 时再核对每条链接落在预期的目标页。"""
    import pypdf
    r = pypdf.PdfReader(path)
    pages = {p.indirect_reference.idnum: i for i, p in enumerate(r.pages)}
    n = bad = wrong = 0
    expect = None
    if links_json:
        with open(links_json, encoding='utf-8') as f:
            spec = json.load(f)
        order = spec['order']
        expect = {}
        for L in spec['links']:
            expect.setdefault(order.index(L['slide']), set()).add(order.index(L['target']))
    for pi, p in enumerate(r.pages):
        for a in p.get('/Annots') or []:
            a = a.get_object()
            if a.get('/Subtype') != '/Link':
                continue
            n += 1
            d = a.get('/Dest')
            if d is None and a.get('/A') is not None:
                d = a['/A'].get('/D')
            if isinstance(d, (str, pypdf.generic.TextStringObject, pypdf.generic.NameObject)):
                d = r.named_destinations.get(str(d))
                d = None if d is None else [d.page]
            tgt = None if d is None else pages.get(d[0].idnum if hasattr(d[0], 'idnum') else d[0].indirect_reference.idnum)
            if tgt is None:
                bad += 1
            elif expect is not None and tgt not in expect.get(pi, ()):
                wrong += 1

    def count(o):
        return sum(count(x) if isinstance(x, list) else 1 for x in o)
    return dict(pages=len(r.pages), links=n, unresolved=bad, misdirected=wrong, outline=count(r.outline))
