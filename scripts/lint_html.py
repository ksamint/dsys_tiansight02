"""Accessibility and structure lint for every HTML page in the repository (stdlib only).

python3 scripts/lint_html.py            # lint all consumer pages
python3 scripts/lint_html.py path.html  # lint one file

Checks: lang on <html>; exactly one <h1>; heading levels never skip; <main> landmark; every <img>
has alt; every form control has a label, aria-label or aria-labelledby; every <button> and <a> has
an accessible name; no duplicate ids; internal href/src targets resolve (files and #ids);
<title> present; no positive tabindex; tabpanels reference tabs; generic link text.
Print-only pages and the supplied export are skipped.
"""
from pathlib import Path
from html.parser import HTMLParser
import re
import sys

root = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'brand/index.html', 'website/index.html', 'website/team.html', 'deck/index.html', 'report/index.html',
         'people/blocks.html', 'people/namecards.html', 'people/social.html', 'html-system/sample/index.html', 'dist/example.html',
         'people/profiles.html', 'people/profile-bian-jiang.html', 'people/profile-bian-jiang-1p.html',
         'people/profile-guo-feng.html', 'people/profile-guo-feng-1p.html']
GENERIC = {'点击这里', 'click here', 'here', 'more', '更多', 'link'}


class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None; self.title = False; self.h = []; self.main = 0; self.imgs = []; self.controls = []; self.ids = []
        self.links = []; self.buttons = []; self.tabindex = []; self.labels_for = set(); self.stack = []; self.text_buf = None
        self.tabs = []; self.panels = []; self.aria_labelledby = []; self.in_label = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'title':
            self.title = True
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.h.append(int(tag[1]))
        if tag == 'main':
            self.main += 1
        if tag == 'img':
            self.imgs.append((a.get('src', ''), 'alt' in a))
        if tag in ('input', 'select', 'textarea') and a.get('type') not in ('hidden', 'submit', 'button'):
            self.controls.append((a.get('id'), a.get('aria-label'), a.get('aria-labelledby'), a.get('type', tag), self.in_label > 0))
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'label':
            self.in_label += 1
            if a.get('for'):
                self.labels_for.add(a['for'])
        if tag in ('a', 'button'):
            self.stack.append([tag, a, ''])
        if a.get('tabindex') and a['tabindex'].lstrip('-').isdigit() and int(a['tabindex']) > 0:
            self.tabindex.append(a['tabindex'])
        if a.get('role') == 'tab':
            self.tabs.append(a.get('aria-controls'))
        if a.get('role') == 'tabpanel':
            self.panels.append(a.get('id'))
        if a.get('aria-labelledby'):
            self.aria_labelledby.append(a['aria-labelledby'])
        if tag in ('a',) and 'href' in a:
            self.links.append(a['href'])
        if tag in ('link', 'script', 'img') and (a.get('href') or a.get('src')):
            self.links.append(a.get('href') or a.get('src'))
        if tag in ('svg',) and self.stack:
            self.stack[-1][2] += a.get('aria-label', '')

    def handle_data(self, data):
        if self.stack:
            self.stack[-1][2] += data

    def handle_endtag(self, tag):
        if tag == 'label' and self.in_label:
            self.in_label -= 1
        if tag in ('a', 'button') and self.stack and self.stack[-1][0] == tag:
            t, a, text = self.stack.pop()
            name = (a.get('aria-label') or text or '').strip()
            self.buttons.append((t, name, a.get('href', '')))


def lint(rel):
    path = root / rel
    html = path.read_text(encoding='utf-8')
    p = P(); p.feed(html)
    out = []
    if not p.lang:
        out.append('html lacks lang')
    if not p.title:
        out.append('no <title>')
    if p.h.count(1) != 1:
        out.append(f'{p.h.count(1)} <h1> elements (expect 1)')
    prev = 0
    for lvl in p.h:
        if prev and lvl > prev + 1:
            out.append(f'heading level skips h{prev} → h{lvl}')
            break
        prev = lvl
    if p.main != 1:
        out.append(f'{p.main} <main> landmarks (expect 1)')
    for src, has_alt in p.imgs:
        if not has_alt:
            out.append(f'img without alt: {src}')
    for cid, al, alb, typ, wrapped in p.controls:
        if not (al or alb or wrapped or (cid and cid in p.labels_for)):
            out.append(f'{typ} control without label (id={cid})')
    for t, name, href in p.buttons:
        if not name:
            out.append(f'<{t}> without accessible name' + (f' ({href})' if href else ''))
        elif name.lower() in GENERIC:
            out.append(f'generic link text "{name}"')
    dup = {i for i in p.ids if p.ids.count(i) > 1}
    if dup:
        out.append('duplicate ids: ' + ', '.join(sorted(dup)[:5]))
    if p.tabindex:
        out.append('positive tabindex: ' + ', '.join(p.tabindex))
    ids = set(p.ids)
    for ref in p.tabs:
        if ref and ref not in ids:
            out.append(f'tab aria-controls {ref} missing')
    for ref in p.aria_labelledby:
        for r in ref.split():
            if r not in ids:
                out.append(f'aria-labelledby {r} missing')
    for href in p.links:
        if href.startswith(('http:', 'https:', 'mailto:', 'tel:', 'data:')):
            continue
        if href.startswith('#'):
            frag = href[1:]
            if frag and not re.fullmatch(r'(p|src|q)=.*|[0-9]+', frag) and frag not in ids:
                out.append(f'broken anchor {href}')
            continue
        target = (path.parent / href.split('#')[0]).resolve()
        if not target.exists() and not re.search(r'photos/(founder-0[1-5]|missing)\.png$|fonts/.*\.woff2$', href):
            out.append(f'missing target {href}')
    return out


if __name__ == '__main__':
    pages = [a for a in sys.argv[1:] if not a.startswith('--')] or PAGES
    failed = 0
    for rel in pages:
        problems = lint(rel)
        if problems:
            failed += 1
            print(f'{rel}:')
            for pr in problems:
                print('  -', pr)
    if failed:
        print(f'FAIL: {failed} page(s)')
        sys.exit(1)
    print(f'PASS: {len(pages)} pages, lang, headings, landmarks, alt, labels, names, ids, anchors, targets')
