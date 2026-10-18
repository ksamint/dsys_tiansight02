// Render check + screenshots: node render.js <deck-dir> [id,id,…]
// Flags SHRINK (runtime had to shrink text), OVERLAP (text boxes overlap), HOVERFLOW (text wider than
// its box), TITLE2 (a page title on more than one line), ORPHAN (a wrapped text whose last line holds two characters or fewer), LOW (body text below y = 920; slides without a footer may go to y = 1016) and OUTX (text
// past the side margins). Screenshots go to SHOTS (default <deck>/.build/shots/). Exit 1 on any issue.
const { chromium } = require('playwright');
const fs = require('fs');
const H = require('./harness');
const cfg = H.config(process.argv);
const SHOTS = (process.env.SHOTS || cfg.build + 'shots/').replace(/\/?$/, '/');
const FONTCSS = `@font-face{font-family:'Noto Serif SC';font-weight:100 900;src:local('Noto Serif CJK SC')}
@font-face{font-family:'Noto Serif SC';font-weight:600 900;src:local('Noto Serif CJK SC Bold'),local('NotoSerifCJKsc-Bold')}
@font-face{font-family:'Noto Serif';font-weight:100 900;src:local('Noto Serif CJK SC')}
@font-face{font-family:'IBM Plex Mono';font-weight:100 900;src:local('DejaVu Sans Mono')}`;
(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERR', String(e).slice(0, 300)));
  const ids = process.argv[3] ? process.argv[3].split(',') : cfg.order;
  const { html, files } = H.deckHtml(cfg, ids, H.HEAD);
  await H.route(ctx, cfg, files, FONTCSS);
  await p.goto('https://deck.local/t.html'); await p.waitForFunction(() => globalThis.__UN, null, { timeout: 15000 });
  const out = await p.evaluate(async h => {
    globalThis.__SC(); const o = globalThis.__UN(h, {}); const c = o.content; const slides = c.order.map(id => c.slides[id]);
    try { const r = await globalThis.__FA(slides, c.assets || {}, {}); r.host.style.cssText = 'position:absolute;top:0;left:0;width:1920px;'; window.__ids = c.order;
      return { n: slides.length, w: r.warnings, errs: o.errors.map(x => x.message).slice(0, 5) }; } catch (e) { return { err: String(e) }; }
  }, html);
  if (out.err) { console.log(out.err); process.exit(1); }
  if (out.errs.length) console.log('runtime errors:', JSON.stringify(out.errs));
  await p.waitForTimeout(500);
  const els = await p.$$('[data-pdf-slide]');
  for (let i = 0; i < els.length; i++) { const s = await els[i].$(':scope > *'); await (s || els[i]).screenshot({ path: SHOTS + ids[i] + '.png' }); }
  const m = await p.evaluate(nofooter => {
    const res = [];
    document.querySelectorAll('[data-pdf-slide]').forEach((w, i) => {
      const id = window.__ids[i]; const s = w.firstElementChild; const sr = s.getBoundingClientRect(); const issues = [];
      const limit = nofooter.includes(id) ? 1016 : 925;
      const T = [...s.querySelectorAll('[data-text-path]')].filter(e => e.textContent.trim() !== '');
      const boxes = T.map(e => { const rg = document.createRange(); rg.selectNodeContents(e); return { e, rs: [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1), t: e.textContent.trim().slice(0, 14) }; });
      for (const x of T) {
        const t = x.textContent.trim().slice(0, 16); const cs = getComputedStyle(x); const r = x.getBoundingClientRect();
        const f = parseFloat(cs.getPropertyValue('--fit') || '1'); if (f < 0.995) issues.push('SHRINK ' + f.toFixed(2) + ' ' + t);
        if (x.scrollWidth > x.clientWidth + 3 && cs.whiteSpace !== 'nowrap') issues.push('HOVERFLOW ' + t);
        if (cs.position !== 'absolute' && r.bottom - sr.top > limit && r.top - sr.top < 960) issues.push('LOW ' + Math.round(r.bottom - sr.top) + ' ' + t);
        if (r.right - sr.left > 1800 || r.left - sr.left < 0) issues.push('OUTX ' + t);
        const fsz = parseFloat(cs.fontSize);
        if (fsz >= 43 && fsz <= 57 && r.top - sr.top < 330) { const q = document.createRange(); q.selectNodeContents(x); if (new Set([...q.getClientRects()].filter(z => z.width > 1).map(z => Math.round(z.top / 8))).size > 1) issues.push('TITLE2 ' + t); }
        const rg = document.createRange(); rg.selectNodeContents(x);
        const lines = {}; for (const q of rg.getClientRects()) if (q.width > 1) { const k = Math.round(q.top / 4); lines[k] = Math.max(lines[k] || 0, q.right) - 0, lines[k + 'l'] = Math.min(lines[k + 'l'] ?? 1e9, q.left); }
        const tops = Object.keys(lines).filter(k => !k.endsWith('l')).map(Number).sort((a, b) => a - b);
        if (tops.length > 1) { const k = tops[tops.length - 1]; const w = lines[k] - lines[k + 'l']; if (w < 2.3 * parseFloat(cs.fontSize)) issues.push('ORPHAN ' + t); }
      }
      for (let a = 0; a < boxes.length; a++) for (let c = a + 1; c < boxes.length; c++) {
        const A = boxes[a], C = boxes[c]; if (A.e.contains(C.e) || C.e.contains(A.e)) continue; let hit = 0;
        for (const r1 of A.rs) for (const r2 of C.rs) { const ox = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), oy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top); if (ox > 2 && oy > 2) hit = Math.max(hit, ox * oy); }
        if (hit > 40) issues.push('OVERLAP ' + A.t + ' <> ' + C.t);
      }
      res.push([id, issues]);
    });
    return res;
  }, cfg.meta.nofooter || []);
  let n = 0;
  for (const [id, is] of m) { if (!is.length) continue; console.log('##', id); for (const x of is.slice(0, 12)) console.log('   ', x); n += is.length; }
  console.log(`render: ${m.length} slides, ${n} issues, screenshots in ${SHOTS}`);
  await b.close(); process.exit(n || out.errs.length ? 1 : 0);
})();
