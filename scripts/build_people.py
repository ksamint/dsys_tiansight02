"""Render the co-founder surfaces from people/people.json.

python3 scripts/build_people.py          # write website/team.html, people/blocks.html,
                                         # people/namecards.html, people/social.html and
                                         # the founder slides inside deck/index.html
python3 scripts/build_people.py --check  # exit 1 if any output is stale

Pure stdlib. Blocks use the .ts-portrait / .ts-identity classes from people/people.css.
"""
from pathlib import Path
import html
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
people_dir = root / 'people'
DATA = json.loads((people_dir / 'people.json').read_text())
PEOPLE, GROUP, CO = DATA['people'], DATA['group'], DATA['company']
DECK_START, DECK_END = '<!-- people:start -->', '<!-- people:end -->'


def esc(s):
    return html.escape(str(s), quote=True)


# ── blocks ───────────────────────────────────────────────────────────

def portrait(p, base, size=None, extra=''):
    style = f' style="--portrait:{size}"' if size else ''
    return (f'<span class="ts-portrait{(" " + extra) if extra else ""}"{style} data-label="{esc(p["name"])}">'
            f'<img src="{base["photo"]}{esc(p["photo"])}" alt="{esc(p["name"])}" data-label="{esc(p["name"])}"></span>')


def identity(p, focus=True, en=True):
    return ('<span class="ts-identity"><span class="name">' + esc(p['name']) + '</span>'
            + (f'<span class="en">{esc(p["en"])}</span>' if en else '')
            + f'<span class="title">{esc(p["title"])}</span>'
            + (f'<span class="focus">{esc(p["focus"])}</span>' if focus else '') + '</span>')


def profile_card(p, base):
    c = p['contact']
    return (f'<article class="ts-card ts-profile" data-index="{esc(p["order"])}">{portrait(p, base)}{identity(p)}'
            f'<p>{esc(p["bio"])}</p>'
            f'<div class="contact"><span>{esc(c["wechat"])}</span><span>{esc(c["email"])}</span></div></article>')


def row(p, base):
    return f'<div class="ts-person-row">{portrait(p, base)}{identity(p, en=False)}</div>'


def byline(p, base):
    return f'<span class="ts-byline">{portrait(p, base)}{identity(p, focus=False, en=False)}</span>'


def voice(p, base):
    return (f'<figure class="ts-voice">{portrait(p, base)}<div><blockquote>「{esc(p["quote"])}」</blockquote>'
            f'<footer>{esc(p["name"])} · {esc(p["title"])}</footer></div></figure>')


def signature(p, base):
    return (f'<div class="ts-signature">{byline(p, base)}'
            f'<span class="ts-seal-stamp" style="--stamp-size:40px" aria-hidden="true">侍</span></div>')


def profile_full(p, base):
    c = p['contact']
    return (f'<article class="ts-card ts-profile-full" data-index="{esc(p["order"])}">'
            f'{portrait(p, base, "200px")}<div class="ts-stack">{identity(p)}<p style="margin:0">{esc(p["bio"])}</p>'
            f'<blockquote class="ts-quote" style="font-size:1.0625rem;padding:var(--space-2) 0 var(--space-2) var(--space-5)">「{esc(p["quote"])}」</blockquote>'
            f'<div class="ts-mono ts-muted" style="font-size:var(--text-caption)">{esc(c["wechat"])} · {esc(c["email"])}</div></div></article>')


# ── deck slides ──────────────────────────────────────────────────────

def slide_team(base):
    cells = ''.join(f'<div class="ts-stack" style="gap:14px">{portrait(p, base, "100%")}{identity(p)}</div>' for p in PEOPLE)
    return (f'<section class="slide paper" data-label="联合创始人">\n  <span class="ts-caption">{esc(GROUP["en"])} · 团队</span>\n'
            f'  <div class="body" style="gap:28px">\n    <h2>{esc(GROUP["title"])}</h2>\n    <div class="founders">{cells}</div>\n'
            f'    <p class="note" style="margin:0">{esc(GROUP["lede"])}</p>\n  </div>\n'
            f'  <div class="footer"><span class="brand"><img src="{base["brand"]}logo.png" alt="">Tiansight</span><span class="page"></span></div>\n</section>')


def slide_spotlight(p, base):
    return (f'<section class="slide" data-label="创始人 · {esc(p["order"])}">\n  <span class="ts-caption">{esc(GROUP["en"])} · {esc(p["order"])}</span>\n'
            f'  <div class="body spotlight">\n    {portrait(p, base)}\n    <div class="ts-stack" style="gap:18px">{identity(p)}'
            f'<p>{esc(p["bio"])}</p><blockquote class="ts-quote">「{esc(p["quote"])}」<footer>{esc(p["name"])}</footer></blockquote></div>\n  </div>\n'
            f'  <div class="footer"><span class="brand"><img src="{base["brand"]}logo.png" alt="">Tiansight</span><span class="page"></span></div>\n</section>')


# ── name cards ───────────────────────────────────────────────────────

def namecards(p, base):
    c = p['contact']
    front = (f'<div class="card card-front"><div class="top"><img src="{base["brand"]}logo.png" alt="侍天">'
             f'<span class="ts-caption">{esc(CO["name"])} · {esc(CO["tagline"])}</span></div>'
             f'<div class="who"><div class="name">{esc(p["name"])}</div><div class="en">{esc(p["en"])}</div><div class="title">{esc(p["title"])}</div></div>'
             f'<div class="contact"><span>{esc(c["phone"])}</span><span>{esc(c["wechat"])}</span><span>{esc(c["email"])}</span><span>{esc(CO["site"])}</span></div></div>')
    port = (f'<div class="card card-portrait">{portrait(p, base)}<div class="who"><span class="ts-caption">{esc(CO["name"])}</span>'
            f'<div class="name">{esc(p["name"])}</div><div class="title">{esc(p["title"])}</div>'
            f'<div class="contact"><span>{esc(c["phone"])}</span><span>{esc(c["wechat"])}</span><span>{esc(c["email"])}</span></div></div></div>')
    back = (f'<div class="card card-back"><img src="{base["brand"]}logo.png" alt="侍天"><span class="ts-tagline">{esc(CO["tagline"])}</span>'
            f'<span class="ts-caption">{esc(CO["alliance"])} · {esc(CO["city"])}</span></div>')
    return front + port + back


# ── social artboards ─────────────────────────────────────────────────

COMPASS = ('<div class="ts-compass" aria-hidden="true" style="--compass-size:{size}px;left:auto;right:-{off}px;top:{top}">'
           '<svg viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-width="1"><circle cx="300" cy="300" r="290"/>'
           '<circle cx="300" cy="300" r="230"/><circle cx="300" cy="300" r="150"/><path d="M300 0v600M0 300h600"/></svg></div>')


def mark(base, top, left=None, right=None):
    pos = f'top:{top}px;' + (f'left:{left}px;' if left is not None else f'right:{right}px;')
    return (f'<div class="mark" style="{pos}"><img src="{base["brand"]}logo.png" alt="侍天">'
            f'<span class="ts-caption">{esc(CO["name"])} · {esc(CO["tagline"])}</span></div>')


def foot():
    return f'<div class="foot"><span>{esc(CO["alliance"])}</span><span>{esc(CO["wechat_public"])}</span></div>'


def social(p, base):
    sq = (f'<div class="art art-square" id="{p["id"]}-square">{COMPASS.format(size=900, off=260, top="30%")}{mark(base, 96, left=64)}'
          f'{portrait(p, base)}{identity(p)}<div class="quote">「{esc(p["quote"])}」</div>{foot()}</div>')
    wide = (f'<div class="art art-wide" id="{p["id"]}-wide">{COMPASS.format(size=700, off=200, top="50%")}{portrait(p, base)}'
            f'<div class="ts-stack" style="gap:16px;position:relative">{identity(p)}<div class="quote">「{esc(p["quote"])}」</div></div>{foot()}</div>')
    cover = (f'<div class="art art-cover" id="{p["id"]}-cover">{COMPASS.format(size=520, off=140, top="50%")}{portrait(p, base)}'
             f'<div style="position:relative">{identity(p)}</div>{mark(base, 32, right=48)}</div>')
    story = (f'<div class="art art-story" id="{p["id"]}-story">{COMPASS.format(size=1100, off=300, top="18%")}{mark(base, 96, left=88)}'
             f'{portrait(p, base)}{identity(p)}<div class="quote">「{esc(p["quote"])}」</div>{foot()}</div>')
    return (f'<div><div class="art-label">{esc(p["id"])} · {esc(p["name"])}</div><div class="art-row">'
            f'<div><div class="art-label">1080 × 1080</div>{sq}</div><div><div class="art-label">1200 × 628</div>{wide}</div>'
            f'<div><div class="art-label">900 × 383</div>{cover}</div></div>'
            f'<div class="art-row" style="margin-top:var(--space-6)"><div><div class="art-label">1080 × 1920</div>{story}</div></div></div>')


# ── render ───────────────────────────────────────────────────────────

def fill(template, blocks):
    page = template
    for key, value in GROUP.items():
        page = page.replace('{{group:' + key + '}}', esc(value))
    for key, value in blocks.items():
        page = page.replace('{{block:' + key + '}}', value)
    if '{{block:' in page or '{{group:' in page:
        raise SystemExit('unresolved placeholders in template')
    return page


def render_all():
    first = PEOPLE[0]
    web = {'photo': '../people/photos/', 'brand': '../brand/'}
    loc = {'photo': 'photos/', 'brand': '../brand/'}
    missing = dict(first, name='照片待补', photo='missing.png')
    outputs = {
        root / 'website' / 'team.html': fill((people_dir / 'templates' / 'team.html').read_text(), {
            'team_cards': ''.join(profile_card(p, web) for p in PEOPLE),
            'voices': ''.join(f'<div class="ts-card">{voice(p, web)}</div>' for p in PEOPLE[:3]),
            'profiles': ''.join(profile_full(p, web) for p in PEOPLE),
        }),
        people_dir / 'blocks.html': fill((people_dir / 'templates' / 'blocks.html').read_text(), {
            'portrait_32': portrait(first, loc, '32px'), 'portrait_48': portrait(first, loc, '48px'),
            'portrait_96': portrait(first, loc, '96px'), 'portrait_160': portrait(first, loc, '160px'),
            'portrait_paper': portrait(first, loc, '96px', 'ts-portrait-paper'),
            'portrait_missing': portrait(missing, loc, '96px'),
            'profile_card': profile_card(first, loc),
            'rows': ''.join(row(p, loc) for p in PEOPLE[:3]),
            'byline': byline(first, loc), 'voice': voice(first, loc), 'signature': signature(first, loc),
            'team_cards': ''.join(profile_card(p, loc) for p in PEOPLE),
        }),
        people_dir / 'namecards.html': fill((people_dir / 'templates' / 'namecards.html').read_text(), {
            'namecards': ''.join(namecards(p, loc) for p in PEOPLE)}),
        people_dir / 'social.html': fill((people_dir / 'templates' / 'social.html').read_text(), {
            'social': ''.join(social(p, loc) for p in PEOPLE)}),
    }
    deck_path = root / 'deck' / 'index.html'
    deck = deck_path.read_text()
    if DECK_START not in deck or DECK_END not in deck:
        raise SystemExit('deck/index.html lacks the people markers')
    slides = '\n'.join([DECK_START, slide_team(web)] + [slide_spotlight(p, web) for p in PEOPLE] + [DECK_END])
    outputs[deck_path] = re.sub(re.escape(DECK_START) + r'.*?' + re.escape(DECK_END), lambda _: slides, deck, flags=re.S)
    return outputs


if __name__ == '__main__':
    outputs = render_all()
    stale = [p for p, out in outputs.items() if not p.exists() or p.read_text() != out]
    if '--check' in sys.argv:
        if stale:
            print('stale: ' + ', '.join(str(p.relative_to(root)) for p in stale) + ' — run python3 scripts/build_people.py')
            sys.exit(1)
        print('people outputs are up to date')
    else:
        for p, out in outputs.items():
            p.write_text(out)
            print(f'wrote {p.relative_to(root)}')
