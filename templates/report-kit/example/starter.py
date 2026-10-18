"""新报告起步脚本：复制本文件，改名为 <项目>_deck.py，按注释替换内容。
运行：python3 starter.py <输出目录>    或    bash templates/report-kit/build.sh <本脚本> <输出目录>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from tsk import *  # noqa: E402,F403

OUT = sys.argv[1] if len(sys.argv) > 1 else './deck/'
# 1) 报告名（页脚显示）与图片。images 写仓库内路径（本地预览、渲染检查、PDF 都用它）；
#    发布到 Slides 幻灯片时，把这些图上传为素材，写一个 {键: "/_blob/<id>"} 的 blobs.json，
#    用 TSK_BLOBS=blobs.json 重新生成即可。
configure(deckname='[客户] · [报告名]', outdir=OUT, images={
    'seal': 'assets/logo-seal.png', 'cover': 'assets/intro/deck/cover.jpg',
    'section': 'assets/intro/deck/section-1.jpg', 'qr': 'assets/intro/people/wechat-qr.png'})

# 2) 页序：先定结构，再写页。SHORT 是目录与书签里显示的短名
S1 = ['data', 'fields']
S2 = ['trend', 'rank']
S3 = ['actions']
S9 = ['gloss', 'src', 'close']
set_order(['cover', 'toc', 'summary'] + ['s1'] + S1 + S2 + S3 + S9,
          [('一', '数据与口径', ['s1'] + S1), ('二', '现状画像', S2), ('三', '对策', S3), ('附', '附录', S9)],
          dict(summary='执行摘要', s1='章节页', data='数据盘点', fields='字段定义', trend='月度趋势', rank='问题排名',
               actions='对策表', gloss='术语', src='来源', close='下一步'))

# 3) 数字一律从结果文件读，不手敲。例如：R = json.load(open('res.json'))
cover('cover', '[客户名] · [项目名]', '[报告标题<br>≤ 10 字]', ['[副题第一行]', '[副题第二行]'], '2026 年 [月] 月', notes='[讲稿]')
toc()
exec_summary('summary', '执行摘要', '[一句话总判断，句号结尾。]', '估计值 VAL.E',
             [('[数字 单位]', '[标题]', '[说明]', 'trend'), ('[数字 单位]', '[标题]', '[说明]', 'rank'), ('[数字 单位]', '[标题]', '[说明]', 'actions')],
             '[判断：一句话]', [('[行动一]', '[说明]', 'actions'), ('[行动二]', '[说明]', 'actions'), ('[行动三]', '[说明]', 'actions')], '[讲稿：口径与来源]')
section_opener('s1', '一', '数据与口径', '[本部分回答什么问题]', 'section', '[讲稿]')
kpi_cards('data', '数据与口径 · 盘点', '[结论标题。]', '观测值 VAL.O', [('[数字 单位]', '[标题]', '[说明]')] * 4, '[讲稿]')
table('fields', '数据与口径 · 字段', '[结论标题。]', '观测值 VAL.O', ['字段', '含义', '示例', '填充率'], [['[字段]', '[含义]', '[示例]', '[%]']] * 6, '[讲稿]', widths=[18, 40, 24, 18], emph_col=0)
vbars('trend', '现状画像 · 趋势', '[结论标题。]', '观测值 VAL.O', [('7 月', 10, ''), ('8 月', 14, ''), ('9 月', 21, '')], '[讲稿]', '[图标题：单位与样本]', hl='9 月')
hbar_list('rank', '现状画像 · 排名', '[结论标题。]', '估计值 VAL.E', [('[栏名]', [('[项]', 30, True), ('[项]', 20, False), ('[项]', 10, False)], 1)], '[讲稿]', legend_note='朱红 = [含义]')
table('actions', '对策', '[结论标题。]', '设计假设值 VAL.H', ['痛点', '证据', '杠杆', '验收'], [['[痛点]', '[证据]', '[杠杆]', '[验收数字]']] * 4, '[讲稿]', widths=[20, 26, 26, 28], emph_col=0)
glossary('gloss', '附录 · 术语', '[N 个术语的定义，全文按此口径使用。]', None, [('[术语]', '[一句话定义]')] * 8, '[讲稿]')
sources('src', '附录 · 来源', '[本报告使用的数据与公开资料。]', [('[来源]', '[名称 · 日期 · 口径]')] * 5, '[讲稿]')
closing('close', '[下一步请求：一句话。]', 'tiansight.apuch.cn', '[讲稿]')

# 4) 术语统一（可选）：每条规则必须命中，否则报错
# apply_terms([('*', '菜篮', '标准点单组合')])
render()
write_index('[报告名]', [('一 数据与口径', '[描述]', 's1'), ('二 现状画像', '[描述]', 'trend'), ('三 对策', '[描述]', 'actions'), ('附 附录', '[描述]', 'gloss')])
print(len(ORDER), 'slides →', OUT)
