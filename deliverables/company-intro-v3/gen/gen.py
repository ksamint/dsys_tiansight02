import json, os, html, datetime
from pathlib import Path
V = json.load(open('vals.json'))
CONTENT = Path(__file__).resolve().parents[3] / 'content'
TEAM = json.loads((CONTENT / 'team.json').read_text())
CONTACT = json.loads((CONTENT / 'contact.json').read_text())
assert len(TEAM['people']) == 4, 'Update corporate page count when adding team members'
ROSTER = [{**p['seat'], 'name': p['name'], 'photo': p['photo']} for p in TEAM['people']]
B = json.load(open('assets.json'))  # key -> relative asset path; inside a Claude Slides artifact use blobs.json
E = html.escape
OUT = '../slides'
os.makedirs(OUT, exist_ok=True)

# ── tokens (侍天 TIANSIGHT design system)
SURF = '#f4f0e7'; PAPER = '#fffdf8'; INK = '#efe6d2'; CHAR = '#17130d'; GOLD = '#76551f'
GOLDHI = '#d4a862'; MUTED = '#706758'; SEAL = '#8c3228'; BODY = CHAR; P100 = SURF  # report colours come from brand/tokens.json only (2026-10-14)
LINE = 'rgba(23,19,13,.18)'; RULE = 'rgba(23,19,13,.34)'; CARD = 'rgba(118,85,31,.34)'
CN = "'Noto Serif SC', 'Songti SC', serif"; EN = "'Noto Serif', Georgia, serif"; MONO = "'IBM Plex Mono', 'Noto Serif SC', 'Courier New', monospace"
import re as _re
def has_num(v): return bool(_re.search(r'[0-9]', str(v)))
TOTAL = 47
slides = []  # (id, html)
NB = []
def note(*t):
    NB.extend(x for x in t if x)

WM = [("T",0),("I",1),("A",0),("N",1),("S",1),("I",1),("G",1),("H",1),("T",1)]
def wm(dark=False):
    ink, gold = (SURF, GOLDHI) if dark else (CHAR, '#a8842f')  # dark: text-on-charcoal, gold-hi; light: charcoal, gold-400
    return ''.join(f'<span style="color:{gold if g else ink};font-weight:{400 if g else 700}">{c}</span>' for c, g in WM)

def sec(id, body, bg=SURF, pad='128px 128px 160px', extra='', footer=True, dark=False, notes=None, n=None, row=False, gap=40, footleft=128, numlight=False):
    fc = 'rgba(244,240,231,.72)' if dark else MUTED
    nc = 'rgba(244,240,231,.92)' if numlight else fc
    foot = ''
    if footer:
        foot = (f'<p style="position:absolute;left:{footleft}px;bottom:64px;width:900px;font-family:{EN};font-size:24px;letter-spacing:6px;color:{fc}">{wm(dark)}<span style="color:{fc}">　·　企业介绍</span></p>'
                f'<p style="position:absolute;right:128px;bottom:64px;width:240px;text-align:right;font-family:{MONO};font-size:24px;color:{nc}">{n:02d} / {TOTAL}</p>')
    allnotes = NB + ([notes] if notes else []); NB.clear()
    aside = ('<aside>' + '<br>'.join(E(x) for x in allnotes) + '</aside>') if allnotes else ''
    h = (f'<section id="{id}" data-transition="fade" style="background:{bg};color:{CHAR};font-family:{CN};padding:{pad};'
         f'display:flex;flex-direction:{"row" if row else "column"};gap:{gap}px;{extra}">\n{body}\n{foot}{aside}\n</section>\n')
    slides.append((id, h))

def eyebrow(t, c=GOLD):
    return f'<p style="font-size:24px;letter-spacing:8px;color:{c}">{E(t)}</p>'

def title(t, size=56, c=CHAR, w=None):
    ws = f'width:{w}px;' if w else ''
    return f'<h2 style="{ws}text-wrap:balance;font-size:{size}px;font-weight:600;line-height:1.2;letter-spacing:4px;color:{c}">{t}</h2>'

def head(eb, t, sub=None, size=56):
    s = f'<div style="display:flex;flex-direction:column;gap:14px;padding-bottom:22px;border-bottom:2px solid {GOLD}">{eyebrow(eb)}{title(t,size)}'
    note(sub)
    return s + '</div>'

def img(key, w, h, fit='cover', extra=''):
    return f'<img src="{B[key]}" alt="" style="width:{w}px;height:{h}px;object-fit:{fit};border-radius:2px;{extra}">'

n = 0
def nx():
    global n; n += 1; return n

# 1 cover
k = nx()
sec('cover', f'''<img src="{B['deck/cover.jpg']}" alt="餐厅实景" style="position:absolute;left:1232px;top:0;width:688px;height:1080px;object-fit:cover">
<div style="display:flex;align-items:center;gap:24px"><img src="{B['logo-seal.png']}" alt="侍天印章" style="width:96px;height:96px;object-fit:contain"><p style="font-family:{EN};font-size:32px;letter-spacing:11px">{wm()}</p></div>
<div style="flex:1"></div>
<h1 style="width:1090px;font-size:96px;font-weight:600;line-height:1.2;letter-spacing:6px;color:{CHAR}">从一道菜，<br>到一家家店的好生意。</h1>
<div style="display:flex;align-items:center;gap:28px;padding-top:8px"><p style="font-size:44px;font-weight:600;letter-spacing:6px;color:{GOLD}">AI + 专家的餐饮经营参谋</p></div>
<div style="width:120px;height:2px;background:{GOLD};margin:8px 0"></div>
<p style="font-size:32px;letter-spacing:12px;color:{MUTED}">拍板之前，问侍天。</p>
<div style="height:24px"></div>''',
    pad='112px 128px 112px', footer=False, extra='width:1920px', n=k, notes='定位：AI + 专家的餐饮经营参谋。专家判断加餐饮第二大脑，陪老板从筹备开业走到多店、多品牌、多市场；每个建议有依据、有人落实、可以核对。企业介绍 · 2026-09-27。以菜单设计与持续迭代为核心，贯穿新餐厅概念开创、单店经营优化与连锁规模化发展。')

# 2 promise
k = nx(); P = V['promise']
cards = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:16px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:48px 40px"><p style="font-family:{MONO};font-size:32px;color:{GOLD}">0{i+1}</p><div style="height:96px"></div><h3 style="font-size:52px;font-weight:600;letter-spacing:4px">{E(p["label"])}</h3></div>' for i,p in enumerate(P['points']))
note(P['body'], *[p['label'] + '：' + p['note'] for p in P['points']])
sec('promise', f'''{eyebrow(P['eyebrow'])}
{title(E(P['title']), 64)}
<div style="flex:1"></div>
<div style="display:flex;gap:32px">{cards}</div>''', n=k)

def statement(id, kicker, t, body, key, k, notes=None):
    sec(id, f'''<img src="{B[key]}" alt="" style="position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover">
<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:linear-gradient(90deg, rgba(23,19,13,.82) 0%, rgba(23,19,13,.55) 55%, rgba(23,19,13,.2) 100%)"></div>
<div style="flex:1"></div>
<p style="font-size:28px;letter-spacing:16px;color:{GOLDHI}">{E(kicker)}</p>
<h2 style="width:1200px;font-size:96px;font-weight:600;line-height:1.25;letter-spacing:6px;color:{SURF}">{t}</h2>
<div style="height:24px"></div>''', bg=CHAR, dark=True, n=k, notes=body)

# 3 statement problem
statement('stmt-problem', '问题', '每天打烊之后，<br>经营的决定才刚开始。', '卖什么、定什么价、怎么组合，每个决定都要有依据。', 'deck/statement-problem.jpg', nx())

def section_open(id, cn, t, sub, key, k):
    sec(id, f'''<img src="{B[key]}" alt="" style="position:absolute;left:1040px;top:0;width:880px;height:1080px;object-fit:cover">
<div style="flex:1"></div>
<div style="width:200px;height:200px;border:2px solid {GOLD};border-radius:50%;display:flex;align-items:center;justify-content:center"><p style="font-size:112px;font-weight:600;line-height:1;color:{GOLD}">{cn}</p></div>
<h2 style="width:840px;font-size:88px;font-weight:600;line-height:1.2;letter-spacing:6px">{E(t)}</h2>
<p style="width:840px;font-size:30px;line-height:1.6;letter-spacing:2px;color:{MUTED}">{E(sub)}</p>
<div style="flex:1"></div>''', extra='width:1920px', n=k, numlight=True)

# 4 section 1
section_open('sec-1', '一', '从开店到连锁', '新店开业 · 概念开创 · 经营复盘 · 连锁督导', 'deck/section-1.jpg', nx())

# 5 four modules
k = nx(); CNN = ['一','二','三','四']
MT = ["新店可研<br>与开业督导", "定位概念开创<br>与产品价值创新", "餐饮经营复盘<br>与优化", "连锁规模化<br>运营督导"]
def mstat(st):
    v = st['value']; num = v[:1].isdigit()
    return (f'<div style="display:flex;flex-direction:column;gap:4px"><p style="font-family:{MONO if num else CN};font-size:{48 if num else 36}px;line-height:1.1;color:{GOLD}">{E(v)}<span style="font-family:{CN};font-size:24px"> {E(st.get("unit",""))}</span></p><p style="font-size:26px;color:{MUTED}">{E(st["label"])}</p></div>')
cards = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:20px;background:{PAPER};border:1px solid {CARD};border-top:3px solid {GOLD};border-radius:2px;padding:40px 36px"><div style="width:72px;height:72px;border:1.5px solid {GOLD};border-radius:50%;display:flex;align-items:center;justify-content:center"><p style="font-size:36px;font-weight:600;color:{GOLD}">{CNN[i]}</p></div><p style="font-size:26px;letter-spacing:4px;color:{GOLD}">{E(s["label"])}</p><h3 style="font-size:40px;font-weight:600;line-height:1.4">{MT[i]}</h3><div style="flex:1"></div><div style="display:flex;gap:32px;padding-top:20px;border-top:1px solid {LINE}">{"".join(mstat(st) for st in V["modules"][i]["detail"]["stats"])}</div></div>' for i,s in enumerate(V['moduleSteps']))
note(*[s['label'] + '：' + s['aim'] for s in V['moduleSteps']])
sec('modules', f'''{head('服务内容 · 四个模块', '四个服务模块，覆盖从开店到连锁。', '签约后 3 个工作日内启动数据收集，可叠加可选专项。')}
<div style="flex:1;display:flex;gap:28px">{cards}</div>''', n=k)

# 6 matrix
k = nx()
ROWS = [("机会","商圈 · 选址 · 竞争",["店址与商圈适配","需求与资源机会","经营变化与竞争","门店分层与区域差异"]),("增长","需求 · 品牌 · 渠道",["门店定位与开业获客","主概念与商业模式","渠道转化与顾客经营","总部与门店顾客经营"]),("交易","菜品 · 定价 · 组合",["开业菜单与价格体系","菜单架构与产品创新","菜单迭代与贡献调整","品牌标准与区域菜单"]),("履约","后厨 · 供应 · 组织",["餐位收益与开业条件","后厨档口与经营协同","餐段空间与执行效率","店型效率与跨店复制"]),("财务","现金流 · 利润",["36 个月投资现金流模型","12 个月分业态现金流","经营测算与利润结构","现金流与店型效率模型"])]
cols = ["新店开业","概念开创","经营复盘","连锁督导"]
th = f'<tr><th style="width:20%;color:{MUTED};font-weight:400">经营层 × 模块</th>' + ''.join(f'<th style="width:20%;color:{GOLD};font-weight:600">{c}</th>' for c in cols) + '</tr>'
trs = ''.join(f'<tr><td><b>{a}</b><br><span style="color:{MUTED}">{b}</span></td>' + ''.join(f'<td>{E(x)}</td>' for x in cells) + '</tr>' for a,b,cells in ROWS)
sec('matrix', f'''{head('方法论 × 解决方案', '一套方法，四类方案。', '以菜单为入口，五个经营层对应四个服务模块。')}
<table style="font-family:{CN};font-size:26px;color:{CHAR};padding:16px 20px">{th}{trs}</table>
''', n=k, notes='现状 → 动作 → 验收：数据有出处，行动有人负责，改善能核对。')

# 7-14 modules
def gantt(tl, labelw=420, trackw=1180, rowh=72, show_out=True):
    ax = tl['axis']; mn, mx = ax['min'], ax['max']; W = trackw
    x = lambda v: round((v - mn) / (mx - mn) * W)
    ticks = ''.join(f'<p style="position:absolute;left:{max(0,min(W-120,x(t["at"])-60))}px;top:0;width:120px;white-space:nowrap;text-align:center;font-family:{MONO};font-size:24px;color:{MUTED}">{E(str(t["label"]))}</p>' for t in ax['ticks'])
    phases = ''
    for p in tl.get('phases') or []:
        phases += f'<div style="position:absolute;left:{x(p["from"])}px;top:40px;width:{x(p["to"])-x(p["from"])-4}px;height:8px;background:{INK if True else ""}"></div><p style="position:absolute;left:{x(p["from"])}px;top:52px;width:{x(p["to"])-x(p["from"])}px;font-size:24px;color:{GOLD}">{E(p["label"])}</p>'
    head_h = 92 if tl.get('phases') else 48
    axis = f'<div style="display:flex;gap:24px"><div style="width:{labelw}px"></div><div style="position:relative;width:{W}px;height:{head_h}px">{ticks}{phases}</div></div>'
    rows = ''
    for r in tl['rows']:
        a, b = x(r['from']), x(r['to'])
        acc = r.get('accent')
        bar = f'<div style="position:absolute;left:{a}px;top:14px;width:{max(8,b-a)}px;height:20px;background:{GOLD if not acc else CHAR};border-radius:2px"></div>'
        near_end = a > W - 520
        out = (f'<p style="position:absolute;left:{max(0, b-520) if near_end else a}px;top:42px;width:520px;{"text-align:right;" if near_end else ""}font-size:26px;color:{MUTED}">{E(r.get("out",""))}</p>') if show_out and r.get('out') else ''
        mk = ''.join(f'<div style="position:absolute;left:{x(m["at"])}px;top:0;width:0;height:{rowh}px;border-left:2px dashed {SEAL}"></div>' for m in (tl.get('markers') or []))
        sub = ''
        rows += f'<div style="display:flex;gap:24px;border-top:1px solid {LINE}"><p style="width:{labelw}px;padding-top:{18 if not show_out else 12}px;font-size:28px;line-height:1.35">{E(r["label"])}{sub}</p><div style="position:relative;width:{W}px;height:{rowh}px">{mk}{bar}{out}</div></div>'
    return axis + '<div style="display:flex;flex-direction:column">' + rows + '</div>'

for i, m in enumerate(V['modules']):
    d = m['detail']; k = nx()
    stats = ''.join(f'<div style="display:flex;flex-direction:column;gap:6px"><p style="font-family:{MONO if s["value"][:1].isdigit() else CN};font-size:{64 if s["value"][:1].isdigit() else 48}px;line-height:1;color:{GOLD}">{E(s["value"])}<span style="font-family:{CN};font-size:28px"> {E(s.get("unit",""))}</span></p><p style="font-size:26px;color:{MUTED}">{E(s["label"])}</p></div>' for s in d['stats'])
    steps = ''.join(f'<div style="display:flex;gap:24px;align-items:baseline;padding:22px 0;border-top:1px solid {LINE}"><p style="width:56px;font-family:{MONO};font-size:28px;color:{GOLD}">0{j+1}</p><div style="flex:1;display:flex;flex-direction:column;gap:6px"><h3 style="font-size:34px;font-weight:600">{E(s["title"])}</h3></div></div>' for j,s in enumerate(d['steps']))
    note(*[s['title'] + '：' + s['body'] for s in d['steps']])
    dels = ''.join(f'<div style="display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid {LINE}"><p style="font-size:28px">{E(x["k"])}</p><p style="font-family:{MONO};font-size:28px;color:{GOLD}">{E(x["v"])}</p></div>' for x in d['deliverables'])
    sec(f'module-{i+1}', f'''{head(d['eyebrow'], E(d['title']), d['subtitle'], size=52)}
<div style="flex:1;display:flex;gap:64px">
<div style="flex:1;display:flex;flex-direction:column;gap:24px"><div style="display:flex;gap:64px">{stats}</div><div style="display:flex;flex-direction:column">{steps}</div></div>
<div style="width:620px;display:flex;flex-direction:column;gap:20px">{img(d['image'],620,300)}<div style="display:flex;flex-direction:column;background:{P100};border-top:2px solid {GOLD};border-radius:2px;padding:20px 28px"><p style="font-size:26px;letter-spacing:6px;color:{GOLD};padding-bottom:8px">核心交付</p>{dels}</div></div>
</div>''', n=k)
    t = m['timeline']; k = nx()
    sec(f'timeline-{i+1}', f'''{head(t['eyebrow'] + ' · ' + t['tag'], E(t['title']), None, size=52)}
<div style="display:flex;flex-direction:column">{gantt(t, rowh=84 if len(t["rows"])<=5 else 64, show_out=False)}</div>
<div style="flex:1"></div>''', n=k, notes='产出：' + '；'.join(r['label'] + ' → ' + r['out'] for r in t['rows'] if r.get('out')) + '。口径：' + t['note'] + ' 排期为计划值，实际节点随项目进度调整。')

# 15 rhythm
k = nx(); R = V['rhythm']
sec('rhythm', f'''{head(R['eyebrow'] + ' · ' + R['tag'], '四个模块的交付节奏', None, size=52)}
<div style="display:flex;flex-direction:column">{gantt(R, labelw=420, rowh=110)}</div>
<div style="flex:1"></div>''', n=k, notes=R['note'])

# 16 options
k = nx()
OPTS = ["开放式厨房<br>展陈设计","后厨设计<br>与优化","菜品口味<br>与出品升级","菜品销售<br>策略优化","餐饮 IP<br>文化打造","菜单视觉与<br>点餐体验设计","采购备货<br>与损耗控制","岗位协同<br>与人效优化","顾客服务与<br>会员复购设计","开业演练<br>与现场督导"]
cells = ''.join(f'<div style="display:flex;flex-direction:column;gap:16px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:40px 32px"><p style="font-family:{MONO};font-size:28px;color:{GOLD}">{j+1:02d}</p><h3 style="font-size:34px;font-weight:600;line-height:1.45">{o}</h3></div>' for j,o in enumerate(OPTS))
sec('options', f'''{head('可选专项服务', '十项可选专项。', '新店开业、经营复盘模块可选。')}
<div style="display:grid;grid-template-columns:repeat(5, 1fr);gap:24px">{cells}</div>
<div style="flex:1"></div>''', n=k, notes='专项按需叠加在新店开业或经营复盘模块之上，周期与范围按项目确认。')

# 17 statement data
statement('stmt-data', '数据', '每一张订单，<br>都是顾客投下的一票。', '侍天把订单级流水变成可以核对的经营判断。', 'deck/statement-data.jpg', nx())
# 18 section 2
section_open('sec-2', '二', '餐饮第二大脑', '菜单推演 · 经营看板 · 教练式督导 · 持续复盘', 'deck/section-2.jpg', nx())

# 19 ladder
k = nx()
cards = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:20px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:40px 36px"><p style="font-family:{EN};font-size:24px;letter-spacing:4px;color:{GOLD}">{E(b["tier"])}</p><h3 style="font-size:48px;font-weight:600;letter-spacing:4px">{E(b["name"])}</h3></div>' for b in V['brainParts'])
note(*[b['name'] + '：' + b['got'] for b in V['brainParts']])
FQ = ["出了什么变化？", "影响多少钱？", "建议改什么？", "谁在什么时候做？", "做后结果怎样？"]
fq = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:8px;padding:20px 0;border-top:1.5px solid {GOLD}"><p style="font-family:{MONO};font-size:28px;color:{GOLD}">Q{j+1}</p><p style="font-size:34px;font-weight:600;color:{CHAR}">{E(q)}</p></div>' for j, q in enumerate(FQ))
sec('brain', f'''{head('餐饮第二大脑', '四个部分，支撑每一次决策。', '侍天持续建设第二大脑，为专家判断和门店行动提供支持。')}
<div style="display:flex;gap:28px">{cards}</div>
<div style="flex:1"></div>
<p style="font-size:28px;letter-spacing:6px;color:{GOLD}">经营看板每次回答的五个问题</p>
<div style="display:flex;gap:28px">{fq}</div>''', n=k)

# 20-23 screens
def screens(id, s, k):
    shots = s['shots']; lay = s.get('layout')
    def shot(sh, w, h):
        return f'<div style="display:flex;flex-direction:column;gap:12px">{img(sh["src"], w, h, "contain", f"background:{INK};border:1px solid {CARD}")}<p style="width:{w}px;font-size:26px;line-height:1.4;color:{BODY}">{E(sh["caption"].split(" · ")[0])}</p></div>'
    if lay == 'grid':
        grid = f'<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:20px">' + ''.join(shot(sh, 340, 230) for sh in shots) + '</div>'
    elif lay == 'feature':
        grid = f'<div style="display:flex;gap:32px">{shot(shots[0], 960, 540)}<div style="display:flex;flex-direction:column;gap:20px">{shot(shots[1], 620, 220)}{shot(shots[2], 620, 220)}</div></div>'
    elif len(shots) == 2:
        grid = f'<div style="display:flex;gap:32px">' + ''.join(shot(sh, 816, 400) for sh in shots) + '</div>'
    else:
        grid = f'<div style="display:flex;gap:28px">' + ''.join(shot(sh, 324, 458) for sh in shots) + '</div>'
    pw = 520 if (len(shots) == 3 and not lay) or lay == "grid" else 1600
    left = f'<div style="display:flex;flex-direction:column;gap:20px">{eyebrow(s["eyebrow"])}{title(E(s["title"]).replace(chr(10),"<br>"), 48 if pw == 520 else 52)}<p style="align-self:flex-start;font-size:24px;color:{SEAL};border:1px solid {SEAL};border-radius:999px;padding:2px 18px">样张 · 模拟数据</p></div>'
    note(s['body'], s['note'])
    if (len(shots) == 3 and not lay) or lay == 'grid':
        sec(id, f'<div style="flex:1;display:flex;gap:56px;align-items:center"><div style="width:520px">{left}</div>{grid}</div>', n=k)
    else:
        sec(id, f'{left}{grid}', pad='112px 128px 160px', gap=28, n=k)
S = V['screens']
screens('scr-report', S['report'], nx()); screens('scr-product', S['product'], nx())
screens('scr-price', S['price'], nx()); screens('scr-trade', S['trade'], nx())

# 24 waterfall chart (built from the repo's ChartSlide sample figure)
k = nx()
start = 41.2; steps = [("客流",-3.4),("客单",1.8),("结构",-2.6),("成本",-1.5),("折扣",-0.9),("套餐",0.6)]
end = round(start + sum(v for _, v in steps), 1)
lo, hi = 32.0, 42.0; TH = 420
y = lambda v: round((v - lo) / (hi - lo) * TH)
bars = []; cur = start
bars.append(("去年同期", 0, y(start), CHAR, f"{start}"))
for lab, v in steps:
    a, b = cur, cur + v; cur = b
    bars.append((lab, y(min(a,b)), max(6, abs(y(b)-y(a))), '#4e6b3f' if v > 0 else SEAL, f"{'+' if v>0 else '−'}{abs(v)}"))
bars.append(("当期", 0, y(end), CHAR, f"{end}"))
bw = 120
cols_html = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:{bw}px"><div style="position:relative;width:{bw}px;height:{TH+40}px"><p style="position:absolute;left:0;bottom:{bot+h+6}px;width:{bw}px;text-align:center;font-family:{MONO};font-size:24px;color:{CHAR}">{E(val)}</p><div style="position:absolute;left:20px;bottom:{bot}px;width:{bw-40}px;height:{h}px;background:{col}"></div></div><p style="font-size:24px;color:{BODY}">{E(lab)}</p></div>' for lab, bot, h, col, val in bars)
sec('chart-waterfall', f'''<div style="flex:1;display:flex;gap:64px">
<div style="flex:1;display:flex;flex-direction:column;gap:20px">{eyebrow('方法论 · 经营洞察图谱 · 利润归因')}
<div style="display:flex;justify-content:space-between"><p style="font-size:26px;color:{GOLD}">午市毛利归因 · 去年同期 → 当期 · 月均 · 万元</p><p style="font-family:{MONO};font-size:24px;color:{GOLD};border:1px solid {GOLD};border-radius:999px;padding:2px 16px">EGA.E1</p></div>
<div style="display:flex;gap:8px;align-items:flex-end;border-bottom:1px solid {RULE}">{cols_html}</div>
</div>
<div style="width:520px;display:flex;flex-direction:column;gap:28px;padding-left:44px;border-left:1px solid {LINE}">{title('哪里发生了变化，<br>影响有多大', 40)}
<p style="font-size:32px;line-height:1.6;color:{BODY}">客流与结构少留 6.0 万 / 月，<br>客单与套餐只补回 2.4 万。</p>
<div style="flex:1"></div><div style="display:flex;flex-direction:column;gap:12px;padding-top:24px;border-top:1.5px solid {RULE}"><p style="font-size:26px;letter-spacing:4px;color:{GOLD}">先改这件</p><p style="font-size:32px;line-height:1.6;color:{BODY}">两道低毛利、高渗透的菜<br>改配方或调价。</p></div></div>
</div>''', bg=PAPER, n=k, notes=f'口径：午市堂食毛利 = 收入 − 食材成本，月均，万元；纵轴从 32 万起；当期 = 41.2 − 3.4 + 1.8 − 2.6 − 1.5 − 0.9 + 0.6 = {end}。来源：收银流水与进货单，2025 与 2026 年 03 至 05 月（样张 · 模拟数据）。')

# 25 corridor
k = nx()
hist = [("5月",35.9),("6月",36.4),("7月",35.1),("8月",36.0)]
fc = [("9月",36.5,38.4,40.1),("10月",36.8,39.6,42.0),("11月",37.0,40.3,43.4)]
base = [36.0,36.1,36.2,36.4]
W, H = 1000, 400; lo, hi = 34.0, 44.0
X = lambda i: round(40 + i * (W - 80) / 6); Y = lambda v: round(H - (v - lo) / (hi - lo) * H)
band = ' '.join(f'{X(i)},{Y(v)}' for i, v in [(3,36.0)] + [(4+j, f[1]) for j, f in enumerate(fc)]) + ' ' + ' '.join(f'{X(4+j)},{Y(f[3])}' for j, f in reversed(list(enumerate(fc)))) + f' {X(3)},{Y(36.0)}'
hl = ' '.join(f'{X(i)},{Y(v)}' for i, (_, v) in enumerate(hist))
p50 = f'{X(3)},{Y(36.0)} ' + ' '.join(f'{X(4+j)},{Y(f[2])}' for j, f in enumerate(fc))
bl = ' '.join(f'{X(3+j)},{Y(v)}' for j, v in enumerate(base))
grid = ''.join(f'<line x1="0" y1="{Y(v)}" x2="{W}" y2="{Y(v)}" stroke="{LINE}" stroke-width="1"/>' for v in (36, 38, 40, 42))
svg = f'<svg aria-label="菜单推演走廊：5—8 月实际约 36 万，方案 B 推演 9—11 月 P50 38.4—40.3 万，P10—P90 区间 36.5—43.4 万，基线约 36 万，9 月实测 38.9 万" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{grid}<polygon points="{band}" fill="#d4a862" fill-opacity="0.32"/><polyline points="{bl}" fill="none" stroke="#706758" stroke-width="3" stroke-dasharray="10 8"/><polyline points="{hl}" fill="none" stroke="#17130d" stroke-width="4"/><polyline points="{p50}" fill="none" stroke="#76551f" stroke-width="4"/><circle cx="{X(4)}" cy="{Y(38.9)}" r="10" fill="#8c3228"/></svg>'
xl = ''.join(f'<p style="position:absolute;left:{X(i)-40}px;top:{H+8}px;width:80px;text-align:center;font-family:{MONO};font-size:24px;color:{MUTED}">{m}</p>' for i, m in enumerate(["5月","6月","7月","8月","9月","10月","11月"]))
yl = ''.join(f'<p style="position:absolute;left:{W+12}px;top:{Y(v)-16}px;width:60px;font-family:{MONO};font-size:24px;color:{MUTED}">{v}</p>' for v in (36, 38, 40, 42))
legend = f'<div style="display:flex;gap:32px;flex-wrap:wrap"><p style="font-size:24px;color:{CHAR}">— 实际</p><p style="font-size:24px;color:{GOLD}">— 推演 P50</p><p style="font-size:24px;color:{GOLD}">■ P10—P90 区间</p><p style="font-size:24px;color:{MUTED}">- - 基线（不改菜单）</p><p style="font-size:24px;color:{SEAL}">● 9 月实测 38.9</p></div>'
sec('chart-corridor', f'''<div style="flex:1;display:flex;gap:64px">
<div style="flex:1;display:flex;flex-direction:column;gap:20px">{eyebrow('方法论 · 经营洞察图谱 · 菜单推演')}
<div style="display:flex;justify-content:space-between"><p style="font-size:26px;color:{GOLD}">菜单推演 · 午市毛利 · 方案 B · 万元 / 月</p><p style="font-family:{MONO};font-size:24px;color:{GOLD};border:1px solid {GOLD};border-radius:999px;padding:2px 16px">EGA.E4</p></div>
<div style="position:relative;width:{W+80}px;height:{H+48}px">{svg}{xl}{yl}</div>{legend}
</div>
<div style="width:520px;display:flex;flex-direction:column;gap:28px;padding-left:44px;border-left:1px solid {LINE}">{title('先推演，再拍板', 44)}
<p style="font-size:32px;line-height:1.6;color:{BODY}">方案 B 每月多留 2—4 万（P50），<br>P10 仍高于基线。</p>
<div style="flex:1"></div><div style="display:flex;flex-direction:column;gap:12px;padding-top:24px;border-top:1.5px solid {RULE}"><p style="font-size:26px;letter-spacing:4px;color:{GOLD}">先改这件</p><p style="font-size:32px;line-height:1.6;color:{BODY}">午市试行方案 B 一个月，<br>逐月与区间核对。</p></div></div>
</div>''', bg=PAPER, n=k, notes='口径：区间为方案 B 的推演（设计值），基线为不改菜单的延续估计，9 月为落地后实测 38.9 万；来源：菜单推演 · 收银流水 2026-05 至 09（样张 · 模拟数据）。区间即结论，不把预期写成已发生的收益。')

# 26 value
k = nx(); VAL = [("顾客是否更容易<br>点到满意的一餐", "点单渗透率、复点率"), ("出品<br>是否更稳定", "出餐时长中位数；|出品类差评占比"), ("浪费<br>是否减少", "损耗率 = 损耗金额|÷ 食材领用金额"), ("门店是否留下<br>更多经营贡献", "门店毛利 = 营业收入|− 食材成本")]
cells = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:20px;background:{PAPER};border:1px solid {CARD};border-top:3px solid {GOLD};border-radius:2px;padding:36px 32px"><div style="width:72px;height:72px;border:1.5px solid {GOLD};border-radius:50%;display:flex;align-items:center;justify-content:center"><p style="font-size:36px;font-weight:600;color:{GOLD}">{CNN[i]}</p></div><div style="flex:1"></div><h3 style="font-size:44px;font-weight:600;line-height:1.45">{t}</h3></div>' for i,(t,m) in enumerate(VAL))
note(*['核对口径 · ' + t.replace('<br>','') + '：' + m.replace('|','') for t, m in VAL], '侍天不替老板拍板，不凭单一销量砍菜，不把预期收益当成结果。')
sec('value', f'''{eyebrow('老板看到的价值')}
{title('老板看得到的变化，落在四件可核对的事上。', 56)}
<div style="flex:1;display:flex;gap:28px">{cells}</div>
<div style="background:{INK};border-radius:2px;padding:36px 40px"><p style="font-size:36px;font-weight:600;letter-spacing:4px;color:{CHAR}">决策有依据，行动有人落实，改善可以核对。</p></div>''', n=k)

# 27 proof
statement('stmt-proof', '实证', '从一家店，<br>到近百家店。', '新店开业、经营复盘、连锁督导，已在真实门店中落地。', 'deck/statement-proof.jpg', nx())

# 28 case index
k = nx()
cards = ''.join(f'<div style="display:flex;flex-direction:column;gap:14px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:32px"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><img src="{B[c["logo"]]}" alt="{E(c["title"])} logo" style="width:120px;height:80px;object-fit:contain;mix-blend-mode:multiply"><p style="font-size:26px;color:{GOLD}">{E(c["tag"].split(" · ")[0])}</p></div><div style="flex:1"></div><h3 style="font-size:40px;font-weight:600;letter-spacing:2px">{E(c["title"])}</h3></div>' for c in V['caseIndex'])
note(*[c['title'] + '：' + c['body'] for c in V['caseIndex']])
sec('cases', f'''{head('伙伴案例', '从新店开业，到近百店督导。', V['caseSummary'])}
<div style="flex:1;display:grid;grid-template-columns:repeat(4, 1fr);gap:24px">{cards}</div>''', n=k)

# 29-36 cases — photo as a flow column, text column with its own padding, no fixed widths
for c in V['cases']:
    p = c['props']; k = nx()
    res = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:2px solid {GOLD}"><p style="font-family:{MONO if has_num(r["value"]) else CN};font-size:{64 if has_num(r["value"]) else 52}px;font-weight:{400 if has_num(r["value"]) else 600};line-height:1.15;letter-spacing:{0 if has_num(r["value"]) else 4}px;color:{GOLD}">{E(r["value"])}</p><p style="font-size:28px;line-height:1.4;color:{BODY}">{"<br>".join(E(x) for x in r["label"].split(" · "))}</p></div>' for r in p['results'])
    hs = 48 if len(p['headline']) <= 22 else 44 if len(p['headline']) <= 27 else 40
    ap = ''.join(f'<div style="display:flex;gap:20px;align-items:baseline;padding:18px 0;border-top:1px solid {LINE}"><p style="font-family:{MONO};font-size:28px;color:{GOLD}">{j+1:02d}</p><p style="font-size:34px;font-weight:600;color:{CHAR}">{E(a["title"])}</p></div>' for j, a in enumerate(p['approach']))
    note(f"{p['name']} · {p['sub']}", p['background'], '挑战：' + '；'.join(p['challenges']), '做法：' + '；'.join(a['title'] + '，' + a['body'] for a in p['approach']), '交付：' + '、'.join(p['deliverables']))
    sec(f'case-{p["index"]:02d}', f'''<img src="{B[p['image']]}" alt="{E(p['name'])} 案例配图" style="width:560px;height:1080px;object-fit:cover">
<div style="flex:1;display:flex;flex-direction:column;gap:32px;padding:96px 128px 176px 80px">
<div style="display:flex;align-items:center;gap:24px"><img src="{B[p['logo']]}" alt="{E(p['name'])} logo" style="width:112px;height:80px;object-fit:contain;mix-blend-mode:multiply"><p style="font-size:26px;letter-spacing:4px;color:{GOLD}">案例 {p['index']:02d} · {E(p['name'])} · {E(p['module'].split(' · ')[-1])}</p></div>
<h2 style="text-wrap:balance;font-size:{hs}px;font-weight:600;line-height:1.35;letter-spacing:2px">{E(p['headline']).replace('，', '，<br>', 1) if len(p['headline']) > 27 else E(p['headline'])}</h2>
<div style="display:flex;flex-direction:column">{ap}</div>
<div style="flex:1"></div>
<div style="display:flex;gap:40px">{res}</div>
</div>''', pad='0', row=True, gap=0, footleft=640, n=k)

# 37 partners
k = nx()
cells = ''
for pl in V['partnerLogos']:
    inner = (f'<img src="{B[pl["src"]]}" alt="{E(pl["name"])}" style="width:220px;height:150px;object-fit:contain;mix-blend-mode:multiply">' if pl.get('src')
             else f'<div style="width:220px;height:150px;display:flex;align-items:center;justify-content:center"><p style="font-size:40px;color:{GOLD}">…</p></div>')
    cells += f'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:24px">{inner}<p style="font-size:26px;color:{BODY};text-align:center">{E(pl["name"])}</p></div>'
sec('partners', f'''{head('伙伴背书', '伙伴品牌', '更多伙伴正在签约中。')}
<div style="flex:1;display:grid;grid-template-columns:repeat(5, 1fr);grid-template-rows:1fr 1fr;gap:24px">{cells}</div>''', n=k)

# 38 section 3
section_open('sec-3', '三', '团队', '联合创始人 · 专家团队', 'deck/section-3.jpg', nx())

# 39 roster
def seat_title(r):
    return ''.join(f'<p style="font-size:28px;line-height:1.5;color:{CHAR}">{E(t)}</p>' for t in r['title'].split(' · '))
k = nx()
seats = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:16px"><div style="height:340px;background:{P100};border-bottom:2px solid {GOLD};border-radius:2px;display:flex;align-items:flex-end;justify-content:center"><img src="{B[r["photo"]]}" alt="{E(r["name"])}" style="width:280px;height:340px;object-fit:contain"></div><h3 style="font-size:40px;font-weight:600;letter-spacing:4px">{E(r["name"])}</h3>{seat_title(r)}</div>' for r in ROSTER)
note(*[r['name'] + '：' + r['field'] for r in ROSTER])
sec('team', f'''{head('团队 · 总览', '两位联合创始人，两位专家。', '新增专家时，在团队中加一位即可。')}
<div style="flex:1;display:flex;gap:40px">{seats}</div>''', n=k)

# 40-43 profiles
for p in TEAM['people']:
    k = nx()
    roles = ''.join(f'<p style="font-size:24px;line-height:1.5;color:{BODY}">{E(r)}</p>' for r in p['roles'])
    hl = ''.join(f'<div style="display:flex;gap:20px;align-items:baseline;padding:18px 0;border-top:1px solid {LINE}"><p style="width:52px;font-family:{MONO};font-size:28px;color:{GOLD}">{j+1:02d}</p><p style="flex:1;font-size:30px;line-height:1.5;color:{CHAR}">{E(h)}</p></div>' for j, h in enumerate(p['highlights']))
    note(' / '.join(p['roles']), p['bio'])
    pid = p['photo'].split('/')[1].split('.')[0]
    sec(f'profile-{pid}', f'''<div style="flex:1;display:flex;gap:72px">
<div style="width:460px;display:flex;flex-direction:column;gap:20px"><div style="height:700px;background:{P100};border-bottom:2px solid {GOLD};border-radius:2px;display:flex;align-items:flex-end;justify-content:center"><img src="{B[p['photo']]}" alt="{E(p['name'])}" style="width:460px;height:700px;object-fit:contain"></div></div>
<div style="flex:1;display:flex;flex-direction:column;gap:28px">{eyebrow('团队 · ' + p['group'])}
<div style="display:flex;align-items:baseline;gap:28px"><h2 style="font-size:80px;font-weight:600;letter-spacing:8px">{E(p['name'])}</h2><p style="font-family:{EN};font-size:28px;letter-spacing:8px;color:{GOLD}">{E(p['latin'])}</p></div>
<div style="display:flex;flex-direction:column">{hl}</div></div></div>''', pad='112px 128px 160px', n=k)

# 44-45 stats
def statcols(id, eb, t, sub, cols, src, k):
    blocks = ''
    for col in cols:
        rows = ''.join(f'<div style="display:flex;align-items:center;gap:24px;padding:16px 0;border-bottom:1px solid {LINE}"><p style="width:220px;font-family:{MONO if has_num(s["value"]) else CN};font-size:{52 if s["value"].isascii() else 40}px;line-height:1.1;color:{GOLD}">{E(s["value"])}</p><div style="flex:1;display:flex;flex-direction:column;gap:4px"><p style="font-size:30px;line-height:1.4;color:{CHAR}">{E(s["label"])}</p></div></div>' for s in col['stats'])
        note(*[s['value'] + ' ' + s['label'] + '：' + s['note'] for s in col['stats'] if s.get('note')])
        blocks += f'<div style="flex:1;display:flex;flex-direction:column"><p style="font-size:30px;font-weight:600;letter-spacing:2px;padding-bottom:12px;border-bottom:2px solid {GOLD}">{E(col["title"])}</p>{rows}</div>'
    sec(id, f'''{head(eb, t, sub)}
<div style="display:flex;gap:48px">{blocks}</div>
<div style="flex:1"></div>''', bg=PAPER, n=k, notes=src)
COLS_A = [{"title":"增长 · 同比","stats":[{"value":"+58%","label":"蒸小皖 · 销售","note":"2017 年销售同比"},{"value":"+24%","label":"东来顺 · 单均销售","note":"2016 年整体单均销售同比"},{"value":"+20%","label":"杯子红 · 午餐人流","note":"2018 年午餐人流同比"},{"value":"+15.3%","label":"东来顺 · 手切羊肉点击率","note":"2016 年手切羊肉点击率同比"}]},{"title":"产品结构 · 服务规模","stats":[{"value":"50%","label":"蒸小皖 · 小笼系列占比"},{"value":"35%","label":"杯子红 · 带骨扒系列占比"},{"value":"60%","label":"服务品牌中 TOP50 占比"}]}]
statcols('stats-growth', '团队案例', '品牌全案项目的增长与结构。', '品牌全案项目', COLS_A, '数据来源：团队项目资料，按项目年份列示；指标口径以品牌方统计为准。', nx())
TO = V['teamOrg']
statcols('stats-org', '团队案例', E(TO['title']) + '。', TO['subtitle'], TO['columns'], '数据来源：团队成员履历资料。', nx())

# 46 decision
statement('stmt-decision', '决策', '拍板之前，<br>问侍天。', '餐饮第二大脑 · 让每个经营决定都有依据。', 'deck/statement-decision.jpg', nx())

# 47 contact
k = nx()
sec('contact', f'''<div style="flex:1;display:flex;gap:96px;align-items:center">
<div style="flex:1;display:flex;flex-direction:column;gap:32px"><div style="display:flex;align-items:center;gap:24px"><img src="{B['logo-seal.png']}" alt="侍天印章" style="width:96px;height:96px;object-fit:contain"><p style="font-family:{EN};font-size:32px;letter-spacing:11px">{wm()}</p></div>
<h2 style="font-size:88px;font-weight:600;line-height:1.25;letter-spacing:6px">{E(CONTACT['title']).replace('，', '，<br>')}</h2>
<p style="font-family:{EN};font-style:italic;font-size:30px;color:{GOLD}">{E(CONTACT['english'])}</p>
<p style="font-family:{EN};font-size:34px;letter-spacing:2px;color:{GOLD}">{E(CONTACT['url'])}</p></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:20px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:40px">{img(CONTACT['qr'], 380, 380, 'contain')}<p style="font-size:26px;letter-spacing:4px;color:{BODY}">{E(CONTACT['qrLabel'])}</p></div>
</div>''', n=k)

assert n == TOTAL, n
for id, h in slides:
    open(f'{OUT}/{id}.html', 'w').write(h)
order = [i for i, _ in slides]
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
deck = {"v": 4, "createdOnFiles": {"v": 1, "at": now}, "lists": "css", "title": "侍天 TIANSIGHT 企业介绍", "cover": "cover", "order": order,
  "sections": {"s0": {"description": "开篇：菜单是餐厅每天都在做的经营决策。", "start": "cover"},
               "s1": {"description": "一 从开店到连锁：四个服务模块、推进节点与可选专项。", "start": "sec-1"},
               "s2": {"description": "二 餐饮第二大脑：四个部分、报告与产品界面、经营洞察图谱。", "start": "stmt-data"},
               "s3": {"description": "实证：8 个伙伴案例与伙伴背书。", "start": "stmt-proof"},
               "s4": {"description": "三 团队：联合创始人、专家与团队案例，收于联系方式。", "start": "sec-3"}},
  "faces": {"noto-serif-sc": {"family": "Noto Serif SC", "href": "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300..700&display=swap"},
            "noto-serif": {"family": "Noto Serif", "href": "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400..700;1,400&display=swap"},
            "ibm-plex-mono": {"family": "IBM Plex Mono", "href": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"}},
  "designSystems": [{"title": "侍天 TIANSIGHT", "namespace": "tiansight", "artifact": "https://claude.ai/code/artifact/07240726-55b4-49c3-bc1d-35a427369025", "version": None, "copiedAt": now}]}
json.dump(deck, open('../deck.json', 'w'), ensure_ascii=False, indent=1)
print(len(order), order)
