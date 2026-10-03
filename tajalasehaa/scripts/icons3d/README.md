# 3D icons (`public/icons3d/`)

Offline renderer for the site's 3D icons: lucide glyphs (ISC) drawn as glossy
tubes in the logo's navy → green gradient, plus a modelled spine. Each key has
three 256px transparent WebPs: `<key>.webp` (tile), `<key>-glyph.webp` (light
backgrounds) and `<key>-light.webp` (dark backgrounds).

```bash
npm i --no-save playwright-core          # headless Chromium driver (not a site dependency)
node scripts/icons3d/extract-glyphs.mjs  # after adding a key to KEYS / LUCIDE_MAP
node scripts/icons3d/run.mjs --keys crown,award   # masters → scripts/icons3d/png (1024px)
python3 scripts/icons3d/post.py final    # WebPs + manifest.json (+ contact sheet)
```

`CHROME_PATH` points `run.mjs` at a local Chromium if Playwright's is not installed.
Look settings (tilt −18°/22°, tube radius 1.05, materials, lights) live in `CFG` at the top of `render.js`;
per-icon overrides go in `CFG.perIcon`.
