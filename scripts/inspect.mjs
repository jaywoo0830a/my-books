import { chromium } from 'playwright';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = join(import.meta.dirname, '..');
const HTML = join(ROOT, 'book.html');
if (!existsSync(HTML)) {
  console.error('book.html not found. Run: npm run build');
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 800, height: 1200 } });
const page = await ctx.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(pathToFileURL(HTML).toString(), { waitUntil: 'networkidle' });
await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
await page.waitForTimeout(400);

const result = await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('section.hai-page'));
  return sections.map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      index: i + 1,
      h1: (el.querySelector('h1')?.textContent || '').trim().slice(0, 40),
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      overflow: el.scrollHeight - el.clientHeight,
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });
});

await browser.close();

let overflowing = 0;
for (const r of result) {
  const flag = r.overflow > 1 ? `OVERFLOW +${r.overflow}px` : 'ok';
  console.log(`${String(r.index).padStart(2)} · ${r.height}h · ${flag.padEnd(18)} · ${r.h1}`);
  if (r.overflow > 1) overflowing++;
}

console.log(`\nresult: ${result.length - overflowing}/${result.length} pages clean`);
process.exit(overflowing > 0 ? 1 : 0);
