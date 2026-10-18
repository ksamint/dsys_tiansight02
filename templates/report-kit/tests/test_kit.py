"""Report kit tests (stdlib only): python3 templates/report-kit/tests/test_kit.py

Covers the token bridge to brand/tokens.json, input validation, the freshness of
deliverables/report-template, and a static pass over its slides for the renderer and brand rules
that can be checked without a browser. The browser checks (lint.js, render.js, pdf.js) run in build.sh.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import unittest

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(KIT))
TEMPLATE = os.path.join(REPO, 'deliverables', 'report-template')
sys.path.insert(0, KIT)
import tsk  # noqa: E402
from tsk import core  # noqa: E402

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()




def slides():
    order = json.loads(read(os.path.join(TEMPLATE, 'deck.json')))['order']
    for sid in order:
        h = read(os.path.join(TEMPLATE, 'slides', sid + '.html'))
        yield sid, re.sub(r'<aside>.*?</aside>', '', h, flags=re.S), order


class Tokens(unittest.TestCase):
    def test_tokens_come_from_the_repo_and_match_the_published_values(self):
        self.assertEqual(core.TOKENS_FALLBACK, [], 'some kit colours fell back: token renamed in brand/tokens.json?')
        for k, v in core.FALLBACK.items():
            self.assertEqual(core.TOKENS[k], core._norm(v), f'{k}: brand tokens drifted from the kit fallback')


class Validation(unittest.TestCase):
    def setUp(self):
        core.reset()

    def tearDown(self):
        core.reset()

    def test_duplicate_page_ids_rejected(self):
        with self.assertRaises(ValueError):
            tsk.set_order(['a', 'a'], [], {})
        tsk.sec('x', '', '')
        with self.assertRaises(ValueError):
            tsk.sec('x', '', '')

    def test_unknown_page_reference_rejected(self):
        tsk.set_order(['a'], [('一', '部分', ['a'])], {'a': 'A'})
        self.assertEqual(tsk.ref('a'), '第 1 页')
        with self.assertRaises(KeyError):
            tsk.pg('b')

    def test_unregistered_image_rejected(self):
        tsk.configure(images={}, blobs={})
        with self.assertRaises(KeyError):
            tsk.blob('nope')

    def test_fit_steps_down_and_warns(self):
        self.assertEqual(tsk.fit('短标题。', None), 56)
        self.assertEqual(tsk.fit('一' * 28, None), 52)
        tsk.fit('一' * 60, None)
        self.assertTrue(core.WARN)

    def test_missing_page_in_order_rejected(self):
        tmp = tempfile.mkdtemp()
        tsk.configure(outdir=tmp)
        tsk.set_order(['a'], [], {})
        with self.assertRaises(ValueError):
            tsk.render()


class Template(unittest.TestCase):
    def test_template_is_fresh(self):
        run = subprocess.run([sys.executable, os.path.join(TEMPLATE, 'gen', 'template_deck.py')],
                             env=dict(os.environ, TSK_CHECK='1'), capture_output=True, text=True)
        self.assertEqual(run.returncode, 0, run.stdout + run.stderr)

    def test_starter_builds(self):
        tmp = tempfile.mkdtemp()
        run = subprocess.run([sys.executable, os.path.join(KIT, 'example', 'starter.py'), tmp], capture_output=True, text=True)
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertEqual(len(os.listdir(os.path.join(tmp, 'slides'))), 12)

    def test_static_rules(self):
        sys.path.insert(0, os.path.join(KIT, 'tools'))
        import check_deck
        self.assertEqual(check_deck.check(TEMPLATE), [])

    def test_static_rules_catch_violations(self):
        import shutil
        sys.path.insert(0, os.path.join(KIT, 'tools'))
        import check_deck
        tmp = tempfile.mkdtemp()
        shutil.copytree(TEMPLATE, tmp, dirs_exist_ok=True, ignore=shutil.ignore_patterns('*.pdf', '.build'))
        p = os.path.join(tmp, 'slides', 'b1.html')
        h = read(p).replace('font-size:24px', 'font-size:18px', 1).replace('示例窗口', '我们为您赋能，示例窗口', 1)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(h)
        codes = {x.split()[1] for x in check_deck.check(tmp)}
        self.assertTrue({'SIZE', 'VOICE', 'LEXICON'} <= codes, codes)

    def test_wordmark_two_tone_in_every_footer(self):
        for sid, h, _ in slides():
            if sid == 'cover':
                continue
            self.assertIn(core.wm(), h, f'{sid}: footer wordmark missing or single-colour')


class FeedbackRules(unittest.TestCase):
    """Label titles, the expected inventory, numbered quadrants and split tables (handbook v1.1)."""
    def setUp(self):
        core.reset()

    def tearDown(self):
        core.reset()

    def copy_template(self):
        import shutil
        tmp = tempfile.mkdtemp()
        shutil.copytree(TEMPLATE, tmp, dirs_exist_ok=True, ignore=shutil.ignore_patterns('*.pdf', '.build'))
        return tmp

    def test_label_title_and_missing_inventory_caught(self):
        sys.path.insert(0, os.path.join(KIT, 'tools'))
        import check_deck
        tmp = self.copy_template()
        p = os.path.join(tmp, 'slides', 'd1.html')
        h = read(p).replace('字段说明</h2>', '字段说明。</h2>', 1)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(h)
        meta_path = os.path.join(tmp, '.tsk.json')
        meta = json.loads(read(meta_path))
        meta['expect']['页型样张'].append('zz-missing')
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False)
        codes = {x.split()[1] for x in check_deck.check(tmp)}
        self.assertTrue({'LABEL', 'MISSING'} <= codes, codes)

    def test_label_deck_accepts_noun_titles(self):
        sys.path.insert(0, os.path.join(KIT, 'tools'))
        import check_deck
        tmp = self.copy_template()
        p = os.path.join(tmp, 'slides', 'b1.html')
        h = read(p)
        h = re.sub(r'(<h2[^>]*>)(.*?)(</h2>)', lambda m: m[1] + '指标卡' + m[3], h, count=1, flags=re.S)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(h)
        self.assertIn('b1: TITLE 指标卡', check_deck.check(tmp))
        meta_path = os.path.join(tmp, '.tsk.json')
        meta = json.loads(read(meta_path))
        meta['label'] = meta.get('label', []) + ['b1']
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False)
        self.assertEqual(check_deck.check(tmp), [])

    def test_quadrant_numbers_and_counts(self):
        tmp = tempfile.mkdtemp()
        tsk.configure(outdir=tmp)
        items = lambda n: [(f'项{i}', f'{i}%', False) for i in range(n)]  # noqa: E731
        tsk.quadrant('q', '眉题', '四格。', None, [('甲', '先改', core.SEAL, items(3)), ('乙', '优化', core.GOLD, items(7)),
                                                  ('丙', '设防', core.GOLD, items(5)), ('丁', '观察', core.MUTED, items(0))], '')
        body = core.SLIDES[-1]['body']
        self.assertIn('本象限共 3 项', body)
        self.assertIn('另 2 项见明细', body)
        self.assertIn('本象限共 0 项', body)
        numbers = [int(n) for n in re.findall(r'<span style="color:[^"]+">(\d+)</span>', body)]
        self.assertEqual(numbers, list(range(1, 14)))

    def test_table_pages_repeat_header(self):
        tmp = tempfile.mkdtemp()
        tsk.configure(outdir=tmp)
        ids = tsk.table_pages('t', '附录', '明细', None, ['品项', '数值'], [[f'品项{i}', str(i)] for i in range(30)], '', per_page=12)
        self.assertEqual(ids, ['t', 't-2', 't-3'])
        for s in core.SLIDES[-3:]:
            self.assertIn('<th', s['body'])
        self.assertIn('（续 3/3）', core.SLIDES[-1]['body'])


if __name__ == '__main__':
    unittest.main(verbosity=1)
