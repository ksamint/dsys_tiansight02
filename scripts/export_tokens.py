"""Export brand/tokens.css to brand/tokens.json in the W3C Design Tokens (DTCG) format.

python3 scripts/export_tokens.py          # write brand/tokens.json
python3 scripts/export_tokens.py --check  # exit 1 if brand/tokens.json is stale

tokens.css stays the source of truth; the JSON is for design tools, native platforms and
Style Dictionary pipelines. Aliases (var(--x)) become {"$value": "{group.name}"} references,
the mobile overrides become a "mobile" mode, and each token keeps its trailing comment as
$description. Groups are derived from the token name.
"""
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
css = (root / 'brand' / 'tokens.css').read_text()

GROUPS = [
    ('color', re.compile(r'^(surface|paper|ink-primary|charcoal|gold|gold-hi|gold-deep|gold-\d+|gold-hover|gold-press|ink-muted|seal|line|line-strong|card-border|control-border|rule|watermark|scrim|focus|color-.*|text|text-muted|text-key|text-tagline|text-on-.*|positive|negative|chart-.*|surface-inverse|muted-on-inverse|line-inverse)$')),
    ('shadow', re.compile(r'^shadow-\d$')),
    ('font', re.compile(r'^(font-.*|weight-.*)$')),
    ('typography', re.compile(r'^(type-.*|text-.*|leading-.*|tracking-.*|measure-.*)$')),
    ('space', re.compile(r'^space-\d+$')),
    ('layout', re.compile(r'^(container|columns|gutter|section-gap|card-pad.*|swatch|mark-.*)$')),
    ('shape', re.compile(r'^radius.*$')),
    ('motion', re.compile(r'^(dur-.*|ease.*)$')),
    ('z', re.compile(r'^z-.*$')),
]
TYPES = {'shadow': 'shadow', 'color': 'color', 'font': 'fontFamily', 'typography': 'dimension', 'space': 'dimension', 'layout': 'dimension', 'shape': 'dimension', 'motion': 'duration', 'z': 'number'}


def group_of(name):
    for g, rx in GROUPS:
        if rx.match(name):
            return g
    return 'other'


def parse_block(block):
    out = {}
    for m in re.finditer(r'--([a-z0-9-]+):\s*([^;]+);(?:\s*/\*\s*(.*?)\s*\*/)?', block):
        if m.group(1) in out:
            raise ValueError(f'Duplicate token: --{m.group(1)}')
        out[m.group(1)] = (m.group(2).strip(), (m.group(3) or '').strip())
    return out


def value_of(raw, name_to_group):
    m = re.fullmatch(r'var\(--([a-z0-9-]+)\)', raw)
    if m and m.group(1) in name_to_group:
        return '{' + name_to_group[m.group(1)] + '.' + m.group(1) + '}'
    return raw


def export():
    root_block = re.search(r':root\s*\{(.*?)\n\}', css, re.S).group(1)
    mobile = re.search(r'@media \(max-width: 640px\)\s*\{\s*:root\s*\{(.*?)\}', css, re.S)
    base = parse_block(root_block)
    mob = parse_block(mobile.group(1)) if mobile else {}
    name_to_group = {n: group_of(n) for n in base}
    version = (Path(__file__).resolve().parents[1] / 'brand' / 'VERSION').read_text().strip()
    tokens = {'$schema': 'https://tr.designtokens.org/format/',
              '$description': f'侍天 TIANSIGHT design tokens, exported from brand/tokens.css (published guide {version}). Do not edit; run scripts/export_tokens.py.',
              '$extensions': {'tiansight': {'version': version}}}
    for name, (raw, desc) in base.items():
        g = name_to_group[name]
        entry = {'$value': value_of(raw, name_to_group)}
        t = TYPES.get(g)
        if t and not entry['$value'].startswith('{'):
            if g == 'font' and name.startswith('weight'):
                t = 'fontWeight'
            if g == 'typography' and (name.startswith('leading') or name.startswith('tracking')):
                t = 'number' if name.startswith('leading') else 'dimension'
            if g == 'motion' and name.startswith('ease'):
                t = 'cubicBezier'
            entry['$type'] = t
        if desc:
            entry['$description'] = desc
        if name in mob:
            entry['$extensions'] = {'tiansight.modes': {'mobile': value_of(mob[name][0], name_to_group)}}
        tokens.setdefault(g, {})[name] = entry
    return json.dumps(tokens, ensure_ascii=False, indent=2) + '\n'


if __name__ == '__main__':
    out = export()
    target = root / 'brand' / 'tokens.json'
    if '--check' in sys.argv:
        if not target.exists() or target.read_text() != out:
            print('brand/tokens.json is stale: run python3 scripts/export_tokens.py')
            sys.exit(1)
        print('brand/tokens.json is up to date')
    else:
        target.write_text(out)
        data = json.loads(out)
        print('wrote brand/tokens.json:', ', '.join(f'{k} {len(v)}' for k, v in data.items() if isinstance(v, dict)))
