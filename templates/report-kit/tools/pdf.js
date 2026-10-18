// Clickable PDF: node pdf.js <deck-dir> <links.json> <out.pdf>
// Renders the deck with the design-system fonts (TOKENS lists the WOFF2 subsets, FONTDIR holds them;
// defaults are the repo's docs/claude-design-system/tokens.json and brand/fonts/), overlays an <a> on
// every link in links.json (written by tsk.build_links) and prints one 1920×1080 page per slide.
// DEBUG=id,id outlines the link boxes and saves screenshots of those slides to <deck>/.build/.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const H = require('./harness');
const cfg = H.config(process.argv);
const LK = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const OUT = process.argv[4];
const DEBUG = process.env.DEBUG;
const TOKENS = process.env.TOKENS || path.join(H.REPO, 'docs/claude-design-system/tokens.json');
process.env.FONTDIR_RESOLVED = path.resolve(process.env.FONTDIR || path.join(H.REPO, 'brand/fonts')) + '/';
// one family name per subset file; the stacks replace the deck's family names
const tok = JSON.parse(fs.readFileSync(TOKENS, 'utf8')).type.fonts;
const fam = { 'Noto Serif SC': [], 'Noto Serif': [], 'IBM Plex Mono': [] }; let css = ''; const pmIdx = {};
tok.forEach((f, i) => {
  let name;
  if (f.family === 'IBM Plex Mono') { pmIdx[f.weight] = (pmIdx[f.weight] || 0); name = 'PM' + pmIdx[f.weight]++; }
  else if (f.family === 'Noto Serif') name = 'NS' + (fam['Noto Serif'].length % 8); else name = 'NSC' + i;
  if (!fam[f.family].includes(name)) fam[f.family].push(name);
  css += `@font-face{font-family:'${name}';font-weight:${f.weight};font-style:${f.style};src:url(https://deck.local/dsfont/${f.file.split('/').pop()}) format('woff2');font-display:block}\n`;
});
const STACK = {}; for (const k in fam) STACK[k] = fam[k].map(n => `'${n}'`).join(',');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERR', String(e).slice(0, 300)));
  const ids = LK.order;
  const { html, files } = H.deckHtml(cfg, ids, '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC">');
  await H.route(ctx, cfg, files, css);
  await p.goto('https://deck.local/t.html'); await p.waitForFunction(() => globalThis.__UN, null, { timeout: 15000 });
  const out = await p.evaluate(async ([h, css, STACK]) => {
    globalThis.__SC(); const o = globalThis.__UN(h, {}); const c = o.content; const slides = c.order.map(id => c.slides[id]);
    const r = await globalThis.__FA(slides, c.assets || {}, {}); const host = r.host;
    const st = document.createElement('style');
    st.textContent = css + `@page{size:1920px 1080px;margin:0}html,body{margin:0;padding:0;background:#fff}
 [data-pdf-slide]{position:relative!important;width:1920px;height:1080px;overflow:hidden;break-after:page;break-inside:avoid}`;
    document.head.appendChild(st);
    host.style.cssText = 'position:static;width:1920px;';
    document.body.innerHTML = ''; document.body.appendChild(host);
    let swapped = 0;
    host.querySelectorAll('*').forEach(el => {
      const ff = el.style && el.style.fontFamily; if (!ff) return;
      const n = ff.replace(/["']?Noto Serif SC["']?/g, STACK['Noto Serif SC']).replace(/["']?IBM Plex Mono["']?/g, STACK['IBM Plex Mono']).replace(/["']?Noto Serif["']?(?! SC)/g, STACK['Noto Serif']);
      if (n !== ff) { el.style.fontFamily = n; swapped++; }
    });
    await Promise.all([...document.fonts].map(f => f.load().catch(() => null)));
    await document.fonts.ready;
    const status = [...document.fonts].reduce((m, f) => (m[f.status] = (m[f.status] || 0) + 1, m), {});
    return { status, n: slides.length, swapped, errs: o.errors.map(x => x.message).slice(0, 5) };
  }, [html, css, STACK]);
  console.log('fonts', JSON.stringify(out.status), 'slides', out.n, 'errors', JSON.stringify(out.errs));
  if (out.status.error) console.log('warning: some font subsets failed to load');
  await p.waitForTimeout(1500);
  const res = await p.evaluate(([ids, links, DEBUG]) => {
    const W = [...document.querySelectorAll('[data-pdf-slide]')]; const miss = []; let made = 0;
    W.forEach((w, i) => { w.id = 'p-' + ids[i]; });
    for (const L of links) {
      const w = W[ids.indexOf(L.slide)]; if (!w) { miss.push(L.slide + ' :: (no slide)'); continue; }
      const wr = w.getBoundingClientRect(); const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT); let node, hit = 0; const cands = [];
      while ((node = tw.nextNode())) {
        let k = node.data.indexOf(L.needle);
        while (k >= 0) {
          const rg = document.createRange(); rg.setStart(node, k + (L.s ?? 0)); rg.setEnd(node, k + (L.e ?? L.needle.length));
          let rects = [...rg.getClientRects()].filter(r => r.width > 1);
          if (L.up) { let el = node.parentElement; for (let u = 0; u < L.up; u++) el = el.parentElement; rects = [el.getBoundingClientRect()]; }
          const top = Math.min(...rects.map(r => r.top)) - wr.top;
          if ((L.zone === 'footer') === (top > 960)) cands.push(rects);
          k = node.data.indexOf(L.needle, k + 1);
        }
      }
      for (const rects of (L.last ? cands.slice(-1) : cands)) {
        for (const r of rects) {
          const a = document.createElement('a'); a.href = '#p-' + L.target;
          a.style.cssText = `position:absolute;display:block;z-index:99;left:${r.left - wr.left - 4}px;top:${r.top - wr.top - 4}px;width:${r.width + 8}px;height:${r.height + 8}px;` + (DEBUG ? 'outline:3px solid rgba(255,0,0,.7)' : '');
          w.appendChild(a); made++;
        }
        hit++;
      }
      if (!hit) miss.push(L.slide + ' :: ' + L.needle);
    }
    return { made, miss };
  }, [ids, LK.links, !!DEBUG]);
  console.log('links made', res.made, 'missing', res.miss.length ? JSON.stringify(res.miss).slice(0, 800) : 0);
  if (DEBUG) { const W = await p.$$('[data-pdf-slide]'); fs.mkdirSync(cfg.build, { recursive: true }); for (const id of DEBUG.split(',')) await W[ids.indexOf(id)].screenshot({ path: cfg.build + 'dbg_' + id + '.png' }); }
  await p.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, tagged: true, preferCSSPageSize: true });
  await b.close(); process.exit(res.miss.length ? 1 : 0);
})();
