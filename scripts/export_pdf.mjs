// Offline browser capture is shared by PDF verification and all deck exports.
import { chromium } from './playwright.mjs';
import { captureSlide } from './capture_slide.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const file=resolve(process.argv[2]);
const output=dirname(file), build=JSON.parse(readFileSync(resolve(output,'build.json'),'utf8'));
const capture=resolve(output,'.verification');mkdirSync(capture,{recursive:true});
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
 const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.route(/^https?:/,r=>{external.push(r.request().url());return r.abort();});
 await page.goto(pathToFileURL(file).href);
 await page.waitForFunction(()=>window.TIANSIGHT_DECK_READY);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
 await page.waitForTimeout(200);
 assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[],'Missing deck images');
 assert.deepEqual(errors,[],'Browser errors');assert.deepEqual(external,[],'External requests');
 await page.evaluate(()=>document.querySelector('deck-stage').setAttribute('noscale',''));
 const pages=[];
 for(let i=0;i<build.pageCount;i++){
  await page.evaluate(i=>document.querySelector('deck-stage').goTo(i),i);
  const section=page.locator('section[data-slide-id]').nth(i);
  const facts=await section.evaluate(captureSlide);
  assert.deepEqual(facts.clipped,[],`Slide ${i+1} HTML text clipping`);
  await section.screenshot({path:resolve(capture,`page-${i+1}.png`)});
  pages.push(facts);
 }
 await page.evaluate(build=>{document.querySelector('deck-stage').removeAttribute('noscale');document.title+=' | '+['deckId','profile','contentVersion','systemVersion','htmlSha256'].map(k=>build[k]).join(' | ');},build);
 await page.pdf({path:resolve(output,'deck.pdf'),width:'1280px',height:'720px',printBackground:true,preferCSSPageSize:true});
 writeFileSync(resolve(capture,'html.json'),JSON.stringify({contentVersion:build.contentVersion,systemVersion:build.systemVersion,htmlSha256:build.htmlSha256,pages,external,errors},null,2)+'\n');
 console.log(`PASS: exported ${build.deckId}/${build.profile}, ${pages.length} offline pages`);
}finally{await browser.close();}
