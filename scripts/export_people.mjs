// Export the social artboards to PNG and the name cards to PDF with the bundled Chromium.
//   node scripts/export_people.mjs            → people/export/*.png, people/export/namecards.pdf
// Requires playwright (npm i -g playwright, or the preinstalled copy in this environment).
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.join(root, 'people', 'export');
mkdirSync(out, { recursive: true });

const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = createRequire(import.meta.url)(path.join(globalRoot, 'playwright'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(root, 'people', 'social.html'));
await page.waitForTimeout(300);
for (const el of await page.locator('.art').all()) {
  const id = await el.getAttribute('id');
  await el.screenshot({ path: path.join(out, id + '.png') });
  console.log('png', id);
}
await page.goto('file://' + path.join(root, 'people', 'namecards.html'));
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: path.join(out, 'namecards.pdf'), width: '90mm', height: '54mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
console.log('pdf namecards');
await browser.close();
