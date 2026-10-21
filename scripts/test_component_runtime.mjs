// Offline integration check; uses the same global Playwright installation as snapshot.mjs.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||resolve(execSync('npm root -g').toString().trim(),'playwright/index.mjs'));
const version='2026.10.21-e0a760';
const runtime=`dist/components/${version}`;
const read=p=>readFileSync(resolve(root,p),'utf8');
const url=p=>pathToFileURL(resolve(root,p)).href;
const output=resolve(root,'.build/runtime-check');mkdirSync(output,{recursive:true});
const manifest=JSON.parse(read(`${runtime}/manifest.json`));
// Exercise the existing corporate template with its actual props and shared canonical people.
let template=read('docs/claude-design-system/templates/company-intro/CompanyIntro.dc.html').replace(/<helmet>[\s\S]*?<\/helmet>/,'').replace('from="./deck-stage.js"','');
let logic=read('docs/claude-design-system/templates/company-intro/CompanyIntro.dc.js').replace(/const PEOPLE = \[[\s\S]*?\n    \];/,'const PEOPLE = window.TIANSIGHT_TEAM.people;');
const types=[...new Set([...template.matchAll(/TIANSIGHTDesignSystem_e0a760\.([\w]+)/g)].map(m=>m[1]))];
const scripts=['vendor/react.min.js','vendor/react-dom.min.js','vendor/d3.min.js','vendor/d3-sankey.min.js','vendor/lucide-icons.js','_ds_bundle.js','deck-stage.js'].map(p=>runtime+'/'+p).concat(['content/team.js','content/contact.js',runtime+'/support.js']);
const fixture=`<!doctype html><html lang="zh"><head><meta charset="utf-8"><link rel="stylesheet" href="${url(runtime+'/styles.css')}">${scripts.map(p=>`<script src="${url(p)}"></script>`).join('')}</head><body><script>window.__renderedTypes=new Set();for(const name of ${JSON.stringify(types)}){const original=window.TIANSIGHTDesignSystem_e0a760[name];window.TIANSIGHTDesignSystem_e0a760[name]=function(...args){window.__renderedTypes.add(name);return original(...args);};}</script><x-dc>${template}</x-dc><script type="text/x-dc" data-dc-script>${logic}</script></body></html>`;
writeFileSync(resolve(output,'corporate.html'),fixture);
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const external=[];
await context.route(/^https?:/,route=>{external.push(route.request().url());return route.abort();});
const errors=[];const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const observations=[];
async function inspect(file, expectedSlides){
  const before=errors.length;
  await page.goto(url(file));
  if(expectedSlides)await page.waitForFunction(n=>document.querySelectorAll('section[data-label]').length===n,expectedSlides);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(x=>x.complete));
  // d3 uses React effects and ResizeObserver; wait for an actual chart where the page declares one.
  await page.waitForTimeout(180);
  const facts=await page.evaluate(()=>({
    slides:[...document.querySelectorAll('section[data-label]')].map(x=>({label:x.dataset.label,id:x.dataset.slideId,text:x.textContent.replace(/\u2060/g,'')})),
    missing:[...document.images].filter(x=>!x.naturalWidth).map(x=>x.getAttribute('src')),
    exports:Object.keys(window.TIANSIGHTDesignSystem_e0a760||{}).filter(k=>k!=='__errors'),
    runtimeErrors:window.TIANSIGHTDesignSystem_e0a760?.__errors||[],
    text:document.body.textContent.replace(/\u2060/g,''),
    fonts:document.fonts.status
  }));
  assert.deepEqual(errors.slice(before),[],file+' browser errors');
  assert.deepEqual(facts.missing,[],file+' missing images');
  assert.deepEqual(facts.runtimeErrors,[]);
  assert.deepEqual(facts.exports.sort(),manifest.components.map(x=>x.name).sort());
  observations.push({file,slides:facts.slides.length,exports:facts.exports.length,fonts:facts.fonts});
  return facts;
}
try{
  const exhibit=await inspect('deliverables/exhibit-design/index.html',41);
  const catalog=JSON.parse(read('content/deck-catalog.json')).decks.find(d=>d.id==='exhibit');
  assert.deepEqual(exhibit.slides.map(s=>s.id),catalog.slides.map(s=>s.id));
  assert(exhibit.text.includes('按项目约定')&&exhibit.text.includes('+22.2%')&&exhibit.text.includes('−19.2%'));
  assert(!exhibit.text.includes('+17.3%')&&!exhibit.text.includes('+13.2%'));
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.querySelector('deck-stage').index),1);
  await page.keyboard.press('ArrowLeft');
  // Capture every slide at authored size; report text rectangles outside its bounds.
  const clipping=[];
  await page.evaluate(()=>document.querySelector('deck-stage').setAttribute('noscale',''));
  for(let i=0;i<41;i++){
    await page.evaluate(i=>document.querySelector('deck-stage').goTo(i),i);
    const slide=page.locator('section[data-label]').nth(i);
    await slide.screenshot({path:resolve(output,`exhibit-${String(i+1).padStart(2,'0')}.png`)});
    const clipped=await slide.evaluate(el=>{
      const bounds=el.getBoundingClientRect(), bad=[];
      const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;
      while(n=walk.nextNode()){
        if(!n.textContent.trim()||['STYLE','SCRIPT'].includes(n.parentElement.tagName))continue;
        const style=getComputedStyle(n.parentElement);if(style.display==='none'||style.visibility==='hidden')continue;
        const range=document.createRange();range.selectNodeContents(n);
        for(const r of range.getClientRects())if(r.width&&r.height&&(r.left<bounds.left-2||r.right>bounds.right+2||r.top<bounds.top-2||r.bottom>bounds.bottom+2)){bad.push(n.textContent.slice(0,60));break;}
      }
      return bad;
    });
    if(clipped.length)clipping.push({page:i+1,text:clipped});
  }
  assert.deepEqual(clipping,[],'Exhibit text clipping');
  // Export from the same HTML, with identity in both HTML metadata and PDF title.
  if(process.argv.includes('--pdf')){
    await page.evaluate(()=>{document.querySelector('deck-stage').removeAttribute('noscale');document.title+=' | '+document.body.dataset.contentVersion+' | '+document.body.dataset.systemVersion;});
    await page.pdf({path:resolve(root,'deliverables/exhibit-design/exhibit-design.pdf'),printBackground:true,preferCSSPageSize:true});
  }
  await inspect('.build/runtime-check/corporate.html',47);
  assert(!((await page.locator('body').innerText()).match(/\d\.\d{10}/)),'Waterfall floating-point labels regressed');
  const used=await page.evaluate(()=>[...window.__renderedTypes]);
  for(const name of types)assert(used.includes(name),`Corporate type missing: ${name}`);
  const cards=[];
  for(const folder of ['components','slides']){
    const walk=dir=>{for(const e of readdirSync(resolve(root,dir),{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(p.endsWith('.card.html'))cards.push(p);}};walk(folder);
  }
  for(const file of cards.concat(['ui_kits/report/index.html','ui_kits/website/index.html','ui_kits/website/partners.html']))await inspect(file);
  await inspect('templates/sales-deck/SalesDeck.dc.html',14);
  const editable=await inspect('deliverables/exhibit-design/src/TiansightDeck-Exhibit.dc.html',41);
  assert.deepEqual(editable.slides,exhibit.slides,'Editable exhibit and generated HTML differ');
  assert.deepEqual(external,[],'Runtime attempted external requests');
  writeFileSync(resolve(output,'results.json'),JSON.stringify({version,observations,corporateTypes:types,exhibitText:exhibit.slides.map(s=>s.text),clipping,external,errors},null,2)+'\n');
  console.log(`PASS: 105 exports; 41 exhibit slides; 47 corporate slides (${types.length} component types); ${cards.length} cards; offline images/fonts/navigation/clipping`);
}finally{await browser.close();}
