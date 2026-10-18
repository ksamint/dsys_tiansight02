"""WCAG contrast audit of every colour pairing the system actually uses.

    python3 scripts/check_contrast.py           # table plus PASS/FAIL
    python3 scripts/check_contrast.py --quiet   # only failures

Colours come from brand/tokens.css, so the audit follows the tokens rather than a copy of them.
Translucent tokens are composited over the ground they sit on before the ratio is computed.

Levels, from WCAG 2.1:
  body   4.5:1  text below 24px, or below 18.66px bold
  large  3.0:1  text 24px and above (the display, tagline, key numbers, chart value labels)
  ui     3.0:1  boundaries a user must see: focus ring, active underline, control borders
  decor  none   hairlines, watermarks and grids, which carry no information on their own
  waived none   the guide or the owner mandates the colour; WAIVERS below records why it is safe

A pairing that is decorative here must stay decorative: if a hairline ever becomes the only thing
distinguishing two controls, move it to "ui" and give it a colour that clears 3:1.
"""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
css = (root / 'brand' / 'tokens.css').read_text()

# ── Pairings the system relies on. Foreground, background, level, where it appears.
PAIRS = [
    ('text', 'surface', 'body', '正文与标题，页面底'),
    ('text', 'paper', 'body', '正文，卡片底'),
    ('text', 'ink-primary', 'body', '主按钮文字，素墨色块'),
    ('text-muted', 'surface', 'body', '辅助文字，页面底'),
    ('text-muted', 'paper', 'body', '辅助文字，卡片底'),
    ('color-caption', 'surface', 'body', '题注，页面底'),
    ('color-caption', 'paper', 'body', '题注，卡片底'),
    ('color-caption', 'ink-primary', 'body', '题注，素墨色块'),
    ('seal', 'surface', 'body', '警示与否定，页面底'),
    ('seal', 'paper', 'body', '警示与否定，卡片底'),
    ('text-key', 'surface', 'waived', '关键数字与标语：指南 §1 指定明金'),
    ('text-key', 'charcoal', 'body', '明金，玄墨底'),
    ('text-on-charcoal', 'charcoal', 'body', '正文，玄墨底'),
    ('text-on-inverse', 'surface-inverse', 'body', '反色卡片正文（v0.7）'),
    ('muted-on-inverse', 'surface-inverse', 'body', '反色卡片次要文字（v0.7）'),
    ('text-key', 'surface-inverse', 'body', '反色卡片上的明金数字（v0.7）'),
    ('text-tagline', 'surface', 'body', '标语 智慧领航者，深金，任何字号（Q2，v0.7）'),
    ('text-tagline', 'paper', 'body', '标语，卡片底'),
    ('gold-deep', 'surface', 'body', '描边徽章文字，页面底（.ts-badge-outline）'),
    ('gold-deep', 'paper', 'body', '描边徽章文字，卡片底'),
    ('line-inverse', 'surface-inverse', 'decor', '反色卡片分隔线'),
    ('gold', 'surface', 'ui', '导航与描边，页面底'),
    ('gold', 'paper', 'ui', '卡片描边'),
    ('focus', 'surface', 'ui', '焦点环，页面底'),
    ('focus', 'paper', 'ui', '焦点环，卡片底'),
    ('control-border', 'surface', 'ui', '输入框与标签边界，页面底'),
    ('control-border', 'paper', 'ui', '输入框与标签边界，卡片底'),
    ('card-border', 'paper', 'decor', '卡片描边；卡片靠宣纸底与内容成立，描边只是修饰'),
    ('line-strong', 'surface', 'decor', '分隔线与链接下划线；从不作为控件唯一边界'),
    ('chart-1', 'paper', 'waived', '图表第一系列：指南 §5 指定明金'),
    ('chart-2', 'paper', 'ui', '图表第二系列'),
    ('chart-3', 'paper', 'ui', '图表第三系列'),
    ('chart-axis', 'paper', 'body', '坐标刻度文字'),
    ('chart-benchmark', 'paper', 'waived', '基准（半透明令牌）：负责人 2026-10-14 决定保留'),
    ('chart-benchmark-solid', 'paper', 'ui', '基准实线（v0.7，仅报告）'),
    ('chart-growth', 'paper', 'ui', '增长（v0.7，仅报告）'),
    ('chart-caution', 'paper', 'ui', '关注（v0.7，仅报告）'),
    ('line', 'surface', 'decor', '发丝线'),
    ('chart-grid', 'paper', 'decor', '网格线'),
    ('watermark', 'surface', 'decor', '罗盘水印'),
    ('ink-primary', 'surface', 'decor', '素墨色块本身，靠金色描边定界'),
]
MIN = {'body': 4.5, 'large': 3.0, 'ui': 3.0, 'decor': 0.0, 'waived': 0.0}

# Pairings the published guide mandates and this repository may not change. They are listed, not
# hidden: each says what the guide requires and what carries the meaning instead. The first
# one is a v0.6 ruling that v0.7 kept.
WAIVERS = {
    ('text-key', 'surface'): '明金作关键数字与标语是指南 §1 的规定。浅底上它永远不是唯一线索：'
                             '数字旁有玄墨题注与单位，标语旁有中文标题。玄墨底上为 8.4:1。',
    ('chart-benchmark', 'paper'): '半透明基准令牌由负责人于 2026-10-14 决定保留（docs/maintaining.md）；'
                                  '打印参考色 #B9B2A7。基准系列总有图例与数值标签，不靠颜色单独承载信息。',
    ('chart-1', 'paper'): '明金作第一数据系列是指南 §5 的规定。每根条形都带玄墨数值标签，'
                          '坐标轴与刻度为素墨灰 5.5:1，图形不靠颜色单独承载信息。',
}


def raw(name):
    match = re.search(r'--' + re.escape(name) + r':\s*([^;]+);', css)
    if not match:
        raise SystemExit(f'token --{name} not found in brand/tokens.css')
    value = match[1].strip()
    alias = re.fullmatch(r'var\(--([a-z0-9-]+)\)', value)
    return raw(alias[1]) if alias else value


def rgba(name):
    """Return (r, g, b, a) 0-255 floats for a token, following var() aliases."""
    value = raw(name)
    hexcode = re.fullmatch(r'#([0-9A-Fa-f]{6})', value)
    if hexcode:
        h = hexcode[1]
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)
    parts = re.fullmatch(r'rgba?\(([^)]+)\)', value)
    if not parts:
        raise SystemExit(f'--{name}: cannot read colour {value}')
    nums = [float(n) for n in re.split(r'[,\s/]+', parts[1].strip()) if n]
    r, g, b = nums[:3]
    return (r, g, b, nums[3] if len(nums) > 3 else 1.0)


def over(fg, bg):
    """Composite a translucent foreground over an opaque background."""
    r, g, b, a = fg
    return tuple(c * a + d * (1 - a) for c, d in zip((r, g, b), bg[:3]))


def luminance(rgb):
    def channel(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg_name, bg_name):
    bg = rgba(bg_name)
    if bg[3] != 1.0:
        raise SystemExit(f'--{bg_name} used as a background must be opaque')
    fg = over(rgba(fg_name), bg)
    lf, lb = luminance(fg), luminance(bg[:3])
    hi, lo = max(lf, lb), min(lf, lb)
    return (hi + 0.05) / (lo + 0.05)


def audit():
    rows, failures = [], []
    for fg, bg, level, where in PAIRS:
        value = ratio(fg, bg)
        need = MIN[level]
        ok = value + 0.05 >= need
        rows.append((fg, bg, level, value, need, ok, where))
        if not ok:
            failures.append(f'--{fg} on --{bg} is {value:.2f}:1, {level} needs {need}:1 ({where})')
        if level == 'waived' and (fg, bg) not in WAIVERS:
            failures.append(f'--{fg} on --{bg} is marked waived with no reason in WAIVERS')
    for pair in WAIVERS:
        if pair not in [(f, b) for f, b, level, _ in PAIRS if level == 'waived']:
            failures.append(f'WAIVERS lists --{pair[0]} on --{pair[1]}, which no pairing waives')
    return rows, failures


def specimen_agrees(rows):
    """The ratios printed in the specimen must match the computed ones to one decimal."""
    text = (root / 'brand' / 'index.html').read_text()
    printed = dict(re.findall(r'--([a-z-]+)<small>[^<]*</small></span><span class="ts-hex ts-mono"[^>]*>#[0-9A-Fa-f]{6} · ([0-9.]+) : 1', text))
    wrong = []
    for token, shown in printed.items():
        value = ratio(token, 'surface')
        if abs(value - float(shown)) > 0.05:
            wrong.append(f'brand/index.html prints --{token} as {shown}:1 on the canvas, computed {value:.1f}:1')
    return wrong


if __name__ == '__main__':
    rows, failures = audit()
    failures += specimen_agrees(rows)
    if '--quiet' not in sys.argv:
        print(f'{"foreground":<20}{"background":<14}{"level":<7}{"ratio":>8}{"min":>7}  where')
        for fg, bg, level, value, need, ok, where in rows:
            mark = ' ' if ok else '!'
            print(f'{mark}--{fg:<17}--{bg:<12}{level:<7}{value:>7.2f}:1{need:>6}  {where}')
    if failures:
        print('FAIL')
        for f in failures:
            print(' -', f)
        sys.exit(1)
    if '--quiet' not in sys.argv and WAIVERS:
        print('\nWaived (published guide or owner decision):')
        for (fg, bg), why in WAIVERS.items():
            print(f'  --{fg} on --{bg}: {why}')
    waived = sum(1 for row in rows if row[2] == 'waived')
    print(f'PASS: {len(rows) - waived} pairings meet WCAG 2.1 for their level, {waived} waived, specimen ratios match')
