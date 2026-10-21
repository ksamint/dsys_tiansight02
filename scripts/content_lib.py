"""Single content contract and resolver shared by builders, catalog and gate."""
from pathlib import Path
import argparse
import copy
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
LAYOUT_KEYS = {'page', 'active', 'highlight', 'figure'}
REFS = {'$team', '$contact', '$case', '$partners', '$asset'}


def read_json(path):
    return json.loads(Path(path).read_text())


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def sha(value):
    return hashlib.sha256(value).hexdigest()


class Library:
    def __init__(self, root=ROOT):
        self.root = Path(root)
        self.current = read_json(self.root / 'dist/components/current.json')
        self.version = self.current['supported']
        if not re.fullmatch(r'[A-Za-z0-9._-]+', self.version):
            raise ValueError('Unsafe runtime version')
        self.runtime = read_json(self.root / 'dist/components' / self.version / 'manifest.json')
        self.slides = {p.stem: read_json(p) for p in sorted((self.root / 'content/slides').glob('*.json'))}
        self.decks = {p.stem: read_json(p) for p in sorted((self.root / 'content/decks').glob('*.json'))}
        index = read_json(self.root / 'assets/index.json')
        entries = index if isinstance(index, list) else index.get('assets', index.get('files', []))
        self.assets = {x['path']: x for x in entries}

    def asset(self, path, output=None):
        path = path.removeprefix('./')
        if path not in self.assets:
            raise ValueError(f'Unregistered asset: {path}')
        file = self.root / path
        if not file.is_file() or sha(file.read_bytes()) != self.assets[path]['sha256']:
            raise ValueError(f'Asset hash mismatch: {path}')
        if output is None:
            return path
        import os
        return Path(os.path.relpath(file, output)).as_posix()

    def resolve(self, value, output=None, inserted=False):
        if isinstance(value, list):
            return [self.resolve(v, output, inserted) for v in value]
        if not isinstance(value, dict):
            return value
        refs = set(value) & REFS
        if len(refs) > 1 or any(k.startswith('$') and k not in REFS | {'$element', '$view', '$param'} for k in value):
            raise ValueError(f'Invalid content reference: {value}')
        if not refs:
            return {k: self.resolve(v, output, inserted) for k, v in value.items()}
        key = next(iter(refs))
        if inserted and key != '$asset':
            raise ValueError('Nested content references are not permitted')
        ref = value[key]
        if key == '$asset':
            if len(value) != 1:
                raise ValueError('Asset references cannot have siblings')
            return self.asset(ref, output)
        if key == '$team':
            people = read_json(self.root / 'content/team.json')['people']
            matches = [p for p in people if p['name'] == ref]
            if len(matches) != 1:
                raise ValueError(f'Unknown or ambiguous person: {ref}')
            result = matches[0]
            if value.get('$view') == 'seat':
                result = {k: result[k] for k in ('name', 'photo')} | result['seat']
            elif '$view' in value:
                raise ValueError('Unknown team view')
        elif key == '$case':
            if not re.fullmatch(r'case-\d+', str(ref)):
                raise ValueError(f'Invalid case id: {ref}')
            case = read_json(self.root / f'content/cases/{ref}.json')
            view = value.get('$view')
            if view is None:
                result = case['summary']
            elif view == 'index':
                summary = case['summary']
                result = {'tag': summary['module'], 'title': case['name'], 'body': summary['summary'], 'logo': summary['logo']}
            elif re.fullmatch(r'snippet:[a-z0-9-]+', str(view)):
                result = case['snippets'][view.split(':', 1)[1]]
            elif re.fullmatch(r'gallery:\d+', str(view)):
                result = case['gallery'][int(view.split(':')[1])]['props']
            else:
                raise ValueError('Unknown case view')
        else:
            if ref is not True:
                raise ValueError(f'{key} requires true')
            result = read_json(self.root / ('content/contact.json' if key == '$contact' else 'content/partners.json'))
        result = self.resolve(copy.deepcopy(result), output, True)
        siblings = {k: self.resolve(v, output, inserted) for k, v in value.items() if k not in (key, '$view')}
        if siblings:
            if key == '$case':
                self.check_overrides(siblings)
            result = {**result, **siblings}
        return result

    @staticmethod
    def check_overrides(overrides):
        if not isinstance(overrides, dict) or set(overrides) - LAYOUT_KEYS:
            raise ValueError(f'Copy or unsupported fields in overrides: {overrides}')
        for value in overrides.values():
            if isinstance(value, (dict, list)) or isinstance(value, str) and len(value) > 24:
                raise ValueError('Overrides must be short layout scalars')

    def deck_slides(self, deck, profile=None, output=None):
        manifest = self.decks[deck] if isinstance(deck, str) else deck
        allowed = None if profile is None else manifest['profiles'][profile]['publish']
        result = []
        for entry in manifest['slides']:
            sid = entry if isinstance(entry, str) else entry['id']
            if sid not in self.slides:
                raise ValueError(f'Unknown slide {sid}')
            record = self.slides[sid]
            overrides = {} if isinstance(entry, str) else entry.get('overrides', {})
            self.check_overrides(overrides)
            if record['status'] == 'planned' or allowed is not None and record['publish'] not in allowed:
                continue
            props = self.resolve(record['props'], output)
            result.append({**record, 'props': {**props, **overrides, 'page': len(result) + 1}})
        return result

    def content_version(self, deck):
        manifest = self.decks[deck] if isinstance(deck, str) else deck
        records = []
        for entry in manifest['slides']:
            sid = entry if isinstance(entry, str) else entry['id']
            record = copy.deepcopy(self.slides[sid])
            if 'props' in record:
                record['props'] = self.resolve(record['props'])
            records.append(record)
        # Include actual dependency bytes, not only a potentially stale manifest hash.
        runtime_path = self.root / 'dist/components' / self.version
        dependencies = {str(p.relative_to(self.root)): sha(p.read_bytes()) for p in sorted(runtime_path.rglob('*')) if p.is_file()}
        extension_owners = {r.get('extension', r['owner']) for r in records if r.get('component', '').startswith('ext:')}
        for folder in ('brand', 'content/extensions'):
            for p in sorted((self.root / folder).rglob('*')):
                if p.is_file() and (folder == 'brand' and p.suffix in ('.css', '.woff2', '.woff') or folder == 'content/extensions' and p.stem in extension_owners):
                    dependencies[str(p.relative_to(self.root))] = sha(p.read_bytes())
        # Track whole shared source records as well as resolved props. A case gallery or
        # approval edit must invalidate every deck referencing that case, even when its
        # current layout reads only summary props.
        def shared_sources(value):
            if isinstance(value, dict):
                for key, ref in value.items():
                    path = None
                    if key in ('$team', '$contact', '$partners'):
                        path = 'content/' + key[1:] + '.json'
                    elif key == '$case':
                        path = f'content/cases/{ref}.json'
                    if path:
                        dependencies[path] = sha((self.root / path).read_bytes())
                    shared_sources(ref)
            elif isinstance(value, list):
                for item in value: shared_sources(item)
        for entry in manifest['slides']:
            sid = entry if isinstance(entry, str) else entry['id']
            shared_sources(self.slides[sid].get('props', {}))
        referenced = set()
        def assets(value):
            if isinstance(value, dict):
                for v in value.values(): assets(v)
            elif isinstance(value, list):
                for v in value: assets(v)
            elif isinstance(value, str) and value in self.assets:
                referenced.add(value)
        assets(records)
        for path in referenced:
            self.asset(path)
            dependencies[path] = self.assets[path]['sha256']
        return sha(canonical({'manifest': manifest, 'slides': records, 'dependencies': dependencies, 'runtime': self.version}).encode())

    def validate_manifest(self, deck):
        if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', deck['id']):
            raise ValueError('Unsafe deck id')
        if deck['status'] not in ('maintained', 'planned'):
            raise ValueError('Unknown deck status')
        for profile, spec in deck.get('profiles', {}).items():
            if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', profile):
                raise ValueError('Unsafe profile id')
            if not isinstance(spec.get('publish'), list) or set(spec['publish']) - {'web','banner','internal','sales-internal','hold'}:
                raise ValueError('Invalid profile filter')
        ids = [entry if isinstance(entry, str) else entry['id'] for entry in deck['slides']]
        if len(ids) != len(set(ids)):
            raise ValueError('Duplicate slide in manifest')
        for sid in ids:
            if sid not in self.slides: raise ValueError(f'Unknown slide {sid}')
        self.deck_slides(deck)

    def check(self):
        if not self.slides or not self.decks:
            raise ValueError('Slide library and deck manifests must not be empty')
        exports = {x['name'] if isinstance(x, dict) else x for x in self.runtime['components']}
        case_names = [read_json(p)['name'] for p in (self.root / 'content/cases').glob('*.json') if 'name' in read_json(p)]
        for sid, slide in self.slides.items():
            if not re.fullmatch(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', sid):
                raise ValueError(f'Invalid slide UUID: {sid}')
            if slide['id'] != sid:
                raise ValueError(f'Slide filename/id mismatch: {sid}')
            status = slide['status']
            if status not in ('maintained', 'planned') or (status == 'maintained') != ('props' in slide):
                raise ValueError(f'Invalid status/props: {sid}')
            if status == 'planned':
                continue
            def inline_case(value):
                if isinstance(value, dict):
                    if '$case' in value: return False
                    return any(inline_case(v) for v in value.values())
                if isinstance(value, list): return any(inline_case(v) for v in value)
                if isinstance(value, str): return any(name in value for name in case_names)
                return False
            if inline_case(slide['props']):
                raise ValueError(f'Inline case content in slide: {sid}')
            component = slide['component']
            if component.startswith('ext:'):
                extension = self.root / f"content/extensions/{slide.get('extension', slide['owner'])}.js"
                if not extension.is_file() or component[4:] not in extension.read_text():
                    raise ValueError(f'Unknown extension: {component}')
            elif component not in exports:
                raise ValueError(f'Unknown runtime component: {component}')
            if 'page' in slide['props']:
                raise ValueError(f'Page number stored in slide: {sid}')
            self.resolve(slide['props'])
        for did, deck in self.decks.items():
            self.validate_manifest(deck)
            ids = [entry if isinstance(entry, str) else entry['id'] for entry in deck['slides']]
            if len(ids) != len(set(ids)):
                raise ValueError(f'Duplicate slide in manifest: {did}')
            if deck['status'] not in ('maintained', 'planned'):
                raise ValueError(f'Unknown deck status: {did}')
            if deck['id'] != did:
                raise ValueError(f'Deck filename/id mismatch: {did}')
            for profile in deck.get('profiles', {}):
                self.deck_slides(deck, profile)
            self.content_version(deck)
        return True


def catalog(library):
    existing = library.root / 'content/deck-catalog.json'
    prior = {d['id']: d for d in read_json(existing).get('decks', [])} if existing.exists() else {}
    decks = []
    for did, manifest in library.decks.items():
        slides = []
        for i, entry in enumerate(manifest['slides']):
            sid = entry if isinstance(entry, str) else entry['id']
            record = library.slides[sid]
            slides.append({k: record[k] for k in ('id', 'label', 'publish', 'owner')} | {'order': i + 1})
        decks.append({'id': did, 'title': manifest['title'], 'status': manifest['status'], 'contentVersion': library.content_version(did), 'systemVersion': library.version, 'profiles': list(manifest.get('profiles', {})), 'slides': slides, 'latestBuilt': prior.get(did, {}).get('latestBuilt'), 'latestApproved': prior.get(did, {}).get('latestApproved')})
    return {'schema': 'tiansight.deck-catalog/2', 'runtime': library.version, 'decks': decks}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--catalog', action='store_true')
    args = parser.parse_args()
    lib = Library()
    if args.catalog:
        print(json.dumps(catalog(lib), ensure_ascii=False, indent=2))
    else:
        lib.check()
        print(f'PASS: content library {len(lib.slides)} slides, {len(lib.decks)} decks; references and manifests valid')
