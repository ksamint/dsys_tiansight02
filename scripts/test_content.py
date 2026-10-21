"""Contract regressions use isolated fixtures, including shared dependency invalidation."""
import copy
import json
from pathlib import Path
from html.parser import HTMLParser
import tempfile
import unittest
from unittest.mock import patch
import build_deck
from content_lib import Library, sha
from text_identity import chars, numbers, numeric_range_text, normalized


class Contracts(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=Path(self.temp.name)
        self.write('dist/components/current.json',{'supported':'test'})
        self.write('dist/components/test/manifest.json',{'namespace':'NS','components':[{'name':'Cover'}]})
        self.write('assets/logo/logo.png','image')
        self.write('assets/index.json',{'assets':[{'path':'assets/logo/logo.png','sha256':sha(b'image')}]})
        self.write('content/team.json',{'people':[{'name':'A','photo':{'$asset':'assets/logo/logo.png'},'seat':{'title':'Role'}}]})
        self.write('content/contact.json',{'title':'Contact'})
        self.write('content/partners.json',{'logos':[{'$asset':'assets/logo/logo.png'}]})
        self.write('content/cases/case-01.json',{'summary':{'title':'Case'}})
        self.write('content/slides/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa.json',{'id':'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','label':'A','owner':'intro','status':'maintained','component':'Cover','publish':'web','props':{'person':{'$team':'A'}}})
        self.write('content/slides/bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb.json',{'id':'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb','label':'B','owner':'intro','status':'planned','publish':'internal'})
        for deck in ('intro','sales'):
            self.write(f'content/decks/{deck}.json',{'id':deck,'title':deck,'status':'maintained','profiles':{'client':{'publish':['web']}},'slides':['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb']})
        self.lib=Library(self.root)

    def tearDown(self): self.temp.cleanup()

    def write(self,path,value):
        target=self.root/path;target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(value if isinstance(value,str) else json.dumps(value))

    def test_reference_resolution_and_team_view(self):
        self.assertEqual(self.lib.resolve({'$team':'A','$view':'seat'}),{'name':'A','photo':'assets/logo/logo.png','title':'Role'})
        self.assertEqual(self.lib.resolve({'$case':'case-01','active':1}),{'title':'Case','active':1})
        self.assertEqual(self.lib.resolve({'$partners':True}),{'logos':['assets/logo/logo.png']})
        with self.assertRaises(ValueError):self.lib.resolve({'$team':'missing'})
        with self.assertRaises(ValueError):self.lib.resolve({'$asset':'../private'})
        with self.assertRaises(ValueError):self.lib.resolve({'$case':'../case-01'})

    def test_nested_content_references_rejected(self):
        self.write('content/contact.json',{'nested':{'$team':'A'}})
        with self.assertRaises(ValueError):self.lib.resolve({'$contact':True})

    def test_copy_override_and_planned_guard(self):
        self.assertTrue(self.lib.check())
        self.assertEqual(len(self.lib.deck_slides('intro','client')),1)
        self.assertEqual(self.lib.deck_slides('intro','client')[0]['props']['page'],1)
        for value in ({'title':'copy'},{'active':'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'*25},{'active':{'title':'copy'}}):
            with self.assertRaises(ValueError):self.lib.check_overrides(value)
        self.lib.slides['bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb']['props']={}
        with self.assertRaises(ValueError):self.lib.check()

    def test_shared_change_invalidates_each_consumer(self):
        before={d:self.lib.content_version(d) for d in ('intro','sales')}
        self.write('content/team.json',{'people':[{'name':'A','photo':{'$asset':'assets/logo/logo.png'},'seat':{'title':'New role'}}]})
        for deck in before:self.assertNotEqual(before[deck],self.lib.content_version(deck))

    def test_asset_integrity_and_runtime_invalidation(self):
        before=self.lib.content_version('intro')
        self.write('dist/components/test/bundle.js','changed')
        self.assertNotEqual(before,self.lib.content_version('intro'))
        self.write('assets/logo/logo.png','tampered')
        with self.assertRaises(ValueError):self.lib.content_version('intro')

    def test_temporary_manifest_paths_are_checked(self):
        for key, value in (('id','../../escape'), ('profiles', {'../escape':{'publish':['web']}}), ('slides',['missing'])):
            manifest=copy.deepcopy(self.lib.decks['intro']);manifest[key]=value
            with self.assertRaises(ValueError):self.lib.validate_manifest(manifest)

    def test_deterministic_build_and_json_script_escaping(self):
        self.lib.slides['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa']['props']['title']='</script><script>unsafe</script>'
        manifest=self.lib.decks['intro']
        with patch.object(build_deck,'ROOT',self.root), patch.object(build_deck,'source_date',return_value='2026-10-21T00:00:00Z'):
            first=build_deck.build(self.lib,manifest,'client',{})
            second=build_deck.build(self.lib,manifest,'client',{})
        self.assertEqual(first,second)
        self.assertNotIn('</script><script>unsafe',first[1])
        self.assertIn('\\u003c/script>',first[1])
        self.assertEqual(first[2]['htmlSha256'],sha(first[1].encode()))
        self.assertEqual(first[2]['pageCount'],1)

    def test_footer_and_namespace_cannot_close_inline_script(self):
        payload='</script><script>window.REVIEW_INJECTION=true</script>'
        manifest=copy.deepcopy(self.lib.decks['intro']);manifest['footer']=payload
        self.lib.runtime['namespace']=payload
        with patch.object(build_deck,'ROOT',self.root), patch.object(build_deck,'source_date',return_value='2026-10-21T00:00:00Z'):
            document=build_deck.build(self.lib,manifest,'client',{})[1]
        class Scripts(HTMLParser):
            def __init__(self):super().__init__();self.inline=[];self.active=False
            def handle_starttag(self,tag,attrs):
                if tag=='script':self.active=True;self.inline.append('')
            def handle_endtag(self,tag):
                if tag=='script':self.active=False
            def handle_data(self,data):
                if self.active:self.inline[-1]+=data
        parsed=Scripts();parsed.feed(document)
        self.assertFalse(any(text.strip()=='window.REVIEW_INJECTION=true' for text in parsed.inline))
        self.assertNotIn(payload,document)
        self.assertIn('const footer='+build_deck.script_json(payload),document)
        self.assertIn('window['+build_deck.script_json(payload)+']',document)

    def test_pdf_identity_preserves_sign_punctuation_and_numeric_order(self):
        for expected,actual in [('+22.2%','−22.2%'),('22.2%','222%')]:
            self.assertNotEqual(chars(expected),chars(actual))
        self.assertEqual(chars('12.3'),chars('13.2'))
        self.assertNotEqual(numbers('12.3'),numbers('13.2'))
        self.assertNotEqual(numbers('22.2'),numbers('2.22'))
        self.assertNotEqual(numbers('123'),numbers('321'))
        self.assertEqual(chars('结果：＋２２.２％\n'),chars('结果:+22.2%'))
        self.assertEqual(numbers('Alpha 12.3 Beta −4.5%'),numbers('Beta −4.5%\nAlpha 12.3'))

    def test_numeric_glyph_geometry_rejects_sign_decimal_and_digit_swaps(self):
        def read(text):
            glyphs=[{'c':c,'bbox':(i*7,0,i*7+6,10)} for i,c in enumerate(text)]
            return numeric_range_text(list(reversed(glyphs)),[[0,0,len(text)*7/0.75,10/0.75]])
        for expected,actual in [('+22.2%','−22.2%'),('22.2%','222%'),('22.2','2.22'),('12.3','13.2'),('123','321')]:
            self.assertEqual(read(expected),normalized(expected))
            self.assertNotEqual(read(actual),normalized(expected))

    def test_case_copy_bypass_blocked_and_shared_snippet_resolves(self):
        self.write('content/cases/case-01.json',{'name':'Approved Case','summary':{'title':'Case'},'snippets':{'approved-mention':'Uses Approved Case'}})
        slide=self.lib.slides['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa']
        for key in ('title','body','name'):
            slide['props']={key:'Uses Approved Case'}
            with self.assertRaises(ValueError):self.lib.check()
        slide['props']={'body':{'$case':'case-01','$view':'snippet:approved-mention'}}
        self.assertTrue(self.lib.check())
        self.assertEqual(self.lib.resolve(slide['props']),{'body':'Uses Approved Case'})

    def test_hash_is_deterministic_and_order_sensitive(self):
        original=self.lib.content_version('intro')
        self.assertEqual(original,self.lib.content_version('intro'))
        self.lib.decks['intro']['slides'].reverse()
        self.assertNotEqual(original,self.lib.content_version('intro'))


if __name__=='__main__': unittest.main()
