// Compare maintained library output with the original offline DC rendering.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from './playwright.mjs';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
const baseline=JSON.parse(fs.readFileSync('snapshots/migration-text.json','utf8'));
const browser=await chromium.launch();const page=await browser.newPage();const report={schema:'tiansight.migration-text/1',normalization:'Whitespace and U+2060 removed; trailing slide page number omitted because manifests assign it per profile.',decks:{}};
const normalize=s=>s.replace(/\u2060|\s/g,'').replace(/\d{2}$/,'');
let held=0;
for(const deck of ['intro','exhibit']){
 // Baseline entries are in manifest order; a slide on hold (待确认后发布) keeps its source text here but is not built.
 const manifest=JSON.parse(fs.readFileSync(`content/decks/${deck}.json`,'utf8'));
 const records=manifest.slides.map(entry=>JSON.parse(fs.readFileSync(`content/slides/${typeof entry==='string'?entry:entry.id}.json`,'utf8')));
 const allowed=manifest.profiles.internal.publish;
 await page.goto(pathToFileURL(path.resolve(`build/${deck}/internal/index.html`)).href);
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);
 const actual=await page.locator('section[data-slide-id]').evaluateAll(s=>s.map(x=>({id:x.dataset.slideId,label:x.dataset.label,text:x.textContent})));
 const aliases={'节首 · 服务模块':'节首 · 一','团队 · 总览':'团队'};const mismatches=[];const unbuilt=[];let matched=0;
 for(const [i,source]of baseline[deck].entries()){
  const record=typeof source==='string'?records[i]:records.find(r=>r.label===(aliases[source.label]||source.label));
  const label=typeof source==='string'?record?.label:aliases[source.label]||source.label;
  if(record&&record.status==='maintained'&&!allowed.includes(record.publish)){unbuilt.push({label,publish:record.publish});continue;}
  const target=typeof source==='string'?actual.find(x=>x.id===record?.id):actual.find(x=>x.label===label);
  const expected=typeof source==='string'?source:source.text;
  if(normalize(expected)===normalize(target?.text||''))matched++;else {const approved=(baseline.approvedDifferences||[]).find(x=>x.deck===deck&&x.label===label&&normalize(expected.replace(x.source,x.actual))===normalize(target?.text||''));mismatches.push({label,source:expected,actual:target?.text||'',cause:approved?.cause||null});}
 }
 held+=unbuilt.length;
 report.decks[deck]={compared:baseline[deck].length-unbuilt.length,matched,mismatches,unbuilt};
}
await browser.close();fs.mkdirSync('.build/migration',{recursive:true});fs.writeFileSync('.build/migration/text-equality.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(report.decks).map(([k,v])=>[k,{compared:v.compared,matched:v.matched,different:v.mismatches.length}]))));

const unexplained=Object.values(report.decks).flatMap(x=>x.mismatches).filter(x=>!x.cause);if(unexplained.length){console.error('FAIL: '+unexplained.length+' unexplained migration text differences');process.exitCode=1;}else console.log(`PASS: ${report.decks.intro.compared} corporate + ${report.decks.exhibit.compared} exhibit source texts preserved; ${held} hold slides retained in the baseline but not built; approved host discrepancy documented`);
