"""Build the maintained exhibit HTML from editable source and pinned distribution."""
from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
VERSION = '2026.10.21-e0a760'
DECK = ROOT / 'deliverables/exhibit-design'
source = (DECK / 'src/TiansightDeck-Exhibit.dc.html').read_text()
inputs = [DECK / 'src/TiansightDeck-Exhibit.dc.html', *(ROOT / 'content' / n for n in ('team.json','contact.json','slide-catalog.js'))]
content_version = hashlib.sha256(b''.join(p.read_bytes() for p in inputs)).hexdigest()
body = re.search(r'<body>(.*?)</body>', source, re.S)[1]
body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S)
body = re.sub(r' from="[^"]*deck-stage.js"', '', body)
body = body.replace('from="../../../dist/', 'from="../../dist/').replace('"./exhibit/', '"./src/exhibit/')
base = f'../../dist/components/{VERSION}'
scripts = [f'{base}/{p}' for p in ['vendor/react.min.js','vendor/react-dom.min.js','vendor/d3.min.js','vendor/d3-sankey.min.js','vendor/lucide-icons.js','_ds_bundle.js','deck-stage.js']]
scripts += ['../../content/team.js','../../content/contact.js','../../content/slide-catalog.js',f'{base}/support.js']
html = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="tiansight-content-version" content="{content_version}">
<meta name="tiansight-system-version" content="{VERSION}">
<title>侍天 TIANSIGHT · 餐饮展陈与厨房设计</title>
<link rel="stylesheet" href="{base}/styles.css">
<style>html,body{{margin:0;background:var(--surface)}}.sr-only{{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}}deck-stage:not(:defined){{visibility:hidden}}</style>
''' + '\n'.join(f'<script src="{p}"></script>' for p in scripts) + f'''
</head><body data-content-version="{content_version}" data-system-version="{VERSION}">
<h1 class="sr-only">侍天 TIANSIGHT · 餐饮展陈与厨房设计</h1><main aria-label="展陈与厨房设计演示文稿">
{body}
</main></body></html>\n'''
manifest = {'schema':'tiansight.artifact/1','deckId':'exhibit','contentVersion':content_version,'designSystemVersion':VERSION,'source':'src/TiansightDeck-Exhibit.dc.html','html':'index.html','htmlSha256':hashlib.sha256(html.encode()).hexdigest(),'pdf':'exhibit-design.pdf','approval':'review-candidate'}
for p, text in [(DECK/'index.html', html),(DECK/'build.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')]:
    if '--check' in sys.argv:
        assert p.is_file() and p.read_text()==text, f'Stale {p.relative_to(ROOT)}'
    else:
        p.write_text(text)
print('PASS: exhibit HTML and version metadata ' + content_version[:12])
