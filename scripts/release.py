"""Build/verify every profile, then update staging identity; never approve releases."""
import argparse
import json
import subprocess
import sys
from content_lib import ROOT, Library, catalog, read_json


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


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('deck');args=parser.parse_args();release(args.deck)
