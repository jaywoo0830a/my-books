import { readdirSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { findPlaywrightChrome } from './find-chrome.mjs';

const ROOT = join(import.meta.dirname, '..');
const SRC_HTML = join(ROOT, 'src', 'book.html');
const OUT_HTML = join(ROOT, 'book.html');
const DIAGRAMS_DIR = join(ROOT, 'diagrams');
const HTMLASITIS_CSS = join(ROOT, 'node_modules', 'htmlasitis', 'htmlasitis.css');
const PUPPETEER_CFG = join(ROOT, 'scripts', 'puppeteer-config.json');
const MERMAID_CFG = join(ROOT, 'scripts', 'mermaid-config.json');

const TMP = join(tmpdir(), `mybooks-${process.pid}`);
mkdirSync(TMP, { recursive: true });

const chrome = findPlaywrightChrome();
process.env.PUPPETEER_EXECUTABLE_PATH = chrome;

console.log('1. 다이어그램 렌더링');

const diagrams = readdirSync(DIAGRAMS_DIR)
  .filter((f) => f.endsWith('.mmd'))
  .sort();

const diagramPng = {};
for (const file of diagrams) {
  const name = basename(file, extname(file));
  const inPath = join(DIAGRAMS_DIR, file);
  const outPath = join(TMP, `${name}.png`);
  process.stdout.write(`   ${name} … `);

  const res = spawnSync(
    'npx',
    [
      'mmdc',
      '-i', inPath,
      '-o', outPath,
      '-c', MERMAID_CFG,
      '-p', PUPPETEER_CFG,
      '-b', 'white',
      '-s', '3',
      '-w', '1400',
    ],
    { encoding: 'utf8' },
  );

  if (res.status !== 0) {
    process.stdout.write('FAIL\n');
    if (res.stderr) process.stderr.write(res.stderr);
    if (res.stdout) process.stderr.write(res.stdout);
    process.exit(1);
  }
  diagramPng[name] = readFileSync(outPath);
  process.stdout.write(`ok (${(diagramPng[name].length / 1024).toFixed(1)} kB)\n`);
}

console.log('2. CSS · 이미지 인라인');

const css = readFileSync(HTMLASITIS_CSS, 'utf8');
let html = readFileSync(SRC_HTML, 'utf8');

html = html.replace('/* HTMLASITIS_CSS */', () => css);

html = html.replace(
  /<img\b([^>]*)\bdata-mermaid="([^"]+)"([^>]*)>/g,
  (match, before, name, after) => {
    const png = diagramPng[name];
    if (!png) {
      console.error(`   missing diagram: ${name}`);
      process.exit(1);
    }
    const dataUri = `data:image/png;base64,${png.toString('base64')}`;
    const cleaned = (before + after).replace(/\s+data-mermaid="[^"]+"/g, '');
    return `<img${cleaned} src="${dataUri}">`;
  },
);

writeFileSync(OUT_HTML, html, 'utf8');

const pageCount = (html.match(/<section\s+class="hai-page[ "]/g) || []).length;
const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`   wrote ${OUT_HTML}`);
console.log(`   .hai-page sections: ${pageCount}`);
console.log(`   single-file size:   ${sizeKb} kB`);

rmSync(TMP, { recursive: true, force: true });

if (pageCount !== 30) {
  console.warn(`   warning: expected 30 pages, got ${pageCount}`);
}

console.log('\n  build done. next: npm run pdf');
