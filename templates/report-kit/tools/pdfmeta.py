"""PDF link table and bookmarks for a tsk deck.

  python3 pdfmeta.py links  <deck script.py> <deck dir>                 → <deck dir>/.build/links.json
  python3 pdfmeta.py finish <deck script.py> <deck dir> <out.pdf>       bookmarks + metadata + link check

The deck script is executed once more (with <deck dir> as its first argument) to recover the page order,
sections and badge table. finish reads <deck dir>/.build/raw.pdf (written by pdf.js) and fails when a
link is unresolved or lands on a page other than the one links.json asked for.
"""
import contextlib
import io
import json
import os
import runpy
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))


def main():
    mode, script, deck = sys.argv[1], sys.argv[2], sys.argv[3].rstrip('/') + '/'
    build = deck + '.build/'
    os.makedirs(build, exist_ok=True)
    rest = sys.argv[4:]
    sys.argv = [script, deck]
    with contextlib.redirect_stdout(io.StringIO()):
        runpy.run_path(script, run_name='__main__')
    import tsk
    if mode == 'links':
        print('links', tsk.build_links(build + 'links.json'))
        return
    dst = rest[0]
    with open(deck + 'deck.json', encoding='utf-8') as f:
        title = json.load(f)['title']
    tsk.outline(build + 'raw.pdf', dst, title)
    r = tsk.verify_pdf(dst, build + 'links.json')
    print('pdf', r)
    if r['unresolved'] or r['misdirected']:
        raise SystemExit('PDF links failed verification')


if __name__ == '__main__':
    main()
