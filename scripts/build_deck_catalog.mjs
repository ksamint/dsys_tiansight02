// Keep catalog hashing and reference semantics identical to the HTML builder.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(execFileSync(process.env.PYTHON||'python3',['scripts/content_lib.py','--catalog'],{cwd:root,encoding:'utf8'}));
const output=JSON.stringify(data,null,2)+'\n';
const index=JSON.stringify(data.decks.flatMap(d=>d.slides).filter((s,i,a)=>a.findIndex(x=>x.id===s.id)===i).map(s=>{const record=JSON.parse(readFileSync(resolve(root,`content/slides/${s.id}.json`),'utf8'));return Object.fromEntries(['id','label','owner','component','publish','tags'].filter(k=>k in record).map(k=>[k,record[k]]));}),null,2)+'\n';
for(const [file,text] of [['content/deck-catalog.json',output],['content/slides.index.json',index]]){
 const path=resolve(root,file);
 if(process.argv.includes('--check'))assert.equal(readFileSync(path,'utf8'),text,`${file} is stale`);else writeFileSync(path,text);
}
console.log(`PASS: deck catalog ${data.decks.length} manifests; shared content hashes and slide index`);
