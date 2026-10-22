"""PDF comparison primitives; keep punctuation and each number's digit order."""
from collections import Counter
import re
import unicodedata

NUMBER_PATTERN = r'[+−-]?\d+(?:[.,]\d+)*(?:%|\+(?!\d))?'


def normalized(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text) if not c.isspace() and c != '\u2060')


def chars(text):
    return Counter(normalized(text))


def numbers(text):
    return Counter(re.findall(NUMBER_PATTERN, unicodedata.normalize('NFKC', text).replace('\u2060', '')))


def numeric_range_text(glyphs, rects):
    """Read numeric glyphs in each HTML line rectangle in visual digit order."""
    actual = ''
    for rect in rects:
        x0, y0, x1, y1 = [v * .75 for v in rect]
        selected = [g for g in glyphs if x0-.4 <= (g['bbox'][0]+g['bbox'][2])/2 <= x1+.4 and y0-1 <= (g['bbox'][1]+g['bbox'][3])/2 <= y1+1 and re.fullmatch(r'[+−0-9.,%\-]', unicodedata.normalize('NFKC', g['c']))]
        selected.sort(key=lambda g: g['bbox'][0])
        actual += ''.join(g['c'] for g in selected)
    return normalized(actual)
