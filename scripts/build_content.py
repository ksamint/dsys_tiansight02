"""Generate shared browser content: python3 scripts/build_content.py [--check]."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def build(check=False):
    stale = []
    for name in ('team', 'contact'):
        source = ROOT / 'content' / f'{name}.json'
        data = json.loads(source.read_text())
        if name == 'team':
            people = data['people']
            assert people and len({p['name'] for p in people}) == len(people)
            assert all(p['roles'] and p['bio'] and p['highlights'] and p['seat'] for p in people)
        else:
            assert all(data[k] for k in ('title', 'body', 'qr', 'url'))
        text = (f'// Generated from content/{name}.json; edit the JSON source.\n'
                f'window.TIANSIGHT_{name.upper()} = '
                + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
        target = source.with_suffix('.js')
        if not target.is_file() or target.read_text() != text:
            stale.append(str(target.relative_to(ROOT)))
            if not check:
                target.write_text(text)
    if check and stale:
        raise SystemExit('Stale shared content: ' + ', '.join(stale))
    print('Shared content ' + ('checked' if check else 'built'))


if __name__ == '__main__':
    build('--check' in sys.argv)
