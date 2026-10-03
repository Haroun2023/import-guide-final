#!/usr/bin/env python3
"""Post-processing for the 3D icon set.

  python3 post.py sheet2d                      # contact sheet of the 2D parse check (png/*-2d.png)
  python3 post.py preview [--src png] [--out preview.png] [--keys a,b]   # quick sheet from 512px PNGs
  python3 post.py final                        # PNG -> 256px WebP in public/icons3d + manifest + contact sheet
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'icons3d')
VARIANTS = ['', '-glyph', '-light']
LIGHT_BG = (0xEE, 0xF3, 0xF1)
NAVY_BG = (0x10, 0x28, 0x3A)
OUT_SIZE = 256


def keys_from_glyphs():
    with open(os.path.join(HERE, 'glyphs.json')) as f:
        return json.load(f)['keys']


def arg(name, default=None):
    if f'--{name}' in sys.argv:
        return sys.argv[sys.argv.index(f'--{name}') + 1]
    return default


def font(size):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def downscale(im, size):
    # Pillow resamples RGBA in premultiplied space (no dark fringes)
    return im.resize((size, size), Image.LANCZOS)


def border_alpha(im, px=2):
    a = im.getchannel('A')
    w, h = a.size
    boxes = [(0, 0, w, px), (0, h - px, w, h), (0, 0, px, h), (w - px, 0, w, h)]
    return max(a.crop(b).getextrema()[1] for b in boxes)


def make_sheet(rows, cell, out, title=None):
    """rows: list of (label, [(image, bg), ...])"""
    f = font(13)
    label_w = 120
    ncol = max(len(r[1]) for r in rows)
    W = label_w + ncol * cell
    top = 28 if title else 0
    H = top + len(rows) * cell
    sheet = Image.new('RGB', (W, H), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    if title:
        d.text((8, 6), title, fill=(30, 30, 30), font=font(15))
    for ri, (label, cells) in enumerate(rows):
        y = top + ri * cell
        d.text((6, y + cell // 2 - 8), label, fill=(40, 40, 40), font=f)
        for ci, (im, bg) in enumerate(cells):
            x = label_w + ci * cell
            sheet.paste(Image.new('RGB', (cell, cell), bg), (x, y))
            if im is None:
                continue
            if im.size != (cell, cell):
                im = downscale(im, cell) if im.size[0] > cell else im.resize((cell, cell), Image.LANCZOS)
            sheet.paste(im, (x, y), im)
    sheet.save(out)
    print('wrote', out, sheet.size)


def grid_sheet(items, cols, cell, bg, out, label=True):
    """items: list of (name, image). Simple grid on a single background."""
    f = font(11)
    rows = (len(items) + cols - 1) // cols
    lab = 16 if label else 0
    sheet = Image.new('RGB', (cols * cell, rows * (cell + lab)), bg)
    d = ImageDraw.Draw(sheet)
    for i, (name, im) in enumerate(items):
        x, y = (i % cols) * cell, (i // cols) * (cell + lab)
        if im.size != (cell, cell):
            im = downscale(im, cell)
        sheet.paste(im, (x, y), im)
        if label:
            col = (200, 210, 215) if sum(bg) < 300 else (60, 70, 75)
            d.text((x + 4, y + cell + 1), name, fill=col, font=f)
    return sheet


def cmd_sheet2d():
    keys = [k for k in keys_from_glyphs() if os.path.exists(os.path.join(HERE, 'png', f'{k}-2d.png'))]
    items = [(k, Image.open(os.path.join(HERE, 'png', f'{k}-2d.png')).convert('RGBA')) for k in keys]
    s = grid_sheet(items, 8, 128, (255, 255, 255), None)
    out = os.path.join(HERE, 'sheet2d.png')
    s.save(out)
    print('wrote', out)


def load_variant(src, key, v):
    p = os.path.join(src, f'{key}{v}.png')
    return Image.open(p).convert('RGBA') if os.path.exists(p) else None


def cmd_preview():
    src = os.path.join(HERE, arg('src', 'png'))
    out = os.path.join(HERE, arg('out', 'preview.png'))
    keys = arg('keys').split(',') if arg('keys') else [k for k in keys_from_glyphs() if os.path.exists(os.path.join(src, f'{k}.png')) or os.path.exists(os.path.join(src, f'{k}-glyph.png'))]
    cell = int(arg('cell', '192'))
    rows = []
    for k in keys:
        t, g, l = (load_variant(src, k, v) for v in VARIANTS)
        cells = [(t, LIGHT_BG), (g, LIGHT_BG), (l, NAVY_BG)]
        # 64px legibility check
        small = []
        for im, bg in cells:
            if im is None:
                small.append((None, bg))
                continue
            s = downscale(im, 64)
            c = Image.new('RGBA', (cell, cell), (0, 0, 0, 0))
            c.paste(s, ((cell - 64) // 2, (cell - 64) // 2), s)
            small.append((c, bg))
        rows.append((k, cells + small))
    make_sheet(rows, cell, out)


def cmd_final():
    src = os.path.join(HERE, 'png')
    os.makedirs(PUBLIC, exist_ok=True)
    keys = keys_from_glyphs()
    sizes = {}
    warnings = []
    for k in keys:
        for v in VARIANTS:
            p = os.path.join(src, f'{k}{v}.png')
            im = Image.open(p).convert('RGBA')
            ba = border_alpha(im)
            if ba > 3:
                warnings.append(f'{k}{v}: alpha {ba} at the frame border (possible clipping)')
            small = downscale(im, OUT_SIZE)
            dst = os.path.join(PUBLIC, f'{k}{v}.webp')
            small.save(dst, 'WEBP', quality=88, alpha_quality=90, method=6)
            sizes[f'{k}{v}.webp'] = os.path.getsize(dst)
    manifest = {'keys': keys, 'variants': VARIANTS, 'size': OUT_SIZE}
    with open(os.path.join(PUBLIC, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=2)
        f.write('\n')
    vals = sorted(sizes.values())
    print(f'{len(sizes)} webp files, {vals[0]/1024:.1f}-{vals[-1]/1024:.1f} KB, total {sum(vals)/1024:.0f} KB')
    big = {k: v for k, v in sizes.items() if v > 20 * 1024}
    if big:
        print('over 20KB:', big)
    for w in warnings:
        print('WARN', w)
    # contact sheet from the final webp files
    tiles = [(k, Image.open(os.path.join(PUBLIC, f'{k}.webp')).convert('RGBA')) for k in keys]
    glyphs = [(k, Image.open(os.path.join(PUBLIC, f'{k}-glyph.webp')).convert('RGBA')) for k in keys]
    lights = [(k, Image.open(os.path.join(PUBLIC, f'{k}-light.webp')).convert('RGBA')) for k in keys]
    cols, cell = 10, 128
    a = grid_sheet(tiles, cols, cell, LIGHT_BG, None)
    b = grid_sheet(glyphs, cols, cell, LIGHT_BG, None)
    c = grid_sheet(lights, cols, cell, NAVY_BG, None)
    # 64px row of everything (legibility check)
    d64 = grid_sheet([(k, im) for k, im in tiles], 19, 64, LIGHT_BG, None, label=False)
    e64 = grid_sheet([(k, im) for k, im in lights], 19, 64, NAVY_BG, None, label=False)
    W = max(x.size[0] for x in (a, b, c, d64, e64))
    f = font(15)
    parts = [('Tiles (<key>.webp) on #EEF3F1', a), ('Glyph (<key>-glyph.webp) on #EEF3F1', b), ('Light (<key>-light.webp) on #10283A', c),
             ('64px tiles', d64), ('64px light', e64)]
    H = sum(x.size[1] + 26 for _, x in parts)
    sheet = Image.new('RGB', (W, H), (255, 255, 255))
    dr = ImageDraw.Draw(sheet)
    y = 0
    for title, im in parts:
        dr.text((8, y + 5), title, fill=(30, 30, 30), font=f)
        y += 26
        sheet.paste(im, (0, y))
        y += im.size[1]
    out = os.path.join(HERE, 'contact-sheet.png')
    sheet.save(out)
    print('wrote', out, sheet.size)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'final'
    {'sheet2d': cmd_sheet2d, 'preview': cmd_preview, 'final': cmd_final}[cmd]()
