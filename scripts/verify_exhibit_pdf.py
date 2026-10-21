"""Verify PDF against the browser check: uv run --with pillow --with pymupdf python scripts/verify_exhibit_pdf.py."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import re
import subprocess
import unicodedata
import pymupdf as fitz
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
deck = ROOT / 'deliverables/exhibit-design'
checks = json.loads((ROOT / '.build/runtime-check/results.json').read_text())
build = json.loads((deck / 'build.json').read_text())
pdf = deck / 'exhibit-design.pdf'
doc = fitz.open(pdf)
assert len(doc) == len(checks['exhibitText']) == 41
assert build['contentVersion'] in doc.metadata['title']
assert build['designSystemVersion'] in doc.metadata['title']
fonts = subprocess.check_output(['pdffonts', str(pdf)], text=True).splitlines()[2:]
assert fonts and all(re.search(r'\s+yes\s+yes\s+yes\s+\d+\s+\d+\s*$', line) for line in fonts), 'All PDF fonts must be embedded/subset/Unicode mapped'

def chars(text):
    return Counter(re.findall(r'[a-zA-Z0-9\u4e00-\u9fff]', unicodedata.normalize('NFKC', text)))

pages = []
for i, page in enumerate(doc):
    assert abs(page.rect.width - 960) < 1 and abs(page.rect.height - 540) < 1
    text = page.get_text()
    missing = chars(checks['exhibitText'][i]) - chars(text)
    extra = chars(text) - chars(checks['exhibitText'][i])
    assert not missing and not extra, f'Page {i+1} text mismatch: missing {missing}, extra {extra}'
    clipped = [w[4] for w in page.get_text('words') if w[0] < -1 or w[1] < -1 or w[2] > page.rect.width+1 or w[3] > page.rect.height+1]
    assert not clipped, f'Page {i+1}: clipped words {clipped}'
    raster = page.get_pixmap(matrix=fitz.Matrix(4/3,4/3), alpha=False)
    actual = Image.frombytes('RGB',[raster.width,raster.height],raster.samples)
    html = Image.open(ROOT / f'.build/runtime-check/exhibit-{i+1:02d}.png').convert('RGB')
    assert actual.size == html.size == (1280,720)
    difference = sum(ImageStat.Stat(ImageChops.difference(actual,html)).mean)/3
    assert difference < 12, f'Page {i+1}: PDF/HTML image drift {difference:.2f}/255'
    actual.save(ROOT / f'.build/runtime-check/pdf-{i+1:02d}.png')
    pages.append({'page':i+1,'characters':sum(chars(text).values()),'imageCount':len(page.get_images()),'meanPixelDifference':round(difference,3),'textMatches':True,'clippedWords':0})
result = {'schema':'tiansight.pdf-verification/1','contentVersion':build['contentVersion'],'designSystemVersion':build['designSystemVersion'],'htmlSha256':build['htmlSha256'],'pdfSha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pages':pages,'fontsEmbedded':True,'fontFamilies':sorted(set(re.sub(r'^[A-Z]+\+', '',line.split()[0]).split('-')[0] for line in fonts)),'pageSizePoints':[960,540],'comparison':'Same-page alphanumeric/CJK character multisets, word bounds, and rendered 1280x720 images; screenshots are browser output from the same HTML.'}
(deck / 'pdf-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'PASS: 41 PDF pages, all HTML text preserved, fonts embedded, no clipped words; max visual difference {max(x["meanPixelDifference"] for x in pages):.3f}/255')
