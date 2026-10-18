"""Rebuild, check and stage the public preview: python3 scripts/build_preview.py."""
from pathlib import Path
import json
import shutil
import subprocess
import sys

from lint_html import lint

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'


def build():
    for args in (
        ['scripts/export_tokens.py'],
        ['scripts/sync_icons.py'],
        ['scripts/build_people.py'],
        ['scripts/build_report.py'],
        ['html-system/build_deck.py', 'html-system/sample'],
        ['scripts/build_dist.py'],
        ['scripts/check.py'],
    ):
        subprocess.run([sys.executable, *args], cwd=ROOT, check=True)

    if OUT.is_symlink():
        raise ValueError('_site must not be a symlink')
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    # Only preview assets and documentation; archived exports and source reports stay out.
    paths = [ROOT / name for name in ('index.html', 'CNAME', 'README.md', 'CHANGELOG.md', 'reference/catalogue.md')]
    for folder in ('brand', 'dist', 'docs', 'skills', 'website', 'deck', 'report', 'people', 'html-system'):
        for path in (ROOT / folder).rglob('*'):
            rel = path.relative_to(ROOT)
            if 'templates' in rel.parts or 'export' in rel.parts:
                continue
            # Claude Design System snapshot: preview cards render only inside that artifact.
            if rel.parts[:2] == ('docs', 'claude-design-system'):
                continue
            if path.suffix.lower() in {'.html', '.css', '.js', '.json', '.csv', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff2', '.md'} or (path.suffix == '.txt' and path.name.startswith('OFL-') and 'fonts' in rel.parts):
                paths.append(path)
    for path in paths:
        if path.is_symlink() or ROOT not in path.resolve().parents:
            raise ValueError(f'Preview input must be a regular repository file: {path}')
        target = OUT / path.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
    (OUT / '.nojekyll').touch()
    (OUT / 'build.json').write_text(json.dumps({
        'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
        'version': (ROOT / 'brand/VERSION').read_text().strip(),
    }) + '\n')
    problems = [(str(page.relative_to(OUT)), lint(page)) for page in OUT.rglob('*.html')]
    problems = [(page, errors) for page, errors in problems if errors]
    assert not problems, problems
    assert (OUT / 'brand/index.html').is_file()
    manifest = json.loads((OUT / 'dist/product/manifest.json').read_text())
    for name in manifest['files']:
        assert (OUT / 'dist/product' / name).is_file(), f'Missing product asset: {name}'
    assert not (OUT / '.git').exists() and not (OUT / 'reference/source').exists()
    print(f'PASS: staged {len(paths)} preview files in _site; HTML links resolve')


if __name__ == '__main__':
    build()
