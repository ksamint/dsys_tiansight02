"""Build versioned library slides into offline HTML; one renderer for all consumers."""
import argparse
import datetime
import html
import json
import os
from pathlib import Path
import subprocess
from content_lib import ROOT, Library, canonical, read_json, sha
from pdf_tooling import run_pdf


def script_json(value):
    # HTML parsers recognize closing script tags even inside JSON/JS strings.
    return json.dumps(value, ensure_ascii=False).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


def source_date():
    epoch = os.environ.get('SOURCE_DATE_EPOCH')
    if epoch is None:
        # Recorded once from the source-package commit; independent of clone depth.
        value = read_json(ROOT / 'content/provenance.json')['sourceDate']
        return datetime.datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
    return datetime.datetime.fromtimestamp(int(epoch), datetime.timezone.utc).isoformat().replace('+00:00', 'Z')



def build(lib, manifest, profile, params):
    output = ROOT / 'build' / manifest['id'] / profile
    slides = lib.deck_slides(manifest, profile, output)
    version = lib.content_version(manifest)
    runtime = os.path.relpath(ROOT / 'dist/components' / lib.version, output)
    scripts = [f'{runtime}/{p}' for p in ('vendor/react.min.js','vendor/react-dom.min.js','vendor/d3.min.js','vendor/d3-sankey.min.js','vendor/lucide-icons.js','_ds_bundle.js','deck-stage.js')]
    extension_decks = sorted({s.get('extension', s['owner']) for s in slides if s['component'].startswith('ext:')})
    scripts += [os.path.relpath(ROOT / f'content/extensions/{did}.js', output) for did in extension_decks]
    defaults = {k: v.get('default') for k, v in manifest.get('params', {}).items()}
    if set(params) - set(defaults):
        raise ValueError(f'Unknown deck parameters: {set(params) - set(defaults)}')
    defaults.update(params)
    # Parameter placeholders are explicit data values; never interpolate arbitrary source code.
    def apply(value):
        if isinstance(value, dict):
            if set(value) == {'$param'}:
                return defaults[value['$param']]
            return {k: apply(v) for k, v in value.items()}
        if isinstance(value, list): return [apply(v) for v in value]
        return value
    def keep_words(value, key=''):
        import re
        if key in {'chart','image','logo','photo','src','latin','tier','numeral','qr','url','value'}:
            return value
        if isinstance(value, str):
            if key in {'title','subtitle','label','q','name'}:
                return ''.join(part if i % 2 else '\u2060'.join(part) for i, part in enumerate(re.split(r'([，、：；。·\n\s])', value)))
            return value[:-4] + '\u2060'.join(value[-4:]) if len(value) >= 14 else value
        if isinstance(value, list): return [keep_words(v, key) for v in value]
        if isinstance(value, dict): return {k: keep_words(v, k) for k, v in value.items()}
        return value
    data = [{'id': s['id'], 'component': s['component'], 'extension': s.get('extension', s['owner']), 'props': keep_words(apply(s['props'])) if 'keep-words' in manifest.get('transforms', []) else apply(s['props'])} for s in slides]
    sections = '\n'.join(f'<section data-slide-id="{html.escape(s["id"], quote=True)}" data-label="{html.escape(s["label"], quote=True)}" aria-label="{html.escape(s["label"], quote=True)}"></section>' for s in slides)
    blob = script_json(data)
    title = html.escape(manifest['title'])
    transforms = manifest.get('transforms', [])
    if set(transforms) - {'keep-words'}: raise ValueError('Unknown deck transform')
    document = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="tiansight-content-version" content="{version}">
<meta name="tiansight-system-version" content="{lib.version}">
<title>{title}</title><link rel="stylesheet" href="{runtime}/styles.css">
<style>html,body{{margin:0;background:var(--surface)}}.sr-only{{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}}deck-stage:not(:defined){{visibility:hidden}}section[data-slide-id]{{width:1280px;height:720px;overflow:hidden}}</style>
''' + '\n'.join(f'<script src="{html.escape(p, quote=True)}"></script>' for p in scripts) + f'''
</head><body data-content-version="{version}" data-system-version="{lib.version}">
<h1 class="sr-only">{title}</h1><main aria-label="{title}"><deck-stage width="1280" height="720">
{sections}
</deck-stage></main><script type="application/json" id="deck-data">{blob}</script>
<script>
(()=>{{
 const NS=window[{script_json(lib.runtime['namespace'])}];
 const revive=v=>Array.isArray(v)?v.map(revive):v&&typeof v==='object'?(v.$element?React.createElement(v.$element.type,revive(v.$element.props||{{}})):Object.fromEntries(Object.entries(v).map(([k,x])=>[k,revive(x)]))):v;
 const data=JSON.parse(document.getElementById('deck-data').textContent);
 const mounts=[...document.querySelectorAll('section[data-slide-id]')];
 data.forEach((s,i)=>{{const C=s.component.startsWith('ext:')?window.TIANSIGHT_EXT[s.extension][s.component.slice(4)]:NS[s.component];if(!C)throw new Error('Unknown component '+s.component);ReactDOM.flushSync(()=>ReactDOM.createRoot(mounts[i]).render(React.createElement(C,revive(s.props))));}});
 const footer={script_json(manifest.get('footer'))};
 if(footer){{const patch=()=>document.querySelectorAll('section[data-slide-id]').forEach(el=>{{const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode())if(n.textContent==='侍天 TIANSIGHT · 餐饮第二大脑')n.textContent=footer;}});patch();new MutationObserver(patch).observe(document.querySelector('main'),{{childList:true,subtree:true}});}}
 window.TIANSIGHT_DECK_READY=true;
}})();
</script></body></html>
'''
    meta = {'schema': 'tiansight.artifact/2', 'deckId': manifest['id'], 'profile': profile, 'contentVersion': version, 'systemVersion': lib.version, 'htmlSha256': sha(document.encode()), 'params': defaults, 'builtAt': source_date(), 'pageCount': len(slides), 'transforms': transforms}
    return output, document, meta


def check_pdf(output, meta):
    if not (output / 'deck.pdf').exists(): return
    verification = read_json(output / 'verification.json')
    for key in ('contentVersion', 'systemVersion', 'htmlSha256'):
        if verification[key] != meta[key]: raise ValueError(f'Stale PDF verification: {output} {key}')
    if not verification.get('passed'): raise ValueError(f'PDF verification failed: {output}')
    # Compare the recorded identity, not unstable Chromium PDF bytes.
    identity = ' | '.join(str(meta[key]) for key in ('deckId','profile','contentVersion','systemVersion','htmlSha256'))
    run_pdf(['-c', 'import pymupdf,sys; d=pymupdf.open(sys.argv[1]); assert d.metadata["title"].endswith(sys.argv[2]), "PDF artifact identity mismatch"; assert len(d)==int(sys.argv[3]), "PDF page count mismatch"', str(output/'deck.pdf'), identity, str(meta['pageCount'])], cwd=ROOT)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('deck', nargs='?')
    parser.add_argument('--profile', default='client')
    parser.add_argument('--param', action='append', default=[])
    parser.add_argument('--manifest', type=Path)
    parser.add_argument('--all', action='store_true')
    parser.add_argument('--pdf', action='store_true')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    lib = Library()
    lib.check()
    params = dict(p.split('=', 1) for p in args.param)
    manifests = list(lib.decks.values()) if args.all else [read_json(args.manifest) if args.manifest else lib.decks[args.deck]]
    for manifest in manifests:
        if manifest['status'] == 'planned':
            print(f'PASS: {manifest["id"]} planned; no output')
            continue
        lib.validate_manifest(manifest)
        for profile in manifest['profiles'] if args.all else [args.profile]:
            if profile not in manifest['profiles']: raise ValueError(f'Unknown profile: {profile}')
            output, document, meta = build(lib, manifest, profile, params)
            for path, value in [(output/'index.html', document), (output/'build.json', json.dumps(meta, ensure_ascii=False, indent=2)+'\n')]:
                if args.check:
                    if not path.is_file() or path.read_text() != value: raise ValueError(f'Stale {path.relative_to(ROOT)}')
                else:
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_text(value)
            if args.check: check_pdf(output, meta)
            if args.pdf:
                subprocess.run(['node', 'scripts/export_pdf.mjs', str(output/'index.html')], check=True, cwd=ROOT)
                run_pdf(['scripts/optimize_pdf.py', str(output/'deck.pdf')], cwd=ROOT)
                run_pdf(['scripts/verify_pdf.py', manifest['id'], profile], cwd=ROOT)
            print(f'PASS: {manifest["id"]}/{profile} {meta["pageCount"]} pages {meta["contentVersion"][:12]}')


if __name__ == '__main__': main()
