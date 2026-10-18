"""Inline the icon sprite into every page that carries the markers.

python3 scripts/sync_icons.py          # rewrite pages between <!-- icons:start --> and <!-- icons:end -->
python3 scripts/sync_icons.py --check  # exit 1 if any page's inline sprite differs from brand/icons.svg

Pages inline the sprite so <use href="#ts-…"> works on file:// as well as http.
"""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
START, END = '<!-- icons:start -->', '<!-- icons:end -->'
sprite = (root / 'brand' / 'icons.svg').read_text().strip()
sprite = re.sub(r'\s*<!--.*?-->\s*', '\n', sprite, flags=re.S).strip()   # drop the usage comment when inlined
sprite = sprite.replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg ', 1)

PAGES = ['brand/index.html', 'website/index.html', 'people/templates/team.html', 'deck/index.html', 'index.html']


def rewrite(text):
    return re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: START + '\n' + sprite + '\n' + END, text, flags=re.S)


if __name__ == '__main__':
    stale = []
    for rel in PAGES:
        path = root / rel
        if not path.exists():
            continue
        text = path.read_text()
        if START not in text or END not in text:
            stale.append(rel + ' (no markers)')
            continue
        out = rewrite(text)
        if out != text:
            if '--check' in sys.argv:
                stale.append(rel)
            else:
                path.write_text(out)
                print('updated', rel)
    if '--check' in sys.argv:
        if stale:
            print('icon sprite stale in: ' + ', '.join(stale) + ' — run python3 scripts/sync_icons.py')
            sys.exit(1)
        print('icon sprites are in sync')
