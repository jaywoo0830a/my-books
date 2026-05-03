import { chromium } from 'playwright';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = join(import.meta.dirname, '..');
const HTML = join(ROOT, 'book.html');
const OUT = join(ROOT, 'dist', 'previews');
mkdirSync(OUT, { recursive: true });

const which = (process.argv[2] || '1,2,3,6,8,13,17,20,23,30')
  .split(',')
  .map((n) => parseInt(n.trim(), 10))
  .filter((n) => !Number.isNaN(n));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 800, height: 1200 } });
const page = await ctx.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(pathToFileURL(HTML).toString(), { waitUntil: 'networkidle' });
await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
await page.waitForTimeout(400);

for (const n of which) {
  const el = await page.locator('section.hai-page').nth(n - 1);
  const out = join(OUT, `page-${String(n).padStart(2, '0')}.png`);
  await el.screenshot({ path: out });
  console.log(`page ${n} → ${out}`);
}
await browser.close();
