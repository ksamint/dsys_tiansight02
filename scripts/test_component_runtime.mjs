// Offline integration check; uses the same global Playwright installation as snapshot.mjs.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=await import('./playwright.mjs');
const version='2026.10.21-e0a760';
const runtime=`dist/components/${version}`;
const read=p=>readFileSync(resolve(root,p),'utf8');
const url=p=>pathToFileURL(resolve(root,p)).href;
const output=resolve(root,'.build/runtime-check');mkdirSync(output,{recursive:true});
const manifest=JSON.parse(read(`${runtime}/manifest.json`));
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
  const catalog=JSON.parse(read('content/deck-catalog.json'));
  const decks={};
  for(const id of ['intro','sales','exhibit']){
    const entry=catalog.decks.find(d=>d.id===id);
    // The internal review build carries every maintained slide its profile filter publishes; hold slides never ship.
    const allowed=JSON.parse(read(`content/decks/${id}.json`)).profiles.internal.publish;
    assert(!allowed.includes('hold'),id+' internal profile must not publish hold slides');
    const expected=entry.slides.filter(s=>{const record=JSON.parse(read(`content/slides/${s.id}.json`));return record.status!=='planned'&&allowed.includes(record.publish);}).map(s=>s.id);
    const facts=await inspect(`build/${id}/internal/index.html`, expected.length);
    assert.deepEqual(facts.slides.map(s=>s.id), expected);
    assert(!facts.text.match(/\d\.\d{10}/),'Floating-point chart label regression');
    decks[id]=facts;
  }
  const exhibit=decks.exhibit;
  // Approved exhibit values live in the library; they render whenever their slide is published, and a held slide keeps them verbatim.
  const builtIds=new Set(exhibit.slides.map(s=>s.id));
  for(const approved of ['按项目约定','+22.2%','−19.2%']){
    const owners=readdirSync(resolve(root,'content/slides')).map(f=>JSON.parse(read(`content/slides/${f}`))).filter(r=>r.status==='maintained'&&JSON.stringify(r.props).includes(approved));
    assert(owners.length,approved+' missing from the slide library');
    assert.equal(exhibit.text.includes(approved),owners.some(r=>builtIds.has(r.id)),approved+' must render exactly when its slide is published');
  }
  assert(!exhibit.text.includes('+17.3%')&&!exhibit.text.includes('+13.2%'));
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.querySelector('deck-stage').index),1);
  await page.keyboard.press('ArrowLeft');
  // Capture every slide at authored size; report text rectangles outside its bounds.
  const clipping=[];
  await page.evaluate(()=>document.querySelector('deck-stage').setAttribute('noscale',''));
  for(let i=0;i<exhibit.slides.length;i++){
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
  const cards=[];
  for(const folder of ['components','slides']){
    const walk=dir=>{for(const e of readdirSync(resolve(root,dir),{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(p.endsWith('.card.html'))cards.push(p);}};walk(folder);
  }
  for(const file of cards.concat(['ui_kits/report/index.html','ui_kits/website/index.html','ui_kits/website/partners.html']))await inspect(file);
  // Explicit specimen props must not hide a broken default runtime asset resolver.
  await page.evaluate(()=>{const host=document.createElement('div');document.body.append(host);ReactDOM.flushSync(()=>ReactDOM.createRoot(host).render(React.createElement(window.TIANSIGHTDesignSystem_e0a760.Seal,{})));});
  await page.waitForFunction(()=>[...document.images].every(x=>x.complete));
  assert.deepEqual(await page.evaluate(()=>[...document.images].filter(x=>!x.naturalWidth).map(x=>x.src)),[],'Bare Seal default image');
  assert.deepEqual(external,[],'Runtime attempted external requests');
  writeFileSync(resolve(output,'results.json'),JSON.stringify({version,observations,decks:Object.fromEntries(Object.entries(decks).map(([id,facts])=>[id,facts.slides])),exhibitText:exhibit.slides.map(s=>s.text),clipping,external,errors},null,2)+'\n');
  console.log(`PASS: 105 exports; ${decks.exhibit.slides.length} exhibit slides; ${decks.intro.slides.length} intro slides; ${decks.sales.slides.length} sales slides (shared canonical library); ${cards.length} cards; offline images/fonts/navigation/clipping`);
}finally{await browser.close();}
