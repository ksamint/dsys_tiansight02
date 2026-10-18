"""侍天 TIANSIGHT 报告幻灯片工具包 · 核心层

令牌、页面框架（页头 / 页脚 / 讲稿）、自适应标题、页序与页码引用、通用组件。
所有页面都用 1920×1080 画布、128px 边距、y ≤ 920 的正文区。

色值只从仓库的 brand/tokens.json 读取；
工具包脱离仓库单独使用时退回到下方 FALLBACK（与 v0.7 发布值一致，tests/test_kit.py 校验两者不漂移）。
"""
import datetime
import json
import os
import re

# ---------------- 令牌 ----------------
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _find_repo():
    d = KIT
    for _ in range(6):
        if os.path.isfile(os.path.join(d, 'brand', 'tokens.json')):
            return d
        d = os.path.dirname(d)
    return None


REPO = _find_repo()

# 工具包常量名 → (令牌文件, 令牌名)
TOKEN_MAP = {
    'SURF': ('brand', 'surface'), 'PAPER': ('brand', 'paper'), 'INK': ('brand', 'ink-primary'),
    'CHAR': ('brand', 'charcoal'), 'GOLD': ('brand', 'gold'), 'GOLDHI': ('brand', 'gold-hi'),
    'MUTED': ('brand', 'ink-muted'), 'SEAL': ('brand', 'seal'),
    'G100': ('brand', 'gold-100'), 'G300': ('brand', 'gold-300'), 'G400': ('brand', 'gold-400'),
    'G500': ('brand', 'gold-500'), 'G600': ('brand', 'gold-600'), 'G700': ('brand', 'gold-700'),
    'GROW': ('brand', 'chart-growth'), 'CAUT': ('brand', 'chart-caution'), 'DATUM': ('brand', 'chart-benchmark-solid'),
    'LINE': ('brand', 'line'), 'RULE': ('brand', 'line-strong'), 'CARD': ('brand', 'card-border'),
    'BODY': ('brand', 'charcoal'), 'P100': ('brand', 'surface'), 'BENCH': ('brand', 'chart-benchmark'),
}
FALLBACK = {
    'SURF': '#F4F0E7', 'PAPER': '#FFFDF8', 'INK': '#EFE6D2', 'CHAR': '#17130D', 'GOLD': '#76551F', 'GOLDHI': '#D4A862',
    'MUTED': '#706758', 'SEAL': '#8C3228', 'G100': '#F3E7CF', 'G300': '#D4A862', 'G400': '#A8842F', 'G500': '#76551F',
    'G600': '#5C4218', 'G700': '#3F2D0F', 'GROW': '#4E6B3F', 'CAUT': '#B98B2A', 'DATUM': '#6E6355',
    'LINE': 'rgba(23,19,13,.18)', 'RULE': 'rgba(23,19,13,.34)', 'CARD': 'rgba(118,85,31,.34)',
    'BODY': '#17130D', 'P100': '#F4F0E7', 'BENCH': 'rgba(112,103,88,.45)',
}


def _read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def _norm(v):
    """'rgba(23, 19, 13, 0.18)' → 'rgba(23,19,13,.18)'；十六进制统一大写。"""
    v = v.strip()
    if v.startswith('#'):
        return v.upper()
    return re.sub(r'\b0\.', '.', v.replace(' ', ''))


def load_tokens(repo=REPO):
    """返回 {常量名: 色值}；找不到令牌文件或某个令牌时用 FALLBACK。第二个返回值列出用了回退值的常量。"""
    src = {}
    if repo:
        try:
            b = json.loads(_read(os.path.join(repo, 'brand', 'tokens.json')))['color']
            src['brand'] = {k: v['$value'] for k, v in b.items()}
        except (OSError, KeyError, ValueError):
            pass

    def resolve(table, name, depth=0):
        v = table.get(name)
        if v is None or depth > 5:
            return None
        m = re.fullmatch(r'\{(?:color\.)?([\w-]+)\}', v.strip())
        return resolve(table, m[1], depth + 1) if m else v

    out, missing = {}, []
    for const, (file, name) in TOKEN_MAP.items():
        v = resolve(src.get(file, {}), name)
        if v is None:
            missing.append(const)
            v = FALLBACK[const]
        out[const] = _norm(v)
    return out, missing


TOKENS, TOKENS_FALLBACK = load_tokens()
globals().update(TOKENS)
CN = "'Noto Serif SC', 'Songti SC', serif"
EN = "'Noto Serif', Georgia, serif"
MONO = "'IBM Plex Mono', 'Noto Serif SC', 'Courier New', monospace"
ON_DARK = 'rgba(244,240,231,.92)'          # 照片或玄墨底上的页脚文字（surface 92%）
FACES = {"noto-serif-sc": {"family": "Noto Serif SC", "href": "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300..700&display=swap"},
         "noto-serif": {"family": "Noto Serif", "href": "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400..700;1,400&display=swap"},
         "ibm-plex-mono": {"family": "IBM Plex Mono", "href": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"}}
DS_RECORD = {"title": "侍天 TIANSIGHT", "namespace": "tiansight", "artifact": "https://claude.ai/artifact/3HezHydMsfPFPqnbSbxv7K", "version": None}

# ---------------- 配置 ----------------
CFG = dict(deckname='报告名称', outdir='./deck/', images={}, blobs={}, nav=[('目录', 'toc'), ('术语', 'gloss')], badge_target='gloss', rule_exempt=[], title_style='conclusion', label_pages=[], expect={})
WARN = []


def reset():
    """清空已登记的页、标签、页序与警告（同一进程里连续生成多份报告时用）。"""
    SLIDES.clear(); BADGES.clear(); WARN.clear(); STALE.clear()
    ORDER.clear(); SECTIONS.clear(); SHORT.clear()
    CFG.update(rule_exempt=[], title_style='conclusion', label_pages=[], expect={})


def configure(**kw):
    """deckname 页脚报告名；outdir 输出目录（其下写 deck.json 与 slides/）；
    images {键: 仓库内相对路径}；blobs {键: '/_blob/<id>'}（发布到 Slides 时用）；
    nav 页脚跳转入口；badge_target 右上角标签在 PDF 中默认跳到的页；
    rule_exempt 引述规则本身的页（如宜忌页），check_deck.py 对其不查避用词、「我们」和标题句号。
    title_style 'conclusion'（默认：论证页标题为结论句，句号结尾）或 'label'（客户要求短标题时，全份用名词短标题）；
    label_pages 用名词短标题的页（数据页、对比页、附录），check_deck.py 要求其标题不加句号、≤ 16 字。
    环境变量 TSK_BLOBS 指向一个 blobs.json 时，自动并入 blobs。"""
    CFG.update(kw)
    if not CFG['outdir'].endswith('/'):
        CFG['outdir'] += '/'
    path = os.environ.get('TSK_BLOBS')
    if path:
        CFG['blobs'] = dict(CFG['blobs'], **json.loads(_read(path)))


def expect(group, ids):
    """登记应有清单：group 为名称（如「门店 × 图」「明细」），ids 为应出现在页序中的页 id。
    check_deck.py 按清单核对，缺页记为 MISSING，并打印每组应有 / 实有数量。"""
    CFG['expect'][group] = list(ids)


def blob(k):
    """图片地址：发布用 blobs 优先；否则为从 slides/ 指向仓库文件的相对路径。"""
    if k in CFG['blobs']:
        return CFG['blobs'][k]
    if k in CFG['images']:
        base = REPO or os.getcwd()
        return os.path.relpath(os.path.join(base, CFG['images'][k]), os.path.join(os.path.abspath(CFG['outdir']), 'slides')).replace(os.sep, '/')
    raise KeyError(f'图片键 {k!r} 未在 configure(images=…) 或 blobs 中登记')


# ---------------- 页序与引用 ----------------
ORDER = []
SECTIONS = []
SHORT = {}


def set_order(order, sections, short):
    dup = sorted({i for i in order if order.count(i) > 1})
    if dup:
        raise ValueError(f'页序中有重复 id：{dup}')
    for n, name, ids in sections:
        bad = [i for i in ids if i not in order]
        if bad:
            raise ValueError(f'章节「{n} {name}」含页序外的 id：{bad}')
    no_short = [i for _, _, ids in sections for i in ids if i not in short]
    if no_short:
        raise ValueError(f'缺少短名（目录与书签用）：{no_short}')
    ORDER[:] = order
    SECTIONS[:] = sections
    SHORT.clear()
    SHORT.update(short)


def pg(i):
    if i not in ORDER:
        raise KeyError(f'页 id {i!r} 不在页序中')
    return ORDER.index(i) + 1


def ref(*ids): return '第 ' + '、'.join(str(pg(i)) for i in ids) + ' 页'


# ---------------- 字标 ----------------
WM = [("T", 0), ("I", 1), ("A", 0), ("N", 1), ("S", 1), ("I", 1), ("G", 1), ("H", 1), ("T", 1)]


def wm(): return ''.join(f'<span style="color:{G400}">{c}</span>' if g else f'<span style="color:{CHAR};font-weight:700">{c}</span>' for c, g in WM)


# ---------------- 页头与自适应标题 ----------------
def text_width(t, size=1):
    """估算宽度：中文 1.04 × 字号，西文 0.58 × 字号（去掉标签后计算）。"""
    t = re.sub(r'<[^>]+>', '', t)
    return sum(0.58 if ord(c) < 128 else 1.04 for c in t) * size


def fit(t, badge):
    """在 56 / 52 / 48 / 44 中选能一行放下标题的最大字号（考虑右侧标签宽度）。放不下记入 WARN。"""
    avail = 1664 - (0 if not badge else 32 + 40 + text_width(badge, 24 * 0.62))
    for sz in (56, 52, 48, 44):
        if text_width(t, sz) + len(t) * 4 <= avail:
            return sz
    WARN.append(f'标题过长，44px 也放不下一行：{t}')
    return 44


def eyebrow(t): return f'<p style="font-size:24px;letter-spacing:8px;color:{GOLD}">{t}</p>'


def head(eb, t, badge=None, size=None):
    size = size or fit(t, badge)
    b = f'<p style="font-family:{MONO};font-size:24px;color:{GOLD};border:1px solid {GOLD};border-radius:999px;padding:2px 16px;white-space:nowrap">{badge}</p>' if badge else ''
    return (f'<div style="display:flex;align-items:flex-end;gap:32px;padding-bottom:22px;border-bottom:2px solid {GOLD}"><div style="flex:1;display:flex;flex-direction:column;gap:14px">{eyebrow(eb)}'
            f'<h2 style="font-size:{size}px;font-weight:600;line-height:1.2;letter-spacing:4px;color:{CHAR}">{t}</h2></div>{b}</div>')


# ---------------- 页面登记与输出 ----------------
SLIDES = []
BADGES = {}


def sec(id, body, notes, bg=SURF, pad='128px 128px 160px', gap=26, footer=True, extra='', numlight=False):
    if any(s['id'] == id for s in SLIDES):
        raise ValueError(f'页 id {id!r} 重复登记')
    SLIDES.append(dict(id=id, body=body, notes=notes, bg=bg, pad=pad, gap=gap, footer=footer, extra=extra, numlight=numlight))


def page(id, eb, title, body, notes, badge=None, bg=SURF, gap=26, badge_target=None):
    """标准内容页：页头 + 主体 + 讲稿。有标签时登记 PDF 跳转目标（默认 CFG['badge_target']）。"""
    target = badge_target or CFG['badge_target']
    if badge and target:
        BADGES[id] = (badge, target)
    sec(id, head(eb, title, badge) + body, notes, bg=bg, gap=gap)


def _footer(i, total, light):
    mc = ON_DARK if light else MUTED
    nc = ON_DARK if light else GOLD
    nav = ''.join(f'<p style="position:absolute;left:{1252 + k * 140}px;bottom:64px;width:120px;{"text-align:right;" if k == 0 else ""}font-family:{CN};font-size:24px;letter-spacing:2px;color:{nc}">{a}</p>' for k, (a, _) in enumerate(CFG['nav']))
    return (f'<p style="position:absolute;left:128px;bottom:64px;width:240px;font-family:{EN};font-size:24px;font-weight:400;letter-spacing:6px;color:{MUTED};white-space:nowrap">{wm()}</p>'
            f'<p style="position:absolute;left:350px;bottom:64px;width:900px;font-family:{CN};font-size:24px;letter-spacing:2px;color:{mc};white-space:nowrap">·　{CFG["deckname"]}</p>'
            + nav + f'<p style="position:absolute;right:128px;bottom:64px;width:240px;text-align:right;font-family:{MONO};font-size:24px;color:{mc}">{i:02d} / {total}</p>')


def _check_mode():
    return bool(os.environ.get('TSK_CHECK'))


STALE = []


def _emit(path, text):
    """写文件；TSK_CHECK=1 时只比较，不一致记入 STALE。"""
    if _check_mode():
        old = _read(path) if os.path.isfile(path) else None
        if old != text:
            STALE.append(os.path.relpath(path))
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def render(order=None):
    """把登记的页写成 slides/<id>.html，删除页序外的旧页文件，写 .tsk.json（无页脚页等给检查工具用）。"""
    order = order or ORDER
    by = {s['id']: s for s in SLIDES}
    missing = [i for i in order if i not in by]
    if missing:
        raise ValueError(f'页序中有未生成的页：{missing}')
    unused = [s['id'] for s in SLIDES if s['id'] not in order]
    if unused:
        WARN.append(f'已生成但不在页序中的页：{unused}')
    for t in set(BADGES.values()):
        if t[1] not in order:
            WARN.append(f'标签「{t[0]}」的跳转目标 {t[1]!r} 不在页序中，PDF 中不会生成该链接')
    for _, t in CFG['nav']:
        if t not in order:
            WARN.append(f'页脚入口指向的 {t!r} 不在页序中，PDF 中不会生成该链接')
    D = CFG['outdir'] + 'slides/'
    for i, s in enumerate([by[x] for x in order], 1):
        foot = _footer(i, len(order), s['numlight']) if s['footer'] else ''
        h = (f'<section id="{s["id"]}" data-transition="fade" style="background:{s["bg"]};color:{CHAR};font-family:{CN};padding:{s["pad"]};display:flex;flex-direction:column;gap:{s["gap"]}px;{s["extra"]}">\n'
             f'{s["body"]}\n{foot}\n<aside>{s["notes"]}</aside>\n</section>\n')
        _emit(D + s['id'] + '.html', h)
    if os.path.isdir(D):
        for f in os.listdir(D):
            if f.endswith('.html') and f[:-5] not in order:
                if _check_mode():
                    STALE.append(os.path.relpath(D + f) + '（页序外的旧页）')
                else:
                    os.remove(D + f)
    meta = dict(order=list(order), nofooter=[s['id'] for s in SLIDES if not s['footer']], exempt=list(CFG['rule_exempt']))
    if CFG['title_style'] != 'conclusion' or CFG['label_pages']:
        meta.update(title_style=CFG['title_style'], label=list(CFG['label_pages']))
    if CFG['expect']:
        meta['expect'] = CFG['expect']
    _emit(CFG['outdir'] + '.tsk.json', json.dumps(meta, ensure_ascii=False) + '\n')
    for w in WARN:
        print('warning:', w)


def write_index(title, sections_desc, now=None, with_ds=True, cover='cover'):
    """deck.json。sections_desc: [(键, 一句话描述, 起始页 id)]；now 省略时取当前 UTC 时间（需要可复现时请固定）。"""
    now = now or datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    for _, _, s in sections_desc:
        pg(s)
    j = {"v": 4, "createdOnFiles": {"v": 1, "at": now}, "lists": "css", "title": title, "cover": cover, "order": ORDER,
         "sections": {k: {"description": d, "start": s} for k, d, s in sections_desc}, "faces": FACES,
         "designSystems": [dict(DS_RECORD, copiedAt=now)] if with_ds else []}
    _emit(CFG['outdir'] + 'deck.json', json.dumps(j, ensure_ascii=False) + '\n')


def write_viewer(title):
    """浏览器预览页 index.html：在仓库根目录起 http 服务后打开该目录即可翻页（← → 键），讲稿显示在底栏。"""
    order = json.dumps(ORDER, ensure_ascii=False)
    h = f'''<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="stylesheet" href="{os.path.relpath(os.path.join(REPO, 'brand', 'fonts.css'), os.path.abspath(CFG['outdir'])).replace(os.sep, '/') if REPO else 'fonts.css'}">
<style>
html,body{{margin:0;height:100%;background:{CHAR}}}
#stage{{position:fixed;inset:0 0 44px 0;display:flex;align-items:center;justify-content:center;overflow:hidden}}
#frame{{width:1920px;height:1080px;flex:none;transform-origin:center;position:relative;overflow:hidden;background:{SURF}}}
#frame section{{position:absolute;inset:0;width:1920px;height:1080px}}
#frame *{{box-sizing:border-box;margin:0}}
#frame section > :not([style*="position:absolute"]){{position:relative}}
#frame aside{{display:none}}
.vh{{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
#bar{{position:fixed;left:0;right:0;bottom:0;height:44px;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 16px;color:{P100};font:13px 'Noto Serif SC',serif;background:{CHAR}}}
#bar button{{background:none;border:1px solid {GOLDHI};color:{P100};padding:4px 14px;cursor:pointer}}
#notes{{flex:1;opacity:.75;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}}
</style></head><body>
<main id="stage"><h1 class="vh">{title}</h1><div id="frame"></div></main>
<div id="bar"><button id="prev" aria-label="上一页">←</button><span id="notes"></span><span id="pg"></span><button id="next" aria-label="下一页">→</button></div>
<script>
const ORDER = {order};
let i = Math.max(0, ORDER.indexOf(location.hash.slice(1)));
const frame = document.getElementById('frame');
function fit(){{ const s = Math.min(innerWidth/1920, (innerHeight-44)/1080); frame.style.transform = 'scale(' + s + ')'; }}
async function show(k){{
  i = (k + ORDER.length) % ORDER.length;
  const h = await (await fetch('slides/' + ORDER[i] + '.html')).text();
  frame.innerHTML = h.replace(/src="(?!https?:|\\/)/g, 'src="slides/');
  const a = frame.querySelector('aside');
  document.getElementById('notes').innerHTML = a ? a.innerHTML : '';
  document.getElementById('pg').textContent = (i + 1) + ' / ' + ORDER.length;
  history.replaceState(null, '', '#' + ORDER[i]);
}}
addEventListener('resize', fit);
addEventListener('keydown', e => {{ if (e.key === 'ArrowRight' || e.key === ' ') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); }});
document.getElementById('prev').onclick = () => show(i - 1);
document.getElementById('next').onclick = () => show(i + 1);
fit(); show(i);
</script></body></html>
'''
    _emit(CFG['outdir'] + 'index.html', h)


def apply_terms(rules):
    """全文术语统一：rules=[(页id或'*', 旧, 新)]；每条须至少命中一次，否则报错。"""
    by = {s['id']: s for s in SLIDES}
    miss = []
    for sid, a, b in rules:
        hit = 0
        for s in (SLIDES if sid == '*' else [by[sid]]):
            for k in ('body', 'notes'):
                if a in s[k]:
                    hit += 1
                    s[k] = s[k].replace(a, b)
        if not hit:
            miss.append((sid, a))
    if miss:
        raise SystemExit('术语规则未命中: ' + repr(miss))


# ---------------- 通用组件 ----------------
def txt(t, size=26, c=BODY, lh=1.55, extra=''): return f'<p style="font-size:{size}px;line-height:{lh};color:{c};{extra}">{t}</p>'
def num(v, size=56, c=GOLD): return f'<p style="font-family:{MONO};font-size:{size}px;line-height:1.1;color:{c}">{v}</p>'


def bignum(v, size=56, usize=28, c=GOLD):
    """'62 %' → 数字等宽土金 + 单位；单位与数字以空格分隔。"""
    n, u = (v.split(' ', 1) + [''])[:2]
    up = f'<p style="font-size:{usize}px;color:{c}">{u}</p>' if u else ''
    return f'<div style="display:flex;align-items:baseline;gap:6px"><p style="font-family:{MONO};font-size:{size}px;line-height:1.1;color:{c};white-space:nowrap">{n}</p>{up}</div>'


def lab(t, c=GOLD, ls=6): return f'<p style="font-size:24px;letter-spacing:{ls}px;color:{c}">{t}</p>'
def colhead(t): return f'<p style="font-size:24px;letter-spacing:6px;color:{GOLD};padding-bottom:10px;border-bottom:1.5px solid {GOLD}">{t}</p>'
def chip(t, c=GOLD): return f'<p style="font-size:24px;color:{c};border:1px solid {c};border-radius:999px;padding:2px 14px;white-space:nowrap">{t}</p>'
def legend(items): return '<div style="display:flex;gap:24px;flex-wrap:wrap">' + ''.join(f'<div style="display:flex;align-items:center;gap:8px"><div style="width:22px;height:18px;background:{c}"></div><p style="font-size:24px;color:{BODY}">{t}</p></div>' for t, c in items) + '</div>'
def note(t): return f'<p style="font-size:24px;line-height:1.5;color:{MUTED}">{t}</p>'
def circ(cn, size=56, fs=26): return f'<div style="width:{size}px;height:{size}px;border:1.5px solid {GOLD};border-radius:50%;display:flex;align-items:center;justify-content:center"><p style="font-size:{fs}px;font-weight:600;color:{GOLD};line-height:1">{cn}</p></div>'


def callout(label, text, dark=False):
    """提示条：「读法」「含义」「对某某」。dark=True 为玄墨条，一页最多一条。"""
    if dark:
        return f'<div style="display:flex;align-items:center;gap:28px;background:{CHAR};border-radius:2px;padding:20px 32px"><p style="font-size:24px;letter-spacing:6px;color:{GOLDHI};white-space:nowrap">{label}</p><p style="flex:1;font-size:26px;font-weight:600;line-height:1.45;color:{PAPER}">{text}</p></div>'
    return f'<div style="display:flex;align-items:center;gap:28px;background:{INK};border:1px solid {GOLD};border-radius:2px;padding:16px 28px"><p style="font-size:24px;letter-spacing:4px;color:{GOLD};white-space:nowrap">{label}</p><p style="flex:1;font-size:26px;line-height:1.45">{text}</p></div>'


def card(inner, gap=12, pad='22px 26px', bg=PAPER, flex='flex:1;', top=None):
    t = f'border:1px solid {top};border-top:4px solid {top};' if top else f'border:1px solid {CARD};'
    return f'<div style="{flex}display:flex;flex-direction:column;gap:{gap}px;background:{bg};{t}border-radius:2px;padding:{pad}">{inner}</div>'


def hbar(label, val, mx, w=520, color=G300, vtxt=None, lw=220, h=22, fs=24, bold=False):
    vt = vtxt if vtxt is not None else str(val)
    return (f'<div style="display:flex;align-items:center;gap:14px"><p style="width:{lw}px;font-size:{fs}px;{"font-weight:600;" if bold else ""}white-space:nowrap">{label}</p>'
            f'<div style="width:{max(2, round(val / mx * w))}px;height:{h}px;background:{color}"></div><p style="font-family:{MONO};font-size:24px;color:{BODY};white-space:nowrap">{vt}</p></div>')


def ref_line(*ids, c=SEAL): return f'<p style="font-size:24px;color:{c}">→ {ref(*ids)}</p>'
