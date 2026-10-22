/* Layout-regression harness: renders every page in headless Chromium and records layout facts.
 *
 *   node scripts/snapshot.mjs --update   # rewrite snapshots/layout.json and PNGs
 *   node scripts/snapshot.mjs --check    # compare against snapshots/layout.json (exit 1 on drift)
 *   node scripts/snapshot.mjs            # same as --check, plus PNGs for eyeballing
 *
 * Facts per page and viewport: horizontal overflow, document height, count of headings, sections,
 * cards, charts and images, first-h1 box, console/page errors. Heights may drift ±3% and the h1 box ±2px
 * (font fallback differs between machines); everything else must match exactly. PNGs go to snapshots/render/ (ignored
 * by git) so a reviewer can diff them by eye; the JSON is the committed baseline.
 * Requires the global Playwright install used by scripts/export_people.mjs.
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = await import('./playwright.mjs');

const VIEWPORTS = { desktop: { width: 1280, height: 900 }, mobile: { width: 390, height: 844 } };
const PAGES = [
  ...['intro', 'exhibit', 'sales'].map(id => ({file: `build/${id}/internal/index.html`, vps: ['desktop']})),
  { file: 'index.html', vps: ['desktop', 'mobile'] },
  { file: 'brand/index.html', vps: ['desktop', 'mobile'] },
  { file: 'website/index.html', vps: ['desktop', 'mobile'] },
  { file: 'website/team.html', vps: ['desktop', 'mobile'] },
  { file: 'deck/index.html', vps: ['desktop'] },
  { file: 'report/index.html', vps: ['desktop'] },
  { file: 'people/blocks.html', vps: ['desktop', 'mobile'] },
  { file: 'people/namecards.html', vps: ['desktop'] },
  { file: 'people/social.html', vps: ['desktop'] },
  { file: 'people/profiles.html', vps: ['desktop', 'mobile'] },
  { file: 'people/profile-bian-jiang.html', vps: ['desktop'] },
  { file: 'people/profile-bian-jiang-1p.html', vps: ['desktop'] },
  { file: 'people/profile-guo-feng.html', vps: ['desktop'] },
  { file: 'people/profile-guo-feng-1p.html', vps: ['desktop'] },
  { file: 'html-system/sample/index.html', vps: ['desktop', 'mobile'] },
  { file: 'dist/example.html', vps: ['desktop', 'mobile'] },
];
const args = process.argv.slice(2);
const update = args.includes('--update');
const outDir = resolve(root, 'snapshots/render');
const baselinePath = resolve(root, 'snapshots/layout.json');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const result = {};
for (const page of PAGES) {
  for (const vp of page.vps) {
    const pg = await browser.newPage({ viewport: VIEWPORTS[vp] });
    const errors = [];
    pg.on('pageerror', (e) => errors.push(String(e.message || e)));
    pg.on('console', (m) => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND/.test(m.text())) errors.push(m.text()); });
    // Webfonts and portraits are supplied later by the user; a failed load of those is expected, anything else is not.
    pg.on('requestfailed', (r) => { const u = r.url(); if (!/\.woff2$|photos\/(founder-0[1-5]|missing)\.png$/.test(u)) errors.push('failed request ' + u.replace(/^.*dsys_tiansight0\d\//, '')); });
    await pg.goto('file://' + resolve(root, page.file));
    await pg.waitForTimeout(350);
    await pg.evaluate(() => document.querySelectorAll('.ts-reveal').forEach((e) => e.classList.remove('ts-reveal')));
    const facts = await pg.evaluate(() => {
      const d = document.documentElement;
      const n = (s) => document.querySelectorAll(s).length;
      const h1 = document.querySelector('h1');
      const box = h1 ? h1.getBoundingClientRect() : null;
      return {
        overflow: d.scrollWidth > d.clientWidth,
        height: d.scrollHeight,
        headings: [n('h1'), n('h2'), n('h3')],
        sections: n('section'), cards: n('.ts-card'), charts: n('svg[role="img"], .ts-chart, .fig'), images: n('img'),
        h1: box ? [Math.round(box.left), Math.round(box.top), Math.round(box.width), Math.round(box.height)] : null,
        title: document.title,
      };
    });
    facts.errors = errors;
    const key = `${page.file}@${vp}`;
    result[key] = facts;
    await pg.screenshot({ path: resolve(outDir, key.replace(/[\/@]/g, '_') + '.png'), fullPage: facts.height < 12000 });
    await pg.close();
  }
}
await browser.close();

if (update || !existsSync(baselinePath)) {
  writeFileSync(baselinePath, JSON.stringify(result, null, 1) + '\n');
  console.log(`wrote ${baselinePath} (${Object.keys(result).length} renders); PNGs in snapshots/render/`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(baselinePath, 'utf8'));
const drift = [];
for (const [key, got] of Object.entries(result)) {
  const was = base[key];
  if (!was) { drift.push(`${key}: no baseline (run --update)`); continue; }
  if (got.overflow) drift.push(`${key}: horizontal overflow`);
  if (got.errors.length) drift.push(`${key}: page errors: ${got.errors.join(' | ')}`);
  if (Math.abs(got.height - was.height) > was.height * 0.03) drift.push(`${key}: height ${was.height} → ${got.height}`);
  if (got.h1 && was.h1 && got.h1.some((v, i) => Math.abs(v - was.h1[i]) > 2)) drift.push(`${key}: h1 box ${JSON.stringify(was.h1)} → ${JSON.stringify(got.h1)}`);
  if (!!got.h1 !== !!was.h1) drift.push(`${key}: h1 presence changed`);
  for (const f of ['headings', 'sections', 'cards', 'charts', 'images', 'title']) {
    if (JSON.stringify(got[f]) !== JSON.stringify(was[f])) drift.push(`${key}: ${f} ${JSON.stringify(was[f])} → ${JSON.stringify(got[f])}`);
  }
}
for (const key of Object.keys(base)) if (!result[key]) drift.push(`${key}: in baseline but not rendered`);
if (drift.length) {
  console.log('DRIFT:'); drift.forEach((d) => console.log(' -', d));
  console.log('If intended, run: node scripts/snapshot.mjs --update');
  process.exit(1);
}
console.log(`PASS: ${Object.keys(result).length} renders match snapshots/layout.json (no overflow, no errors, structure and height within 3%)`);
