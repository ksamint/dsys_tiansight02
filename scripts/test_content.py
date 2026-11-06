"""Contract regressions use isolated fixtures, including shared dependency invalidation."""
import copy
import json
from pathlib import Path
from html.parser import HTMLParser
import tempfile
import unittest
from unittest.mock import patch
import build_deck
from content_lib import Library, catalog, sha
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
        self.write('content/positioning.json',self.positioning())
        self.write('content/slides/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa.json',{'id':'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','label':'A','owner':'intro','status':'maintained','component':'Cover','publish':'web','props':{'person':{'$team':'A'}}})
        self.write('content/slides/bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb.json',{'id':'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb','label':'B','owner':'intro','status':'planned','publish':'internal'})
        for deck in ('intro','sales'):
            self.write(f'content/decks/{deck}.json',{'id':deck,'title':deck,'status':'maintained','profiles':{'client':{'publish':['web']}},'slides':['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb']})
        self.lib=Library(self.root)

    def tearDown(self): self.temp.cleanup()

    @staticmethod
    def positioning():
        scenario=lambda v,n,mod,st:{'id':n,'verb':v,'name':n,'question':'q','inputs':'i','output':'o','cadence':'c','acceptance':'a','module':mod,'stage':st}
        dim=lambda i:{'id':i,'name':i,'en':i.upper(),'body':'b'}
        return {'schema':'tiansight.positioning/1','id':'p','title':'t','version':'1','status':'draft','approval':None,
            'lead':{'eyebrow':'e','title':'T','note':'N','body':'B'},
            'models':[{'id':'operating','numeral':'壹','name':'经营模型','en':'O','tagline':'tl','aim':'aim','headline':'h','verbs':['开发','诊断','优化'],
                        'scenarios':[scenario('开发','新店','module-1','before'),scenario('诊断','老店','module-3','during'),scenario('优化','弱店','module-4','expand')]},
                      {'id':'profit','numeral':'貳','name':'利润模型','en':'P','tagline':'tl','aim':'aim','headline':'h','objective':'obj','dimensions':[dim(f'd{i}') for i in range(4)],'shift':{'from':'f','to':'t','by':'by'},'effect':'eff'},
                      {'id':'talent','numeral':'叁','name':'人才模型','en':'T','tagline':'tl','aim':'aim','headline':'h','roles':[{'id':f'r{i}','name':f'R{i}','holds':'h','needs':'n'} for i in range(6)],'dimensions':[dim(f'd{i}') for i in range(4)],'shift':{'from':'f','to':'t','by':'by'}}],
            'foundations':{'eyebrow':'fe','title':'ft','body':'fb','items':[{'id':i,'name':i,'en':i.upper(),'body':'b','supports':['talent'],'state':'在用'} for i in ('knowledge-base','decision-tree','capability-table')]},
            'refs':{'modules':{'module-1':'一','module-3':'三','module-4':'四'},'stages':{'before':'前','during':'中','expand':'扩'}}}

    def test_positioning_views_resolve_from_one_record(self):
        steps=self.lib.resolve({'$positioning':'models:steps','active':1})
        self.assertEqual([s['label'] for s in steps['steps']],['经营模型','利润模型','人才模型']); self.assertEqual(steps['active'],1)
        matrix=self.lib.resolve({'$positioning':'operating:matrix'})
        self.assertEqual(matrix['columns'],['开发 · 新店','诊断 · 老店','优化 · 弱店']); self.assertEqual(len(matrix['rows']),5)
        self.assertEqual(len(self.lib.resolve({'$positioning':'foundations:cards'})['items']),3)
        with self.assertRaises(ValueError):self.lib.resolve({'$positioning':'unknown:view'})
        with self.assertRaises(ValueError):self.lib.resolve({'$positioning':'models:steps','title':'copy in override'})
        with self.assertRaises(ValueError):self.lib.resolve({'$positioning':'models:steps','$view':'x'})
        broken=self.positioning(); broken['status']='approved'
        self.write('content/positioning.json',broken)
        with self.assertRaises(ValueError):self.lib.resolve({'$positioning':'models:steps'})

    def test_positioning_edit_invalidates_consuming_deck(self):
        self.lib.slides['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa']['props']={'$positioning':'profit:tiers'}
        before=self.lib.content_version(self.lib.decks['intro'])
        record=self.positioning(); record['models'][1]['aim']='changed'
        self.write('content/positioning.json',record)
        self.assertNotEqual(before,self.lib.content_version(self.lib.decks['intro']))

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

    def test_full_case_record_invalidates_all_consumers(self):
        self.lib.slides['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa']['props']={'$case':'case-01'}
        before={d:self.lib.content_version(d) for d in ('intro','sales')}
        self.write('content/cases/case-01.json',{'summary':{'title':'Case'},'gallery':[], 'approval':'Updated approval'})
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

    def test_hold_slides_never_enter_a_profile(self):
        manifest=copy.deepcopy(self.lib.decks['intro']);manifest['profiles']['internal']={'publish':['web','internal','hold']}
        with self.assertRaises(ValueError):self.lib.validate_manifest(manifest)
        self.lib.slides['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa']['publish']='hold'
        self.assertEqual(self.lib.deck_slides('intro','client'),[])

    def test_approval_matches_current_versions_only(self):
        def approved(entry):
            self.write('content/approvals.json',{'schema':'tiansight.approvals/1','decks':{'intro':entry}})
            return {d['id']:d['latestApproved'] for d in catalog(self.lib)['decks']}
        current=self.lib.content_version('intro')
        record={'contentVersion':current,'systemVersion':'test','approvedAt':'2026-10-22','by':'production-review'}
        self.assertEqual(approved(record),{'intro':record,'sales':None})
        self.assertEqual(approved({**record,'contentVersion':'0'*64}),{'intro':None,'sales':None})
        self.assertEqual(approved({**record,'systemVersion':'other'}),{'intro':None,'sales':None})
        with self.assertRaises(ValueError):approved({**record,'by':'anyone'})
        self.write('content/approvals.json',{'schema':'tiansight.approvals/1','decks':{'missing':record}})
        with self.assertRaises(ValueError):catalog(self.lib)
        self.write('content/approvals.json',{'schema':'tiansight.approvals/1','decks':{}})
        self.assertEqual({d['id']:d['latestApproved'] for d in catalog(self.lib)['decks']},{'intro':None,'sales':None})

    def test_hash_is_deterministic_and_order_sensitive(self):
        original=self.lib.content_version('intro')
        self.assertEqual(original,self.lib.content_version('intro'))
        self.lib.decks['intro']['slides'].reverse()
        self.assertNotEqual(original,self.lib.content_version('intro'))


if __name__=='__main__': unittest.main()
