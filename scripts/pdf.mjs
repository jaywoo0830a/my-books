import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = join(import.meta.dirname, '..');
const HTML = join(ROOT, 'book.html');
const OUT_DIR = join(ROOT, 'dist');
const OUT_PDF = join(OUT_DIR, 'slow-bookstore.pdf');

if (!existsSync(HTML)) {
  console.error(`book.html not found. Run: npm run build`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

console.log('1. Chromium으로 인쇄');
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.goto(pathToFileURL(HTML).toString(), { waitUntil: 'networkidle' });
await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
await page.waitForTimeout(400);

await page.pdf({
  path: OUT_PDF,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();

console.log(`   wrote ${OUT_PDF}`);

console.log('2. 페이지 수 검증');
const html = readFileSync(HTML, 'utf8');
const declared = (html.match(/<section\s+class="hai-page[ "]/g) || []).length;

let pdfPages = null;
const info = spawnSync('pdfinfo', [OUT_PDF], { encoding: 'utf8' });
if (info.status === 0) {
  const m = info.stdout.match(/^Pages:\s+(\d+)/m);
  if (m) pdfPages = parseInt(m[1], 10);
}
if (pdfPages === null) {
  const buf = readFileSync(OUT_PDF);
  const text = buf.toString('latin1');
  pdfPages = (text.match(/\/Type\s*\/Page[\s/>]/g) || []).length;
}

const status = declared === pdfPages ? 'OK' : 'MISMATCH';
console.log(`   declared .hai-page sections: ${declared}`);
console.log(`   pdf pages:                   ${pdfPages}`);
console.log(`   status:                      ${status}`);

if (declared !== pdfPages) {
  console.error('\n  some page overflowed. open book.html in a browser and look for sections that bleed.');
  process.exit(1);
}
