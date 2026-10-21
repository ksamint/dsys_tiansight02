"""Recover the approved export and build its offline component distribution (or --check)."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import re
import sys
import zipfile
from runtime_patches import patch_bundle

ROOT = Path(__file__).resolve().parents[1]
VERSION = '2026.10.21-e0a760'
ARCHIVE = ROOT / 'archive/approved-2026-10-21'
DIST = ROOT / 'dist/components' / VERSION
CHECK = '--check' in sys.argv
PREFIX = 'export/dsys_tiansight02/deliverables/exhibit-design/'
FILES = {}

def sha(data):
    return hashlib.sha256(data).hexdigest()

def put(path, data):
    data = data.encode() if isinstance(data, str) else data
    FILES[path] = data
    if CHECK:
        assert path.is_file() and path.read_bytes() == data, f'Stale or missing: {path.relative_to(ROOT)}'
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    return {'path': path.relative_to(ROOT).as_posix(), 'bytes': len(data), 'sha256': sha(data)}

def js(data):
    return json.dumps(data, ensure_ascii=False, indent=2) + '\n'

def norm(value):
    return re.sub(r'\s+', '', value).lower().replace(',.', ',0.')

with zipfile.ZipFile(ARCHIVE / 'source.zip') as z:
    entries = []
    for info in z.infolist():
        assert not info.is_dir() and '..' not in Path(info.filename).parts and not info.filename.startswith('/')
        data = z.read(info)
        entries.append({'path': info.filename, 'bytes': len(data), 'sha256': sha(data)})
    html = z.read(PREFIX + 'index.html').decode()
    embedded = json.loads(re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.S)[1])
    template = json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.S)[1])

resources = {}
resource_records = []
for uid, item in embedded.items():
    data = base64.b64decode(item['data'], validate=True)
    if item.get('compressed'):
        data = gzip.decompress(data)
    ext = 'css' if item['mime'] == 'text/css' else 'js'
    record = put(ARCHIVE / 'resources' / (uid + '.' + ext), data)
    resource_records.append({'id': uid, 'mime': item['mime'], **record})
    resources[uid] = data.decode()
put(ARCHIVE / 'template.html', template)
bundle = next(x for x in resources.values() if x.startswith('/* @ds-bundle:'))
meta = json.loads(re.search(r'/\* @ds-bundle: (.*?) \*/', bundle)[1])
assert meta['namespace'] == 'TIANSIGHTDesignSystem_e0a760' and len(meta['components']) == 105
css = next(x for k, x in resources.items() if embedded[k]['mime'] == 'text/css')
image_script = next(x for x in resources.values() if 'window.__EXH_IMG=' in x)
images = json.JSONDecoder().raw_decode(image_script[image_script.index('={') + 1:])[0]
nested = []
# Preserve every embedded image, including the approved originals also present as ZIP entries.
for name, uri in images.items():
    assert '..' not in Path(name).parts and not name.startswith('/')
    mime, payload = uri.split(';base64,', 1)
    data = base64.b64decode(payload, validate=True)
    record = put(DIST / 'assets' / ('supplied-logo-seal.png' if name == 'logo-seal.png' else name), data)
    nested.append({'resource': 'image-map', 'name': name, 'mime': mime[5:], **record})
    if name.startswith('exhibit/'):
        assert (ROOT / 'deliverables/exhibit-design/src' / name).read_bytes() == data
# Recover all font bytes; deduplicate against the official self-hosted fonts by content.
fonts = {sha(p.read_bytes()): p for p in (ROOT / 'brand/fonts').glob('*.woff2')}
for i, uri in enumerate(re.findall(r'data:font/woff2;base64,[A-Za-z0-9+/=]+', css)):
    data = base64.b64decode(uri.split(',', 1)[1], validate=True)
    path = fonts.get(sha(data), DIST / 'assets/fonts' / (sha(data) + '.woff2'))
    record = put(path, data)
    nested.append({'resource': 'styles', 'index': i, 'mime': 'font/woff2', **record})
assert len(nested) >= 155, f'Unexpected embedded asset inventory: {len(nested)}'
# The official foundation wins. Preserve extension geometry and semantic aliases only.
foundation = (ROOT / 'brand/tokens.css').read_text()
tokens = dict(re.findall(r'--([\w-]+):\s*([^;]+);', foundation))
colors = {norm(v): n for n, v in tokens.items() if re.fullmatch(r'#[a-fA-F0-9]+|rgba?\([^)]*\)', v)}
colors.update({norm(v): k for k, v in {'surface':'#F4F0E7','paper':'#FFFDF8','ink-primary':'#EFE6D2','charcoal':'#17130D','gold':'#76551F','seal':'#8C3228'}.items()})
aliases = {
    'parchment-50':'paper', 'parchment-100':'surface', 'parchment-150':'surface', 'parchment-200':'ink-primary',
    'parchment-300':'ink-primary', 'parchment-400':'ink-primary', 'parchment-500':'gold-300',
    'bronze-100':'gold-100', 'bronze-200':'gold-100', 'bronze-300':'gold-300',
    'ink-900':'charcoal', 'ink-800':'charcoal', 'ink-700':'charcoal', 'ink-600':'ink-muted',
    'ink-500':'ink-muted', 'ink-400':'ink-muted', 'ink-300':'ink-muted', 'ink-200':'line',
    'ink-100':'ink-primary', 'ink-050':'surface', 'seal-300':'seal', 'seal-100':'ink-primary',
    'growth-200':'ink-primary', 'loss-200':'ink-primary', 'caution-200':'ink-primary', 'datum-200':'ink-primary',
    'shadow-inset':'shadow-1', 'line-hairline':'line', 'line-rule':'line-strong', 'line-card':'card-border',
}
css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
def declaration(m):
    name, value = m[1], m[2]
    if name in tokens:
        return ''
    if name in aliases:
        return f'--{name}:var(--{aliases[name]});'
    def color(c):
        key = norm(c[0])
        assert key in colors, f'Unmapped style color {name}: {key}'
        return 'var(--' + colors[key] + ')'
    value = re.sub(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)', color, value)
    return f'--{name}:{value};'
css = re.sub(r'--([\w-]+):\s*([^;]+);', declaration, css)
# Decorative hover washes become the published pale surfaces.
css = css.replace('rgba(118,85,31,.035)', 'var(--surface)').replace('rgba(118,85,31,.05)', 'var(--ink-primary)')
css = re.sub(r'background-image:[^;]*gradient[^;]*;', 'background-image:none;', css)
css = re.sub(r'\n\s*\n+', '\n', css).strip()
css = '\n'.join(line.rstrip() for line in css.splitlines())
for old, new in [('text-display', 'charcoal'), ('text-body', 'text'), ('text-caption', 'color-caption')]:
    css = css.replace('var(--' + old + ')', 'var(--' + new + ')')
assert not re.search(r'#[0-9a-fA-F]{3,8}\b|rgba?\(', css)
put(DIST / 'styles.css', '@import "../../../brand/fonts.css";\n@import "../../../brand/tokens.css";\n' + css + '\n')
# Keep the compiled original intact in archive; only adapt runtime asset resolution here.
bundle = patch_bundle(bundle)
bundle = bundle.replace('function dsAsset(file) {', 'function dsAsset(file) {\n  if (file.startsWith("logos/")) file = "partners/" + file.slice(6);')
bundle = bundle.replace('"../../assets/logo-seal.png"', '__ds_scope.dsAsset("logo-seal.png")')
bundle = bundle.replace('const LUCIDE = "https://unpkg.com/lucide-static@0.441.0/icons/";', 'const LUCIDE = window.TIANSIGHT_LUCIDE;')
bundle = bundle.replace('"url(" + LUCIDE + name + ".svg)"', '"url(" + (LUCIDE[name] || "") + ")"')
# Resolve compiled chart colours from the foundation too (d3 requires concrete colours).
def resolve_token(name):
    value = tokens[name]
    match = re.fullmatch(r'var\(--([\w-]+)\)', value)
    return resolve_token(match[1]) if match else value
compiled_colors = {key: resolve_token(name) for key, name in colors.items()}
for old, token in {'#F6F1E4':'surface','#D6C6A4':'ink-primary','#3A332A':'charcoal','#D2BD8E':'gold-100','#FBF8F1':'paper'}.items():
    compiled_colors[norm(old)] = resolve_token(token)
def compiled_color(match):
    value = match[1]
    key = norm(value)
    if key in compiled_colors:
        return json.dumps(compiled_colors[key])
    if key.startswith('rgba(239,230,210,'):
        return json.dumps(resolve_token('muted-on-inverse'))
    if key.startswith('rgba(118,85,31,'):
        return json.dumps(resolve_token('watermark'))
    raise ValueError('Unmapped compiled color: ' + value)
bundle = re.sub(r'"(#[0-9a-fA-F]{3,8}\b|rgba?\([0-9., ]+\))"', compiled_color, bundle)
put(DIST / '_ds_bundle.js', bundle)
for filename, marker in [('react.min.js', 'react.production.min.js'), ('react-dom.min.js', 'react-dom.production.min.js')]:
    put(DIST / 'vendor' / filename, next(x for x in resources.values() if x.startswith('/**') and marker in x[:150]))
support = next(x for x in resources.values() if x.startswith('// GENERATED from dc-runtime'))
for package, filename in [('react@18.3.1/umd/react.production.min.js', 'react.min.js'), ('react-dom@18.3.1/umd/react-dom.production.min.js', 'react-dom.min.js'), ('@babel/standalone@7.29.0/babel.min.js', 'babel.min.js')]:
    support = support.replace('"https://unpkg.com/' + package + '"', 'new URL("vendor/' + filename + '", document.currentScript.src).href')
support = support.replace('if (!window.__resources) {', 'if (!window.__resources && location.protocol !== "file:") {')
put(DIST / 'support.js', support)
put(DIST / 'deck-stage.js', next(x for x in resources.values() if x.startswith('// @ds-adherence-ignore')))
# Existing system assets supply default corporate/chart examples, newer supplied images win.
for path in (ROOT / 'assets').rglob('*'):
    if path.is_file() and 'fonts' not in path.relative_to(ROOT / 'assets').parts:
        rel = path.relative_to(ROOT / 'assets')
        if rel.parts[0] == 'intro':
            rel = Path(*rel.parts[1:])
        target = DIST / 'assets' / rel
        if target not in FILES and rel.as_posix() != 'logo-seal.png':
            put(target, path.read_bytes())
# Canonical identity is verified against the live brand record by the repository gate.
put(DIST / 'assets/logo-seal.png', (ROOT / 'brand/logo.png').read_bytes())
inventory = {'schema':'tiansight.recovery/1', 'source':{'path':'archive/approved-2026-10-21/source.zip','originalFilename':'Template review and fixes (1).zip','sha256':sha((ARCHIVE/'source.zip').read_bytes())},'zipEntries':entries,'embeddedResources':resource_records,'nestedResources':nested,'template':{'path':'archive/approved-2026-10-21/template.html','sha256':sha(template.encode())}}
put(ARCHIVE / 'inventory.json', js(inventory))
asset_records = []
for path in sorted(DIST.rglob('*')):
    if path.is_file() and path.name != 'manifest.json':
        data = FILES.get(path, path.read_bytes())
        asset_records.append({'path':path.relative_to(ROOT).as_posix(),'bytes':len(data),'sha256':sha(data)})
manifest = {'schema':'tiansight.component-distribution/1','version':VERSION,'namespace':meta['namespace'],'status':'review-candidate','source':inventory['source'],'foundationVersion':(ROOT/'brand/VERSION').read_text().strip(),'entry':'dist/components/'+VERSION+'/loader.js','styles':'dist/components/'+VERSION+'/styles.css','components':meta['components'],'sourceHashes':meta['sourceHashes'],'unexposedExports':meta['unexposedExports'],'files':asset_records,'externalAssets':[x for x in nested if x['path'].startswith('brand/')]+[{'path':name,'bytes':len((ROOT/name).read_bytes()),'sha256':sha((ROOT/name).read_bytes())} for name in ('brand/fonts.css','brand/tokens.css')],'limitations':['Compiled components supplied; original JSX sources are not included.','Historical JSX and older exported bundles are archives, not the current build input.'],'dependencies':{'react':'18.3.1','react-dom':'18.3.1','d3':'7.9.0','d3-sankey':'0.12.3','lucide-static':'0.441.0','@babel/standalone':'7.29.0'}}
put(DIST / 'manifest.json', js(manifest))
put(ROOT / 'dist/components/current.json', js({'schema':'tiansight.component-channel/1','supported':VERSION,'manifest':f'{VERSION}/manifest.json','latestApprovedBuilt':None,'latestPolicy':'Latest means the latest explicitly approved release that passed build and artifact validation. This PR is a review candidate; merging alone is not approval of generated artifacts.'}))
print(f'PASS: {len(entries)} ZIP entries, {len(resources)} embedded resources, {len(nested)} nested assets, {len(meta["components"])} exports; {"verified" if CHECK else "built"} {VERSION}')
