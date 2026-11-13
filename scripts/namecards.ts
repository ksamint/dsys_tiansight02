// 侍天 TIANSIGHT name cards: local editor and PNG export.
//
//   node scripts/namecards.ts            open the editor at http://127.0.0.1:4178
//   node scripts/namecards.ts export     export PNGs from people/local/cards.json, no editor
//   PORT=5000 node scripts/namecards.ts  editor on another port
//
// Real contact details are typed in here and saved to people/local/cards.json, which git ignores
// (docs/maintaining.md §6). The committed people/people.json keeps placeholders. Layout comes from
// scripts/build_people.py; this file only moves values and drives the export.
// Output: people/export/namecards/*-trim.png (90 × 54 mm) and *-bleed.png (96 × 60 mm), 300 dpi.
// Runs on Node 22.18+ (built-in type stripping) with the globally installed playwright.

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createRequire } from 'node:module';
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Card {
  name: string;
  en: string;
  title: string;
  title_en: string;
  phone: string;
  wechat: string;
  email: string;
}

const FIELDS: ReadonlyArray<[keyof Card, string]> = [
  ['name', '姓名'], ['en', '英文名'], ['title', '职务'], ['title_en', '英文职务'],
  ['phone', '电话 M'], ['wechat', '微信 微'], ['email', '邮箱 E'],
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localDir = path.join(root, 'people', 'local');
const cardsFile = path.join(localDir, 'cards.json');
const pageFile = path.join(root, 'people', 'export', 'namecards.html');
const pngDir = path.join(root, 'people', 'export', 'namecards');
const DPI = 300;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function blank(): Card {
  return { name: '', en: '', title: '联合创始人', title_en: 'Co-founder', phone: '', wechat: '', email: '' };
}

function loadCards(): Card[] {
  if (!existsSync(cardsFile)) {
    const seed = JSON.parse(readFileSync(path.join(root, 'people', 'people.json'), 'utf8')) as { cards: Card[] };
    saveCards(seed.cards);
  }
  return JSON.parse(readFileSync(cardsFile, 'utf8')) as Card[];
}

function saveCards(cards: Card[]): void {
  mkdirSync(localDir, { recursive: true });
  writeFileSync(cardsFile, JSON.stringify(cards, null, 2) + '\n');
}

function render(): void {
  execFileSync('python3', [path.join(root, 'scripts', 'build_people.py'), '--cards', cardsFile, '--out', pageFile], { stdio: 'ignore' });
}

const slug = (c: Card, i: number): string =>
  `back-${String(i + 1).padStart(2, '0')}` + (c.en.trim() ? '-' + c.en.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '');

async function exportPng(cards: Card[]): Promise<string[]> {
  render();
  const req = createRequire(import.meta.url);
  const { chromium } = req(path.join(execSync('npm root -g').toString().trim(), 'playwright')) as typeof import('playwright');
  rmSync(pngDir, { recursive: true, force: true });
  mkdirSync(pngDir, { recursive: true });
  const names = ['front', ...cards.map(slug)];
  const written: string[] = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 4000 }, deviceScaleFactor: DPI / 96 });
    await page.goto('file://' + pageFile);
    await page.evaluate(() => document.fonts.ready);
    // Trim: the card itself, clipped to 90 × 54 mm → 1063 × 638 px.
    const px = (mm: number): number => (mm * 96) / 25.4;
    await page.evaluate(() => { document.body.className = 'export'; });
    const cardsEls = await page.locator('.sheet .card').all();
    for (let i = 0; i < cardsEls.length; i++) {
      const box = await cardsEls[i].boundingBox();
      if (!box) continue;
      const file = path.join(pngDir, `${names[i]}-trim.png`);
      await page.screenshot({ path: file, clip: { x: box.x, y: box.y, width: px(90), height: px(54) }, animations: 'disabled' });
      written.push(path.relative(root, file));
    }
    // Bleed: one sheet at a time, filling a viewport of 96 × 60 mm → 1134 × 709 px. (A clip that size
    // comes back a few pixels short in Chromium, so the viewport sets the size instead.)
    await page.setViewportSize({ width: Math.ceil(px(96)), height: Math.ceil(px(60)) });
    await page.evaluate(() => { document.body.className = 'export export-bleed'; });
    await page.addStyleTag({ content: '.shell-head,.spec-note{display:none}.cards{display:block;padding:0}.sheet{width:100vw;height:100vh;box-sizing:border-box}.sheet[hidden]{display:none}' });
    const sheets = await page.locator('.sheet').all();
    for (let i = 0; i < sheets.length; i++) {
      await page.evaluate((n: number) => { document.querySelectorAll('.sheet').forEach((s, k) => { (s as HTMLElement).hidden = k !== n; }); }, i);
      const file = path.join(pngDir, `${names[i]}-bleed.png`);
      await page.screenshot({ path: file, animations: 'disabled' });
      written.push(path.relative(root, file));
    }
  } finally {
    await browser.close();
  }
  return written;
}

function editor(cards: Card[], note: string): string {
  const sets = cards.map((c, i) => `
    <fieldset class="person"><legend>背面 ${i + 1}${c.name ? ' · ' + esc(c.name) : ''}</legend>
      ${FIELDS.map(([k, label]) => `<div class="ts-field"><label class="ts-label" for="c${i}-${k}">${label}</label>
        <input class="ts-input" id="c${i}-${k}" name="c${i}.${k}" value="${esc(c[k])}"></div>`).join('')}
      <button class="ts-button ts-button-quiet ts-button-sm" formaction="/remove?i=${i}">删除这张</button>
    </fieldset>`).join('');
  return `<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>名片编辑 · 侍天 TIANSIGHT</title>
<link rel="stylesheet" href="/r/brand/fonts.css"><link rel="stylesheet" href="/r/brand/tokens.css">
<link rel="stylesheet" href="/r/brand/base.css"><link rel="stylesheet" href="/r/brand/components.css">
<style>
  body { margin: 0; }
  .ed { display: grid; grid-template-columns: minmax(300px, 380px) 1fr; min-height: 100vh; }
  form { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5); border-right: 1px solid var(--line); background: var(--paper); }
  .person { border: 1px solid var(--card-border); border-radius: 2px; padding: var(--space-4); display: grid; gap: var(--space-3); margin: 0; }
  .person legend { padding: 0 var(--space-2); font-weight: var(--weight-title); }
  .acts { display: flex; flex-wrap: wrap; gap: var(--space-3); position: sticky; bottom: 0; background: var(--paper); padding-block: var(--space-3); }
  .note { font-size: var(--text-small); color: var(--text-muted); white-space: pre-line; margin: 0; }
  iframe { width: 100%; height: 100%; border: 0; background: var(--surface); }
</style></head><body><main class="ed">
<form method="post" action="/save">
  <div class="ts-heading"><span class="ts-caption">Name cards · 本地编辑</span><h1>名片编辑</h1></div>
  <p class="note">填写后点「保存预览」；导出的 PNG 在 people/export/namecards/（300 dpi，含裁切版与 3 mm 出血版）。
数据只存在 people/local/cards.json，不进入公开仓库。${note ? '\n\n' + esc(note) : ''}</p>
  ${sets}
  <div class="acts">
    <button class="ts-button" formaction="/save">保存预览</button>
    <button class="ts-button ts-button-secondary" formaction="/export">导出 PNG</button>
    <button class="ts-button ts-button-quiet" formaction="/add">新增一张</button>
  </div>
</form>
<iframe title="名片预览" src="/r/people/export/namecards.html?t=${Date.now()}"></iframe>
</main></body></html>`;
}

async function body(req: IncomingMessage): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}

function fromForm(form: URLSearchParams, count: number): Card[] {
  return Array.from({ length: count }, (_, i) => {
    const c = blank();
    for (const [k] of FIELDS) c[k] = (form.get(`c${i}.${k}`) ?? '').trim();
    return c;
  });
}

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.js': 'text/javascript',
};

function serveFile(res: ServerResponse, urlPath: string): void {
  const file = path.resolve(root, '.' + decodeURIComponent(urlPath));
  if (!file.startsWith(root + path.sep) || !existsSync(file)) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(readFileSync(file));
}

function startEditor(port: number): void {
  let note = '';
  loadCards();
  render();
  createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(editor(loadCards(), note));
        note = '';
        return;
      }
      if (req.method === 'GET' && url.pathname.startsWith('/r/')) { serveFile(res, url.pathname.slice(2)); return; }
      if (req.method === 'POST') {
        const form = await body(req);
        let cards = fromForm(form, loadCards().length);
        if (url.pathname === '/add') cards.push(blank());
        if (url.pathname === '/remove') cards = cards.filter((_, i) => i !== Number(url.searchParams.get('i')));
        saveCards(cards);
        render();
        note = '已保存。';
        if (url.pathname === '/export') {
          const files = await exportPng(cards);
          note = `已导出 ${files.length} 个 PNG：\n` + files.join('\n');
        }
        res.writeHead(303, { location: '/' }).end();
        return;
      }
      res.writeHead(404).end('not found');
    } catch (err) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }).end(String(err));
    }
  }).listen(port, '127.0.0.1', () => console.log(`name-card editor: http://127.0.0.1:${port}  (Ctrl+C to stop)`));
}

if (process.argv[2] === 'export') {
  const files = await exportPng(loadCards());
  files.forEach((f) => console.log('png', f));
} else {
  startEditor(Number(process.env.PORT ?? 4178));
}
