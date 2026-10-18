"""Static brand and renderer rules for any tsk deck: python3 check_deck.py <deck dir>

Reads slides/*.html in deck order (speaker notes excluded) and fails on:
  SIZE      text under 24px                       STYLE   margin / z-index / em / var() in a style
  GAP       two-value gap                          PAD     padding over 256px
  CELL      font or weight on a table cell         REF     「→ 第 N 页」 outside the deck
  EMOJI     emoji                                  ELEMS   more than 200 elements on a slide
  TITLE     page title not a sentence ending in 。 CHAR    more than one charcoal block on a slide
  LABEL     label-page title ends in 。 or exceeds 16 characters
  MISSING   a page in the expected inventory (configure expect / tsk.expect) is not in the deck
  LEXICON   avoided word (赋能 抓手 闭环 …)          VOICE   我们 / 您 in on-screen text
  WORDMARK  footer wordmark missing or single-colour

Pages listed in .tsk.json "exempt" (configure(rule_exempt=[…])) skip LEXICON, VOICE and TITLE —
for pages that quote the rules themselves. Pages in "label" (configure(label_pages=[…])), or every
page when "title_style" is "label", take the LABEL rule instead of TITLE. Exit 1 when anything is
found; the completeness summary prints either way.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from tsk import core  # noqa: E402

AVOID = ('赋能', '抓手', '闭环', '打法', '解决方案', '颠覆', '爆款', '裂变', '数据补全')
TAGS = re.compile(r'<(?:p|div|h1|h2|h3|span|img|table|tr|td|th|x-shape)\b')


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def visible_text(h):
    return re.sub(r'<[^>]+>', '', h)


def check(deck):
    deck = deck.rstrip('/') + '/'
    order = json.loads(read(deck + 'deck.json'))['order']
    meta = json.loads(read(deck + '.tsk.json')) if os.path.isfile(deck + '.tsk.json') else {}
    exempt = set(meta.get('exempt', []))
    nofooter = set(meta.get('nofooter', []))
    label = set(order) if meta.get('title_style') == 'label' else set(meta.get('label', []))
    out = []
    for group, ids in meta.get('expect', {}).items():
        for sid in ids:
            if sid not in order:
                out.append(f'{sid}: MISSING expected in 「{group}」')
    for sid in order:
        h = re.sub(r'<aside>.*?</aside>', '', read(deck + 'slides/' + sid + '.html'), flags=re.S)
        add = lambda code, msg: out.append(f'{sid}: {code} {msg}')  # noqa: E731
        for size in re.findall(r'font-size:(\d+(?:\.\d+)?)px', h):
            if float(size) < 24:
                add('SIZE', f'{size}px')
        for style in re.findall(r'style="([^"]*)"', h):
            if re.search(r'(^|;)\s*margin', style) or 'z-index' in style or re.search(r'\d(\.\d+)?em\b', style) or 'var(' in style:
                add('STYLE', style[:60])
            for gap in re.findall(r'(?:^|;)\s*gap:([^;]+)', style):
                if len(gap.split()) > 1:
                    add('GAP', gap)
            for pad in re.findall(r'padding:([^;]+)', style):
                if any(int(v) > 256 for v in re.findall(r'(\d+)px', pad)):
                    add('PAD', pad)
        for cell in re.findall(r'<t[dh][^>]*style="([^"]*)"', h):
            if 'font-family' in cell or 'font-weight' in cell:
                add('CELL', cell[:60])
        for n in re.findall(r'→ 第 (\d+) 页', h):
            if not 1 <= int(n) <= len(order):
                add('REF', f'page {n} of {len(order)}')
        if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', h.replace('✓', '').replace('✕', '').replace('☐', '')):
            add('EMOJI', '')
        if len(TAGS.findall(h)) > 200:
            add('ELEMS', str(len(TAGS.findall(h))))
        if len(re.findall(r'background:\s*' + re.escape(core.CHAR) + r'\b', h, re.I)) > 1:
            add('CHAR', 'more than one charcoal block')
        if sid not in nofooter and core.wm() not in h:
            add('WORDMARK', 'footer wordmark missing or single-colour')
        if sid in exempt:
            continue
        title = re.search(r'<h2[^>]*>(.*?)</h2>', h, re.S)
        if title and title[0].find('font-size:88px') < 0:
            t = visible_text(title[1]).strip()
            if sid in label:
                if t.endswith('。') or len(t) > 16:
                    add('LABEL', t[:30])
            elif not t.endswith(('。', ']', '］')):
                add('TITLE', t[:30])
        text = visible_text(h)
        for w in AVOID:
            if w in text:
                add('LEXICON', w)
        if '我们' in text or '您' in text:
            add('VOICE', '我们 / 您')
    return out


def main():
    deck = sys.argv[1]
    problems = check(deck)
    for p in problems:
        print('   ', p)
    n = len(json.loads(read(deck.rstrip('/') + '/deck.json'))['order'])
    meta_path = deck.rstrip('/') + '/.tsk.json'
    meta = json.loads(read(meta_path)) if os.path.isfile(meta_path) else {}
    order = set(json.loads(read(deck.rstrip('/') + '/deck.json'))['order'])
    for group, ids in meta.get('expect', {}).items():
        print(f'    completeness 「{group}」: expected {len(ids)}, present {sum(i in order for i in ids)}')
    print(f'check: {n} slides, {len(problems)} problems')
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
