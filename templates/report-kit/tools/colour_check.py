"""Colour budget on the render screenshots: python3 colour_check.py <deck dir> [limit % = 5]

朱红 (seal, #8C3228) may cover at most 5% of a slide (brand QA §8.6). Counts pixels within ±12 per
channel of the seal colour in <deck dir>/.build/shots/<id>.png. Exit 1 when a slide is over."""
import json
import sys

from PIL import Image

deck = sys.argv[1].rstrip('/') + '/'
limit = float(sys.argv[2]) if len(sys.argv) > 2 else 5.0
order = json.load(open(deck + 'deck.json', encoding='utf-8'))['order']
SEAL = (0x8C, 0x32, 0x28)
over = []
for sid in order:
    im = Image.open(f'{deck}.build/shots/{sid}.png').convert('RGB').resize((480, 270))
    px = (im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata())
    n = sum(1 for p in px if all(abs(a - b) <= 12 for a, b in zip(p, SEAL)))
    share = 100 * n / len(px)
    if share > limit:
        over.append((sid, share))
for sid, share in over:
    print(f'    {sid}: SEAL {share:.1f}% of the slide (limit {limit:g}%)')
print(f'colour: {len(order)} slides, {len(over)} over the 朱红 budget')
sys.exit(1 if over else 0)
