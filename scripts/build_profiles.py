"""Build the co-founder profile pages from people/profiles.json.

    python3 scripts/build_profiles.py            # write the pages
    python3 scripts/build_profiles.py --check    # fail if a page on disk is stale

Outputs, per profile in the library:
    people/profile-<id>.html      完整版 — seven A4 pages, print to PDF as-is
    people/profile-<id>-1p.html   一页版 — one A4 page
and one index, people/profiles.html, which lists the library by category.

Every value the pages print is bound to its path in the profile object with data-bind="…", and the
profile JSON travels inside the page. people/profile-edit.js reads both, so any parameter can be
changed on the page itself, re-applied from a JSON payload (file, paste, ?data=URL, or a
postMessage from a host system), and exported again. Structure comes from this builder; values
can move at run time. See docs/profile-architecture.md.

The build refuses to run when a profile shows more than three auxiliary titles, when a number has
no source, or when a category or source is not declared.
"""
from pathlib import Path
import html as H
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
data_path = root / 'people' / 'profiles.json'
MAX_AUX = 3
CJK = re.compile('[一-鿿]')


def esc(text):
    return H.escape(str(text), quote=True)


def P(*parts):
    """Join path segments into one data-bind path: P("figures.", fig["id"], ".value")."""
    return ''.join(str(p) for p in parts)


def b(path, value, tag='span', cls='', extra=''):
    """A bound scalar: the text node the editor can change, addressed by its path in the profile."""
    c = f' class="{cls}"' if cls else ''
    return f'<{tag} data-bind="{path}"{c}{extra}>{esc(value)}</{tag}>'


def bj(path, items, sep='、', tag='span', cls=''):
    """A bound list rendered joined; the editor splits on the same separator when writing back."""
    c = f' class="{cls}"' if cls else ''
    return f'<{tag} data-bind="{path}" data-join="{esc(sep)}"{c}>{esc(sep.join(items))}</{tag}>'


def load():
    return json.loads(data_path.read_text(encoding='utf-8'))


# ── validation ──────────────────────────────────────────────
def numbers(profile, unique=False):
    """Every number the pages print. With unique, one row per distinct claim for the source table."""
    out = list(profile.get('figures', []))
    for case in profile.get('cases', []):
        out += case.get('results', [])
    out += list(profile.get('trainings', []))
    if not unique:
        return out
    seen, rows = set(), []
    for entry in out:
        label = entry.get('metric') or entry.get('zh') or entry.get('title', '')
        value = entry.get('value') or entry.get('scale') or ''
        key = (label, ''.join(ch for ch in value if ch.isalnum()))
        if key in seen:
            continue
        seen.add(key)
        rows.append(entry)
    return rows


LISTS = ('figures', 'principles', 'capabilities', 'brands', 'services', 'roles', 'education', 'trainings', 'cases')


def validate(data):
    problems = []
    categories, sources = data['categories'], data['sources']
    for profile in data['profiles']:
        who = profile['id']
        shown = [t for t in profile['titles_aux'] if t['show']]
        if len(shown) > MAX_AUX:
            problems.append(f'{who}: {len(shown)} auxiliary titles shown, at most {MAX_AUX}')
        if not profile.get('title_main'):
            problems.append(f'{who}: no main title')
        for entry in numbers(profile):
            if entry.get('grade') not in data['grades']:
                problems.append(f'{who}/{entry.get("id")}: grade {entry.get("grade")} not declared')
            if entry.get('source') not in sources:
                problems.append(f'{who}/{entry.get("id")}: source {entry.get("source")} not declared')
        cap_ids = {c['id'] for c in profile['capabilities']}
        for case in profile['cases']:
            for cid in case.get('capabilities', []):
                if cid not in cap_ids:
                    problems.append(f'{who}/{case["id"]}: capability {cid} not in this profile')
        ids = []
        for key in LISTS:
            for entry in profile.get(key, []):
                ids.append(entry.get('id'))
                if entry.get('type') not in categories:
                    problems.append(f'{who}/{entry.get("id")}: category {entry.get("type")} not in the vocabulary')
                if not entry.get('id'):
                    problems.append(f'{who}: an entry under {key} has no id, so it cannot be addressed')
        dup = {i for i in ids if i and ids.count(i) > 1}
        if dup:
            problems.append(f'{who}: duplicate entry ids ' + ', '.join(sorted(dup)))
        if profile.get('source') not in sources:
            problems.append(f'{who}: profile source {profile.get("source")} not declared')
    return problems


# ── fragments ───────────────────────────────────────────────
def head(title, css_depth='../'):
    return f"""<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<link rel="stylesheet" href="{css_depth}brand/fonts.css">
<link rel="stylesheet" href="{css_depth}brand/tokens.css">
<link rel="stylesheet" href="{css_depth}brand/base.css">
<link rel="stylesheet" href="{css_depth}brand/components.css">
<link rel="stylesheet" href="profile.css">
</head>
<body>
<!-- Generated by scripts/build_profiles.py from people/profiles.json. Edit the data, not this file. -->
<a class="ts-skip" href="#top">跳到正文</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><pattern id="pgrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0v30" fill="none" stroke="currentColor" stroke-width="1"/></pattern></defs></svg>"""


GRID = '<svg class="grid" aria-hidden="true"><rect width="100%" height="100%" fill="url(#pgrid)"/></svg>'


def embedded(profile, data):
    payload = {'schema': data['schema'], 'version': data['version'], 'issued': data['issued'],
               'branding': data['branding'], 'grades': data['grades'], 'sources': data['sources'],
               'categories': data['categories'], 'profile': profile}
    text = json.dumps(payload, ensure_ascii=False).replace('</', '<\\/')
    return f'<script type="application/json" id="ts-profile-data">{text}</script>'


def backstage(profile, data, kind, other_href, other_label):
    boxes = ''.join(
        f'<label class="ts-tag"><input type="checkbox" data-aux="{i}"{" checked" if t["show"] else ""}> {b(P("titles_aux.", i, ".zh"), t["zh"])}</label>'
        for i, t in enumerate(profile['titles_aux']))
    return f"""<div class="backstage" role="region" aria-label="后台">
  <div class="ts-container">
    <div class="row">
      <span class="ts-caption">后台 · {esc(kind)}</span>
      <div class="tools">
        <button class="ts-button ts-button-sm" type="button" id="bs-edit" aria-pressed="false">编辑参数</button>
        <button class="ts-button ts-button-sm ts-button-secondary" type="button" id="bs-import">导入 JSON</button>
        <button class="ts-button ts-button-sm ts-button-secondary" type="button" id="bs-export">导出 JSON</button>
        <button class="ts-button ts-button-sm ts-button-secondary" type="button" id="bs-pdf">导出 PDF</button>
        <button class="ts-button ts-button-sm ts-button-quiet" type="button" id="bs-reset">复位</button>
        <span class="sep"></span>
        <span class="ts-caption">辅助职务 ≤ 3</span>{boxes}<span class="over" hidden>已超过 3 个</span>
        <span class="sep"></span>
        <a href="{esc(other_href)}">{esc(other_label)}</a>
        <a href="profiles.html">履历库</a>
      </div>
    </div>
    <p class="hint" id="bs-status">编辑模式：页面上每个带虚线的值都可直接修改。改动只在本页；导出 JSON 后写回 people/profiles.json 并重新构建即为正式版本。</p>
  </div>
  <dialog class="ts-dialog" id="bs-dialog" aria-labelledby="bs-dialog-title">
    <span class="ts-caption">JSON</span>
    <h2 id="bs-dialog-title" style="margin-top:var(--space-2)">导入或复制</h2>
    <p class="ts-small ts-muted">粘贴一个 profile 对象或整个 profiles.json（按 id 取本人），或选择文件。导出时此处为当前状态。</p>
    <textarea class="ts-textarea" id="bs-json" rows="12" aria-label="JSON" style="width:100%;font-family:var(--font-mono);font-size:12px"></textarea>
    <div class="actions">
      <label class="ts-button ts-button-quiet" style="cursor:pointer"><input type="file" accept="application/json" id="bs-file" class="ts-visually-hidden"> 选择文件</label>
      <button class="ts-button ts-button-quiet" type="button" data-close>关闭</button>
      <button class="ts-button" type="button" id="bs-apply">应用</button>
    </div>
  </dialog>
</div>"""


def mark(data):
    return f'<span class="mark"><img src="{esc(data["branding"]["logo"])}" alt="" data-bind-src="branding.logo"></span>'


def cobrand_slot(profile, data):
    logo = profile.get('cobrand', {}).get('logo') or ''
    label = profile.get('cobrand', {}).get('label') or data['branding']['cobrand_label']
    inner = (f'<img src="{esc(logo)}" alt="{esc(label)}" data-bind-src="cobrand.logo">' if logo
             else f'<span class="slot-label" data-bind="cobrand.label" data-placeholder="{esc(label)}">{esc(profile.get("cobrand", {}).get("label", ""))}</span>')
    return f'<div class="logo-slot" data-slot="cobrand">{inner}</div>'


def doc_head(profile, data, slot=False):
    right = (cobrand_slot(profile, data) if slot else '') + f'<span class="ts-caption">{b("en", profile["en"])} PROFILE</span>'
    return (f'<div class="doc-head"><div class="lockup">{mark(data)}<span class="ts-caption">'
            f'<span data-bind="branding.wordmark">{esc(data["branding"]["wordmark"])}</span> ｜ '
            f'<span data-bind="branding.alliance">{esc(data["branding"]["alliance"])}</span></span></div>'
            f'<div class="right">{right}</div></div>')


def doc_foot(profile, data, no, total):
    return (f'<div class="doc-foot">{b("keywords", profile["keywords"], cls="keywords")}'
            f'<span class="brand">{mark(data)}<span data-bind="branding.wordmark">{esc(data["branding"]["wordmark"])}</span></span>'
            f'<span class="no">{no:02d} / {total:02d}</span></div>')


def sec(title, caption):
    return f'<div class="sec"><div class="t"><h2>{title}</h2><span class="ts-caption">{esc(caption)}</span></div><span class="rule"></span></div>'


def figure_block(fig):
    unit = f'<small>{b(P("figures.", fig["id"], ".unit"), fig.get("unit", ""))}</small>'
    return (f'<div class="fig" data-figure="{esc(fig["id"])}"><span class="v">{b(P("figures.", fig["id"], ".value"), fig["value"])}{unit}</span>'
            f'{b(P("figures.", fig["id"], ".label"), fig["label"], cls="l")}{b(P("figures.", fig["id"], ".zh"), fig["zh"], cls="n")}</div>')


def portrait(profile):
    photo = root / 'people' / profile['photo']
    if photo.is_file():
        return f'<div class="portrait"><img src="{esc(profile["photo"])}" alt="{esc(profile["name"])}" data-bind-src="photo"></div>'
    return f'<div class="portrait"><span class="placeholder">肖像待补<br>{b("photo", profile["photo"])}</span></div>'


def aux_slot(profile):
    shown = [t for t in profile['titles_aux'] if t['show']][:MAX_AUX]
    return '<div class="aux" data-aux-slot>' + ''.join(f'<span>{esc(t["zh"])}</span>' for t in shown) + '</div>'


def cover(profile, data, total):
    figs = ''.join(figure_block(f) for f in profile['figures'])
    return f"""<section class="page cover" id="cover">
  {GRID}
  {doc_head(profile, data, slot=True)}
  <div class="cover-body">
    <div class="panel ts-ground-charcoal">
      {portrait(profile)}
      <div class="figures">{figs}</div>
    </div>
    <div class="cover-text">
      {b("domain", profile["domain"], cls="domain")}
      <h1>{b("name", profile["name"])}</h1>
      {b("en", profile["en"], cls="en-name")}
      <div class="titles">
        {b("title_main", profile["title_main"], cls="main")}
        {aux_slot(profile)}
      </div>
      <p class="bio">{b("lede", profile["lede"])}</p>
    </div>
  </div>
  {doc_foot(profile, data, 1, total)}
</section>"""


def timeline_row(path, when, title, org, note):
    return (f'<div class="row"><span class="when">{b(path + ".period", when)}</span>'
            f'<div class="what"><h3>{b(path + ".title", title)}</h3><span class="org">{b(path + ".org", org)}</span>'
            f'<p>{b(path + ".note", note)}</p></div></div>')


def page_profile(profile, data, total):
    prose = ''.join(f'<p>{b(P("summary.", i), t)}</p>' for i, t in enumerate(profile['summary']))
    principles = ''.join(
        f'<div class="dark-card ts-ground-charcoal"><h3>{b(P("principles.", x["id"], ".title"), x["title"])}</h3><p>{b(P("principles.", x["id"], ".body"), x["body"])}</p></div>'
        for x in profile['principles'])
    rows = ''.join(timeline_row(P('roles.', r['id']), r.get('period', ''), r['title'], r['org'], r.get('note', ''))
                   for r in profile.get('roles', []))
    for e in profile.get('education', []):
        rows += timeline_row(P('education.', e['id']), e.get('period', ''), e['title'], e.get('org', ''), e.get('note', ''))
    for e in profile.get('trainings', []):
        detail = ' · '.join(b(P('trainings.', e['id'], '.', key), e[key]) for key in ('role', 'scale', 'region') if e.get(key))
        rows += (f'<div class="row"><span class="when">{b(P("trainings.", e["id"], ".period"), e.get("period", ""))}</span>'
                 f'<div class="what"><h3>{b(P("trainings.", e["id"], ".title"), e["title"])}</h3><span class="org">{b(P("trainings.", e["id"], ".org"), e.get("org", ""))}</span>'
                 f'<p>{detail}</p></div></div>')
    return f"""<section class="page" id="profile">
  {GRID}
  {doc_head(profile, data)}
  {sec("个人简介", "Profile")}
  <div class="prose">{prose}</div>
  {sec("全案经验", "Operating principles")}
  <div class="cards-3">{principles}</div>
  {sec("履历", "Roles, education and training")}
  <div class="timeline">{rows}</div>
  {doc_foot(profile, data, 2, total)}
</section>"""


def page_portfolio(profile, data, total):
    if profile.get('brands'):
        caption = 'Brand portfolio'
        groups = ''.join(
            f'<div class="tile"><h3>{b(P("brands.", g["id"], ".group"), g["group"])}</h3><p>{bj(P("brands.", g["id"], ".items"), g["items"])}</p></div>'
            for g in profile['brands'])
    else:
        caption = 'Service portfolio'
        groups = ''.join(
            f'<div class="tile"><h3>{b(P("services.", x["id"], ".group"), x["group"])}</h3><p>{b(P("services.", x["id"], ".body"), x["body"])}</p></div>'
            for x in profile['services'])
    caps = ''.join(
        f'<div class="tile"><span class="k">0{i}</span><span class="v">{b(P("capabilities.", c["id"], ".title"), c["title"])}</span></div>'
        for i, c in enumerate(profile['capabilities'], 1))
    return f"""<section class="page" id="portfolio">
  {GRID}
  {doc_head(profile, data)}
  {sec("服务覆盖", caption)}
  <p>{b("portfolio_lede", profile["portfolio_lede"])}</p>
  <div class="tiles">{groups}</div>
  {sec("核心能力", "Capability model")}
  <div class="tiles tiles-5">{caps}</div>
  {doc_foot(profile, data, 3, total)}
</section>"""


def number(text):
    found = re.search(r'[\d.]+', text)
    return float(found.group()) if found else 0.0


def delta_strip(case):
    """Before and after, when the case states both. Recomputed on the page when either value changes."""
    facts = {f['k']: (i, f['v']) for i, f in enumerate(case['facts'])}
    pairs = [(k, k.replace('前', '后')) for k in facts if '前' in k and k.replace('前', '后') in facts]
    if not pairs:
        return ''
    bk, ak = pairs[0]
    (bi, bv), (ai, av) = facts[bk], facts[ak]
    bn, an = number(bv), number(av)
    if not bn or not an:
        return ''
    wide = max(bn, an)
    gain = (an - bn) / bn * 100
    cid = case['id']
    return (f'<div class="delta" data-delta="{esc(cid)}" data-before="cases.{cid}.facts.{bi}.v" data-after="cases.{cid}.facts.{ai}.v">'
            f'<span class="side"><span class="k">{b(P("cases.", cid, ".facts.", bi, ".k"), bk)}</span><span class="v" data-delta-before>{esc(bv)}</span></span>'
            f'<span class="bars"><i data-delta-bar="before" style="width:{bn / wide * 100:.0f}%"></i><i class="after" data-delta-bar="after" style="width:{an / wide * 100:.0f}%"></i></span>'
            f'<span class="side" style="text-align:right"><span class="k">{b(P("cases.", cid, ".facts.", ai, ".k"), ak)}</span><span class="v" data-delta-after>{esc(av)}</span>'
            f'<span class="gain" data-delta-gain>{"+" if gain >= 0 else ""}{gain:.0f}%</span></span></div>')


def page_case(profile, case, data, no, total):
    cid = case['id']
    facts = ''.join(
        f'<div class="tile"><span class="k">{b(P("cases.", cid, ".facts.", i, ".k"), f["k"])}</span><span class="v">{b(P("cases.", cid, ".facts.", i, ".v"), f["v"])}</span></div>'
        for i, f in enumerate(case['facts']))
    results = ''.join(
        f'<div class="r"><span class="m">{b(P("cases.", cid, ".results.", r["id"], ".metric"), r["metric"])}<small>{b(P("cases.", cid, ".results.", r["id"], ".window"), r["window"])} · {b(P("cases.", cid, ".results.", r["id"], ".grade"), r["grade"])}</small></span>'
        f'{b(P("cases.", cid, ".results.", r["id"], ".value"), r["value"], cls="v", extra=(" data-long" if CJK.search(r["value"]) else ""))}</div>'
        for r in case['results'])
    names = {c['id']: c['title'] for c in profile['capabilities']}
    caps = ''.join(f'<span class="ts-badge ts-badge-outline">{b(P("capabilities.", c, ".title"), names[c])}</span>' for c in case.get('capabilities', []))
    src = data['sources'][profile['source']]
    return f"""<section class="page" id="{esc(cid)}">
  {GRID}
  {doc_head(profile, data)}
  <div class="case-band ts-ground-charcoal"><span class="ts-caption">Selected case · 选摘案例</span><h2>{b(P("cases.", cid, ".title"), case["title"])}</h2></div>
  <div class="tiles tiles-4">{facts}</div>
  <div class="cards-2">
    <div class="strategy"><span class="ts-caption">Product strategy · 产品策略</span><p>{b(P("cases.", cid, ".strategy"), case["strategy"])}</p>{delta_strip(case)}</div>
    <div class="result"><span class="ts-caption">Business result · 经营结果</span><div class="results">{results}</div></div>
  </div>
  <div class="case-foot">
    <div><span class="ts-caption">Capabilities exercised · 本案涉及能力</span><div class="strip">{caps}</div></div>
    <p class="note">数字出处：{esc(src["label"])}（{esc(src["kind"])}，{esc(src["date"])}），等级 {esc(src["grade"])}。口径与全部条目见第 {total} 页。</p>
  </div>
  {doc_foot(profile, data, no, total)}
</section>"""


def page_sources(profile, data, no, total):
    rows = ''
    for entry in numbers(profile, unique=True):
        src = data['sources'][entry['source']]
        label = entry.get('metric') or entry.get('zh') or entry.get('title', '')
        value = entry.get('value') or entry.get('scale') or ''
        window = entry.get('window') or entry.get('note') or entry.get('region') or ''
        cat = data['categories'][entry.get('type', 'case')]['zh'] if entry.get('type') in data['categories'] else data['categories']['case']['zh']
        rows += (f'<tr><td>{esc(label)}</td><td class="ts-mono">{esc(value)}</td><td>{esc(window)}</td>'
                 f'<td>{esc(cat)}</td><td><span class="grade">{esc(entry["grade"])}</span></td>'
                 f'<td>{esc(src["kind"])} · {esc(src["date"])}</td></tr>')
    grades = ''.join(f'<div><b class="ts-mono">{esc(k)}</b> {esc(v)}</div>' for k, v in data['grades'].items())
    items = ''.join(f'<li>{esc(i["text"])}</li>' for i in data['open_items'] if i['profile'] in ('*', profile['id']))
    edits = ''.join(f'<li>「{esc(e["from"])}」改为「{esc(e["to"])}」—— {esc(e["why"])}</li>'
                    for e in data['lexicon_edits'] if e['profile'] == profile['id'])
    return f"""<section class="page" id="sources">
  {GRID}
  {doc_head(profile, data)}
  {sec("数据出处与口径", "Sources and definitions")}
  <p style="font-size:9pt">本页列出前面每一个数字的口径、类别、证据等级与出处。出处「{esc(data["sources"][profile["source"]]["label"])}」为本人提供的材料。页面上改动的数值不改变其等级与出处；换了来源，请在 profiles.json 中登记新的 source。</p>
  <div class="grades">{grades}</div>
  <table class="ts-table-ledger sourcetable">
    <thead><tr><th>指标</th><th>数值</th><th>口径 / 窗口</th><th>类别</th><th>等级</th><th>出处</th></tr></thead>
    <tbody>{rows}</tbody>
  </table>
  <div class="cards-2">
    <div class="note-block"><span class="ts-caption">Open items · 待核</span><ul class="notes">{items}</ul></div>
    {'<div class="note-block" data-lexicon-note><span class="ts-caption">Lexicon edits · 语汇调整</span><ul class="notes">' + edits + '</ul></div>' if edits else '<div></div>'}
  </div>
  {doc_foot(profile, data, no, total)}
</section>"""


def render_full(profile, data):
    cases = profile['cases']
    total = 4 + len(cases)
    pages = [cover(profile, data, total), page_profile(profile, data, total), page_portfolio(profile, data, total)]
    pages += [page_case(profile, c, data, 4 + i, total) for i, c in enumerate(cases)]
    pages.append(page_sources(profile, data, total, total))
    title = f'{profile["name"]} {profile["en"]} · {profile["title_main"]} · 完整版 · 侍天 TIANSIGHT'
    return f"""{head(title)}
{embedded(profile, data)}
{backstage(profile, data, "完整版 Full", P("profile-", profile["id"], "-1p.html"), "一页版")}
<main id="top" class="pages">
{chr(10).join(pages)}
</main>
<script src="profile-edit.js"></script>
</body>
</html>
"""


def render_onepage(profile, data):
    figs = ''.join(figure_block(f) for f in profile['figures'])
    caps = ''.join(f'<span class="ts-badge ts-badge-outline">{b(P("capabilities.", c["id"], ".title"), c["title"])}</span>' for c in profile['capabilities'])
    cases = ''
    for case in [c for c in profile['cases'] if 'onepage' in c['show_in']]:
        cid = case['id']
        meta = ' · '.join(b(P('cases.', cid, '.facts.', i, '.v'), f['v']) for i, f in enumerate(case['facts'][:3]))
        items = ''.join(f'<li>{b(P("cases.", cid, ".results.", r["id"], ".metric"), r["metric"])}<b>{b(P("cases.", cid, ".results.", r["id"], ".value"), r["value"])}</b></li>'
                        for r in case['results'][:3])
        cases += f'<div class="c"><h2>{b(P("cases.", cid, ".title"), case["title"])}</h2><span class="meta">{meta}</span><ul>{items}</ul></div>'
    if profile.get('brands'):
        coverage = '服务品牌：' + '、'.join(b(P('brands.', g['id'], '.group'), g['group']) for g in profile['brands'])
    else:
        coverage = '服务覆盖：' + '、'.join(b(P('services.', x['id'], '.group'), x['group']) for x in profile['services'])
    src = data['sources'][profile['source']]
    title = f'{profile["name"]} {profile["en"]} · {profile["title_main"]} · 一页版 · 侍天 TIANSIGHT'
    return f"""{head(title)}
{embedded(profile, data)}
{backstage(profile, data, "一页版 One page", P("profile-", profile["id"], ".html"), "完整版")}
<main id="top" class="pages">
<section class="page onepage" id="onepage">
  {GRID}
  {doc_head(profile, data, slot=True)}
  <div class="hero">
    <div class="panel ts-ground-charcoal">
      {portrait(profile)}
      <div class="figures">{figs}</div>
    </div>
    <div>
      {b("domain", profile["domain"], cls="domain")}
      <h1>{b("name", profile["name"])}</h1>
      {b("en", profile["en"], cls="en-name")}
      <div class="titles">
        {b("title_main", profile["title_main"], cls="main")}
        {aux_slot(profile)}
      </div>
      <p class="bio">{b("lede", profile["lede"])}</p>
      <p style="font-size:8.5pt;margin-top:3mm;line-height:1.65">{b("summary.0", profile["summary"][0])}</p>
    </div>
  </div>
  {sec("核心能力", "Capability model")}
  <div class="strip">{caps}</div>
  {sec("选摘案例", "Selected cases")}
  <div class="cases">{cases}</div>
  <p style="font-size:9pt">{coverage}</p>
  <p class="foot-note">数字口径与出处见完整版第 {4 + len(profile["cases"])} 页。本页数字来源：{esc(src["label"])}（{esc(src["kind"])}，{esc(src["date"])}），等级 {esc(src["grade"])}，客户可见前请逐条确认。</p>
  {doc_foot(profile, data, 1, 1)}
</section>
</main>
<script src="profile-edit.js"></script>
</body>
</html>
"""


def render_index(data):
    cards = ''
    for profile in data['profiles']:
        aux = ' · '.join(t['zh'] for t in profile['titles_aux'] if t['show'])
        counts = {}
        for key in LISTS:
            for entry in profile.get(key, []):
                counts[entry['type']] = counts.get(entry['type'], 0) + 1
        chips = ''.join(f'<span class="ts-badge ts-badge-outline">{esc(data["categories"][c]["zh"])} {n}</span>' for c, n in sorted(counts.items()))
        cards += f'''<article class="ts-card" data-index="{esc(profile["order"])}">
      <span class="ts-caption">{esc(profile["domain"])}</span>
      <h2 class="ts-card-title">{esc(profile["name"])} {esc(profile["en"])}</h2>
      <p class="ts-small"><b>{esc(profile["title_main"])}</b><br>{esc(aux)}</p>
      <p class="ts-small ts-muted">{esc(profile["lede"])}</p>
      <div class="chips" style="margin-top:var(--space-3)">{chips}</div>
      <div class="links" style="margin-top:var(--space-4)">
        <a href="profile-{esc(profile["id"])}.html">完整版</a>
        <a href="profile-{esc(profile["id"])}-1p.html">一页版</a>
      </div>
    </article>'''
    vocab = ''.join(f'<tr><td class="ts-mono">{esc(k)}</td><td>{esc(v["zh"])}</td><td>{esc(v["en"])}</td><td class="ts-small ts-muted">{esc(v["note"])}</td></tr>'
                    for k, v in data['categories'].items())
    grades = ''.join(f'<tr><td class="ts-mono">{esc(k)}</td><td>{esc(v)}</td></tr>' for k, v in data['grades'].items())
    items = ''.join(f'<li>{esc(i["text"])}<span class="ts-small ts-muted">（{esc("全部" if i["profile"] == "*" else i["profile"])}）</span></li>' for i in data['open_items'])
    return f'''{head('联合创始人履历库 · 侍天 TIANSIGHT')}
<main id="top" class="ts-container ts-section">
  <div class="ts-heading">
    <span class="ts-caption">Co-founder profiles · {esc(data["version"])} · {esc(data["issued"])}</span>
    <h1>联合创始人履历库</h1>
    <p class="ts-sub">一份 <code>people/profiles.json</code> 驱动两种版本：完整版七页、一页版一页。每条经历归入下方类别，每个数字带出处与证据等级。主职务统一为「侍天联合创始人」，辅助职务在数据中开关，最多显示三个。页面上每个值都可在后台编辑、以 JSON 导入导出，架构见 <a href="../docs/profile-architecture.md">docs/profile-architecture.md</a>，数据契约见 <a href="profiles.schema.json">profiles.schema.json</a>。</p>
  </div>
  <div class="profile-cards" style="margin-top:var(--space-7)">{cards}</div>
  <div style="margin-top:var(--space-8)">
    <span class="ts-caption">Category vocabulary · 数据类型</span>
    <div class="ts-table-wrap" style="margin-top:var(--space-3)">
      <table class="ts-table-ledger">
        <thead><tr><th>键</th><th>类别</th><th>English</th><th>说明</th></tr></thead>
        <tbody>{vocab}</tbody>
      </table>
    </div>
  </div>
  <div style="margin-top:var(--space-7)">
    <span class="ts-caption">Evidence grades · 证据等级</span>
    <div class="ts-table-wrap" style="margin-top:var(--space-3)">
      <table class="ts-table-ledger">
        <thead><tr><th>等级</th><th>含义</th></tr></thead>
        <tbody>{grades}</tbody>
      </table>
    </div>
  </div>
  <div class="ts-notice ts-notice-warn" style="margin-top:var(--space-7)">
    <span class="ts-caption">待核</span>
    <div><ul style="margin:0;padding-left:1.2em">{items}</ul></div>
  </div>
  <p class="ts-small ts-muted" style="margin-top:var(--space-6)">生成命令：<code>python3 scripts/build_profiles.py</code>。PDF 与单文件：<code>node scripts/export_profiles.mjs</code>。数据源：<code>people/profiles.json</code>。</p>
</main>
</body>
</html>
'''


def outputs(data):
    files = {root / 'people' / 'profiles.html': render_index(data)}
    for profile in data['profiles']:
        files[root / 'people' / f'profile-{profile["id"]}.html'] = render_full(profile, data)
        files[root / 'people' / f'profile-{profile["id"]}-1p.html'] = render_onepage(profile, data)
    return files


def main(check=False):
    data = load()
    problems = validate(data)
    if problems:
        print('FAIL: people/profiles.json')
        for p in problems:
            print(' -', p)
        return 1
    files = outputs(data)
    stale = [p for p, text in files.items() if not p.is_file() or p.read_text(encoding='utf-8') != text]
    if check:
        if stale:
            print('stale: ' + ', '.join(sorted(p.relative_to(root).as_posix() for p in stale)) + ' — run python3 scripts/build_profiles.py')
            return 1
        print(f'profiles are up to date ({len(files)} pages)')
        return 0
    for path, text in files.items():
        path.write_text(text, encoding='utf-8')
    print(f'wrote {len(files)} pages: ' + ', '.join(sorted(p.name for p in files)))
    return 0


if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
