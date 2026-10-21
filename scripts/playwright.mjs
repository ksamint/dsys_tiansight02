// Reuse an explicit, global, or Codex-cached Playwright installation.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
const candidates = [process.env.PLAYWRIGHT_MODULE,
  resolve(execSync('npm root -g').toString().trim(), 'playwright/index.mjs'),
  resolve(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')];
const modulePath = candidates.find(p => p && existsSync(p));
if (!modulePath) throw new Error('Playwright unavailable; set PLAYWRIGHT_MODULE to its index.mjs');
export const { chromium } = await import(modulePath);
