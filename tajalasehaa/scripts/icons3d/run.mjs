// Drives render.html in headless Chromium (SwiftShader WebGL) and writes 512px PNGs to ./png
// usage: node run.mjs [--keys a,b,c] [--variants tile,glyph,light] [--out png] [--debug2d] [--cfg '{"exposure":1.1}']
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { startServer } from './serve.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);

const PORT = Number(opt('port', 4455));
const outDir = path.join(HERE, opt('out', 'png'));
fs.mkdirSync(outDir, { recursive: true });

const server = await startServer(PORT);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined, // e.g. a local Chromium; default: Playwright's
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    '--disable-background-networking', '--disable-component-update', '--no-first-run'],
});
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 640 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[page ${m.type()}]`, m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${PORT}/render.html`);
  await page.waitForFunction(() => window.__ready === true || window.__error, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);
  console.log('GL:', await page.evaluate(() => window.ICONS.gl));
  const cfg = opt('cfg', null);
  if (cfg) await page.evaluate((c) => window.ICONS.reset(JSON.parse(c)), cfg);
  const allKeys = await page.evaluate(() => window.ICONS.keys);
  const keys = opt('keys', null) ? opt('keys').split(',') : allKeys;
  const variants = opt('variants', 'tile,glyph,light').split(',');
  const suffix = { tile: '', glyph: '-glyph', light: '-light' };

  if (flag('debug2d')) {
    for (const key of keys) {
      const url = await page.evaluate((k) => window.ICONS.debugPolylines(k), key);
      fs.writeFileSync(path.join(outDir, `${key}-2d.png`), Buffer.from(url.split(',')[1], 'base64'));
    }
    console.log('debug2d done');
  } else {
    const t0 = Date.now();
    for (const key of keys) {
      const t1 = Date.now();
      for (const v of variants) {
        const url = await page.evaluate(([k, vv]) => window.ICONS.renderIcon(k, vv), [key, v]);
        fs.writeFileSync(path.join(outDir, `${key}${suffix[v]}.png`), Buffer.from(url.split(',')[1], 'base64'));
      }
      const info = await page.evaluate((k) => window.ICONS.info(k), key);
      console.log(`${key.padEnd(16)} ${String(Date.now() - t1).padStart(6)}ms  build ${info.ms}ms  tris ${info.tris}  ${info.w}x${info.h}x${info.depth}`);
    }
    console.log(`total ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
} finally {
  await browser.close();
  server.close();
}
