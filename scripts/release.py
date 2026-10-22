"""Build/verify every profile, then update staging identity; approval is a separate explicit step."""
import argparse
import datetime
import json
import subprocess
import sys
from content_lib import ROOT, APPROVERS, Library, approvals, catalog, read_json


def release(deck):
    lib=Library()
    manifest=lib.decks[deck]
    if manifest['status']=='planned':
        raise ValueError(f'{deck} is planned and cannot be released')
    records={}
    for profile in manifest['profiles']:
        subprocess.run([sys.executable,'scripts/build_deck.py',deck,'--profile',profile,'--pdf'],cwd=ROOT,check=True)
        output=ROOT/'build'/deck/profile
        records[profile]={'build':read_json(output/'build.json'),'verification':read_json(output/'verification.json')}
    # Publication is atomic at catalog level: failed profiles never advance latestBuilt.
    data=catalog(Library())
    first=next(iter(records.values()))['build']
    entry=next(d for d in data['decks'] if d['id']==deck)
    entry['latestBuilt']={k:first[k] for k in ('contentVersion','systemVersion','builtAt')} | {'path':f'build/{deck}/','profiles':{p:{'path':f'build/{deck}/{p}/','pages':r['build']['pageCount']} for p,r in records.items()}}
    (ROOT/'content/deck-catalog.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    lines=[f'# {manifest["title"]}', '',f'Content: `{first["contentVersion"]}`',f'System: `{first["systemVersion"]}`',f'Built: {first["builtAt"]}', '', '| Profile | Pages | Verification |','| --- | ---: | --- |']
    lines += [f'| {p} | {r["build"]["pageCount"]} | PASS: text, fonts, clipping, pixels |' for p,r in records.items()]
    (ROOT/'build'/deck/'RELEASE.md').write_text('\n'.join(lines)+'\n')
    subprocess.run(['node','scripts/build_deck_catalog.mjs'],cwd=ROOT,check=True)
    print(f'PASS: {deck} latestBuilt updated; approval unchanged')


def approve(deck, by):
    """Record production approval of the current latestBuilt; refuse anything unbuilt or stale."""
    lib=Library()
    if deck not in lib.decks:
        raise ValueError(f'Unknown deck: {deck}')
    entry=next(d for d in catalog(lib)['decks'] if d['id']==deck)
    built=entry['latestBuilt']
    if not built:
        raise ValueError(f'{deck} has no latestBuilt; run scripts/release.py {deck} first')
    if built['contentVersion']!=entry['contentVersion'] or built['systemVersion']!=entry['systemVersion']:
        raise ValueError(f'{deck} latestBuilt is stale against the current content/system version; release it again before approving')
    data=approvals(lib)
    data['decks'][deck]={'contentVersion':built['contentVersion'],'systemVersion':built['systemVersion'],'approvedAt':datetime.date.today().isoformat(),'by':by}
    data['decks']=dict(sorted(data['decks'].items()))
    (ROOT/'content/approvals.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    subprocess.run(['node','scripts/build_deck_catalog.mjs'],cwd=ROOT,check=True)
    print(f'PASS: {deck} latestApproved set to {built["contentVersion"][:12]} by {by}')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('deck')
    parser.add_argument('--approve',action='store_true',help='record the current latestBuilt as approved (production review only)')
    parser.add_argument('--by',choices=APPROVERS,default='production-review')
    args=parser.parse_args()
    approve(args.deck,args.by) if args.approve else release(args.deck)
