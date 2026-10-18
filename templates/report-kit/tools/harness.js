// Shared set-up for lint.js, render.js and pdf.js: paths, the patched Slides runtime and image routing.
//
// The runtime (app.js + app.css from the Claude Slides artifact type, patched by patch_runtime.py) is
// served from RUNTIME (default templates/report-kit/runtime/). Slide images are either repo-relative
// paths (resolved against the deck's slides/ folder) or /_blob/<id> ids (resolved through BLOBMAP +
// ASSETS). Both are rewritten to /_blob/<key> on a fake origin so the runtime accepts them.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KIT = path.resolve(__dirname, '..');
const REPO = path.resolve(KIT, '..', '..');

function config(argv) {
  const deck = path.resolve(argv[2] || process.env.DECK || '.') + '/';
  const runtime = path.resolve(process.env.RUNTIME || path.join(KIT, 'runtime')) + '/';
  for (const f of ['app.js', 'app.css']) {
    if (!fs.existsSync(runtime + f)) {
      console.error(`missing ${runtime}${f} — copy app.js and app.css from the Slides artifact type and run tools/patch_runtime.py (see README)`);
      process.exit(2);
    }
  }
  const blobmap = process.env.BLOBMAP ? JSON.parse(fs.readFileSync(process.env.BLOBMAP, 'utf8')) : {};
  const assets = path.resolve(process.env.ASSETS || REPO) + '/';
  let meta = { order: null, nofooter: [] };
  if (fs.existsSync(deck + '.tsk.json')) meta = JSON.parse(fs.readFileSync(deck + '.tsk.json', 'utf8'));
  const order = JSON.parse(fs.readFileSync(deck + 'deck.json', 'utf8')).order;
  return { deck, runtime, blobmap, assets, meta, order, build: deck + '.build/' };
}

// Read the slides and rewrite every image to /_blob/<key>; returns {html, files: key -> absolute path}.
function deckHtml(cfg, ids, head) {
  const files = {};
  for (const [id, f] of Object.entries(cfg.blobmap)) files[id] = path.isAbsolute(f) ? f : cfg.assets + f;
  let html = '<!doctype html><html><head><title>deck</title>' + (head || '') + '</head><body>';
  for (const id of ids) {
    const p = cfg.deck + 'slides/' + id + '.html';
    let h = fs.readFileSync(p, 'utf8');
    h = h.replace(/src="([^"]+)"/g, (m, src) => {
      if (/^https?:/.test(src) || src.startsWith('/_blob/')) return m;
      const abs = path.resolve(cfg.deck + 'slides/', src);
      if (!fs.existsSync(abs)) { console.log('MISSING IMAGE', id, src); return m; }
      const key = crypto.createHash('md5').update(abs).digest('hex');
      files[key] = abs;
      return `src="/_blob/${key}"`;
    });
    html += h + '\n';
  }
  return { html: html + '</body></html>', files };
}

// Route the fake origin: runtime files, the host page, images; fonts handled by the caller.
async function route(ctx, cfg, files, fontCss) {
  await ctx.route('**/*', async r => {
    const u = r.request().url();
    if (u.startsWith('https://deck.local/_blob/')) {
      const f = files[u.split('/_blob/')[1]];
      return f && fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 404 });
    }
    if (u.startsWith('https://deck.local/dsfont/')) return r.fulfill({ path: process.env.FONTDIR_RESOLVED + u.split('/dsfont/')[1], contentType: 'font/woff2' });
    if (u.startsWith('https://deck.local/')) {
      const f = u.replace('https://deck.local/', '').split('?')[0] || 't.html';
      const p = f === 't.html' ? path.join(__dirname, 't.html') : cfg.runtime + f;
      return fs.existsSync(p) ? r.fulfill({ path: p }) : r.fulfill({ status: 404, body: '' });
    }
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: fontCss, contentType: 'text/css' });
    return r.abort();
  });
}

// Font links the runtime expects in <head> (it maps them to the deck's faces).
const HEAD = ['Noto+Serif+SC:wght@300..700', 'IBM+Plex+Mono:wght@400;500', 'Noto+Serif:ital,wght@0,400..700;1,400']
  .map(f => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f}&display=swap">`).join('');

module.exports = { KIT, REPO, HEAD, config, deckHtml, route };
