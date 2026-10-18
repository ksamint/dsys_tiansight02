"""侍天 TIANSIGHT 报告幻灯片工具包 · 页型库
每个函数生成一页并登记（不返回 HTML）。参数是纯数据：字符串、数字、列表。
编号与《侍天报告模板手册》第四节一致。容量上限写在 docstring 里，超出请拆页。
"""
from .core import *
# ================= A 结构页 =================
def cover(id,kicker,title,sub_lines,date_line,photo='cover',notes='',tagline='拍板之前，问侍天。'):
    """A1 封面：右侧 688px 照片栏；标题 ≤ 10 字（两行以内）。"""
    sub='<br>'.join(sub_lines)
    sec(id,f'''<img src="{blob(photo)}" alt="封面照片" style="position:absolute;left:1232px;top:0;width:688px;height:1080px;object-fit:cover">
<div style="display:flex;align-items:center;gap:24px"><img src="{blob('seal')}" alt="侍天印章" style="width:96px;height:96px;object-fit:contain"><p style="font-family:{EN};font-size:32px;letter-spacing:11px">{wm()}</p></div>
<div style="flex:1"></div>
<p style="font-size:34px;letter-spacing:10px;color:{GOLD}">{kicker}</p>
<h1 style="width:1060px;font-size:96px;font-weight:600;line-height:1.2;letter-spacing:6px;color:{CHAR}">{title}</h1>
<p style="width:1040px;font-size:34px;line-height:1.5;letter-spacing:2px;color:{BODY}">{sub}</p>
<div style="width:120px;height:2px;background:{GOLD}"></div>
<p style="font-size:30px;letter-spacing:4px;color:{MUTED}">{date_line}</p>
<div style="flex:1"></div>
<p style="font-size:30px;letter-spacing:12px;color:{MUTED}">{tagline}</p>''',notes,pad='112px 128px 112px',gap=28,footer=False)
def toc(id='toc',title=None,notes='目录。PDF 版中目录各行、页脚「目录」「术语」、右上角标签与「→ 第 N 页」均可点击跳转。'):
    """A2 目录：按 SECTIONS 自动分三栏；≤ 40 行。"""
    items=[]
    for n,name,ids in SECTIONS: items.append(('H',n,name)); items+=[('R',i) for i in ids]
    cols=[[],[],[]]; per=-(-len(items)//3); ci=0; last=None
    for it in items:
        if it[0]=='H':
            last=it
            if len(cols[ci])>=per-1 and ci<2: ci+=1      # 部分标题不落在栏尾
        elif len(cols[ci])>=per and ci<2:
            ci+=1; cols[ci].append(('H',last[1],last[2]+'（续）'))
        cols[ci].append(it)
    dense=len(items)>34; hp='6px 0 2px' if dense else '10px 0 4px'; rp='1px 0' if dense else '4px 0'
    def col(c):
        o=''
        for it in c:
            if it[0]=='H': o+=f'<p style="font-size:24px;letter-spacing:6px;color:{GOLD};padding:{hp};border-bottom:1.5px solid {GOLD}">{it[1]}　{it[2]}</p>'
            else: o+=f'<div style="display:flex;align-items:baseline;gap:18px;padding:{rp};border-bottom:1px solid {LINE}"><p style="width:44px;font-family:{MONO};font-size:24px;color:{GOLD}">{pg(it[1]):02d}</p><p style="flex:1;font-size:24px">{SHORT[it[1]]}</p></div>'
        return f'<div style="flex:1;display:flex;flex-direction:column">{o}</div>'
    title=title or f'{len(SECTIONS)} 个部分，共 {len(ORDER)} 页。'
    sec(id,head('目录',title,'PDF 版可点击跳转')+f'<div style="display:flex;gap:56px">{"".join(col(c) for c in cols)}</div>',notes,bg=PAPER)
def section_opener(id,cn,title,sub,photo,notes):
    """A3 章节页：中文数字圈 + 标题（可用 <br>）+ 副题；右侧 880px 照片。"""
    sec(id,f'''<img src="{blob(photo)}" alt="章节照片" style="position:absolute;left:1040px;top:0;width:880px;height:1080px;object-fit:cover">
<div style="flex:1"></div>
<div style="width:200px;height:200px;border:2px solid {GOLD};border-radius:50%;display:flex;align-items:center;justify-content:center"><p style="font-size:112px;font-weight:600;line-height:1;color:{GOLD}">{cn}</p></div>
<h2 style="width:840px;font-size:88px;font-weight:600;line-height:1.2;letter-spacing:6px">{title}</h2>
<p style="width:840px;font-size:30px;line-height:1.6;letter-spacing:2px;color:{MUTED}">{sub}</p>
<div style="flex:1"></div>''',notes,numlight=True)
def exec_summary(id,eb,title,badge,kpis,judgment,actions,notes):
    """A4 执行摘要：kpis=[(数字,标题,说明,目标页id)]×3；judgment=一句判断；actions=[(标题,说明,目标页id)]×3。"""
    fc=''.join(card(f'{bignum(a,56,28)}<p style="font-size:26px;font-weight:600;line-height:1.35">{b}</p>{txt(c,24,BODY,1.5)}'+(ref_line(t) if t else '')) for a,b,c,t in kpis)
    ac=''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:6px;padding:4px 0 4px 20px;border-left:3px solid {GOLD}"><p style="font-size:28px;font-weight:600">{a}</p>{txt(b,24,BODY,1.5)}'+(ref_line(t) if t else '')+'</div>' for a,b,t in actions)
    page(id,eb,title,f'<div style="display:flex;gap:24px">{fc}</div>{callout("判断",judgment,dark=True)}<div style="display:flex;gap:32px">{ac}</div>',notes,badge,bg=PAPER)
def closing(id,ask,contact_line,notes,qr='qr'):
    """A5 收尾页：下一步请求 + 网址 + 二维码。"""
    sec(id,f'''<div style="flex:1;display:flex;gap:96px;align-items:center">
<div style="flex:1;display:flex;flex-direction:column;gap:30px">
<div style="display:flex;align-items:center;gap:24px"><img src="{blob('seal')}" alt="侍天印章" style="width:112px;height:112px;object-fit:contain"><p style="font-family:{EN};font-size:32px;letter-spacing:11px">{wm()}</p></div>
<p style="font-size:26px;letter-spacing:8px;color:{GOLD}">下一步</p>
<h2 style="font-size:80px;font-weight:600;line-height:1.25;letter-spacing:6px">拍板之前，<br>问侍天。</h2>
{txt(ask,28,BODY,1.6,'width:960px')}
<p style="font-family:{EN};font-size:34px;letter-spacing:2px;color:{GOLD}">{contact_line}</p></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:20px;background:{PAPER};border:1px solid {CARD};border-radius:2px;padding:40px"><img src="{blob(qr)}" alt="侍天微信二维码" style="width:360px;height:360px;object-fit:contain"><p style="font-size:26px;letter-spacing:4px;color:{BODY}">微信扫码联系侍天</p></div>
</div>''',notes,gap=40)
# ================= B 论证页 =================
def kpi_cards(id,eb,title,badge,kpis,notes,callout_=None,bg=SURF,badge_target=None):
    """B1 大数字卡：kpis=[(数字,标题,说明)] 3–5 张。"""
    c=''.join(card(f'<p style="font-size:24px;color:{MUTED}">{b}</p>{bignum(a,56)}<p style="font-size:24px;line-height:1.45;color:{BODY}">{d}</p>') for a,b,d in kpis)
    page(id,eb,title,f'<div style="display:flex;gap:24px">{c}</div>'+(callout(*callout_) if callout_ else ''),notes,badge,bg,badge_target=badge_target)
def two_lists(id,eb,title,badge,left,right,notes,side=None,callout_=None,labels=('能','否')):
    """B2 两栏对照：left/right=(栏名,[条目]) 每栏 ≤ 6 条；side=(栏名,HTML) 可选第三栏。"""
    def lst(name,items,c,l): return f'<div style="flex:1;display:flex;flex-direction:column">{colhead(name)}'+''.join(f'<div style="display:flex;gap:14px;align-items:baseline;padding:10px 0;border-bottom:1px solid {LINE}"><p style="font-size:24px;color:{c};white-space:nowrap">{l}</p><p style="font-size:26px;line-height:1.4">{t}</p></div>' for t in items)+'</div>'
    s=f'<div style="width:520px;display:flex;flex-direction:column;gap:12px">{colhead(side[0])}{side[1]}</div>' if side else ''
    page(id,eb,title,f'<div style="display:flex;gap:48px">{lst(left[0],left[1],GROW,labels[0])}{lst(right[0],right[1],SEAL,labels[1])}{s}</div>'+(callout(*callout_) if callout_ else ''),notes,badge)
def steps(id,eb,title,badge,items,notes,footer_blocks=None,highlight_last=True):
    """B3 步骤卡：items=[(中文序号,名称,做什么,产出)] 3–5 步；footer_blocks=[(标题,说明)] ≤ 3。"""
    n=len(items)
    mc=''.join(f'''<div style="flex:1;display:flex;flex-direction:column;gap:12px;background:{INK if (highlight_last and i==n-1) else PAPER};border:1px solid {GOLD if (highlight_last and i==n-1) else CARD};border-radius:2px;padding:20px 22px">
{circ(a,56,26)}<p style="font-size:30px;font-weight:600">{b}</p><p style="font-size:24px;line-height:1.45;color:{BODY}">{c}</p><div style="flex:1"></div><p style="font-size:24px;color:{GOLD};border-top:1px solid {LINE};padding-top:10px">{d}</p></div>''' for i,(a,b,c,d) in enumerate(items))
    fb=''
    if footer_blocks: fb='<div style="display:flex;gap:32px">'+''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:6px;padding:4px 0 4px 20px;border-left:3px solid {GOLD}"><p style="font-size:26px;font-weight:600">{a}</p><p style="font-size:24px;line-height:1.5;color:{BODY}">{b}</p></div>' for a,b in footer_blocks)+'</div>'
    page(id,eb,title,f'<div style="display:flex;gap:18px;align-items:stretch">{mc}</div>{fb}',notes,badge,gap=30)
def quadrant(id,eb,title,badge,quads,notes,side_html='',side_title='读法',top=5):
    """B4 四格矩阵：quads=[(格名,动作,颜色,[(项,数值文字,是否重点)], 本格总数可省)]×4。
    每格显示前 top 项（默认 5，调用方先排序），四格连续编号，编号对应明细表；
    本格不足 top 项时注明实际数量，超过时注明其余项数见明细。"""
    seq=[0]
    def q(t,act,c,items,total=None):
        total=len(items) if total is None else total
        li=''
        for a,b,r in items[:top]:
            seq[0]+=1
            li+=f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:6px 0;border-bottom:1px solid {LINE}"><p style="font-size:26px;{"font-weight:600;color:"+SEAL if r else ""}"><span style="color:{GOLD}">{seq[0]}</span>　{a}</p><p style="font-family:{MONO};font-size:24px;color:{MUTED}">{b}</p></div>'
        shown=min(total,top,len(items))
        if total<top:
            li+=f'<p style="font-size:24px;color:{MUTED}">本象限共 {total} 项</p>'
        elif total>shown:
            li+=f'<p style="font-size:24px;color:{MUTED}">另 {total-shown} 项见明细</p>'
        return f'<div style="display:flex;flex-direction:column;gap:6px;background:{PAPER};border:1px solid {c};border-top:4px solid {c};border-radius:2px;padding:16px 22px"><div style="display:flex;justify-content:space-between;align-items:baseline"><p style="font-size:28px;font-weight:600">{t}</p><p style="font-size:24px;color:{c};border:1px solid {c};border-radius:999px;padding:0 14px">{act}</p></div>{li}</div>'
    page(id,eb,title,f'<div style="display:flex;gap:40px"><div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:18px">{"".join(q(*x) for x in quads)}</div><div style="width:440px;display:flex;flex-direction:column;gap:14px">{colhead(side_title)}{side_html}</div></div>',notes,badge)
def quotes(id,eb,title,badge,stats,quotes_,context,notes):
    """B5 引语页：stats=[(数字,标题,说明)] ≤ 3；quotes_=[(原话,出处)] ≤ 3；context=[段落] 外部背景。"""
    sc=''.join(card(f'<p style="font-size:24px;color:{MUTED}">{b}</p>{bignum(a,56)}<p style="font-size:24px;color:{BODY}">{c}</p>') for a,b,c in stats)
    qc=''.join(f'<div style="display:flex;flex-direction:column;gap:8px;padding:6px 0 6px 22px;border-left:3px solid {SEAL}"><p style="font-size:28px;line-height:1.45">{a}</p><p style="font-size:24px;color:{MUTED}">{b}</p></div>' for a,b in quotes_)
    cx=''.join(f'<p style="font-size:24px;line-height:1.55;color:{BODY}">{p}</p>' for p in context)
    page(id,eb,title,f'<div style="display:flex;gap:24px">{sc}</div><div style="display:flex;gap:48px"><div style="flex:1;display:flex;flex-direction:column;gap:20px">{qc}</div><div style="width:700px;display:flex;flex-direction:column;gap:12px">{colhead("外部背景")}{cx}</div></div>',notes,badge)
def roadmap(id,eb,title,badge,stages,phases,principle,notes):
    """B6 阶段路线：stages=[(阶段,状态,说明,颜色)] 4 个；phases=[(时间,名称,说明)] 3 段；principle=一句原则。"""
    sc=''
    for i,(a,b,c,col) in enumerate(stages):
        sc+=f'<div style="flex:1;display:flex;flex-direction:column;gap:8px;background:{INK if col==SEAL else PAPER};border:1px solid {col};border-top:4px solid {col};border-radius:2px;padding:18px 20px"><p style="font-size:30px;font-weight:600">{a}</p><p style="font-size:24px;color:{col}">{b}</p><p style="font-size:24px;line-height:1.45;color:{BODY}">{c}</p></div>'
        if i<len(stages)-1: sc+=f'<div style="width:36px;display:flex;align-items:center;justify-content:center"><x-shape kind="arrow-right" style="width:32px;height:18px;background:{BENCH}"></x-shape></div>'
    ph=''.join(f'<div style="flex:1;display:flex;flex-direction:column;gap:6px;padding:4px 0 4px 20px;border-left:3px solid {GOLD}"><p style="font-family:{MONO};font-size:24px;color:{GOLD}">{a}</p><p style="font-size:28px;font-weight:600">{b}</p><p style="font-size:24px;line-height:1.5;color:{BODY}">{c}</p></div>' for a,b,c in phases)
    page(id,eb,title,f'<div style="display:flex;align-items:stretch">{sc}</div><div style="display:flex;gap:32px">{ph}</div>{callout("原则",principle)}',notes,badge,gap=28)
def process_flow(id,eb,title,badge,nodes,records,standard,notes,alert_index=None):
    """B7 流程案例：nodes=[(时间,事件,说明)] 3–5 个；records=[(标签,说明)] ≤ 4；standard=(标题,正文,注)。"""
    st=''
    for i,(t,a,b) in enumerate(nodes):
        c=SEAL if i==alert_index else GOLD
        st+=f'<div style="flex:1;display:flex;flex-direction:column;gap:8px;padding:18px 20px;background:{PAPER};border:1px solid {c};border-top:4px solid {c};border-radius:2px"><p style="font-family:{MONO};font-size:36px;color:{c}">{t}</p><p style="font-size:28px;font-weight:600">{a}</p><p style="font-size:24px;color:{BODY}">{b}</p></div>'
        if i<len(nodes)-1: st+=f'<div style="width:40px;display:flex;align-items:center;justify-content:center"><x-shape kind="arrow-right" style="width:36px;height:18px;background:{BENCH}"></x-shape></div>'
    rc=''.join(f'<div style="display:flex;gap:18px;align-items:baseline;padding:10px 0;border-bottom:1px solid {LINE}"><p style="width:270px;font-size:26px;font-weight:600;color:{SEAL}">{a}</p><p style="flex:1;font-size:24px;line-height:1.4">{b}</p></div>' for a,b in records)
    page(id,eb,title,f'''<div style="display:flex;align-items:stretch">{st}</div><div style="display:flex;gap:48px"><div style="flex:1;display:flex;flex-direction:column">{colhead('同类记录')}{rc}</div>
<div style="width:560px;display:flex;flex-direction:column;gap:10px">{colhead(standard[0])}<p style="font-size:26px;line-height:1.5">{standard[1]}</p><p style="font-size:24px;line-height:1.5;color:{MUTED}">{standard[2]}</p></div></div>''',notes,badge)
# ================= C 数据页 =================
def vbars(id,eb,title,badge,bars,notes,chart_title,side_title=None,side_html='',max_v=None,hl=None,height=330,unit=''):
    """C1 竖柱趋势：bars=[(标签,数值,副标签)] ≤ 8；hl=要用朱红强调的标签。"""
    mx=max_v or max(v for _,v,_ in bars)*1.1
    b=''.join(f'''<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px"><p style="font-family:{MONO};font-size:30px;color:{SEAL if l==hl else CHAR}">{v:g}{unit}</p>
<div style="width:96px;height:{round(v/mx*height)}px;background:{SEAL if l==hl else G300}"></div><p style="font-size:26px;font-weight:600">{l}</p><p style="font-size:24px;color:{MUTED}">{s}</p></div>''' for l,v,s in bars)
    side=f'<div style="flex:1;display:flex;flex-direction:column;gap:14px">{colhead(side_title)}{side_html}</div>' if side_title else ''
    page(id,eb,title,f'<div style="display:flex;gap:64px"><div style="width:{760 if side else 1664}px;display:flex;flex-direction:column;gap:14px">{colhead(chart_title)}<div style="height:{height+140}px;display:flex;align-items:flex-end;gap:12px">{b}</div></div>{side}</div>',notes,badge)
def hbar_list(id,eb,title,badge,panels,notes,legend_note=None):
    """C2 横条排名：panels=[(栏名,[(标签,数值,是否强调)],栏宽权重)] 1–3 栏，每栏 ≤ 12 行，已按数值排序。"""
    tot=sum(p[2] for p in panels); cols=''
    for name,rows,wt in panels:
        mx=max(v for _,v,_ in rows); w=round((1664-48*(len(panels)-1))*wt/tot)
        lw=max(110,min(260,int(max(len(l) for l,_,_ in rows)*26)))
        cols+=f'<div style="width:{w}px;display:flex;flex-direction:column;gap:9px">{colhead(name)}'+''.join(hbar(l,v,mx,max(120,w-lw-110),SEAL if e else G300,f'{v:g}',lw=lw) for l,v,e in rows)+'</div>'
    ln=f'<div style="display:flex;align-items:center;gap:12px"><div style="width:22px;height:18px;background:{SEAL}"></div><p style="font-size:24px;color:{BODY}">{legend_note}</p></div>' if legend_note else ''
    page(id,eb,title,f'<div style="display:flex;gap:48px">{cols}</div>{ln}',notes,badge,gap=24)
def paired_bars(id,eb,title,badge,names,rows,notes,unit='%',side_title=None,side_html='',scale=16,hl=()):
    """C3 分组对比：names=(A名,B名)；rows=[(指标,A值,B值)] ≤ 8；hl=要强调的指标。"""
    r=''
    for k,a,b in rows:
        h=k in hl
        r+=(f'<div style="display:flex;align-items:center;gap:14px;padding:4px 0"><p style="width:150px;font-size:24px;{"font-weight:600" if h else ""}">{k}</p>'
            f'<div style="display:flex;flex-direction:column;gap:3px"><div style="display:flex;align-items:center;gap:10px"><div style="width:{round(a*scale)}px;height:18px;background:{SEAL if h else G500}"></div><p style="font-family:{MONO};font-size:24px">{a:.1f}{unit}</p></div>'
            f'<div style="display:flex;align-items:center;gap:10px"><div style="width:{round(b*scale)}px;height:18px;background:{BENCH}"></div><p style="font-family:{MONO};font-size:24px;color:{MUTED}">{b:.1f}{unit}</p></div></div></div>')
    side=f'<div style="width:560px;display:flex;flex-direction:column;gap:10px">{colhead(side_title)}{side_html}</div>' if side_title else ''
    page(id,eb,title,f'{legend([(names[0],G500),(names[1],BENCH)])}<div style="display:flex;gap:56px"><div style="flex:1;display:flex;flex-direction:column;gap:4px">{colhead("指标占比")}{r}</div>{side}</div>',notes,badge,gap=22)
def diverging(id,eb,title,badge,rows,notes,labels=('被称赞','被批评'),hl=(),foot=None):
    """C4 双向条：rows=[(名称,正,负,合计)] ≤ 14，按 正−负 排序。"""
    mx=max(max(p,n) for _,p,n,_ in rows); out=''
    for nm,p,n,t in rows:
        out+=(f'<div style="display:flex;align-items:center"><div style="width:420px;display:flex;justify-content:flex-end;align-items:center;gap:10px"><p style="font-family:{MONO};font-size:24px;color:{BODY}">{p}</p><div style="width:{max(2,round(p/mx*330))}px;height:20px;background:{GROW}"></div></div>'
              f'<p style="width:250px;text-align:center;font-size:24px;{"font-weight:600;color:"+SEAL if nm in hl else ""}">{nm}</p>'
              f'<div style="width:420px;display:flex;align-items:center;gap:10px"><div style="width:{max(2,round(n/mx*330))}px;height:20px;background:{SEAL}"></div><p style="font-family:{MONO};font-size:24px;color:{BODY}">{n}</p></div>'
              f'<p style="flex:1;text-align:right;font-family:{MONO};font-size:24px;color:{MUTED}">{t}</p></div>')
    hd=f'<div style="display:flex;align-items:center"><p style="width:420px;text-align:right;font-size:24px;color:{GROW}">{labels[0]}</p><p style="width:250px;text-align:center;font-size:24px;color:{MUTED}">项目</p><p style="width:420px;font-size:24px;color:{SEAL}">{labels[1]}</p><p style="flex:1;text-align:right;font-size:24px;color:{MUTED}">合计</p></div>'
    page(id,eb,title,f'{hd}<div style="display:flex;flex-direction:column;gap:7px">{out}</div>'+(note(foot) if foot else ''),notes,badge,gap=18)
def small_multiples(id,eb,title,badge,panels,notes,foot=None,scale=15,unit='%'):
    """C5 小倍数：panels=[(名称,来源,[(标签,数值)],一句对应)] 2–4 个；最后一个值用朱红。"""
    cards=''
    for n,src,vals,rel in panels:
        mb=''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><p style="font-family:{MONO};font-size:26px;color:{SEAL if i==len(vals)-1 else BODY}">{v:g}{unit}</p><div style="width:72px;height:{round(v*scale)}px;background:{SEAL if i==len(vals)-1 else G300}"></div><p style="font-size:24px;color:{MUTED}">{l}</p></div>' for i,(l,v) in enumerate(vals))
        cards+=card(f'<div style="display:flex;align-items:baseline;justify-content:space-between"><p style="font-size:32px;font-weight:600">{n}</p><p style="font-size:24px;color:{MUTED}">{src}</p></div><div style="height:340px;display:flex;align-items:flex-end;gap:8px">{mb}</div><p style="font-size:24px;color:{GOLD};border-top:1px solid {LINE};padding-top:10px">{rel}</p>',gap=14)
    page(id,eb,title,f'<div style="display:flex;gap:24px">{cards}</div>'+(note(foot) if foot else ''),notes,badge,gap=24)
def ratio_bars(id,eb,title,badge,chart_title,rows,notes,threshold=None,side_cards=()):
    """C6 比例条：rows=[(名称,条数,比例%,标注)] ≤ 14；比例 ≥ threshold 用朱红；side_cards=[HTML]。"""
    r=''
    for a,n,v,tag in rows:
        c=SEAL if threshold is not None and v>=threshold else G300
        r+=(f'<div style="display:flex;align-items:center;gap:14px"><p style="width:170px;font-size:24px;white-space:nowrap">{a}</p><div style="width:{round(v*9)}px;height:20px;background:{c}"></div>'
            f'<p style="width:90px;font-family:{MONO};font-size:24px">{v:.0f}%</p><p style="width:110px;font-family:{MONO};font-size:24px;color:{MUTED}">{n} 条</p><p style="font-size:24px;color:{GOLD}">{tag}</p></div>')
    sc=''.join(side_cards)
    page(id,eb,title,f'<div style="display:flex;gap:48px"><div style="flex:1;display:flex;flex-direction:column;gap:8px">{colhead(chart_title)}{r}</div><div style="width:440px;display:flex;flex-direction:column;gap:18px">{sc}</div></div>',notes,badge,gap=24)
def heat_table(id,eb,title,badge,cols,rows,notes,fmt='{:.0f}%',max_v=None,col_title='项目',foot=None):
    """C7 热力表：cols=[列名] ≤ 8；rows=[(行名,[值])] ≤ 10；单元格按值深浅着色（金阶）。"""
    mx=max_v or max(v for _,vs in rows for v in vs if v is not None)
    ramp=[(0.0,P100),(0.2,G100),(0.45,G300),(0.7,G500),(0.9,G700)]
    def col(v):
        if v is None: return P100,MUTED
        c=[x for t,x in ramp if v/mx>=t][-1]; return c,(PAPER if v/mx>=0.7 else CHAR)
    cw=round((1664-260-8*len(cols))/len(cols))
    hd=f'<div style="display:flex;gap:8px;align-items:flex-end"><p style="width:260px;font-size:24px;color:{MUTED}">{col_title}</p>'+''.join(f'<p style="width:{cw}px;text-align:center;font-size:24px;font-weight:600">{c}</p>' for c in cols)+'</div>'
    rr=''.join(f'<div style="display:flex;gap:8px;align-items:center"><p style="width:260px;font-size:24px">{nm}</p>'+''.join((lambda bg_fg:f'<p style="width:{cw}px;text-align:center;font-family:{MONO};font-size:24px;padding:10px 0;background:{bg_fg[0]};color:{bg_fg[1]}">{"—" if v is None else fmt.format(v)}</p>')(col(v)) for v in vs)+'</div>' for nm,vs in rows)
    page(id,eb,title,f'<div style="display:flex;flex-direction:column;gap:8px">{hd}{rr}</div>'+(note(foot) if foot else ''),notes,badge,gap=22)
def timeline(id,eb,title,badge,events,notes,side_title=None,side_bars=None,unit='%'):
    """C8 时间线：events=[(日期,对象,事件)] ≤ 8；side_bars=[(标签,数值,副标签)] 可选侧栏小柱图（最后一根朱红）。"""
    tl=''.join(f'<div style="display:flex;gap:20px;align-items:flex-start;padding:8px 0;border-bottom:1px solid {LINE}"><p style="width:190px;font-family:{MONO};font-size:24px;color:{GOLD}">{d}</p><p style="width:330px;font-size:24px;font-weight:600;line-height:1.4">{w}</p><p style="flex:1;font-size:24px;line-height:1.4;color:{BODY}">{t}</p></div>' for d,w,t in events)
    side=''
    if side_bars:
        mx=max(v for _,v,_ in side_bars)
        sb=''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><p style="font-family:{MONO};font-size:30px;color:{SEAL if i==len(side_bars)-1 else CHAR}">{v:g}{unit}</p><div style="width:84px;height:{max(4,round(v/mx*300))}px;background:{SEAL if i==len(side_bars)-1 else G300}"></div><p style="font-size:24px;font-weight:600">{l}</p><p style="font-size:24px;color:{MUTED}">{s}</p></div>' for i,(l,v,s) in enumerate(side_bars))
        side=f'<div style="width:440px;display:flex;flex-direction:column;gap:12px">{colhead(side_title)}<div style="height:420px;display:flex;align-items:flex-end;gap:10px">{sb}</div></div>'
    page(id,eb,title,f'<div style="display:flex;gap:48px"><div style="flex:1;display:flex;flex-direction:column">{colhead("时间线")}{tl}</div>{side}</div>',notes,badge,gap=24)
# ================= D 表格页 =================
def table(id,eb,title,badge,header,rows,notes,widths=None,emph_col=None,hl_rows=(),foot=None,bg=SURF,gap=22):
    """D1–D3 表格：header=[列名]；rows=[[单元格]] ≤ 12 行（两行文字的行 ≤ 8）；
    widths=[百分比]；emph_col=用土金色强调的列号；hl_rows=浅金底色的行号。单元格不能设字体或字重。"""
    widths=widths or [round(100/len(header))]*len(header)
    h=f'<tr style="background:{INK}">'+''.join(f'<th style="width:{w}%;text-align:left;color:{GOLD}">{c}</th>' for c,w in zip(header,widths))+'</tr>'
    for i,r in enumerate(rows):
        bgc=f' style="background:{G100}"' if i in hl_rows else (f' style="background:{P100}"' if i%2 else '')
        h+=f'<tr{bgc}>'+''.join(f'<td{" style=color:"+GOLD if j==emph_col else ""}>{c}</td>' for j,c in enumerate(r))+'</tr>'
    page(id,eb,title,f'<table style="font-family:{CN};font-size:24px;color:{CHAR};width:1664px">{h}</table>'+(note(foot) if foot else ''),notes,badge,bg=bg,gap=gap)
def table_pages(id,eb,title,badge,header,rows,notes,per_page=12,**kw):
    """长表分页：每页 per_page 行（两行文字的行宜 ≤ 8），每页重复表头；
    第 2 页起 id 为 「id-2」「id-3」…，眉题加「（续 k/n）」，标题不变。返回各页 id，按顺序放进页序。"""
    chunks=[rows[i:i+per_page] for i in range(0,len(rows),per_page)] or [[]]
    ids=[]
    for k,part in enumerate(chunks,1):
        pid=id if k==1 else f'{id}-{k}'
        table(pid,eb if k==1 else f'{eb}（续 {k}/{len(chunks)}）',title,badge,header,part,notes,**kw)
        ids.append(pid)
    return ids
def list_columns(id,eb,title,badge,columns,notes,foot=None):
    """D4 紧凑清单：columns=[(栏名,[(名称,数值,标记)])] ≤ 3 栏 × 11 行；有标记的行浅金底。"""
    def colm(t,rows):
        o=colhead(t)
        for a,n,m in rows:
            o+=(f'<div style="display:flex;align-items:center;gap:12px;padding:6px 10px;border-bottom:1px solid {LINE}{";background:"+G100 if m else ""}">'
                f'<p style="flex:1;font-size:24px">{a}</p><p style="width:64px;text-align:right;font-family:{MONO};font-size:24px">{n}</p><p style="width:120px;font-size:24px;color:{SEAL}">{m}</p></div>')
        return f'<div style="flex:1;display:flex;flex-direction:column">{o}</div>'
    page(id,eb,title,f'<div style="display:flex;gap:40px">{"".join(colm(*c) for c in columns)}</div>'+(note(foot) if foot else ''),notes,badge,gap=20)
# ================= E 附录页 =================
def glossary(id,eb,title,badge,terms,notes):
    """E1 术语速查：terms=[(术语,定义)] ≤ 12，两栏。"""
    cells=''.join(f'<div style="display:flex;flex-direction:column;gap:6px;padding:12px 0 0;border-top:1px solid {LINE}"><p style="font-size:28px;font-weight:600">{a}</p><p style="font-size:24px;line-height:1.45;color:{BODY}">{b}</p></div>' for a,b in terms)
    page(id,eb,title,f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">{cells}</div>',notes,badge,bg=PAPER,gap=24)
def sources(id,eb,title,items,notes,foot='门店与顾客昵称不对外展示；顾客原话为节选。'):
    """E2 来源：items=[(来源,内容)] ≤ 10。"""
    sr=''.join(f'<div style="display:flex;gap:24px;align-items:baseline;padding:10px 0;border-bottom:1px solid {LINE}"><p style="width:240px;font-size:24px;font-weight:600;color:{GOLD}">{a}</p><p style="flex:1;font-size:24px;line-height:1.45">{b}</p></div>' for a,b in items)
    page(id,eb,title,f'<div style="display:flex;flex-direction:column">{sr}</div>'+note(foot),notes,None,gap=22)
def team(id,eb,title,people,notes,badge=None):
    """F1 团队页：people=[(图片键,姓名,席位头衔,本项目分工)] 4 人。姓名与席位头衔照抄 guidelines/company-intro-v3.md「团队」表。"""
    cards=''.join(card(f'<img src="{blob(k)}" alt="{n}" style="width:354px;height:260px;object-fit:contain;background:{INK};border-radius:2px"><p style="font-size:40px;font-weight:600;letter-spacing:4px">{n}</p>{txt(r.replace(' · ','<br>'),24,GOLD,1.45)}<div style="flex:1"></div>{txt(d,24,BODY,1.5,"padding-top:12px;border-top:1px solid "+LINE)}',gap=12,pad='20px 22px') for k,n,r,d in people)
    page(id,eb,title,f'<div style="flex:1;display:flex;gap:24px">{cards}</div>',notes,badge,gap=28)
