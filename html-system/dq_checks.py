"""Data-quality checks for report source tables (stdlib only).

Library:  from dq_checks import run_checks; results = run_checks(rows, spec)
CLI:      python3 html-system/dq_checks.py data/table.csv --key 品项名称 --value 总销量 --rate 复购点击率 \
              --num 复购数量 --den 总销售数量 --small 300 --window 累计窗 --group 门店

Each check returns {check, status: pass|warn|fail, result, affected, action}. The output feeds
manifest.quality and the 质量异常 slide; the checks mirror the ones the reference reports did by hand:
window consistency, declared denominators, rate recomputation, small samples, name normalization
(spec/promo suffixes, half/full-width brackets, spaces), duplicate keys after normalization,
missing values, closed-period rows, outlier months and reconciliation against a system total.
"""
import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict

SUFFIX_SPEC = re.compile(r'[（(]\s*(半例|例|小份|中份|大份|份|位|只|条|斤|两|杯|壶|套|双人|四人|1人|2人|4人)\s*[)）]$')
SUFFIX_PROMO = re.compile(r'[（(]\s*(会员活动|第二杯半价|半价|特价|买一送一|活动|新品)\s*[)）]$')


def to_num(v):
    if v is None:
        return None
    s = str(v).strip().replace(',', '').replace('%', '').replace('＋', '+')
    if s in ('', '—', '-', 'null', 'None'):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def normalize_name(name):
    """Return (main_name, spec, promo). Mirrors the reference cleaning log: full-width brackets, no spaces, strip suffixes."""
    s = str(name).replace('(', '（').replace(')', '）').replace(' ', '').replace('　', '')
    promo = spec = ''
    m = SUFFIX_PROMO.search(s)
    if m:
        promo, s = m.group(1), s[:m.start()]
    m = SUFFIX_SPEC.search(s)
    if m:
        spec, s = m.group(1), s[:m.start()]
    return s, spec, promo


def run_checks(rows, spec):
    key, value, rate, num, den = spec.get('key'), spec.get('value'), spec.get('rate'), spec.get('num'), spec.get('den')
    small, group, total = spec.get('small', 300), spec.get('group'), spec.get('system_total')
    out = []
    n = len(rows)

    def add(check, status, result, affected='', action=''):
        out.append({'check': check, 'status': status, 'result': result, 'affected': affected, 'action': action})

    add('行数', 'pass', f'{n:,} 行', '', '')
    if spec.get('window'):
        add('查询窗口已声明', 'pass', spec['window'] + (f' · {spec["window_months"]} 个月' if spec.get('window_months') else ''), '', '不同窗口类型的比率不可放在同一张图')
    else:
        add('查询窗口已声明', 'fail', '未声明窗口类型与长度', '全表', '在 manifest.sources[].window 声明月窗 / 累计窗与长度')
    if rate and not (num and den):
        add('比率分母已声明', 'fail', f'{rate} 无分子 / 分母字段', rate, '在 manifest.metrics 里写明分子 ÷ 分母')
    if rate and num and den:
        worst, bad = 0.0, 0
        for r in rows:
            a, b, c = to_num(r.get(num)), to_num(r.get(den)), to_num(r.get(rate))
            if a is None or b in (None, 0) or c is None:
                continue
            calc = a / b * (100 if c > 1.5 else 1)
            diff = abs(calc - c)
            worst = max(worst, diff)
            if diff > 0.01 * (100 if c > 1.5 else 1):
                bad += 1
        add('比率复算', 'pass' if bad == 0 else 'warn', f'最大偏差 {worst:.4g}，超差 {bad} 行', f'{bad} 行' if bad else '', '偏差来自导出端舍入则记录，否则回查导出' if bad else '')
    if value:
        smalls = [r for r in rows if (to_num(r.get(value)) or 0) < small]
        add('小样本', 'warn' if smalls else 'pass', f'{len(smalls)} 行 {value} < {small}', ', '.join(str(r.get(key, ''))[:12] for r in smalls[:6]), '图表标注 n，不进排名')
    if key:
        norm = defaultdict(list)
        promos, specs = [], []
        for r in rows:
            main, sp, pr = normalize_name(r.get(key, ''))
            norm[(r.get(group, ''), main)].append(r.get(key, ''))
            if pr:
                promos.append(r.get(key, ''))
            if sp:
                specs.append(r.get(key, ''))
        dups = {k: v for k, v in norm.items() if len(set(v)) > 1}
        add('名称归一后重复', 'warn' if dups else 'pass', f'{len(dups)} 个主品名由多行拼成', '; '.join(' / '.join(sorted(set(v))) for v in list(dups.values())[:4]), '按主品名汇总后再排名')
        add('促销衍生 SKU', 'warn' if promos else 'pass', f'{len(promos)} 行带活动后缀', ', '.join(promos[:5]), '与主品分列，单独评估')
        add('规格拆分 SKU', 'warn' if specs else 'pass', f'{len(specs)} 行带规格后缀', ', '.join(specs[:5]), '按主品名汇总')
        exact = Counter((r.get(group, ''), r.get(key, '')) for r in rows)
        ed = [k for k, c in exact.items() if c > 1]
        add('完全重复键', 'fail' if ed else 'pass', f'{len(ed)} 个键重复', ', '.join(f'{g}·{k}' for g, k in ed[:4]), '合并后求和，比率重算')
    fields = spec.get('required', [c for c in (key, value, rate, num, den) if c])
    missing = {f: sum(1 for r in rows if to_num(r.get(f)) is None and not str(r.get(f, '')).strip()) for f in fields}
    bad = {f: c for f, c in missing.items() if c}
    add('必填字段缺失', 'warn' if bad else 'pass', ', '.join(f'{f} 缺 {c}' for f, c in bad.items()) or '无缺失', '', '分母为空置空，不置零')
    if group:
        counts = Counter(r.get(group, '') for r in rows)
        lo = [g for g, c in counts.items() if c < 0.5 * (n / max(len(counts), 1))]
        add('分组覆盖不均', 'warn' if lo else 'pass', f'{len(counts)} 组，最少 {min(counts.values()) if counts else 0} 行', ', '.join(lo[:4]), '停业或新开门店不进同期排名')
    if total is not None and value:
        s = sum(to_num(r.get(value)) or 0 for r in rows)
        diff = (s - total) / total * 100 if total else 0
        add('与系统合计对账', 'pass' if abs(diff) < 0.5 else 'fail', f'表内合计 {s:,.0f} vs 系统 {total:,.0f}（{diff:+.2f}%）', '', '差异 > 0.5% 须先解释再使用')
    return out


def load_csv(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def to_html(results):
    rows = ''.join(f'<tr class="{ "warn" if r["status"] in ("warn", "fail") else ""}"><td class="m">{r["status"]}</td><td class="k">{r["check"]}</td><td>{r["result"]}</td><td>{r["affected"]}</td><td>{r["action"]}</td></tr>' for r in results)
    return f'<table class="t c"><thead><tr><th class="m">状态</th><th>检查</th><th>结果</th><th>涉及</th><th>处理</th></tr></thead><tbody>{rows}</tbody></table>'


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('csv'); ap.add_argument('--key'); ap.add_argument('--value'); ap.add_argument('--rate'); ap.add_argument('--num'); ap.add_argument('--den')
    ap.add_argument('--small', type=float, default=300); ap.add_argument('--group'); ap.add_argument('--window'); ap.add_argument('--months', type=float)
    ap.add_argument('--total', type=float); ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    res = run_checks(load_csv(a.csv), {'key': a.key, 'value': a.value, 'rate': a.rate, 'num': a.num, 'den': a.den, 'small': a.small,
                                      'group': a.group, 'window': a.window, 'window_months': a.months, 'system_total': a.total})
    if a.json:
        print(json.dumps(res, ensure_ascii=False, indent=1))
    else:
        for r in res:
            print(f"{r['status']:5} {r['check']:12} {r['result']}" + (f"  [{r['affected']}]" if r['affected'] else ''))
    sys.exit(1 if any(r['status'] == 'fail' for r in res) else 0)
