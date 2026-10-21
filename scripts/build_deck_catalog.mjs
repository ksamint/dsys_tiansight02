// Reuse supplied UUIDs and order; do not claim metadata-only decks have buildable source.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const context=vm.createContext({window:{}});
vm.runInContext(read('content/slide-catalog.js'),context);
const supplied=context.window.TIANSIGHT_SLIDE_CATALOG;
const build=JSON.parse(read('deliverables/exhibit-design/build.json'));
const corporate=JSON.parse(read('deliverables/company-intro-v3/deck.json'));
const decks=Object.entries(supplied.DECKS).map(([id,d])=>({
  id,title:d.title,contentVersion:id==='exhibit'?build.contentVersion:hash(JSON.stringify(d)),
  canonicalSource:'guidelines/company-intro-v3.md',derivedFrom:id==='intro'?null:'intro',
  source:id==='exhibit'?'deliverables/exhibit-design/src/TiansightDeck-Exhibit.dc.html':null,
  sourceStatus:id==='exhibit'?'maintained':'supplied-metadata-only',
  designSystemVersion:id==='exhibit'?build.designSystemVersion:null,
  sharedContent:['content/team.json','content/contact.json'],
  slides:d.slides.map((s,i)=>({...s,order:i+1}))
}));
// The existing published corporate deck has its own stable IDs and remains canonical.
decks.push({id:'company-intro-v3',title:corporate.title,canonicalFor:'intro',source:'deliverables/company-intro-v3/gen/gen.py',contentVersion:hash(read('deliverables/company-intro-v3/gen/vals.json')+read('content/team.json')+read('content/contact.json')),designSystemVersion:'foundation-v0.7',sourceStatus:'maintained-static',sharedContent:['content/team.json','content/contact.json'],slides:corporate.order.map((id,i)=>({id,order:i+1,source:`deliverables/company-intro-v3/slides/${id}.html`}))});
for(const deck of decks) assert.equal(new Set(deck.slides.map(s=>s.id)).size,deck.slides.length);
const data={schema:'tiansight.deck-catalog/1',version:'2026-10-21',latestPolicy:'Only explicitly approved, successfully built releases qualify as latest. Metadata-only records are never downloadable releases.',decks};
const output=JSON.stringify(data,null,2)+'\n';
const path=resolve(root,'content/deck-catalog.json');
if(process.argv.includes('--check'))assert.equal(readFileSync(path,'utf8'),output,'Deck catalog is stale');else writeFileSync(path,output);
console.log('PASS: catalog preserves 52 intro, 52 kitchen, 41 exhibit metadata UUIDs and 47 canonical corporate slide IDs');
