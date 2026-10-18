"""侍天报告模板：规范页 + 全部页型样张（39 页）。

python3 deliverables/report-template/gen/template_deck.py      重新生成 ../slides、../deck.json、../index.html
TSK_CHECK=1 python3 …/template_deck.py                           只核对已提交的文件是否与生成结果一致
TSK_BLOBS=blobs.json python3 …/template_deck.py <输出目录>       发布到 Slides 幻灯片时，图片改用 /_blob/<id>

这份脚本也是「新报告怎么写」的范例：每种页型都有一段可照抄的调用。
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'templates', 'report-kit'))
from tsk import *  # noqa: E402,F403

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..')
configure(deckname='侍天报告模板', outdir=OUT, badge_target='catalog', rule_exempt=['voice', 'qa'], label_pages=['d1'], images={
    'seal': 'assets/logo-seal.png', 'cover': 'assets/intro/deck/cover.jpg', 'module2': 'assets/intro/deck/module-2.jpg',
    'qr': 'assets/intro/people/wechat-qr.png', 'bianjiang': 'assets/intro/people/bianjiang.png', 'guofeng': 'assets/intro/people/guofeng.png',
    'liquanchao': 'assets/intro/people/liquanchao.png', 'yuxiangdong': 'assets/intro/people/yuxiangdong.png'})

# ---------------- 页序 ----------------
S1 = ['principles', 'howto', 'voice', 'colors', 'type', 'layout', 'charts', 'badges', 'dodont', 'qa', 'constraints', 'catalog']
S2 = ['sopen', 'exsum']
S3 = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']
S4 = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8']
S5 = ['d1', 'd2', 'd3', 'd4', 'gloss', 'src', 'team', 'close']
SECT = [('一', '模板与规范', S1), ('二', '结构页样张', S2), ('三', '论证页样张', S3), ('四', '数据页样张', S4), ('五', '表格与附录样张', S5)]
SH = dict(principles='五条总原则', howto='制作五步', voice='品牌声音 · 宜与忌', colors='色彩', type='字体与字号', layout='版式与网格',
          charts='图表规则', badges='证据标签', dodont='宜忌对照', qa='出版前检查', constraints='渲染器硬约束', catalog='页型目录',
          sopen='A3 章节页', exsum='A4 执行摘要',
          b1='B1 大数字卡', b2='B2 两栏对照', b3='B3 步骤卡', b4='B4 四格矩阵', b5='B5 引语页', b6='B6 阶段路线', b7='B7 流程案例',
          c1='C1 竖柱趋势', c2='C2 横条排名', c3='C3 分组对比', c4='C4 双向条', c5='C5 小倍数', c6='C6 严重度条', c7='C7 热力表', c8='C8 时间线',
          d1='D1 字段字典', d2='D2 对策表', d3='D3 指标看板', d4='D4 紧凑清单', gloss='E1 术语速查', src='E2 来源', team='F1 团队', close='A5 收尾页')
set_order(['cover', 'toc'] + S1 + S2 + S3 + S4 + S5, SECT, SH)
expect('页型样张', S2 + S3 + S4 + S5)

SB = '样张 · 虚构数据'          # 样张页右上标签，PDF 中跳到页型目录
def sample(code, name, fn): return f'{code} {name} · {fn}'
def N(code, name, use, cap, fn, care):
    return f'页型 {code} {name}。用途：{use}容量：{cap}函数：{fn}。注意：{care}本页数据为虚构，仅示意版式；正式报告的讲稿在此写口径、来源与读法。'

# ================= A1 / A2 =================
cover('cover', '侍天 TIANSIGHT · 报告规范', '报告模板<br>与页型样张', ['报告规范 · 页型目录 · 二十七种页型样张', '配套《侍天报告模板手册》与 tsk 工具包'], '2026 年 10 月 · v1',
      notes=N('A1', '封面', '报告名、副题与日期。', '标题 ≤ 10 字、两行以内；副题 ≤ 2 行。', "cover(id, kicker, title, sub_lines, date_line, photo)", '印章旁只放双色字标，不另写「侍天」；照片只放右侧 688px 栏。'))
toc(notes=N('A2', '目录', '按部分列出全部页。', '≤ 40 行，自动分三栏。', 'toc()', '目录由页序自动生成，不手写页码；PDF 中每行可点击跳转。'))

# ================= 一 模板与规范 =================
P5 = [('一', '结论先行', '论证页标题是一句结论；数字带单位、窗口与来源。'), ('二', '参谋不是销售', '沉稳、克制、敢言；不替老板拍板，不把预期写成结果。'),
      ('三', '素墨土金', '淡墨纸与宣纸为底，玄墨写字，土金画线，朱红只作印记。'), ('四', '一页一事', '一页只讲一个判断；放不下就拆页，不缩字。'),
      ('五', '可复核', '每个数字能追到结果文件或公开来源；链接可跳转。')]
page('principles', '模板与规范 · 总原则', '五条总原则按优先级排列，冲突时前一条优先。',
     '<div style="display:flex;gap:20px">' + ''.join(card(f'{circ(a)}<p style="font-size:34px;font-weight:600;letter-spacing:2px">{b}</p>{txt(c,24,BODY,1.55)}', gap=16, pad='26px 24px') for a, b, c in P5) + '</div>'
     + callout('依据', '侍天 TIANSIGHT 设计系统 v0.7、菜单分析方法论 v3.0、侍天餐饮模型，以及三份客户成稿（提案与两份补充报告）的复盘。')
     + '<div style="display:flex;gap:32px">' + ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:6px;padding:4px 0 4px 20px;border-left:3px solid {GOLD}"><p style="font-size:26px;font-weight:600">{a}</p>{txt(b,24,BODY,1.5)}</div>' for a, b in
       [('模板幻灯片', '规范页与全部页型样张，复制后替换内容即可。'), ('模板手册', '规则全文：声音、色彩、字号、版式、页型、流程、检查清单。'), ('tsk 工具包', '页型函数库、渲染检查、可跳转 PDF 导出。')]) + '</div>',
     '五条原则是所有其他规则的来源。遇到手册没写到的情况，按这五条的先后顺序判断。', gap=30)

steps('howto', '模板与规范 · 制作流程', '一份报告分五步完成，每一步都留下可复核的文件。', None,
      [('一', '数据盘点', '列清文件、时间区间、条数与全部字段含义，写明能下与不能下的结论。', '01_数据事实与字段定义.md'),
       ('二', '大纲与数据稿', '每页先写标题与关键数字，列出应有的门店、图与明细。', '02_报告大纲与逐页数据稿.md'),
       ('三', '计算', '上屏数字由脚本算出，与源数据对账，不手敲。', 'res.json 等结果文件'),
       ('四', '生成与检查', '用页型函数生成页面，渲染检查全部为 0，再看缩略图。', 'slides/*.html 页面文件'),
       ('五', '核对与发布', '关键数字逐一对回结果文件；发布幻灯片，导出可跳转 PDF。', '幻灯片 · PDF · 数据表')],
      '五步对应手册第五节。第四步的检查项：SHRINK（被压缩）、OVERLAP（重叠）、HOVERFLOW（横向溢出）、LOW（越过 y = 920）、OUTX（越出左右边界），全部为 0 才进入第五步。',
      footer_blocks=[('结果文件是唯一来源', '页面、讲稿、PDF 里的数字都从同一份结果文件读出。'), ('标题由表管理', '眉题、标题、标签集中写在一张表里，改一处全局生效。'), ('术语由表统一', '术语替换规则每条必须命中，未命中即报错。')])

LEX = (f'<div style="display:flex;flex-direction:column;gap:10px"><p style="font-size:24px;color:{GROW}">优先</p><div style="display:flex;gap:10px;flex-wrap:wrap">'
       + ''.join(chip(w, GROW) for w in ['领航', '校准', '复盘', '验收', '增利', '口径', '规格', '数据校准'])
       + f'</div><p style="font-size:24px;color:{SEAL}">避免</p><div style="display:flex;gap:10px;flex-wrap:wrap">'
       + ''.join(chip(w, SEAL) for w in ['赋能', '抓手', '闭环', '打法', '解决方案', '颠覆', '爆款', '裂变', '数据补全'])
       + f'</div>{txt("统计原文中的「同比增长」照录；侍天自己的主张用「增利」。",24,MUTED,1.5)}</div>')
two_lists('voice', '模板与规范 · 品牌声音', '标题写结论，主语是门店与顾客，不用「我们」「您」。', None,
          ('宜', ['论证页标题是结论，句号结尾', '主语是门店、菜单、顾客', '第三人称称侍天', '每条建议带依据、动作与验收', '设计值、推算值明说', '数字带单位与时间窗口']),
          ('忌', ['论证页用「菜品评论分析」式名词标题', '「我们认为」「为您」', '「为您赋能」等销售口吻', '「提升出品效率」这类空话', '把目标写成已发生的结果', '「大量差评」等无数字描述']),
          '标点：中文用全角；「·」作连接，「、」分隔句内并列；中文句中不用破折号。不用 emoji，不用感叹号（顾客原话除外）。',
          side=('词表', LEX), labels=('宜', '忌'))

def sw(name, hv, use):
    return card(f'<div style="height:60px;background:{hv};border:1px solid {LINE}"></div><div style="display:flex;justify-content:space-between;align-items:baseline"><p style="font-size:28px;font-weight:600">{name}</p><p style="font-family:{MONO};font-size:24px;color:{GOLD}">{hv}</p></div>{txt(use,24,BODY,1.4)}', gap=10, pad='16px 18px')
ROW1 = [('淡墨纸', SURF, '默认页面底色'), ('宣纸', PAPER, '卡片底、第二种页底'), ('素墨', INK, '表头、提示条、色块'), ('玄墨', CHAR, '标题与正文；每页一个色块')]
ROW2 = [('土金', GOLD, '线、眉题、数字、页码'), ('明金', GOLDHI, '柱条；作文字仅 ≥ 28px'), ('素墨灰', MUTED, '注释、次要文字、页脚'), ('朱红', SEAL, '警示与重点；单页 ≤ 5%')]
RAMP = [('金 100', G100), ('金 300', G300), ('金 400', G400), ('金 500', G500), ('金 600', G600), ('金 700', G700), ('增长', GROW), ('关注', CAUT), ('中性', DATUM), ('基准', BENCH)]
page('colors', '模板与规范 · 色彩', '素墨为纸，玄墨为字，土金为骨，朱红只作印记。',
     f'<div style="display:flex;gap:20px">{"".join(sw(*x) for x in ROW1)}</div><div style="display:flex;gap:20px">{"".join(sw(*x) for x in ROW2)}</div>'
     + f'<div style="display:flex;flex-direction:column;gap:12px">{colhead("金阶（高亮行、柱条分层）与语义色（仅报告图表）")}<div style="display:flex;gap:12px">'
     + ''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:6px"><div style="height:44px;background:{c}"></div><p style="font-size:24px">{n}</p><p style="font-family:{MONO};font-size:24px;color:{MUTED}">{c if c.startswith('#') else '灰 45%'}</p></div>' for n, c in RAMP)
     + '</div></div>',
     '色值与设计系统 tokens 一致，代码中统一从 tsk.core 读取常量，不手写色值。图表配色：一个系列用明金；两个系列加玄墨；三个系列再加朱红；对标基准用 chart-benchmark 令牌（素墨灰 45% 透明度，色块标「灰 45%」；叠在淡墨纸上约为 #B9B2A7，仅作印刷核色参考，不写进代码）；正负对比用增长绿与朱红。', gap=22)

def trow(role, spec, sp):
    return f'<div style="display:flex;align-items:center;gap:32px;padding:8px 0;border-bottom:1px solid {LINE}"><p style="width:200px;font-size:24px;color:{MUTED}">{role}</p><div style="flex:1;display:flex">{sp}</div><p style="width:430px;font-family:{MONO};font-size:24px;color:{GOLD}">{spec}</p></div>'
TROWS = [('封面标题', 'Serif SC 88–104 / 600', '<p style="font-size:80px;font-weight:600;letter-spacing:6px;line-height:1.15">拍板之前，问侍天。</p>'),
         ('页标题', 'Serif SC 56 / 600 · 自动降档', '<p style="font-size:56px;font-weight:600;letter-spacing:4px;line-height:1.2">一句结论，句号结尾。</p>'),
         ('卡片标题', 'Serif SC 34–44 / 600', '<p style="font-size:40px;font-weight:600;letter-spacing:2px">对的菜单</p>'),
         ('数字', 'Plex Mono 48–64 · 土金', bignum('62.4 %', 56, 28)),
         ('文字型数值', 'Serif SC 40 / 600 · 土金', f'<p style="font-size:40px;font-weight:600;color:{GOLD}">订单级</p>'),
         ('正文', 'Serif SC 24–26 · 行高 1.5', '<p style="font-size:26px;line-height:1.5">每个数字带单位、时间窗口与来源。</p>'),
         ('眉题', 'Serif SC 24 · 土金 · 字距 8', eyebrow('章节 · 主题（编号）')),
         ('注释', 'Serif SC 24 · 素墨灰', note('口径：≤ 2 星为差评；来源：平台导出。')),
         ('字标', 'Noto Serif · 双色', f'<p style="font-family:{EN};font-size:32px;letter-spacing:11px">{wm()}</p>')]
page('type', '模板与规范 · 字体与字号', '字号只有九档角色，任何文字不小于 24px。',
     '<div style="display:flex;flex-direction:column">' + ''.join(trow(*r) for r in TROWS) + '</div>',
     '中文 Noto Serif SC，数字 IBM Plex Mono，西文 Noto Serif。页标题用 fit() 在 56、52、48、44 中自动选能一行放下的最大字号；仍放不下就改写标题。字标 TIANSIGHT 双色：T、A 为玄墨 700，INSIGHT 为金 400。', gap=18)

def ab(l, t, w, h, inner='', bg=None, extra=''):
    b = f'background:{bg};' if bg else ''
    return f'<div style="position:absolute;left:{l}px;top:{t}px;width:{w}px;height:{h}px;{b}{extra}">{inner}</div>'
CANVAS = (f'<div style="position:relative;width:960px;height:540px;background:{PAPER};border:1px solid {RULE}">'
          + ab(0, 0, 64, 540, bg=G100) + ab(896, 0, 64, 540, bg=G100) + ab(64, 0, 832, 64, bg=G100) + ab(64, 460, 832, 80, bg=G100)
          + ab(64, 64, 832, 72, f'<p style="font-size:24px;color:{GOLD};padding:6px 16px">页头 · 眉题 + 结论标题 + 标签胶囊</p>', INK)
          + ab(64, 136, 832, 3, bg=GOLD)
          + ab(64, 156, 832, 290, f'<div style="display:flex;flex-direction:column;gap:8px;padding:20px"><p style="font-size:26px;font-weight:600">主体 · 一个图、表或卡片组</p><p style="font-size:24px;color:{BODY}">至多再加一条提示条；长说明放讲稿</p></div>', PAPER, f'border:1px dashed {GOLD}')
          + ab(64, 476, 832, 40, f'<p style="font-size:24px;color:{MUTED};white-space:nowrap">页脚 · 字标 · 报告名　　目录　术语　　NN / 总数</p>')
          + ab(8, 250, 52, 40, f'<p style="font-family:{MONO};font-size:24px;color:{GOLD}">128</p>')
          + ab(896, 424, 64, 40, f'<p style="font-family:{MONO};font-size:24px;color:{SEAL}">920</p>')
          + '</div>')
LR = ['画布 1920 × 1080；左右与上边距 128px，有页脚时下边距 160px', '正文不越过 y = 920，页脚基线距底 64px', '页头固定：眉题 → 结论标题 → 右侧标签 → 土金 2px 底线',
      '左对齐；居中只用于封面、章节页、收尾页', '卡片：宣纸底、1px 金色细线、圆角 2px、无阴影，同行等高', '照片只放独立一栏，不压在正文下面', '序号用中文数字加金色细圈']
page('layout', '模板与规范 · 版式', '每页由页头、一个主体和页脚三段组成，正文止于 y = 920。',
     f'<div style="display:flex;gap:56px"><div style="display:flex;flex-direction:column;gap:12px">{lab("示意 · 按 1 : 2 缩放，浅金为边距")}{CANVAS}</div>'
     f'<div style="flex:1;display:flex;flex-direction:column">{colhead("版式规则")}'
     + ''.join(f'<p style="font-size:24px;line-height:1.45;padding:9px 0;border-bottom:1px solid {LINE}">{r}</p>' for r in LR) + '</div></div>',
     '页脚由工具包自动生成：左侧字标与报告名，中右「目录」「术语」两个跳转入口，右侧页码。全屏照片页（封面、章节页）不放页头。', gap=28)

EX = [('出餐慢', 214, False), ('服务态度', 188, False), ('目标菜品出品', 151, True), ('售罄未告知', 120, False), ('环境卫生', 96, False), ('价格', 71, False), ('排队', 44, False)]
CHR = [('宜', GROW, '柱与条从 0 开始'), ('宜', GROW, '排名按数值从高到低排序'), ('宜', GROW, '单系列明金，第二系列玄墨，第三系列朱红'), ('宜', GROW, '对标基准用 chart-benchmark 令牌；正负用绿与朱红'),
       ('宜', GROW, '图上方写单位与样本，下方写口径'), ('忌', SEAL, '3D、阴影、渐变'), ('忌', SEAL, '双坐标轴；超过 5 项的饼图'), ('忌', SEAL, '彩虹色；坐标数字小于 24px')]
page('charts', '模板与规范 · 图表', '图表只用金阶与语义色，柱从 0 开始，排名按数值排序。',
     f'<div style="display:flex;gap:64px"><div style="width:900px;display:flex;flex-direction:column;gap:12px">{colhead("示例 · 差评主题条数（虚构，n = 1,000）")}'
     + ''.join(hbar(l, v, 214, 460, SEAL if e else G300, str(v), lw=220, bold=e) for l, v, e in EX)
     + f'<div style="display:flex;align-items:center;gap:12px"><div style="width:22px;height:18px;background:{SEAL}"></div><p style="font-size:24px;color:{BODY}">朱红 = 与本项目核心目标直接相关</p></div>'
     + note('口径：一条评论可涉及多个主题；来源：示例平台导出，2026 年 7–9 月。') + '</div>'
     + f'<div style="flex:1;display:flex;flex-direction:column">{colhead("规则")}'
     + ''.join(f'<div style="display:flex;gap:14px;align-items:baseline;padding:9px 0;border-bottom:1px solid {LINE}"><p style="font-size:24px;color:{c}">{a}</p><p style="font-size:24px;line-height:1.4">{t}</p></div>' for a, c, t in CHR) + '</div></div>',
     '图下方的口径行是唯一允许上屏的口径说明；其余口径写进讲稿。横条函数 hbar() 的标签框固定宽度、不换行。', gap=28)

table('badges', '模板与规范 · 证据与口径标签', '右上角标签统一写「中文 + 代码」，说明这一页数字的身份。', None,
      ['标签', '含义', '何时用', '标签写法'],
      [['观测值 VAL.O', '直接读自菜单、评论、POS', '计数、占比、标价', '观测值 VAL.O'], ['估计值 VAL.E', '规则或模型估出，有误差', '关键词标注、正负判定', '估计值 VAL.E · 估计级'],
       ['模拟值 VAL.S', '按规则推算', '标准点单组合、场景模拟', '模拟值 VAL.S'], ['设计假设值 VAL.H', '提案设定，待测试确认', '价格区间、时限、目标值', '设计假设值 VAL.H'],
       ['可信上限 CAP', '假设级 H < 估计级 E < 观测级 O', '整页结论能撑多强', '可信上限 · 估计级'], ['外部参照 ORG.E3', '公开统计与行业报告', '市场背景页', '外部参照 ORG.E3'],
       ['数据级 DM1–DM5', '菜单照片 → 标价 → POS → 成本卡 → 实验', '数据盘点页', '数据级 DM2'], ['样张', '模板示意，数据虚构', '仅用于模板', '样张 · 虚构数据']],
      '品牌 QA 第 5 条的「设计值」「实测值」分别对应设计假设值 VAL.H 与观测值 VAL.O，两种写法可互换，同一份报告内统一一种。设计系统中的「EGA E1–E4」即方法论 v3.0 的「ORG 证据来源」，报告统一写 ORG。标签过长会挤压标题，代码可移到眉题。PDF 中右上角标签可点击，跳到术语或口径页。',
      widths=[20, 32, 24, 24], emph_col=0, bg=PAPER)

table('dodont', '模板与规范 · 宜忌对照', '十组宜忌对照，来自三份成稿的复盘。', None,
      ['项目', '宜', '忌'],
      [['标题', '论证页一句结论；数据页可用名词短标题', '两行标题；孤字；为凑结论删数据'], ['标签', '「估计值 VAL.E」中文加代码', '只写 VAL.E、CAP=H 等代码'],
       ['术语', '先在术语页定义，全文一个叫法', '同一概念多个叫法（菜篮、套餐、组合）'], ['口径', '写清来源：平台人均为用户自报', '「实测人均」等含糊说法'],
       ['数字', '等宽土金，带单位与窗口，从结果文件读', '手敲数字；无单位；无窗口'], ['推算', '设计值、模拟值明说', '把目标写成已发生'],
       ['朱红', '只给警示与本项目重点', '正面数据、装饰、大面积色块'], ['长说明', '放进讲稿', '上屏小字'],
       ['放不下', '拆页', '缩字、压行距、缩边距'], ['页码引用', '程序生成「→ 第 N 页」', '手写页码，改页序后失效']],
      '这十组来自三份客户成稿（提案与两份补充报告）的返工记录：菜篮改为标准点单组合、实测人均改为平台人均、代码补中文、长标签挤压标题等。',
      widths=[14, 43, 43], emph_col=0)

QA = ['论证页标题为结论句，数据页可用短标题', '每页右上标签为「中文 + 代码」', '所有文字 ≥ 24px；渲染检查五项全部为 0', '字标双色；封面印章旁不另写「侍天」',
      '每个数字有单位、窗口与来源；已与源数据对账', '朱红只用于警示与重点；一页最多一个玄墨色块', '无「我们」「您」，无 emoji，无避用词', '术语全文一致，术语页定义齐全',
      '「→ 第 N 页」由程序生成，与页序一致', 'PDF 链接全部可解析；书签完整', '门店、图、明细数量与应有清单一致', '分享前在「分享」中设置权限']
def qcol(items, k0): return '<div style="flex:1;display:flex;flex-direction:column">' + ''.join(f'<div style="display:flex;gap:20px;align-items:center;padding:13px 0;border-bottom:1px solid {LINE}"><div style="width:28px;height:28px;border:1.5px solid {GOLD};border-radius:2px"></div><p style="width:44px;font-family:{MONO};font-size:24px;color:{GOLD}">{k0+i+1:02d}</p><p style="flex:1;font-size:26px">{t}</p></div>' for i, t in enumerate(items)) + '</div>'
page('qa', '模板与规范 · 出版前检查', '出版前逐条核对十二项，全部通过才能分享。',
     f'<div style="display:flex;gap:56px">{qcol(QA[:6],0)}{qcol(QA[6:],6)}</div>' + callout('工具', 'lint.js 与 render.js 覆盖第 3 项；export.verify_pdf() 覆盖第 10 项；其余逐页人工核对。'),
     '检查清单与手册第六节一致。第 5 项建议由未参与制作的人核对。', gap=28)

table('constraints', '模板与规范 · 渲染器硬约束', '幻灯片渲染器只接受封闭的样式子集，以下十一条是硬约束。', None,
      ['约束', '做法'],
      [['无 margin、z-index、em、var()', '用 gap、padding、flex 间距'], ['gap 只能一个值；padding ≤ 256', '行列间距相同'],
       ['表格单元格不能设字体、字重', '在 table 上设字体；用颜色强调；行可设底色'], ['span 只能设颜色、粗体、斜体、下划线', '换字号就拆成两个 p'],
       ['链接只保留 http(s)', '页内跳转由工具包生成的 PDF 实现'], ['空的无底色 div 会被丢弃', '留白用 flex:1 占位或有底色的块'],
       ['每页 ≤ 200 个元素；每个容器 ≤ 24 个定位子元素', '大表用行而不是单元格包装'], ['边框四边须同一样式与颜色', '顶部强调线与边框同色，宽度可不同'],
       ['超出画布会被整体缩字', '盯住 SHRINK，宁可拆页'], ['SVG 内不能写字', '图上文字用定位的 p'], ['中文约 1.04 × 字号/字，西文约 0.58', '标题长度交给 fit() 估算']],
      '这些约束来自渲染器报错的实际记录。lint.js 会报出不支持的写法；render.js 报出压缩、重叠与越界。',
      widths=[46, 54], emph_col=0, bg=PAPER)

CAT = [('A 结构页', [('A1', '封面', 'cover'), ('A2', '目录', 'toc'), ('A3', '章节页', 'sopen'), ('A4', '执行摘要', 'exsum'), ('A5', '收尾页', 'close')]),
       ('B 论证页', [('B1', '大数字卡', 'b1'), ('B2', '两栏对照', 'b2'), ('B3', '步骤卡', 'b3'), ('B4', '四格矩阵', 'b4'), ('B5', '引语页', 'b5'), ('B6', '阶段路线', 'b6'), ('B7', '流程案例', 'b7')]),
       ('C 数据页', [('C1', '竖柱趋势', 'c1'), ('C2', '横条排名', 'c2'), ('C3', '分组对比', 'c3'), ('C4', '双向条', 'c4'), ('C5', '小倍数', 'c5'), ('C6', '严重度条', 'c6'), ('C7', '热力表', 'c7'), ('C8', '时间线', 'c8')]),
       ('D 表格页', [('D1', '字段字典', 'd1'), ('D2', '对策表', 'd2'), ('D3', '指标看板', 'd3'), ('D4', '紧凑清单', 'd4')]),
       ('E 附录与 F 团队', [('E1', '术语速查', 'gloss'), ('E2', '来源', 'src'), ('F1', '团队', 'team')])]
def catcol(groups):
    o = ''
    for g, rows in groups:
        o += f'<p style="font-size:24px;letter-spacing:6px;color:{GOLD};padding:10px 0 4px;border-bottom:1.5px solid {GOLD}">{g}</p>'
        o += ''.join(f'<div style="display:flex;align-items:baseline;gap:18px;padding:3px 0;border-bottom:1px solid {LINE}"><p style="width:48px;font-family:{MONO};font-size:24px;color:{GOLD}">{c}</p><p style="flex:1;font-size:26px">{n}</p><p style="font-size:24px;color:{GOLD}">→ 第 {pg(t)} 页</p></div>' for c, n, t in rows)
    return f'<div style="flex:1;display:flex;flex-direction:column">{o}</div>'
page('catalog', '模板与规范 · 页型目录', '二十七种页型，每种都有样张，点页码即可跳转。',
     f'<div style="display:flex;gap:56px">{catcol(CAT[:2])}{catcol(CAT[2:3])}{catcol(CAT[3:])}</div>',
     '每页 = 页头 + 一个主体（图、表或卡片组）+ 至多一条提示条。样张的眉题写明页型编号与函数名；讲稿写明用途、容量与注意事项。容量超出就拆页。', bg=PAPER)

# ================= 二 结构页样张 =================
section_opener('sopen', '二', '结构页样张', 'A3 章节页 · section_opener()：每部分开篇用一页；标题 ≤ 2 行，右侧照片栏 880px。封面、目录、收尾页分别见第 1、2 页与最后一页。', 'module2',
               N('A3', '章节页', '每部分开篇。', '标题 ≤ 2 行，副题 ≤ 3 行。', "section_opener(id, cn, title, sub, photo, notes)", '照片不压字；中文数字与章节序一致。'))
exec_summary('exsum', sample('A4', '执行摘要', 'exec_summary()'), '目标菜品差评占比两个月升至近两成，问题集中在出品与告知。', SB,
             [('18.9 %', '目标菜品差评占比', '9 月；7 月为 3.1%。', 'c5'), ('45.8 %', '售罄未告知的严重度', '该主题差评中 1 星占比，基线 28%。', 'c6'), ('6 家', '问题集中门店', '12 家门店中 6 家贡献八成差评。', 'c2')],
             '问题不在菜品本身，而在出品时段与售罄告知；先改流程，再谈扩店。',
             [('先改告知', '售罄在下单时告知，用 POS 记录验收。', 'b7'), ('再定出品', '出炉到上桌时限，按门店分时段排产。', 'd2'), ('后看口碑', '按周跟踪目标菜品差评占比。', 'd3')],
             N('A4', '执行摘要', '三个核心数字 + 一句判断 + 三条行动。', '3 卡 + 1 条 + 3 块。', "exec_summary(id, eb, title, badge, kpis, judgment, actions, notes)", '卡片与行动块里的「→ 第 N 页」由程序生成；判断条是本页唯一玄墨色块。'))

# ================= 三 论证页样张 =================
kpi_cards('b1', sample('B1', '大数字卡', 'kpi_cards()'), '示例窗口共 4,000 条评论，差评 744 条，占 18.6%。', SB,
          [('4,000 条', '评论总数', '7–9 月，三个平台合计'), ('18.6 %', '差评占比', '≤ 2 星评论 ÷ 全部评论'), ('4.2 分', '平均星级', '5 分制，含默认好评'), ('12 家', '覆盖门店', '含 1 家装修中门店')],
          N('B1', '大数字卡', '3–5 个关键数字，交代样本规模与口径。', '5 张卡。', 'kpi_cards(id, eb, title, badge, kpis, notes, callout_)', '数字与单位以空格分隔；每张卡必须有说明行。'),
          callout_=('读法', '四个数字交代样本规模与口径，后续各页都以此为分母。'))
two_lists('b2', sample('B2', '两栏对照', 'two_lists()'), '这份数据能回答「哪里出问题」，不能回答「为什么」。', SB,
          ('能下的结论', ['哪些主题被抱怨最多', '哪些门店差评集中', '差评随时间如何变化', '哪些菜品被点名', '哪种处理方式更常见']),
          ('不能下的结论', ['顾客为什么不满意', '差评对营业额的影响', '未留评顾客的看法', '门店之间的成本差异', '改进后的效果']),
          N('B2', '两栏对照', '能 / 不能、现状 / 目标。', '每栏 ≤ 6 条。', 'two_lists(id, eb, title, badge, left, right, notes, side, callout_, labels)', '两栏条数尽量相等；第三栏 side 可放词表或说明。'),
          callout_=('对策', '不能下的结论交由门店访谈与 POS 订单补足。'))
steps('b3', sample('B3', '步骤卡', 'steps()'), '示例方法分四步，每一步都有可复核的产出。', SB,
      [('一', '盘点', '列清文件、区间、条数与全部字段。', '字段字典'), ('二', '标注', '平台标签 → 客户维度 → 侍天规则，三层叠加。', '统一标注底表'),
       ('三', '排序', '频次 × 严重度，找出最先要改的问题。', '优先级矩阵'), ('四', '对准目标', '把问题落到核心目标相关的门店与产品。', '对策表')],
      N('B3', '步骤卡', '方法、流程。', '3–5 步；底部说明块 ≤ 3。', 'steps(id, eb, title, badge, items, notes, footer_blocks)', '最后一步默认素墨底高亮；步骤名 ≤ 6 字。'),
      footer_blocks=[('严重度', '某主题差评中 1 星的占比。'), ('严重度指数', '该占比 ÷ 全部差评的 1 星占比。')])
quadrant('b4', sample('B4', '四格矩阵', 'quadrant()'), '高频且高严重的三类问题应最先处理。', SB,
         [('高频 · 高严重', '先改', SEAL, [('服务态度', '51%', True), ('售罄未告知', '46%', True), ('出餐慢', '40%', False)]),
          ('高频 · 低严重', '流程优化', CAUT, [('目标菜品出品', '33%', False), ('环境卫生', '27%', False), ('价格', '23%', False)]),
          ('低频 · 高严重', '设防线', GOLD, [('食品安全', '61%', False), ('错单', '39%', False)]),
          ('低频 · 低严重', '观察', DATUM, [('份量', '19%', False), ('排队', '16%', False), ('停车', '12%', False)])],
         N('B4', '四格矩阵', '频次 × 严重度等二维分类。', '每格 Top 5，四格连续编号，编号对应明细；不足 5 项写实际数量。', 'quads=[(格名, 动作, 颜色, [(项, 数值, 是否重点)])]', '格名写清两个维度；重点项用朱红，全页不超过 3 个。'),
         side_html=txt('横轴为提及条数，纵轴为严重度。分界线取全部差评的中位数。', 24, BODY, 1.55) + txt('数值为该主题差评中 1 星占比。', 24, MUTED, 1.55))
quotes('b5', sample('B5', '引语页', 'quotes()'), '[结论：顾客原话说明了什么，一句话。]', SB,
       [('32 %', '目标菜品差评占比', '示例窗口末周'), ('16 条', '人工编码评论', '逐条阅读，双人复核')],
       [('[顾客原话节选，保留原标点，≤ 40 字。]', '[平台 · 星级 · 日期]'), ('[第二条原话，代表另一类问题。]', '[平台 · 星级 · 日期]'), ('[第三条原话。]', '[平台 · 星级 · 日期]')],
       ['[外部背景：权威来源的一句话事实，带年份与口径。]', '[第二条背景，说明与本项目目标的关系。]'],
       N('B5', '引语页', '顾客原话 + 外部背景。', '数字 ≤ 3，原话 2–4 句。', 'quotes(id, eb, title, badge, stats, quotes_, context, notes)', '原话只节选不改写，门店与顾客昵称不展示；背景须注明来源。'))
roadmap('b6', sample('B6', '阶段路线', 'roadmap()'), '项目分四个阶段推进，试点验证后再复制。', SB,
        [('诊断', '已完成', '数据盘点与基线', GROW), ('设计', '进行中', '菜单与服务规格', GOLD), ('试点', '下一步', '2–3 家门店验证', SEAL), ('推广', '待启动', '按店型复制', DATUM)],
        [('第 1–4 周', '建立基线', '差评主题、出品时段、售罄记录的基线。'), ('第 5–10 周', '门店试点', '两家门店试行告知与排产规则。'), ('第 11–16 周', '按店型复制', '试点达标后按店型推广。')],
        '试点未达到验收标准，不进入推广。',
        N('B6', '阶段路线', '项目阶段 + 分段计划。', '4 阶段 + 3 段。', 'roadmap(id, eb, title, badge, stages, phases, principle, notes)', '当前阶段用朱红；状态写「已完成 / 进行中 / 下一步 / 待启动」。'))
process_flow('b7', sample('B7', '流程案例', 'process_flow()'), '一次差评的四个时间点显示，问题出在售罄告知。', SB,
             [('11:30', '顾客下单', '点目标菜品与两道配菜'), ('11:52', '催单', '服务员答复「马上好」'), ('12:10', '告知售罄', '下单 40 分钟后才告知'), ('12:15', '留下差评', '1 星，提到「没人说」')],
             [('同类记录 A', '[示例：另一家门店同类经过，一句话。]'), ('同类记录 B', '[示例：同类经过，一句话。]'), ('同类记录 C', '[示例：同类经过，一句话。]')],
             ('应有标准', '售罄在下单时告知；出餐超过 20 分钟主动说明。', '设计假设值，须经门店测试确认。'),
             N('B7', '流程案例', '一个具体过程的时间点。', '3–5 个节点；同类记录 ≤ 4。', 'process_flow(id, eb, title, badge, nodes, records, standard, notes, alert_index)', '出问题的节点用 alert_index 标红；标准写成可验收的数字。'), alert_index=2)

# ================= 四 数据页样张 =================
vbars('c1', sample('C1', '竖柱趋势', 'vbars()'), '差评量 9 月升至 318 条，为半年最高。', SB,
      [('4 月', 142, '条'), ('5 月', 151, '条'), ('6 月', 168, '条'), ('7 月', 190, '条'), ('8 月', 236, '条'), ('9 月', 318, '条')],
      N('C1', '竖柱趋势', '按月、按周的量。', '≤ 8 柱。', 'vbars(id, eb, title, badge, bars, notes, chart_title, side_title, side_html, hl)', '柱从 0 开始；hl 指定的柱用朱红。'),
      '月度差评条数（≤ 2 星）', side_title='读法',
      side_html=txt('9 月环比增加 82 条，增量的六成来自目标菜品相关评论。', 26, BODY, 1.55) + txt('同期门店数从 9 家增至 12 家，单店差评量仍在上升。', 26, BODY, 1.55) + note('口径：评论日期；含追评。'), hl='9 月')
TH = [('出餐慢', 214, False), ('服务态度', 188, False), ('目标菜品出品', 151, True), ('售罄未告知', 120, True), ('环境卫生', 96, False), ('价格', 71, False), ('份量', 63, False), ('排队', 44, False), ('错单', 31, False), ('停车', 18, False)]
ST = [('门店 A', 168, True), ('门店 B', 142, True), ('门店 C', 120, False), ('门店 D', 97, False), ('门店 E', 81, False), ('门店 F', 66, False), ('门店 G', 52, False), ('门店 H', 40, False), ('门店 I', 31, False), ('门店 J', 22, False)]
hbar_list('c2', sample('C2', '横条排名', 'hbar_list()'), '出餐慢与服务态度居前，目标菜品出品排第三。', SB,
          [('差评主题 · 条数', TH, 1), ('门店 · 差评条数', ST, 1)],
          N('C2', '横条排名', '标签、门店、问题排序。', '1–3 栏，每栏 ≤ 12 行。', 'hbar_list(id, eb, title, badge, panels, notes, legend_note)', '按数值排序后传入；强调项用朱红并写图例。'),
          legend_note='朱红 = 与本项目核心目标直接相关')
paired_bars('c3', sample('C3', '分组对比', 'paired_bars()'), '目标菜品门店的出品类差评占比高出其余门店 12 个百分点。', SB, ('目标菜品门店', '其余门店'),
            [('出品', 31.4, 19.2), ('服务', 24.0, 26.1), ('售罄', 14.8, 6.3), ('环境', 9.2, 12.5), ('价格', 8.1, 9.4), ('排队', 6.0, 7.7)],
            N('C3', '分组对比', 'A 组 vs B 组。', '≤ 8 个指标。', 'paired_bars(id, eb, title, badge, names, rows, notes, unit, side_title, side_html, scale, hl)', '第二组用基准色（chart-benchmark 令牌）；scale 调整条长，最长条 ≤ 700px。'),
            side_title='含义', side_html=txt('出品与售罄两项差距最大，其余主题两组接近。', 26, BODY, 1.55) + note('口径：某主题差评 ÷ 该组全部差评。'), hl=('出品', '售罄'))
diverging('c4', sample('C4', '双向条', 'diverging()'), '烧味拼盘被称赞最多，豉油鸡被批评最多且多于被称赞。', SB,
          [('烧味拼盘', 86, 21, 107), ('叉烧', 64, 18, 82), ('虾饺', 52, 12, 64), ('肠粉', 41, 15, 56), ('豉汁排骨', 33, 14, 47), ('艇仔粥', 28, 13, 41), ('菜心', 19, 11, 30), ('白切鸡', 22, 37, 59), ('豉油鸡', 31, 58, 89)],
          N('C4', '双向条', '正面 vs 负面。', '≤ 14 行。', 'diverging(id, eb, title, badge, rows, notes, labels, hl, foot)', '按「正 − 负」排序；正面绿、负面朱红；合计列放最右。'),
          hl=('豉油鸡',), foot='口径：一条评论中对某菜品的正、负提及分别计数；示例数据。')
small_multiples('c5', sample('C5', '小倍数', 'small_multiples()'), '三个指标同向恶化，9 月均为三个月最高。', SB,
                [('目标菜品差评占比', '平台评论', [('7 月', 3.1), ('8 月', 8.4), ('9 月', 18.9)], '对应：出品与告知'),
                 ('售罄相关差评占比', '平台评论', [('7 月', 4.2), ('8 月', 6.0), ('9 月', 11.5)], '对应：排产'),
                 ('出餐超 20 分钟占比', 'POS 订单', [('7 月', 7.5), ('8 月', 9.1), ('9 月', 14.2)], '对应：出品时段')],
                N('C5', '小倍数', '2–4 个指标各自的趋势。', '4 个面板。', 'small_multiples(id, eb, title, badge, panels, notes, foot, scale)', '各面板刻度相同才能横向比较；最后一期用朱红；最高柱 ≤ 260px。'), foot='口径：月度；三个指标分母不同，见讲稿。', scale=13)
ratio_bars('c6', sample('C6', '严重度条', 'ratio_bars()'), '服务态度与售罄未告知的差评中，近半是 1 星。', SB, '各主题差评中 1 星占比',
           [('服务态度', 188, 51.2, '先改'), ('售罄未告知', 120, 45.8, '先改'), ('出餐慢', 214, 40.3, '先改'), ('错单', 31, 38.7, ''), ('目标菜品出品', 151, 33.1, ''), ('环境卫生', 96, 27.1, ''), ('价格', 71, 22.5, ''), ('份量', 63, 19.0, ''), ('排队', 44, 15.9, '')],
           N('C6', '严重度条', '比例条 + 基准线说明。', '≤ 14 行。', 'ratio_bars(id, eb, title, badge, chart_title, rows, notes, threshold, side_cards)', '阈值以上用朱红；侧栏写基准与读法。'),
           threshold=40, side_cards=[card(f'<p style="font-size:24px;color:{MUTED}">基准</p>{bignum("27.6 %",56)}{txt("全部差评中 1 星的占比",24,BODY,1.45)}'), card(f'<p style="font-size:24px;color:{MUTED}">读法</p>{txt("高于 40% 的主题用朱红，意味着这类问题一旦发生，顾客多给 1 星。",24,BODY,1.5)}')])
heat_table('c7', sample('C7', '热力表', 'heat_table()'), '门店 A 与门店 B 的出品类差评占比最高。', SB, ['门店 A', '门店 B', '门店 C', '门店 D', '门店 E', '门店 F'],
           [('出品', [38, 34, 22, 18, 20, 15]), ('服务', [24, 26, 28, 30, 22, 25]), ('售罄', [16, 14, 6, 5, None, 4]), ('环境', [6, 9, 14, 12, 16, 18]), ('价格', [8, 7, 10, 11, 12, 13]), ('排队', [5, 6, 9, 8, 7, 9])],
           N('C7', '热力表', '品类 × 门店、维度 × 维度。', '≤ 10 行 × 8 列。', 'heat_table(id, eb, title, badge, cols, rows, notes, fmt, max_v, col_title, foot)', '颜色按金阶分五档；缺值写「—」，不填 0。'),
           col_title='主题 \\ 门店', foot='口径：某门店某主题差评 ÷ 该门店全部差评；门店 E 售罄数据缺失。')
timeline('c8', sample('C8', '时间线', 'timeline()'), '两个月内扩至 12 家门店，目标菜品差评占比同步上升。', SB,
         [('2026-07-01', '门店 A、B', '目标菜品上线'), ('2026-07-20', '门店 C–E', '第二批上线'), ('2026-08-10', '平台活动', '团购套餐上线，含目标菜品'),
          ('2026-08-28', '门店 F–I', '第三批上线'), ('2026-09-15', '门店 J、K', '新店开业'), ('2026-09-30', '门店 L', '装修中，计入门店数')],
         N('C8', '时间线', '事件序列 + 侧栏小图。', '≤ 8 行；侧栏 ≤ 5 柱。', 'timeline(id, eb, title, badge, events, notes, side_title, side_bars)', '日期用 YYYY-MM-DD；事件写事实，不写评价。'),
         side_title='目标菜品差评占比', side_bars=[('7 月', 3.1, '5 家'), ('8 月', 8.4, '9 家'), ('9 月', 18.9, '12 家')])

# ================= 五 表格与附录样张 =================
table('d1', sample('D1', '字段字典', 'table()'), '字段说明', SB, ['字段', '含义', '示例', '填充率'],
      [['评论 ID', '平台唯一编号', '[示例编号]', '100%'], ['门店', '门店名称', '门店 A', '100%'], ['星级', '1–5 星，≤ 2 星为差评', '2', '100%'], ['评论日期', '顾客发布日期', '2026-09-18', '100%'],
       ['正文', '评论全文', '[节选]', '97%'], ['平台标签', '平台自动标签', '服务', '62%'], ['人均', '平台人均（用户自报）', '86 元', '41%'], ['商家回复', '是否回复', '是', '78%']],
      N('D1', '字段字典', '字段、含义、示例、填充率。', '≤ 12 行。', 'table(id, eb, title, badge, header, rows, notes, widths, emph_col, hl_rows, foot)', '「人均」须写明口径；填充率低于 50% 的字段不单独下结论。'),
      widths=[18, 40, 24, 18], emph_col=0, hl_rows=(6,), foot='浅金行 = 口径需特别说明的字段。')
table('d2', sample('D2', '对策表', 'table()'), '五个痛点各对应一个杠杆与一条可验收的标准。', SB, ['痛点', '证据', '杠杆', '验收'],
      [['售罄未告知', '120 条，1 星占 45.8%', '下单时提示余量', 'POS 售罄提示率 100%'], ['出餐慢', '214 条，1 星占 40.3%', '分时段排产', '出炉到上桌 ≤ 15 分钟'],
       ['服务态度', '188 条，1 星占 51.2%', '催单话术与升级规则', '催单 5 分钟内答复'], ['目标菜品出品', '151 条', '标准配方与出炉批次', '批次合格率 ≥ 95%'], ['份量', '63 条', '份量标准与称重', '抽检偏差 ≤ 5%']],
      N('D2', '对策表', '痛点、证据、杠杆、验收。', '≤ 8 行。', "table(...) 四列", '验收列必须是可测量的数字；设计值在讲稿里标明 VAL.H。'), widths=[20, 26, 26, 28], emph_col=0)
table('d3', sample('D3', '指标看板', 'table()'), '六个指标按周跟踪，其中三个已有基线。', SB, ['类型', '指标', '口径', '数据', '读数', '目标'],
      [['结果', '目标菜品差评占比', '提及 ÷ 全部差评', '平台评论', '18.9%', '≤ 8%'], ['结果', '平均星级', '5 分制', '平台评论', '4.2', '≥ 4.5'],
       ['过程', '售罄提示率', '提示单 ÷ 售罄单', 'POS', '—', '100%'], ['过程', '出炉到上桌', '中位数，分钟', 'POS', '—', '≤ 15'],
       ['过程', '催单答复时长', '中位数，分钟', '门店记录', '—', '≤ 5'], ['投入', '试点门店数', '执行新规则门店', '项目记录', '0', '2']],
      N('D3', '指标看板', '类型、指标、口径、数据、读数、目标。', '≤ 8 行。', "table(...) 六列", '无基线写「—」；目标值为设计假设值。'), widths=[10, 24, 22, 16, 12, 16], emph_col=4)
list_columns('d4', sample('D4', '紧凑清单', 'list_columns()'), '12 家门店分三批上线，门店 A、B 差评最多。', SB,
             [('第一批 · 7 月', [('门店 A', 168, '重点'), ('门店 B', 142, '重点'), ('门店 C', 120, ''), ('门店 D', 97, ''), ('门店 E', 81, '')]),
              ('第二批 · 8 月', [('门店 F', 66, ''), ('门店 G', 52, ''), ('门店 H', 40, ''), ('门店 I', 31, '')]),
              ('第三批 · 9 月', [('门店 J', 22, '新店'), ('门店 K', 14, '新店'), ('门店 L', 0, '装修')])],
             N('D4', '紧凑清单', '门店、SKU 分栏清单。', '3 栏 × 11 行。', 'list_columns(id, eb, title, badge, columns, notes, foot)', '有标记的行浅金底；数值列为差评条数等单一口径。'), foot='数值为示例窗口内差评条数。')
glossary('gloss', '附录 · 术语速查（E1 · glossary()）', '十二个模板术语的定义，全文按此口径使用。', None,
         [('结论标题', '一句完整判断，句号结尾，一行放下。'), ('眉题', '标题上方的小字：章节 · 主题（编号）。'), ('标签胶囊', '右上角圆角标签，写「中文 + 代码」。'),
          ('提示条', '主体下方一条：「读法」「含义」「对某某」。'), ('讲稿', '每页 aside 中的文字：口径、来源与读法。'), ('页型', '有固定结构的页面，编号 A1–F1。'),
          ('口径', '数字怎么数：分子、分母、窗口与来源。'), ('读数身份', '观测、估计、模拟或设计假设。'), ('可信上限', '整页结论能撑多强：假设级、估计级、观测级。'),
          ('严重度', '某主题差评中 1 星的占比。'), ('渲染检查', 'lint 与 render 报告的五类问题，全部为 0。'), ('页码引用', '「→ 第 N 页」，由程序按页序生成。')],
         N('E1', '术语速查', '术语两栏。', '≤ 12 条；超出拆为多页。', 'glossary(id, eb, title, badge, terms, notes)', '页 id 固定为 gloss，页脚「术语」跳到这里；定义一句话说清。'))
sources('src', '附录 · 来源（E2 · sources()）', '[本报告使用的数据与公开资料。]',
        [('平台评论导出', '[文件名 · 时间区间 · 条数]'), ('客户内部标注', '[维度名称 · 条数 · 标注人]'), ('POS 订单', '[门店 · 时间区间 · 订单数]'),
         ('国家统计局', '[表名 · 年份 · 口径]'), ('地方统计公报', '[城市 · 年份 · 指标]'), ('行业报告', '[机构 · 报告名 · 年份]'), ('媒体报道', '[媒体 · 标题 · 日期]')],
        N('E2', '来源', '数据与公开资料。', '≤ 10 条。', 'sources(id, eb, title, items, notes, foot)', '每条写到能复查的程度：名称、日期、口径。'))
team('team', '附录 · 团队（F1 · team()）', '两位联合创始人与两位专家分别负责本项目的四条主线。',
     [('bianjiang', '边江', '联合创始人 · 前海底捞品牌负责人', '品牌定位 · 菜单咨询'),
      ('guofeng', '郭峰', '联合创始人 · EHL 大中华区创始团队', '组织能力 · AI 应用'),
      ('liquanchao', '李权超', '餐饮出品专家 · 中式烹调高级技师', '菜品研发 · 出品标准'),
      ('yuxiangdong', '余向东', '餐饮后厨设计专家', '后厨动线 · 设备展陈')],
     N('F1', '团队', '项目团队与分工。', '4 人。', 'team(id, eb, title, people, notes, badge)', '姓名与席位头衔照抄 guidelines/company-intro-v3.md「团队」表，不增减字；第四栏样张用 v3 的「方向」，正式报告改写为本项目分工。').replace('本页数据为虚构，仅示意版式；', ''))
closing('close', '[下一步请求：一句话写清希望对方拍板的事项与时间，例如「请在某月某日前确认试点门店」。]', 'tiansight.apuch.cn',
        N('A5', '收尾页', '下一步请求与联系方式。', '请求 ≤ 2 行。', 'closing(id, ask, contact_line, notes)', '只提一个请求；联系方式与二维码不改动。').replace('本页数据为虚构，仅示意版式；', ''))

render()
write_index('侍天报告模板', [('一 模板与规范', '总原则、制作流程、声音、色彩、字号、版式、图表、标签、宜忌、检查清单、渲染约束、页型目录', 'principles'),
                           ('二 结构页样张', '章节页与执行摘要', 'sopen'), ('三 论证页样张', 'B1–B7', 'b1'), ('四 数据页样张', 'C1–C8', 'c1'),
                           ('五 表格与附录样张', '表格、清单、术语、来源、团队、收尾', 'd1')], now='2026-10-14T00:00:00Z')
write_viewer('侍天报告模板')
if os.environ.get('TSK_CHECK'):
    if STALE:
        raise SystemExit('stale: ' + ', '.join(STALE) + ' — run python3 deliverables/report-template/gen/template_deck.py')
    print('fresh:', len(ORDER), 'slides')
else:
    print(len(ORDER), 'slides →', os.path.abspath(OUT))
