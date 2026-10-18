from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / 'brand'
DIST = ROOT / 'dist' / 'product'


def namespace(css):
    return re.sub(r'--(?!ts-)([a-z][a-z0-9-]*)', r'--ts-\1', css)


def render():
    parts = ['tokens.css', 'components.css', 'product.css']
    css = '\n'.join((BRAND / name).read_text() for name in parts)
    css = namespace(css)
    css = re.sub(r'(?m)^th\[aria-sort', '.ts-root th[aria-sort', css)
    files = {
        'tiansight.css': css.encode(),
        'tiansight.js': (BRAND / 'runtime.js').read_bytes(),
        'tokens.json': (BRAND / 'tokens.json').read_bytes(),
        'icons.svg': (BRAND / 'icons.svg').read_bytes(),
        'logo.png': (BRAND / 'logo.png').read_bytes(),
    }
    font_css = []
    for rule in re.findall(r'@font-face\s*\{[^}]*\}', (BRAND / 'fonts.css').read_text()):
        filename = re.search(r'url\("fonts/([^"]+)"\)', rule)
        if filename and not (BRAND / 'fonts' / filename.group(1)).is_file():
            raise ValueError('Missing bundled font: ' + filename.group(1))
        if filename:
            files['fonts/' + filename.group(1)] = (BRAND / 'fonts' / filename.group(1)).read_bytes()
            font_css.append(rule)
    files['fonts.css'] = ('\n'.join(font_css) + '\n').encode()
    for license_file in sorted((BRAND / 'fonts').glob('OFL-*.txt')):
        files['fonts/' + license_file.name] = license_file.read_bytes()
    hashes = {name: {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)} for name, body in sorted(files.items())}
    digest = hashlib.sha256(''.join(name + '\0' + entry['sha256'] + '\0' + str(entry['bytes']) + '\n' for name, entry in sorted(hashes.items())).encode()).hexdigest()
    manifest = {'schema': 'tiansight-product/v1', 'brand_version': (BRAND / 'VERSION').read_text().strip(),
                'content_sha256': digest, 'files': hashes,
                'font_policy': 'same-origin when bundled; local serif fallback otherwise'}
    files['manifest.json'] = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
    return files


def build(check=False):
    files = render()
    stale = [name for name, body in files.items() if not (DIST / name).is_file() or (DIST / name).read_bytes() != body]
    if check:
        if stale:
            raise ValueError('Product distribution stale: ' + ', '.join(stale))
    else:
        for name, body in files.items():
            target = DIST / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(body)
    print('Product distribution verified' if check else 'Product distribution built')
    return 0


if __name__ == '__main__':
    build('--check' in sys.argv)
