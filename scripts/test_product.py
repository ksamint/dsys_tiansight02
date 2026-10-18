import json
import re
import unittest
from build_product import render, namespace
from export_tokens import export, parse_block


class ProductContract(unittest.TestCase):
    def test_duplicate_tokens_rejected(self):
        with self.assertRaises(ValueError):
            parse_block('--caption: 1rem; --caption: red;')

    def test_caption_types(self):
        tokens = json.loads(export())
        self.assertEqual(tokens['typography']['text-caption']['$type'], 'dimension')
        self.assertEqual(tokens['color']['color-caption']['$value'], '{color.gold-deep}')

    def test_deterministic_manifest(self):
        first = render()
        self.assertEqual(first, render())
        manifest = json.loads(first['manifest.json'])
        import hashlib
        for name, entry in manifest['files'].items():
            self.assertEqual(hashlib.sha256(first[name]).hexdigest(), entry['sha256'])
            self.assertEqual(len(first[name]), entry['bytes'])

    def test_no_legacy_variables(self):
        css = render()['tiansight.css'].decode()
        self.assertFalse(re.search(r'var\(--(?!ts-)', css))
        self.assertEqual(namespace(namespace('--surface: var(--paper);')), namespace('--surface: var(--paper);'))


if __name__ == '__main__':
    unittest.main()
