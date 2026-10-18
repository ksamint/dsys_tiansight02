"""Build a Tiansight HTML report (deck or scroll) from a manifest directory.

python3 html-system/build_deck.py <dir>            # writes <dir>/index.html
python3 html-system/build_deck.py <dir> --check    # exit 1 if <dir>/index.html is stale

<dir>/manifest.json   validated loosely against html-system/manifest.schema.json
<dir>/data/*.csv      tables referenced by sources[].table; rendered into the appendix
<dir>/slides/*.html   optional hand-written slide bodies, referenced by blocks[{type:html, file}]

Everything structural is generated from the manifest: cover, TOC, evidence base, evidence map,
change log, data quality, limitations, source log, glossary, the explanation panel behind every
content slide, the ⊞ 数据出处 button, footers with report id · version · 口径, and the source
appendix overlay with drill-down filters. Content slides hold blocks: chart (charts.py family),
kpis, panel, table, list, html.
"""
from pathlib import Path
import csv
import html as H
import json
import re
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import charts  # noqa: E402

GRADES = {'E1': 'E1 直接计量', 'E2': 'E2 抽样推算', 'E3': 'E3 外部参照 / 设计值', 'E4': 'E4 未验证'}
GRADE_TEXT = {
    'E1': '系统实测或全量交易数据直接计算，可复算',
    'E2': '在实测值上做抽样或代数分解，方式影响数值不影响方向',
    'E3': '公开外部数据、商圈采集或含目标假设的设计值',
    'E4': '未经数据验证的推断，须经试点验证',
}
CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']


def esc(s):
    return H.escape(str(s), quote=True)


def read_csv(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        rows = list(csv.reader(f))
    return rows[0], rows[1:]


class Deck:
    def __init__(self, folder):
        self.dir = Path(folder)
        self.m = json.loads((self.dir / 'manifest.json').read_text(encoding='utf-8'))
        self.r = self.m['report']
        self.sources = {s['id']: s for s in self.m['sources']}
        self.metrics = {mt['id']: mt for mt in self.m.get('metrics', [])}
        self.rel = Path('..' if self.dir.parent == ROOT else '../..')
        depth = len(self.dir.resolve().relative_to(ROOT).parts)
        self.up = '../' * depth
        self.pages = []        # (slide_html, meta_html)
        self.page_of = {}      # slide id → page number
        self.sprite = (ROOT / 'brand' / 'icons.svg').read_text().replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg ', 1)
        self.sprite = re.sub(r'\s*<!--.*?-->\s*', '\n', self.sprite, flags=re.S)

    # ── helpers ──
    def foot(self, caliber=''):
        return (f'<div class="s-foot"><span class="cal">{esc(self.r["client"])} · {esc(self.r["title"])} · {esc(self.r["id"])} · {esc(self.r["version"])}'
                + (f' ｜ 口径：{esc(caliber)}' if caliber else '') + '</span><span class="pg"></span></div>')

    def top(self, chip, ega=None, src=None, tag=''):
        e = f'<span class="ega e{ega[-1]}">{esc(GRADES.get(ega, ega))}</span>' if ega else ''
        b = f'<button class="srcbtn" data-src="{esc(src)}">⊞ 数据出处</button>' if src else ''
        return f'<div class="s-top"><span class="chip">{esc(chip)}</span>{e}{b}<span class="s-tag">{esc(tag)}</span></div>'

    def meta(self, s):
        m = s.get('meta') or {}
        items = [('SOURCE', m.get('source') or ' · '.join(self.sources[k]['name'] for k in s.get('src', []) if k in self.sources)),
                 ('FORMULA 公式与出处', m.get('formula') or ' ｜ '.join(f'{self.metrics[k]["name"]} = {self.metrics[k]["formula"]}' for k in s.get('metrics', []) if k in self.metrics)),
                 ('DERIVATION 推导逻辑', m.get('derivation')), ('GLOSSARY', m.get('glossary')),
                 ('CONCLUSION', m.get('conclusion') or (s.get('conclusion') or {}).get('text')), ('CONFIDENCE', m.get('confidence'))]
        return '<aside class="meta">' + ''.join(f'<div><div class="k">{k}</div><div class="b">{esc(v)}</div></div>' for k, v in items if v) + '</aside>'

    def add(self, slide_html, meta_html='', sid=None):
        self.pages.append((slide_html, meta_html))
        if sid:
            self.page_of[sid] = len(self.pages)

    def slide(self, cls, chip, title, body, *, ega=None, src=None, tag='', caliber='', layout=''):
        return (f'<section class="slide {cls}">{self.top(chip, ega, src, tag)}<h2 class="s-title">{title}</h2>'
                f'<div class="s-body {layout}">{body}</div>{self.foot(caliber)}</section>')

    # ── blocks ──
    def block(self, b, s):
        t = b['type']
        if t == 'chart':
            fam = charts.FAMILIES[b['family']]
            kw = dict(b.get('args', {}))
            kw.setdefault('src', (s.get('src') or [None])[0])
            svg = fam(*b.get('pos', []), **kw)
            style = f' style="{b["style"]}"' if b.get('style') else ''
            cap = f'<div class="note" style="padding:6px 10px 0">{esc(b["caption"])}</div>' if b.get('caption') else ''
            return f'<div class="fig" data-src="{esc(kw["src"] or "")}"{style}>{svg}</div>{cap}'
        if t == 'kpis':
            return ('<div style="display:grid;grid-template-columns:repeat(' + str(len(b['items'])) + ',1fr);gap:14px">' +
                    ''.join(f'<div class="kpi {k.get("tone", "")}"><div class="l">{esc(k["label"])}</div><div class="v">{esc(k["value"])}{" <small>" + esc(k["unit"]) + "</small>" if k.get("unit") else ""}</div><div class="d">{esc(k.get("note", ""))}</div></div>' for k in b['items']) + '</div>')
        if t == 'panel':
            return f'<div class="panel {b.get("tone", "")}"><div class="hd">{esc(b["head"])}</div><div class="txt">{b["body"]}</div>' + (f'<div class="note">{b["note"]}</div>' if b.get('note') else '') + '</div>'
        if t == 'table':
            head = ''.join(f'<th class="{c.get("cls", "")}">{esc(c["label"])}</th>' for c in b['columns'])
            rows = ''.join('<tr class="' + esc(r.get('cls', '')) + '">' + ''.join(f'<td class="{c.get("cls", "")}">{v}</td>' for c, v in zip(b['columns'], r['cells'])) + '</tr>' for r in b['rows'])
            return f'<table class="t {b.get("density", "")}"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'
        if t == 'list':
            tag = 'ol' if b.get('numbered') else 'ul'
            return f'<{tag} class="{"ns" if b.get("numbered") else "ls"}">' + ''.join(f'<li>{i}</li>' for i in b['items']) + f'</{tag}>'
        if t == 'html':
            return (self.dir / 'slides' / b['file']).read_text(encoding='utf-8') if b.get('file') else b.get('html', '')
        raise SystemExit(f'unknown block type {t}')

    # ── generated slides ──
    def cover(self):
        r = self.r
        w = r['window']
        self.add(f'<section class="slide cover"><div class="bar"></div><div class="inner"><span class="ts-caption">{esc(r["client"])} · {esc(r.get("subtitle", "侍天 TIANSIGHT"))}</span>'
                 f'<h1>{esc(r["title"])}</h1><div class="sub">{esc(r.get("lede", ""))}</div>'
                 f'<div class="facts"><div>版本<b>{esc(r["version"])}</b></div><div>出具日期<b>{esc(r["issued"])}</b></div><div>数据窗口<b>{esc(w["from"])} → {esc(w["to"])}</b></div><div>范围<b>{esc(r.get("scope", ""))}</b></div></div></div></section>', sid='cover')

    def toc(self, content):
        rows = ''.join(f'<div class="toc-row" data-go="{self.page_of.get(s["id"], "")}"><span class="no">{s.get("chapter", "")}</span><span class="ti">{esc(re.sub(r"<[^>]+>", "", s["title"]))} <span>{esc(s["chip"])}</span></span><span class="pg">P {self.page_of.get(s["id"], "")}</span></div>' for s in content if s.get('kind', 'content') != 'divider')
        return self.slide('toc', '目录 · CONTENTS', f'{esc(self.r["title"])}：{len(content)} 页内容，每页一个可复算的结论', rows, tag='目录', layout='')

    def evidence_base(self):
        srcs = self.m['sources']
        kpis = [{'label': f'{s["name"]} · {s["grade"]}', 'value': f'{s["rows"]:,}', 'unit': '行', 'note': f'{s["window"].get("from", "")} → {s["window"].get("to", "")} · {s["window"].get("type", "")}' + (f'；{s["caliber"]}' if s.get('caliber') else ''), 'tone': 'a' if s['grade'] == 'E1' else ''} for s in srcs[:4]]
        counts = {g: sum(1 for s in self.m['slides'] if s.get('ega') == g) for g in GRADES}
        legend = ''.join(f'<b style="color:var(--ega-{g[-1]})">{GRADES[g]}</b> {GRADE_TEXT[g]}<br>' for g in GRADES)
        body = (self.block({'type': 'kpis', 'items': kpis}, {}) +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">'
                + ''.join(self.block({'type': 'panel', 'head': f'口径 · {c["term"]}', 'body': esc(c['definition'])}, {}) for c in self.m.get('glossary', [])[:2])
                + f'<div class="panel"><div class="hd">证据分级 · EGA</div><div class="note">{legend}</div><div class="note">全案 ' + ' · '.join(f'{g} <b>{n} 页</b>' for g, n in counts.items()) + '</div></div></div>')
        self.add(self.slide('', '证据底盘 · EVIDENCE BASE', f'<em>{len(srcs)} 类证据源</em>，全案结论按 EGA 四级标注，分母、时间窗与已知偏差在此一次性声明', body, tag='开篇', layout='rows', caliber='见各源 window 与 caliber'), sid='evidence-base')

    def evidence_map(self, content):
        rows = [{'no': i + 1, 'text': re.sub(r'<[^>]+>', '', s['conclusion']['text'] if s.get('conclusion') else s['title'])[:44], 'metric': self.metrics.get(s['conclusion'].get('metric', ''), {}).get('name', '') if s.get('conclusion') else '', 'value': (s.get('conclusion') or {}).get('value', ''), 'grade': s.get('ega', 'E1'), 'page': self.page_of.get(s['id'], '')}
                for i, s in enumerate([s for s in content if s.get('conclusion')])]
        if not rows:
            return
        e1 = sum(1 for r in rows if r['grade'] == 'E1')
        self.add(self.slide('', '结论索引 · EVIDENCE MAP', f'<em>{len(rows)} 条核心结论</em>逐条对应一项可复算指标，其中 <em>{e1} 条</em>由 E1 数据直接支撑',
                            f'<div class="fig" style="border:0;background:transparent">{charts.evidence_map(rows)}</div>', tag='开篇'), sid='evidence-map')

    def changes(self):
        v = self.m['versions'][-1]
        if len(self.m['versions']) < 2 and not v.get('changes'):
            return
        rows = [{'cells': [c['kind'], c['what'], c.get('why', ''), ', '.join(c.get('affects', []))], 'cls': 'hi' if c['kind'] == '口径' else ''} for c in v['changes']]
        body = self.block({'type': 'table', 'density': 'c', 'columns': [{'label': '类型', 'cls': 'm'}, {'label': '变更'}, {'label': '原因'}, {'label': '影响页'}], 'rows': rows}, {})
        prev = self.m['versions'][-2]['version'] if len(self.m['versions']) > 1 else '首版'
        self.add(self.slide('', f'卷首 · {prev} → {v["version"]} 的变更', f'{prev} → <em>{v["version"]}</em>：{len(v["changes"])} 处变更，口径变更 <s>{sum(1 for c in v["changes"] if c["kind"] == "口径")} 处</s>', body, tag=v['date']), sid='changes')

    def quality(self):
        q = self.m.get('quality', [])
        if not q:
            return
        rows = [{'cells': [x['status'], x['check'], x['result'], x.get('affected', ''), x.get('action', '')], 'cls': 'warn' if x['status'] in ('warn', 'fail') else ''} for x in q]
        body = self.block({'type': 'table', 'density': 'c', 'columns': [{'label': '状态', 'cls': 'm'}, {'label': '检查', 'cls': 'k'}, {'label': '结果'}, {'label': '涉及'}, {'label': '处理'}], 'rows': rows}, {})
        bad = sum(1 for x in q if x['status'] in ('warn', 'fail'))
        self.add(self.slide('', '质量异常 · DATA QUALITY', f'{len(q)} 项质量检查，<s>{bad} 项</s>需处理后才能进入分析', body, ega='E1', tag='数据准备', caliber='先修数据，再评结论'), sid='quality')

    def limitations(self):
        L = self.m.get('limitations', [])
        if not L:
            return
        body = ''.join(f'<div class="panel {"warn" if i == 0 else ""}"><div class="hd">局限{CN[i]} · {esc(x["title"])}</div><div class="txt">{x["body"]}</div>' + (f'<div class="note"><b>要补的事：</b>{x["fix"]}</div>' if x.get('fix') else '') + '</div>' for i, x in enumerate(L))
        self.add(self.slide('', '分析局限 · LIMITATIONS', f'<em>{len(L)} 条局限</em>限定结论的适用范围；标注 E1 的数字可回溯到具体导出文件与窗口', body, tag='边界', layout=f'g{min(len(L), 3)}'), sid='limitations')

    def source_log(self):
        rows = [{'cells': [i + 1, f'<b>{esc(s["name"])}</b><br><span class="note">{esc(s.get("file", ""))}{" · " + esc(s["sheet"]) if s.get("sheet") else ""}</span>', f'{s["rows"]:,}', f'{s["window"].get("type", "")} {s["window"].get("from", "")}→{s["window"].get("to", "")}', s['grade'], '；'.join(s.get('cleaning', [])) or '—'], 'cls': ''} for i, s in enumerate(self.m['sources'])]
        body = self.block({'type': 'table', 'density': 'c', 'columns': [{'label': '#', 'cls': 'm'}, {'label': '源文件 · 工作表'}, {'label': '行', 'cls': 'n'}, {'label': '窗口'}, {'label': '等级', 'cls': 'm'}, {'label': '清洗动作'}], 'rows': rows}, {})
        v = self.m['versions'][-1]
        body += f'<div class="note" style="margin-top:8px">可复现性：所有图表数值由 manifest.json 声明的数据源按各页页脚口径聚合产生，无手工录入；本页「⊞ 数据出处」可展开全部底表。报告版本 {esc(v["version"])} · {esc(v["date"])}' + (f' · {esc(v["author"])}' if v.get('author') else '') + '</div>'
        self.add(self.slide('', '附录 · SOURCE LOG', f'源文件清单与清洗日志：<em>{len(self.m["sources"])} 份</em>数据源，共 {sum(s["rows"] for s in self.m["sources"]):,} 行', body, ega='E1', src=self.m['sources'][0]['id'], tag='附录'), sid='source-log')

    def glossary(self):
        g = self.m.get('glossary', [])
        mets = list(self.metrics.values())
        if not g and not mets:
            return
        rows = [{'cells': [f'<b>{esc(mt["name"])}</b>', esc(mt['formula']), mt['grade'], esc(mt.get('threshold', '') or mt.get('window_rule', ''))], 'cls': ''} for mt in mets]
        body = self.block({'type': 'table', 'density': 'c', 'columns': [{'label': '指标'}, {'label': '公式'}, {'label': '等级', 'cls': 'm'}, {'label': '阈值 / 窗口规则'}], 'rows': rows}, {}) if rows else ''
        if g:
            body += '<dl class="glossary" style="margin:10px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:4px 24px">' + ''.join(f'<div><dt class="ts-caption" style="font-size:12px">{esc(x["term"])}</dt><dd class="note" style="margin:0">{esc(x["definition"])}</dd></div>' for x in g) + '</dl>'
        self.add(self.slide('', '附录 · GLOSSARY', f'<em>{len(mets)} 项指标</em>的公式、等级与阈值，{len(g)} 条术语口径', body, tag='附录'), sid='glossary')

    # ── appendix overlay ──
    def appendix(self):
        groups = {}
        for s in self.m['sources']:
            groups.setdefault(s.get('group', '数据源'), []).append(s)
        nav = '<b style="margin-top:0">数据附录 · SOURCE APPENDIX</b>' + ''.join(f'<b>{esc(g)}</b>' + ''.join(f'<a data-k="{esc(s["id"])}">{esc(s["name"])}</a>' for s in ss) for g, ss in groups.items())
        secs = []
        for s in self.m['sources']:
            cap = f'<b>{s["grade"]}</b> · 来源：{esc(s.get("file", s["name"]))}' + (f' · {esc(s["sheet"])}' if s.get('sheet') else '') + f' · {s["window"].get("type", "")} {s["window"].get("from", "")} → {s["window"].get("to", "")} · 共 {s["rows"]:,} 行' + (f' ｜ 口径：{esc(s["caliber"])}' if s.get('caliber') else '')
            table = ''
            if s.get('table'):
                head, rows = read_csv(self.dir / 'data' / s['table'])
                ki = head.index(s['key_column']) if s.get('key_column') in head else 0
                table = ('<div class="filter"><span></span><button type="button">清除筛选</button></div><table><thead><tr>' + ''.join(f'<th>{esc(h)}</th>' for h in head) + '</tr></thead><tbody>'
                         + ''.join(f'<tr data-key="{esc(r[ki])}">' + ''.join(f'<td>{esc(c)}</td>' for c in r) + '</tr>' for r in rows) + '</tbody></table>')
            secs.append(f'<section id="src-{esc(s["id"])}"><h3>{esc(s["name"])}</h3><div class="cap">{cap}</div>{table}</section>')
        return f'<div class="srcov"><div class="srcnav">{nav}</div><div class="srcbody">{"".join(secs)}</div></div><button class="srcclose" type="button">关闭 Esc</button>'

    # ── assemble ──
    def build(self):
        content = [s for s in self.m['slides']]
        # first pass: number pages so TOC and map can link
        self.cover()
        toc_at = len(self.pages) + 1
        self.pages.append(('', ''))      # toc placeholder
        self.evidence_base()
        map_at = len(self.pages) + 1
        self.pages.append(('', ''))      # evidence map placeholder
        self.changes()
        for s in content:
            if s.get('kind') == 'divider':
                self.add(f'<section class="slide divider"><div class="s-top"><span class="chip">{esc(s["chip"])}</span></div><div class="s-body" style="justify-content:center;gap:24px"><div class="dv-num">{esc(s.get("chapter", ""))}</div><div class="dv-h">{s["title"]}</div><div class="rule-block"></div><div class="lead">{s.get("lede", "")}</div></div>{self.foot()}</section>', sid=s['id'])
                continue
            body = ''.join(self.block(b, s) for b in s.get('blocks', []))
            self.add(self.slide('', s['chip'], s['title'], body, ega=s.get('ega'), src=(s.get('src') or [None])[0], tag=s.get('tag', s.get('chapter', '')), caliber=s.get('caliber', ''), layout=s.get('layout', '')), self.meta(s), sid=s['id'])
        self.quality()
        self.limitations()
        self.source_log()
        self.glossary()
        self.pages[toc_at - 1] = (self.toc(content), '')
        self.pages[map_at - 1] = ('', '')
        saved = self.pages
        self.pages = []
        self.evidence_map(content)
        saved[map_at - 1] = self.pages[0] if self.pages else saved[map_at - 1]
        self.pages = [p for p in saved if p[0]]
        rows = ''.join(f'<div class="row">{s}{m}</div>' for s, m in self.pages)
        r = self.r
        return f'''<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(r["client"])} · {esc(r["title"])} · {esc(r["version"])} · 侍天 TIANSIGHT</title>
<link rel="stylesheet" href="{self.up}brand/fonts.css">
<link rel="stylesheet" href="{self.up}brand/tokens.css">
<link rel="stylesheet" href="{self.up}brand/base.css">
<link rel="stylesheet" href="{self.up}brand/components.css">
<link rel="stylesheet" href="{self.up}html-system/report.css">
</head>
<body class="mode-deck">
<!-- Generated by html-system/build_deck.py from manifest.json. Edit the manifest, data and slides, not this file. -->
{self.sprite}
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">{charts.hatch_defs()}</svg>
<div class="wb"><span class="title">{esc(r["client"])} · {esc(r["title"])}</span><span>{esc(r["version"])} · {esc(r["issued"])}</span><button id="pl" type="button">全屏播放</button><button id="sv" type="button">数据附录</button><button id="mt" type="button">显示解释面板</button><span class="hint">← → 翻页 · F 全屏 · O 目录 · M 解释面板 · Esc 退出 · 打印导出 1280×720 PDF</span></div>
{self.appendix()}
<div class="tip"></div>
<main class="stage"><div class="deck">{rows}</div></main>
<div class="pgind"></div>
<script src="{self.up}html-system/report.js"></script>
</body>
</html>
'''


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    folder = Path(sys.argv[1]).resolve()
    out = Deck(folder).build()
    target = folder / 'index.html'
    if '--check' in sys.argv:
        if not target.exists() or target.read_text(encoding='utf-8') != out:
            print(f'{target.relative_to(ROOT)} is stale: run python3 html-system/build_deck.py {folder.relative_to(ROOT)}')
            sys.exit(1)
        print(f'{target.relative_to(ROOT)} is up to date')
    else:
        target.write_text(out, encoding='utf-8')
        n_slides = out.count('<section class="slide')
        print(f'wrote {target.relative_to(ROOT)} ({len(out):,} bytes, {n_slides} slides)')
