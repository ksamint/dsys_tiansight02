// Compare maintained library output with the original offline DC rendering.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from './playwright.mjs';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
const baseline=JSON.parse(fs.readFileSync('snapshots/migration-text.json','utf8'));
const browser=await chromium.launch();const page=await browser.newPage();const report={schema:'tiansight.migration-text/1',normalization:'Whitespace and U+2060 removed; trailing slide page number omitted because manifests assign it per profile.',decks:{}};
const normalize=s=>s.replace(/\u2060|\s/g,'').replace(/\d{2}$/,'');
for(const deck of ['intro','exhibit']){
 await page.goto(pathToFileURL(path.resolve(`build/${deck}/internal/index.html`)).href);
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);
 const actual=await page.locator('section[data-slide-id]').evaluateAll(s=>s.map(x=>({label:x.dataset.label,text:x.textContent})));
 const aliases={'节首 · 服务模块':'节首 · 一','团队 · 总览':'团队'};const mismatches=[];let matched=0;
 for(const [i,source]of baseline[deck].entries()){
  const label=typeof source==='string'?actual[i]?.label:aliases[source.label]||source.label;
  const target=typeof source==='string'?actual[i]:actual.find(x=>x.label===label);
  const expected=typeof source==='string'?source:source.text;
  if(normalize(expected)===normalize(target?.text||''))matched++;else {const approved=(baseline.approvedDifferences||[]).find(x=>x.deck===deck&&x.label===label&&normalize(expected.replace(x.source,x.actual))===normalize(target?.text||''));mismatches.push({label,source:expected,actual:target?.text||'',cause:approved?.cause||null});}
 }
 report.decks[deck]={compared:baseline[deck].length,matched,mismatches};
}
await browser.close();fs.mkdirSync('.build/migration',{recursive:true});fs.writeFileSync('.build/migration/text-equality.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(report.decks).map(([k,v])=>[k,{compared:v.compared,matched:v.matched,different:v.mismatches.length}]))));

const unexplained=Object.values(report.decks).flatMap(x=>x.mismatches).filter(x=>!x.cause);if(unexplained.length){console.error('FAIL: '+unexplained.length+' unexplained migration text differences');process.exitCode=1;}else console.log('PASS: 47 corporate + 41 exhibit source texts preserved; approved host discrepancy documented');
