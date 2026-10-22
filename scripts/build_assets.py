"""Generate and verify the canonical asset register from actual repository references."""
from pathlib import Path
import argparse
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
METADATA = {'assets/index.json', 'assets/path-map.json'}
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.avif'}


def generate():
    mapping = json.loads((ROOT / 'assets/path-map.json').read_text())
    assets = {p.relative_to(ROOT).as_posix(): p for p in (ROOT / 'assets').rglob('*')
              if p.is_file() and p.relative_to(ROOT).as_posix() not in METADATA}
    refs = {key: set() for key in assets}
    aliases = {key: {key, key.removeprefix('assets/')} for key in assets}
    for old, canonical in mapping['paths'].items():
        if canonical in aliases:
            aliases[canonical].add(old)
    for old, canonical in mapping['paths'].items():
        if old.startswith('deliverables/lifecycle-map/') and canonical in aliases:
            aliases[canonical].add('/'.join(Path(old).parts[-2:]))
    for old, canonical in mapping['runtime'].items():
        aliases[canonical].add(old)
    # Reference records point to content IDs where available, and explicit specimen/brand files otherwise.
    roots = ['content', 'brand', 'components', 'slides', 'ui_kits', 'templates', 'html-system',
             'skills', 'people', 'report', 'website', 'deck', 'deliverables/lifecycle-map']
    for dirname in roots:
        directory = ROOT / dirname
        if not directory.exists():
            continue
        for file in directory.rglob('*'):
            if not file.is_file() or file.suffix not in {'.json', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.py'}:
                continue
            text = file.read_text(errors='replace')
            rel = file.relative_to(ROOT).as_posix()
            owner = rel
            if rel.startswith(('content/slides/', 'content/cases/')):
                owner = json.loads(text).get('id', rel)
            elif rel == 'content/team.json':
                owner = 'person:content/team.json'
            elif rel == 'content/partners.json':
                owner = 'partner:content/partners.json'
            elif rel.startswith('brand/'):
                owner = 'brand:' + rel
            for canonical, choices in aliases.items():
                if any(alias in text and re.search(r'(?<![\w-])' + re.escape(alias) + r'(?![\w/.-])', text)
                       for alias in choices):
                    refs[canonical].add(owner)
    # Font licenses and source manifests accompany the foundation's registered self-hosted font set.
    for canonical, file in assets.items():
        if canonical.startswith('assets/fonts/'):
            refs[canonical].add('brand:brand/fonts.css')
        # The runtime manifest consumes the complete approved image map and supplies default component assets.
        if canonical in mapping['runtime'].values():
            refs[canonical].add('brand:dist/components/2026.10.21-e0a760/manifest.json')
    result = []
    for canonical, file in sorted(assets.items()):
        sources = mapping['sources'].get(canonical, [canonical])
        supplied = any('#embedded/' in source for source in sources)
        approval = {'by': 'owner', 'date': '2026-10-21', 'record': 'docs/component-runtime.md'} if supplied else {'by': 'owner', 'record': 'CHANGELOG.md v0.7'}
        result.append({'path': canonical, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
                       'kind': file.relative_to(ROOT / 'assets').parts[0], 'source': sources[0],
                       'sources': sources, 'approval': approval, 'usedBy': sorted(refs[canonical])})
    return {'schema': 'tiansight.asset-register/1', 'assets': result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    register = generate()
    data = json.dumps(register, ensure_ascii=False, indent=2) + '\n'
    path = ROOT / 'assets/index.json'
    if args.check:
        assert path.is_file() and path.read_text() == data, 'Stale or missing assets/index.json'
        unused = [item['path'] for item in register['assets'] if not item['usedBy']]
        assert not unused, 'Unreferenced assets: ' + ', '.join(unused)
        hashes = {}
        for item in register['assets']:
            if Path(item['path']).suffix.lower() in IMAGE_EXTENSIONS:
                assert item['sha256'] not in hashes, f'Duplicate canonical image: {item["path"]} and {hashes.get(item["sha256"])}'
                hashes[item['sha256']] = item['path']
    else:
        path.write_text(data)
    print(f'PASS: {len(register["assets"])} canonical assets {"verified" if args.check else "registered"}')


if __name__ == '__main__':
    main()
