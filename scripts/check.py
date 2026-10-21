"""Offline baseline check: python3 scripts/check.py [--render].

--render additionally runs node scripts/snapshot.mjs --check (headless Chromium layout regression)."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
brand = root / 'brand'
source = json.loads((brand / 'source.json').read_text())
guide = (brand / 'guide.md').read_text()
tokens = (brand / 'tokens.css').read_text()
base = (brand / 'base.css').read_text()
components = (brand / 'components.css').read_text()
specimen = (brand / 'index.html').read_text()
problems = []
notes = []


def token_value(name):
    match = re.search(r'--' + re.escape(name) + r':\s*([^;]+);', tokens)
    return match[1].strip() if match else None


# 1. Published theme → tokens.css
mapping = {'surface': 'surface', 'paper': 'paper', 'ink-primary': 'primary',
           'charcoal': 'ink', 'gold': 'accent', 'ink-muted': 'muted', 'seal': 'secondary'}
for token, key in mapping.items():
    value = token_value(token)
    if not value or value.lower() != source['theme'][key].lower():
        problems.append(f'tokens.css --{token} != theme.{key}')
line = token_value('line')
if not line or re.sub(r'\s', '', line) != re.sub(r'\s', '', source['theme']['line']):
    problems.append('tokens.css --line != theme.line')

# 2. Guide colour table → tokens.css (every row of §1)
guide_rows = re.findall(r'^\| `--([a-z-]+)` \|[^|]*\| `(#[0-9A-Fa-f]{6})` \|', guide, re.M)
if len(guide_rows) < 9:
    problems.append('guide colour table not found')
for token, hexval in guide_rows:
    if (token_value(token) or '').lower() != hexval.lower():
        problems.append(f'tokens.css --{token} != guide {hexval}')

# 3. Official logo
if hashlib.sha256((brand / 'logo.png').read_bytes()).hexdigest() != source['logo']['sha256']:
    problems.append('logo.png hash mismatch')
if 'Serif everywhere' not in guide:
    problems.append('guide.md missing "Serif everywhere"')

# 3b. fonts.css declares only the three families and reports files not yet supplied
fonts_css = (brand / 'fonts.css').read_text()
for family in set(re.findall(r'font-family:\s*"([^"]+)"', fonts_css)):
    if family not in ('Noto Serif SC', 'Noto Serif', 'IBM Plex Mono'):
        problems.append(f'fonts.css: unexpected family {family}')
missing_fonts = [f for f in re.findall(r'url\("fonts/([^"]+)"\)', fonts_css) if not (brand / 'fonts' / f).is_file()]
if missing_fonts:
    notes.append('webfonts not yet supplied: ' + ', '.join(missing_fonts))

# 4. Foundation policy: serif fallbacks only, no banned families, no raw colour outside tokens.css
for name, css in (('tokens.css', tokens), ('base.css', base), ('components.css', components), ('product.css', (brand / 'product.css').read_text())):
    for family in re.findall(r'--font-[a-z]+:\s*([^;]+);', css):
        if 'sans-serif' in family:
            problems.append(f'{name}: sans-serif fallback in font stack')
    if re.search(r'\b(Inter|Roboto|Arial|Helvetica)\b', css):
        problems.append(f'{name}: banned font family')
    if name != 'tokens.css' and re.search(r'#[0-9A-Fa-f]{3,8}\b|rgba?\(', css):
        problems.append(f'{name}: raw colour value, use a token')
    for radius in re.findall(r'border-radius:\s*([^;]+);', css):
        if radius not in ('var(--radius)', 'var(--radius-pill)', '50%'):
            problems.append(f'{name}: border-radius {radius} (only 2px, pill, 50%)')
    if 'linear-gradient' in css or 'radial-gradient' in css:
        problems.append(f'{name}: gradient')

# 5. Every var(--x) used in base/components/specimen is declared in tokens.css
declared = set(re.findall(r'--([a-z0-9-]+):', tokens + base + components + specimen))
declared |= {'span', 'span-md', 'swatch-color', 'mark-size', 'stamp-size', 'compass-size'}
used = set(re.findall(r'var\(--([a-z0-9-]+)', base + components + specimen))
for missing in sorted(used - declared):
    problems.append(f'undeclared token --{missing}')

# 6. Specimen is offline: no remote scripts, styles, fonts, or images; only one inline demo script (tabs, dialog, motion)
for url in re.findall(r'(?:src|href)="(https?://[^"]+)"', specimen):
    problems.append(f'index.html loads remote resource {url}')
if re.search(r'<script[^>]*\ssrc=', specimen):
    problems.append('index.html loads an external script')
if specimen.count('<script') > 1:
    problems.append('index.html has more than one inline script')
for ref in re.findall(r'(?:src|href)="([^"#:]+)"', specimen):
    if not (brand / ref).is_file():
        problems.append(f'index.html references missing file {ref}')
if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', specimen.replace('✓', '').replace('✕', '')):
    problems.append('index.html contains emoji')

# 7. Consumers (deck, website) follow the same policy and stay offline
PHOTO = re.compile(r'photos/(founder-0[1-5]|missing)\.png$')
missing_photos = set()
for consumer in ('deck', 'website', 'report', 'people'):
    folder = root / consumer
    pages = sorted(folder.glob('*.html'))
    html = ''.join(p.read_text() for p in pages)
    css = ''.join(f.read_text() for f in folder.glob('*.css'))
    if re.search(r'#[0-9A-Fa-f]{3,8}\b|rgba?\(', css):
        problems.append(f'{consumer}: raw colour value in CSS, use a token')
    for style in re.findall(r'style="([^"]*)"', html):
        if re.search(r'#[0-9A-Fa-f]{3,8}\b|rgba?\(', style):
            problems.append(f'{consumer}: raw colour value in inline style')
            break
    for radius in re.findall(r'border-radius:\s*([^;]+);', css):
        if radius not in ('var(--radius)', 'var(--radius-pill)', '50%', '0'):
            problems.append(f'{consumer}: border-radius {radius}')
    if re.search(r'\b(Inter|Roboto|Arial|Helvetica)\b', css) or 'sans-serif' in css:
        problems.append(f'{consumer}: banned or sans-serif font family')
    for url in re.findall(r'(?:src|href)="(https?://[^"]+)"', html):
        problems.append(f'{consumer}: loads remote resource {url}')
    for ref in set(re.findall(r'(?<![\w-])(?:src|href)="([^"#:]+)"', html)):
        if (folder / ref).is_file():
            continue
        if PHOTO.search(ref):
            missing_photos.add(ref.split('/')[-1])
        else:
            problems.append(f'{consumer}: references missing file {ref}')
    if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', html.replace('✓', '').replace('✕', '')):
        problems.append(f'{consumer}: contains emoji')
    used = set(re.findall(r'var\(--([a-z0-9-]+)', css + html))
    local = set(re.findall(r'--([a-z0-9-]+):', css + html))
    for missing in sorted(used - declared - local - {'h'}):
        problems.append(f'{consumer}: undeclared token --{missing}')
    if consumer in ('website', 'people'):
        # A block marked data-lexicon-note documents the substitutions, so it quotes the avoided words.
        prose = re.sub(r'<div[^>]*data-lexicon-note>.*?</ul>\s*</div>', '', html, flags=re.S)
        for word in ('赋能', '抓手', '闭环', '包治百病', '颠覆', '爆款', '裂变', '解决方案', '打法'):
            if word in prose:
                problems.append(f'{consumer}: avoided lexicon "{word}"')

# 8. Generated outputs must match their builders
sys.path.insert(0, str(root / 'scripts'))
import build_report  # noqa: E402
import build_people  # noqa: E402
if build_report.render() != (root / 'report' / 'index.html').read_text():
    problems.append('report/index.html is stale: run python3 scripts/build_report.py')
for path, out in build_people.render_all().items():
    if not path.exists() or path.read_text() != out:
        problems.append(f'{path.relative_to(root)} is stale: run python3 scripts/build_people.py')

# 8b. HTML report system: sample deck fresh and passing its gate; report.css follows the policy
rep_css = (root / 'html-system' / 'report.css').read_text()
if re.search(r'#[0-9A-Fa-f]{3,8}\b', rep_css):
    problems.append('html-system/report.css: raw hex colour')
if re.search(r'\b(Inter|Roboto|Arial|Helvetica)\b', rep_css) or 'sans-serif' in rep_css:
    problems.append('html-system/report.css: banned font family')
gate = subprocess.run([sys.executable, str(root / 'html-system' / 'check_report.py'), str(root / 'html-system' / 'sample')], capture_output=True, text=True)
if gate.returncode != 0:
    problems.append('html-system/sample: ' + gate.stdout.strip().replace('\n', ' '))
for rel in ('html-system/sample/index.html',):
    text = (root / rel).read_text()
    for url in re.findall(r'(?:src|href)="(https?://[^"]+)"', text):
        problems.append(f'{rel}: loads remote resource {url}')

# 8c. Inline icon sprites match brand/icons.svg
sync = subprocess.run([sys.executable, str(root / 'scripts' / 'sync_icons.py'), '--check'], capture_output=True, text=True)
if sync.returncode != 0:
    problems.append(sync.stdout.strip())
for rel in ('brand/index.html', 'website/index.html', 'website/team.html', 'deck/index.html', 'index.html'):
    text = (root / rel).read_text()
    ids = set(re.findall(r'<symbol id="([^"]+)"', text))
    for used in set(re.findall(r'<use href="#([^"]+)"', text)):
        if used not in ids:
            problems.append(f'{rel}: icon #{used} not in inline sprite')

# 8d. Token export and accessibility lint are in step with the sources
for label, cmd in (('tokens.json', [sys.executable, str(root / 'scripts' / 'export_tokens.py'), '--check']),
                   ('lint', [sys.executable, str(root / 'scripts' / 'lint_html.py')]),
                   ('dist', [sys.executable, str(root / 'scripts' / 'build_dist.py'), '--check']),
                   ('contrast', [sys.executable, str(root / 'scripts' / 'check_contrast.py'), '--quiet']),
                   ('profiles', [sys.executable, str(root / 'scripts' / 'build_profiles.py'), '--check'])):
    run = subprocess.run(cmd, capture_output=True, text=True)
    if run.returncode != 0:
        problems.append(f'{label}: ' + run.stdout.strip().replace('\n', ' '))

product_tests = subprocess.run([sys.executable, str(root / 'scripts/test_product.py')], capture_output=True, text=True)
if product_tests.returncode:
    problems.append('product: ' + product_tests.stderr)

# 8h. Report kit: unit and static tests, template deck fresh (deliverables/report-template)
kit_tests = subprocess.run([sys.executable, str(root / 'templates/report-kit/tests/test_kit.py')], capture_output=True, text=True)
if kit_tests.returncode:
    problems.append('report kit: ' + kit_tests.stderr.strip().splitlines()[-1] + ' — run python3 templates/report-kit/tests/test_kit.py')

# 8i. Product runtime: chartTheme() reads the chart tokens, so charts in apps match the foundation
runtime_js = (brand / 'runtime.js').read_text()
theme = re.search(r'function chartTheme\(.*?\n  \}', runtime_js, re.S)
if not theme:
    problems.append('brand/runtime.js: chartTheme() not found')
else:
    body = theme[0]
    for name in sorted(set(re.findall(r"token\('([a-z0-9-]+)'\)", body))):
        if token_value(name) is None:
            problems.append(f'brand/runtime.js: chartTheme() reads undeclared token --{name}')
    if not re.search(r"series:\s*\[token\('chart-1'\),\s*token\('chart-2'\),\s*token\('chart-3'\)\]", body):
        problems.append('brand/runtime.js: chartTheme() series must be --chart-1..3 (guide §5)')
    if not re.search(r"benchmark:\s*token\('chart-benchmark'\)", body):
        problems.append('brand/runtime.js: chartTheme() benchmark must be --chart-benchmark (translucent, owner decision 2026-10-14)')

# 8j. Public repository: client deliverables stay out of reference/source (docs/maintaining.md §6)
tracked = subprocess.run(['git', 'ls-files', 'reference/source'], cwd=root, capture_output=True, text=True).stdout.split()
for path in tracked:
    if path != 'reference/source/README.md':
        problems.append(f'{path}: client deliverable committed; keep it local (reference/source/README.md)')

# 8k. Public repository: no raw data files (docs/maintaining.md §6). Invented sample tables are allowed
# only under the sample folders below; spreadsheets, databases and data dumps are never committed.
DATA_OK = ('html-system/sample/data/',)
DATA_EXT = ('.xlsx', '.xls', '.xlsm', '.xlsb', '.numbers', '.parquet', '.feather', '.sqlite', '.sqlite3', '.db', '.sav', '.dta', '.pkl', '.csv', '.tsv')
for path in subprocess.run(['git', 'ls-files'], cwd=root, capture_output=True, text=True).stdout.splitlines():
    if path.lower().endswith(DATA_EXT) and not path.startswith(DATA_OK):
        problems.append(f'{path}: raw data file in the public repository (docs/maintaining.md §6)')

# 8e. Layout regression (opt-in: needs the global Playwright install)
if '--render' in sys.argv:
    run = subprocess.run(['node', str(root / 'scripts' / 'snapshot.mjs'), '--check'], capture_output=True, text=True)
    if run.returncode != 0:
        problems.append('snapshot: ' + run.stdout.strip().replace('\n', ' '))
    else:
        notes.append(run.stdout.strip())

# 8f. Version file matches the guide
version = (brand / 'VERSION').read_text().strip()
if f'· {version} ·' not in guide:
    problems.append(f'brand/VERSION {version} not the version named in guide.md')
if f'"version": "{version}"' not in (brand / 'tokens.json').read_text():
    problems.append('brand/tokens.json version differs from brand/VERSION')
if not (root / 'dist' / f'tiansight-{version}.css').is_file():
    problems.append(f'dist/tiansight-{version}.css missing: run python3 scripts/build_dist.py')

# Append to scripts/check.py before "# 9. Supplied export is intact" — v0.7 assertions.

# 8g. v0.7 rulings
# Q11: charcoal never a page ground; only .ts-card-charcoal, at most one per page/slide
for consumer in ('deck', 'website', 'report'):
    for page in sorted((root / consumer).glob('*.html')):
        html = page.read_text()
        if re.search(r'<(section|body|main)[^>]*class="[^"]*ts-ground-charcoal', html):
            problems.append(f'{page.relative_to(root)}: charcoal used as a page ground (guide §7)')
        for sect in re.findall(r'<section[^>]*>.*?</section>', html, re.S):
            if sect.count('ts-card-charcoal') > 1:
                problems.append(f'{page.relative_to(root)}: more than one charcoal card in a section')
# Q2: tagline never in bright gold outside charcoal scopes
if re.search(r'\.ts-tagline\s*\{[^}]*--gold-hi', components):
    problems.append('components.css: .ts-tagline uses --gold-hi on pale (ruling Q2)')
# p5: semantic chart colours stay in report/
for consumer in ('deck', 'website', 'brand'):
    text = ''.join(p.read_text() for p in (root / consumer).glob('*.html')) + ''.join(p.read_text() for p in (root / consumer).glob('*.css') if p.name != 'tokens.css')
    for tokname in ('chart-growth', 'chart-caution', 'chart-benchmark-solid', 'chart-loss'):
        if f'var(--{tokname})' in text:
            problems.append(f'{consumer}: --{tokname} is report-only (guide §5)')
# Mark lockup: the CN name is never set beside the mark
for rel in ('brand/index.html', 'website/index.html', 'website/team.html', 'deck/index.html', 'report/index.html', 'index.html', 'people/templates/team.html', 'report/template.html'):
    if '<span class="ts-wordmark"><b>侍天</b>' in (root / rel).read_text():
        problems.append(f'{rel}: CN name repeated beside the mark (guide §3 lockup)')
# gold ramp and shadow tokens declared with the published values
for tokname, hexval in (('gold-100', '#F3E7CF'), ('gold-300', '#D4A862'), ('gold-400', '#A8842F'), ('gold-500', '#76551F'), ('gold-600', '#5C4218'), ('gold-700', '#3F2D0F')):
    if (token_value(tokname) or '').lower() != hexval.lower():
        problems.append(f'tokens.css --{tokname} != {hexval}')

# 9. Supplied export is intact
exported_tokens = json.loads((brand / 'tokens.json').read_text())
for group, name, expected_type in (('color', 'gold-600', 'color'), ('shadow', 'shadow-3', 'shadow'), ('typography', 'type-ui', 'dimension')):
    if exported_tokens.get(group, {}).get(name, {}).get('$type') != expected_type:
        problems.append(f'tokens.json: {name} must be {group}/{expected_type}')

# Current runtime and maintained content must be reproducible offline.
for command in ([sys.executable, 'scripts/build_component_runtime.py', '--check'],
                [sys.executable, 'scripts/build_content.py', '--check'],
                [sys.executable, 'scripts/build_exhibit.py', '--check'],
                ['node', 'scripts/build_deck_catalog.mjs', '--check']):
    run = subprocess.run(command, cwd=root, capture_output=True, text=True)
    if run.returncode:
        problems.append(' '.join(command) + ': ' + run.stdout + run.stderr)

# The reviewed PDF must identify exactly the HTML/content/system being shipped.
artifact_dir = root / 'deliverables/exhibit-design'
artifact = json.loads((artifact_dir / 'build.json').read_text())
verification = json.loads((artifact_dir / 'pdf-verification.json').read_text())
for key in ('contentVersion', 'designSystemVersion', 'htmlSha256'):
    if artifact[key] != verification[key]:
        problems.append('Exhibit PDF verification is stale: ' + key)
if hashlib.sha256((artifact_dir / artifact['pdf']).read_bytes()).hexdigest() != verification['pdfSha256']:
    problems.append('Exhibit PDF hash differs from the verified artifact')

# Archived export completeness remains checked independently.
export = root / 'TIANSIGHT 侍天 Design System'
manifest = json.loads((export / '_ds_manifest.json').read_text())
for entry in manifest['components']:
    if not (export / entry['sourcePath']).is_file():
        problems.append(f'export missing {entry["sourcePath"]}')
for entry in manifest['cards']:
    if not (export / entry['path']).is_file():
        problems.append(f'export missing {entry["path"]}')

if problems:
    print('FAIL')
    for problem in problems:
        print(' -', problem)
    sys.exit(1)
if missing_photos:
    notes.append('portraits not yet supplied: ' + ', '.join(sorted(missing_photos)))
for note in notes:
    print('note:', note)
print(f"PASS: official palette, {len(guide_rows)} guide tokens, logo hash, foundation policy, tokens.json, dist bundle, a11y lint, contrast, profiles, chart theme, public reference, no raw data, "
      f"offline specimen, deck, website, report and people, report kit, 105 current component exports; {len(manifest['components'])} archived exports and {len(manifest['cards'])} cards")
