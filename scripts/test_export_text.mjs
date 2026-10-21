// Verify computed CSS case transforms without losing SVG chart labels or case sensitivity.
import assert from 'node:assert/strict';
import { chromium } from './playwright.mjs';
import { captureSlide } from './capture_slide.mjs';
const browser=await chromium.launch();
try{
 const page=await browser.newPage();
 await page.setContent('<html lang="en"><body><section><span style="text-transform:uppercase">Proof +22.2%</span><span style="text-transform:lowercase">LOWER</span><span>MiXeD</span><svg width="200" height="50"><text x="0" y="30" style="text-transform:uppercase">Svg 13.2</text></svg></section></body></html>');
 const capture=await page.locator('section').evaluate(captureSlide);
 assert.equal(capture.text,'PROOF +22.2%lowerMiXeDSVG 13.2');
 assert(capture.numericRanges.some(r=>r.text==='+22.2%'));
 assert(capture.numericRanges.some(r=>r.text==='13.2'));
 await page.locator('span').nth(2).evaluate(el=>el.textContent='mixed');
 const altered=await page.locator('section').evaluate(captureSlide);
 assert.notEqual(altered.text,capture.text,'Unstyled source case changes must remain detectable');
 console.log('PASS: rendered CSS uppercase/lowercase, mixed case fidelity, SVG labels and numeric ranges');
}finally{await browser.close();}
