"""Verify exported pages against screenshots/text from the identical offline HTML."""
from collections import Counter
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import unicodedata
import pymupdf as fitz
from PIL import Image, ImageChops, ImageStat
from content_lib import ROOT, read_json
from text_identity import chars, normalized, numeric_range_text


def verify_numeric_ranges(page, ranges):
    glyphs = [c for block in page.get_text('rawdict')['blocks'] if 'lines' in block for line in block['lines'] for span in line['spans'] for c in span['chars']]
    for token in ranges:
        actual = numeric_range_text(glyphs, token['rects'])
        assert normalized(actual) == normalized(token['text']), f"Numeric identity mismatch: expected {token['text']!r}, PDF {actual!r}"


def verify(deck, profile):
    output = ROOT / 'build' / deck / profile
    build = read_json(output / 'build.json')
    checks = read_json(output / '.verification/html.json')
    pdf = output / 'deck.pdf'
    doc = fitz.open(pdf)
    for key in ('contentVersion', 'systemVersion', 'htmlSha256'):
        assert checks[key] == build[key], f'Stale browser capture {key}'
    identity = ' | '.join(str(build[key]) for key in ('deckId','profile','contentVersion','systemVersion','htmlSha256'))
    assert doc.metadata['title'].endswith(identity), 'PDF artifact identity mismatch'
    assert len(doc) == build['pageCount'] == len(checks['pages']), 'PDF page count mismatch'
    fonts = {font[0] for page in doc for font in page.get_fonts()}
    def embedded(xref):
        if doc.extract_font(xref)[3]: return True
        obj = doc.xref_object(xref)
        if '/Subtype /Type3' not in obj: return False
        # Chromium may embed CJK as Type3 glyph programs instead of font files.
        procs = re.search(r'/CharProcs\s*<<(.*?)>>', obj, re.S)
        unicode_map = re.search(r'/ToUnicode\s+(\d+) 0 R', obj)
        refs = re.findall(r'(\d+) 0 R', procs[1]) if procs else []
        return bool(refs and unicode_map and doc.xref_stream(int(unicode_map[1])) and all(doc.xref_stream(int(ref)) for ref in refs))
    assert fonts and all(embedded(xref) for xref in fonts), 'Every PDF font must embed a font file or Type3 glyph programs with Unicode map'
    if shutil.which('pdffonts'):
        lines = subprocess.check_output(['pdffonts', str(pdf)], text=True).splitlines()[2:]
        assert lines and all(re.search(r'\s+yes\s+yes\s+yes\s+\d+\s+\d+\s*$', line) for line in lines), 'Fonts require embedding, subsetting and Unicode maps'
    pages = []
    for i, page in enumerate(doc):
        assert abs(page.rect.width-960)<1 and abs(page.rect.height-540)<1, f'Page {i+1}: dimensions'
        text = page.get_text()
        missing, extra = chars(checks['pages'][i]['text']) - chars(text), chars(text) - chars(checks['pages'][i]['text'])
        assert not missing and not extra, f'Page {i+1} text mismatch: missing {missing}, extra {extra}'
        assert 'numericRanges' in checks['pages'][i], 'Numeric capture missing; re-export HTML/PDF'
        verify_numeric_ranges(page, checks['pages'][i]['numericRanges'])
        clipped = [w[4] for w in page.get_text('words') if w[0]<-1 or w[1]<-1 or w[2]>page.rect.width+1 or w[3]>page.rect.height+1]
        assert not clipped, f'Page {i+1}: clipped PDF words {clipped}'
        raster=page.get_pixmap(matrix=fitz.Matrix(4/3,4/3),alpha=False)
        actual=Image.frombytes('RGB',[raster.width,raster.height],raster.samples)
        expected=Image.open(output / f'.verification/page-{i+1}.png').convert('RGB')
        assert actual.size == expected.size == (1280,720)
        difference=sum(ImageStat.Stat(ImageChops.difference(actual,expected)).mean)/3
        assert difference<12, f'Page {i+1}: pixel drift {difference:.3f}/255'
        pages.append({'page':i+1,'id':checks['pages'][i]['id'],'characters':sum(chars(text).values()),'textMatches':True,'clippedWords':0,'meanPixelDifference':round(difference,3)})
    result={'schema':'tiansight.pdf-verification/2','deckId':deck,'profile':profile,**{key:build[key] for key in ('contentVersion','systemVersion','htmlSha256')},'pdfSha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pageCount':len(pages),'pages':pages,'fontsEmbedded':True,'fontVerification':'pdffonts + embedded font streams' if shutil.which('pdffonts') else 'PyMuPDF font files or Type3 glyph streams and Unicode maps (pdffonts unavailable)','pageSizePoints':[960,540],'textComparison':'NFKC non-whitespace character multisets including punctuation/signs, plus each numeric token in visual digit order at its HTML range; positioned text blocks may reorder','passed':True}
    (output/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(f'PASS: {deck}/{profile} {len(pages)} PDF pages; text, fonts, clipping, visual drift <12/255')
    return result


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('deck');parser.add_argument('profile',nargs='?',default='client')
    args=parser.parse_args();verify(args.deck,args.profile)
