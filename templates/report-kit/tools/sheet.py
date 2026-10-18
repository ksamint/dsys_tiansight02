"""Contact sheets of the render screenshots: python3 sheet.py <deck dir> [per sheet = 9]
Reads <deck dir>/.build/shots/<id>.png in deck order, writes <deck dir>/.build/shots/_sheet<N>.png."""
import json
import sys

from PIL import Image

deck = sys.argv[1].rstrip('/') + '/'
per = int(sys.argv[2]) if len(sys.argv) > 2 else 9
shots = deck + '.build/shots/'
order = json.load(open(deck + 'deck.json', encoding='utf-8'))['order']
W, H = 640, 360
for k in range(0, len(order), per):
    ids = order[k:k + per]
    im = Image.new('RGB', (W * 3, H * ((len(ids) + 2) // 3)), 'white')
    for i, s in enumerate(ids):
        im.paste(Image.open(f'{shots}{s}.png').convert('RGB').resize((W, H)), ((i % 3) * W, (i // 3) * H))
    im.save(f'{shots}_sheet{k // per}.png')
    print(f'{shots}_sheet{k // per}.png')
