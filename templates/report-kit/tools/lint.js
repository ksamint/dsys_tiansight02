// Renderer syntax check: node lint.js <deck-dir> [id,id,…]
// Prints the runtime's errors (e), warnings (w), unsupported styles (u), lints (l) and notes (n) per slide.
// Exit 1 when there is any error or unsupported style. Chinese "break mid-word" lints are dropped
// (Chinese wraps per character); the stylesheet note about the host page is dropped too.
const { chromium } = require('playwright');
const H = require('./harness');
const cfg = H.config(process.argv);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage();
  const ids = process.argv[3] ? process.argv[3].split(',') : cfg.order;
  const { html, files } = H.deckHtml(cfg, ids, H.HEAD);
  await H.route(ctx, cfg, files, '');
  await p.goto('https://deck.local/t.html'); await p.waitForFunction(() => globalThis.__UN, null, { timeout: 15000 });
  const r = await p.evaluate(h => {
    const o = globalThis.__UN(h, {}); const f = a => (a || []).map(x => typeof x === 'string' ? x : (x.line + ':' + x.col + ' ' + x.message));
    return { e: f(o.errors), w: f(o.warnings), u: f(o.unsupported), l: f(o.lints), n: f(o.notes) };
  }, html);
  const starts = []; html.split('\n').forEach((t, i) => { const m = t.match(/<section id="([^"]+)"/); if (m) starts.push([i + 1, m[1]]); });
  const slideAt = s => { const n = parseInt(s); let id = '-'; for (const [a, b] of starts) if (a <= n) id = b; return id; };
  let hard = 0;
  for (const k of ['e', 'w', 'u', 'l', 'n']) for (const x of r[k]) {
    if (k === 'l' && /break mid-word/.test(x) && /"[^"]*[\u3400-\u9fff][^"]*"/.test(x)) continue;
    if (k === 'n' && slideAt(x) === '-') continue;
    if (k === 'e' || k === 'u') hard++;
    console.log(k, slideAt(x), x.slice(0, 260));
  }
  console.log(`lint: ${ids.length} slides, ${hard} errors`);
  await b.close(); process.exit(hard ? 1 : 0);
})();
