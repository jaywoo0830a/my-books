import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export function findPlaywrightChrome() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root)
    .filter((name) => name.startsWith('chromium-') && !name.includes('headless'))
    .map((name) => ({ name, n: parseInt(name.split('-')[1], 10) }))
    .sort((a, b) => b.n - a.n);

  for (const { name } of dirs) {
    const candidate = join(root, name, 'chrome-linux64', 'chrome');
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {}
    const candidate2 = join(root, name, 'chrome-linux', 'chrome');
    try {
      if (statSync(candidate2).isFile()) return candidate2;
    } catch {}
  }
  throw new Error('Could not find Playwright Chromium. Run: npx playwright install chromium');
}
