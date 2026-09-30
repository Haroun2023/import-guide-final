// Taj Al-Asehaa 3D icon renderer (three.js r186, runs in headless Chromium).
//
// Pipeline per glyph:
//   SVG (lucide node / custom glyph) -> SVGLoader curves -> dense polylines (icon units, y up, centred)
//   -> exact 2D distance field to the stroke centre-lines -> 3D tube SDF  f = sqrt(d^2 + z^2) - r
//   -> marching cubes -> every vertex projected onto the exact tube surface + analytic normal.
// Round caps, round joins, tight bends, dots and overlapping strokes are all handled by the SDF union,
// so there is no pinching, no gaps and no overlapping (z-fighting) geometry.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { edgeTable, triTable } from 'three/addons/objects/MarchingCubes.js';

const DEG = Math.PI / 180;

// ------------------------------------------------------------------------------------------------
// Settings (keep identical for every icon so the set stays consistent)
// ------------------------------------------------------------------------------------------------
export const CFG = {
  size: 1024,                // render size (px, 2x supersample of 512); downscaled to 256 afterwards
  fov: 30,
  tiltX: -18, tiltY: 22,     // icon group rotation (degrees), Euler order XYZ
  padding: 0.12,             // fraction of the frame on each side
  tubeR: 1.05,               // tube radius on the 24-unit lucide grid (stroke 2 -> r 1)
  grid: 0.09,                // SDF grid spacing for glyph tubes (icon units)
  sampleStep: 0.05,          // curve sampling step (icon units)
  glyphGap: 1.25,            // gap between the glyph's back and the tile face / shadow plane
  refBox: 26,                // reference glyph box (24 grid + tube) used for scale in glyph variants
  tile: { size: 34, depthRatio: 0.12, n: 4.6, edgeR: 1.7 },   // squircle (superellipse n) tile, depth 12% of size
  light: { dir: [0.42, 1.0, 0.78], intensity: 2.6, mapSize: 1024, extent: 30, radius: 12, blurSamples: 20, bias: -0.0004 },
  envIntensity: 0.5,
  exposure: 1.0,
  // per-variant multipliers on exposure / environment / key light
  variant: {
    tile: { exposure: 1, env: 1, key: 1 },
    glyph: { exposure: 1, env: 1, key: 1 },
    light: { exposure: 0.85, env: 1, key: 0.9 },
  },
  glyphMat: { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 },
  tileMat: { roughness: 0.34, clearcoat: 0.5, clearcoatRoughness: 0.2 },
  shadow: { tile: 0.2, glyph: 0.26, light: 0.34 },
  colors: {
    brand: ['#24475D', '#0C8456', '#3FC480'],   // bottom-left -> top-right
    light: ['#8FE3B4', '#FFFFFF'],             // mint (bottom-left) -> white (top-right), same light direction as brand
    // tile albedo is pre-tinted + gained so the rendered face lands on near-white mint (~#F4F8F6 -> #E3F0EA) after ACES
    tile: ['#C6E6D7', '#ECF7F1'],
    tileGain: 1.5,                              // linear albedo gain on the tile (compensates ACES shoulder)
    disc: '#8FE3B4',
    discLight: '#3FC480',
  },
  // per-icon overrides: r (tube radius), scale (uniform glyph scale)
  perIcon: {},
};

// ------------------------------------------------------------------------------------------------
// Colour helpers (interpolate in sRGB like a CSS gradient, store linear for three.js)
// ------------------------------------------------------------------------------------------------
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function srgbToLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function gradientAt(stops, t) {
  t = Math.min(1, Math.max(0, t));
  const n = stops.length - 1;
  const f = t * n;
  const i = Math.min(n - 1, Math.floor(f));
  const u = f - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  return [0, 1, 2].map((k) => srgbToLinear(a[k] + (b[k] - a[k]) * u));
}

// ------------------------------------------------------------------------------------------------
// SVG -> polylines
// ------------------------------------------------------------------------------------------------
function glyphToPolylines(svgText, step) {
  const data = new SVGLoader().parse(svgText);
  const polylines = [];
  for (const sp of data.paths) {
    const node = sp.userData.node;
    const tag = node.nodeName.toLowerCase();
    if (tag === 'circle') {
      const r = parseFloat(node.getAttribute('r'));
      const fill = node.getAttribute('fill');
      if ((fill && fill !== 'none') || r <= 1) {
        const cx = parseFloat(node.getAttribute('cx'));
        const cy = parseFloat(node.getAttribute('cy'));
        polylines.push([[cx - 12, 12 - cy]]); // dot -> sphere
        continue;
      }
    }
    for (const sub of sp.subPaths) {
      const pts = [];
      const push = (v) => {
        const p = [v.x - 12, 12 - v.y];
        const l = pts[pts.length - 1];
        if (!l || Math.hypot(p[0] - l[0], p[1] - l[1]) > 1e-7) pts.push(p);
      };
      for (const c of sub.curves) {
        if (c.isLineCurve) { push(c.v1); push(c.v2); continue; }
        const n = Math.max(4, Math.ceil(c.getLength() / step));
        for (const v of c.getPoints(n)) push(v);
      }
      if (sub.autoClose && pts.length > 1) {
        const a = pts[0], b = pts[pts.length - 1];
        if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-7) pts.push([a[0], a[1]]);
      }
      if (pts.length) polylines.push(pts);
    }
  }
  return polylines;
}

function polylinesToSegments(polylines, scale = 1) {
  const segs = [];
  for (const pl of polylines) {
    if (pl.length === 1) segs.push(pl[0][0] * scale, pl[0][1] * scale, pl[0][0] * scale, pl[0][1] * scale);
    for (let i = 0; i < pl.length - 1; i++) {
      segs.push(pl[i][0] * scale, pl[i][1] * scale, pl[i + 1][0] * scale, pl[i + 1][1] * scale);
    }
  }
  return new Float64Array(segs);
}

// ------------------------------------------------------------------------------------------------
// Marching cubes over a scalar grid (negative = inside). Returns indexed positions.
// Corner / edge numbering follows three.js' MarchingCubes (Paul Bourke tables).
// ------------------------------------------------------------------------------------------------
function marchingCubes(F, nx, ny, nz, x0, y0, z0, h) {
  const pos = [];
  const idx = [];
  const cache = new Map();
  const sxy = nx * ny;
  const vert = (i, j, k, axis, fa, fb) => {
    const key = ((k * ny + j) * nx + i) * 3 + axis;
    let v = cache.get(key);
    if (v !== undefined) return v;
    const t = fa / (fa - fb);
    let x = x0 + i * h, y = y0 + j * h, z = z0 + k * h;
    if (axis === 0) x += t * h; else if (axis === 1) y += t * h; else z += t * h;
    v = pos.length / 3;
    pos.push(x, y, z);
    cache.set(key, v);
    return v;
  };
  const ev = new Int32Array(12);
  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < ny - 1; j++) {
      let q = (k * ny + j) * nx;
      for (let i = 0; i < nx - 1; i++, q++) {
        const f0 = F[q], f1 = F[q + 1], f2 = F[q + nx], f3 = F[q + 1 + nx];
        const f4 = F[q + sxy], f5 = F[q + 1 + sxy], f6 = F[q + nx + sxy], f7 = F[q + 1 + nx + sxy];
        let ci = 0;
        if (f0 < 0) ci |= 1;
        if (f1 < 0) ci |= 2;
        if (f3 < 0) ci |= 4;
        if (f2 < 0) ci |= 8;
        if (f4 < 0) ci |= 16;
        if (f5 < 0) ci |= 32;
        if (f7 < 0) ci |= 64;
        if (f6 < 0) ci |= 128;
        const bits = edgeTable[ci];
        if (bits === 0) continue;
        if (bits & 1) ev[0] = vert(i, j, k, 0, f0, f1);
        if (bits & 2) ev[1] = vert(i + 1, j, k, 1, f1, f3);
        if (bits & 4) ev[2] = vert(i, j + 1, k, 0, f2, f3);
        if (bits & 8) ev[3] = vert(i, j, k, 1, f0, f2);
        if (bits & 16) ev[4] = vert(i, j, k + 1, 0, f4, f5);
        if (bits & 32) ev[5] = vert(i + 1, j, k + 1, 1, f5, f7);
        if (bits & 64) ev[6] = vert(i, j + 1, k + 1, 0, f6, f7);
        if (bits & 128) ev[7] = vert(i, j, k + 1, 1, f4, f6);
        if (bits & 256) ev[8] = vert(i, j, k, 2, f0, f4);
        if (bits & 512) ev[9] = vert(i + 1, j, k, 2, f1, f5);
        if (bits & 1024) ev[10] = vert(i + 1, j + 1, k, 2, f3, f7);
        if (bits & 2048) ev[11] = vert(i, j + 1, k, 2, f2, f6);
        const base = ci << 4;
        for (let t = 0; triTable[base + t] !== -1; t += 3) {
          idx.push(ev[triTable[base + t]], ev[triTable[base + t + 1]], ev[triTable[base + t + 2]]);
        }
      }
    }
  }
  return { positions: new Float32Array(pos), indices: new Uint32Array(idx) };
}

// Make triangle winding agree with the (outward) normals.
function fixWinding(positions, normals, indices) {
  let s = 0;
  const n = Math.min(indices.length, 30000);
  for (let t = 0; t < n; t += 3) {
    const a = indices[t] * 3, b = indices[t + 1] * 3, c = indices[t + 2] * 3;
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    s += cx * normals[a] + cy * normals[a + 1] + cz * normals[a + 2];
  }
  if (s < 0) {
    for (let t = 0; t < indices.length; t += 3) {
      const tmp = indices[t + 1]; indices[t + 1] = indices[t + 2]; indices[t + 2] = tmp;
    }
  }
}

function toGeometry(positions, normals, indices) {
  fixWinding(positions, normals, indices);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

// ------------------------------------------------------------------------------------------------
// Stroke tubes: exact 2D distance field -> 3D tube SDF -> MC -> exact projection
// ------------------------------------------------------------------------------------------------
function segBounds(segs) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let s = 0; s < segs.length; s += 4) {
    minX = Math.min(minX, segs[s], segs[s + 2]); maxX = Math.max(maxX, segs[s], segs[s + 2]);
    minY = Math.min(minY, segs[s + 1], segs[s + 3]); maxY = Math.max(maxY, segs[s + 1], segs[s + 3]);
  }
  return { minX, minY, maxX, maxY };
}

function makeSegIndex(segs, reach, cell = 1.0) {
  const b = segBounds(segs);
  const bx0 = b.minX - reach - cell, by0 = b.minY - reach - cell;
  const nbx = Math.ceil((b.maxX - b.minX + 2 * reach + 2 * cell) / cell) + 1;
  const nby = Math.ceil((b.maxY - b.minY + 2 * reach + 2 * cell) / cell) + 1;
  const buckets = Array.from({ length: nbx * nby }, () => []);
  for (let s = 0; s < segs.length; s += 4) {
    const i0 = Math.floor((Math.min(segs[s], segs[s + 2]) - reach - bx0) / cell);
    const i1 = Math.floor((Math.max(segs[s], segs[s + 2]) + reach - bx0) / cell);
    const j0 = Math.floor((Math.min(segs[s + 1], segs[s + 3]) - reach - by0) / cell);
    const j1 = Math.floor((Math.max(segs[s + 1], segs[s + 3]) + reach - by0) / cell);
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) buckets[j * nbx + i].push(s);
  }
  return {
    closest(x, y, out) {
      const i = Math.floor((x - bx0) / cell), j = Math.floor((y - by0) / cell);
      let best = Infinity;
      const list = (i >= 0 && j >= 0 && i < nbx && j < nby) ? buckets[j * nbx + i] : null;
      const scan = list && list.length ? list : null;
      const loop = (s) => {
        const ax = segs[s], ay = segs[s + 1], dx = segs[s + 2] - ax, dy = segs[s + 3] - ay;
        const L2 = dx * dx + dy * dy;
        let t = L2 > 0 ? ((x - ax) * dx + (y - ay) * dy) / L2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = ax + t * dx, py = ay + t * dy;
        const d2 = (x - px) * (x - px) + (y - py) * (y - py);
        if (d2 < best) { best = d2; out[0] = px; out[1] = py; }
      };
      if (scan) for (const s of scan) loop(s);
      else for (let s = 0; s < segs.length; s += 4) loop(s);
      return best;
    },
  };
}

function buildTubeGeometry(segs, r, h) {
  const b = segBounds(segs);
  const pad = r + 3 * h;
  const x0 = b.minX - pad, y0 = b.minY - pad;
  const nx = Math.ceil((b.maxX - b.minX + 2 * pad) / h) + 1;
  const ny = Math.ceil((b.maxY - b.minY + 2 * pad) / h) + 1;
  const BIG = pad;
  const D = new Float32Array(nx * ny).fill(BIG * BIG);
  const R = r + 2.5 * h;
  for (let s = 0; s < segs.length; s += 4) {
    const ax = segs[s], ay = segs[s + 1], dx = segs[s + 2] - ax, dy = segs[s + 3] - ay;
    const L2 = dx * dx + dy * dy;
    const i0 = Math.max(0, Math.floor((Math.min(ax, ax + dx) - R - x0) / h));
    const i1 = Math.min(nx - 1, Math.ceil((Math.max(ax, ax + dx) + R - x0) / h));
    const j0 = Math.max(0, Math.floor((Math.min(ay, ay + dy) - R - y0) / h));
    const j1 = Math.min(ny - 1, Math.ceil((Math.max(ay, ay + dy) + R - y0) / h));
    for (let j = j0; j <= j1; j++) {
      const py = y0 + j * h;
      let q = j * nx + i0;
      for (let i = i0; i <= i1; i++, q++) {
        const px = x0 + i * h;
        let t = L2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = px - ax - t * dx, ey = py - ay - t * dy;
        const d2 = ex * ex + ey * ey;
        if (d2 < D[q]) D[q] = d2;
      }
    }
  }
  const nz = Math.ceil((2 * (r + 2.5 * h)) / h) + 1;
  const z0 = -((nz - 1) * h) / 2;
  const F = new Float32Array(nx * ny * nz);
  for (let k = 0; k < nz; k++) {
    const z = z0 + k * h, z2 = z * z;
    const off = k * nx * ny;
    for (let q = 0; q < nx * ny; q++) F[off + q] = Math.sqrt(D[q] + z2) - r;
  }
  const { positions, indices } = marchingCubes(F, nx, ny, nz, x0, y0, z0, h);
  // exact projection onto the union-of-tubes surface + analytic normals
  const index = makeSegIndex(segs, r + 4 * h);
  const normals = new Float32Array(positions.length);
  const c = [0, 0];
  for (let v = 0; v < positions.length; v += 3) {
    const x = positions[v], y = positions[v + 1], z = positions[v + 2];
    index.closest(x, y, c);
    let nxv = x - c[0], nyv = y - c[1], nzv = z;
    const len = Math.hypot(nxv, nyv, nzv) || 1;
    nxv /= len; nyv /= len; nzv /= len;
    positions[v] = c[0] + r * nxv; positions[v + 1] = c[1] + r * nyv; positions[v + 2] = r * nzv;
    normals[v] = nxv; normals[v + 1] = nyv; normals[v + 2] = nzv;
  }
  return toGeometry(positions, normals, indices);
}

// ------------------------------------------------------------------------------------------------
// Generic SDF mesher (tile, spine): grid eval -> MC -> Newton projection + gradient normals
// ------------------------------------------------------------------------------------------------
function buildSdfGeometry(fn, bounds, h, eps = 0.004) {
  const [bx0, by0, bz0, bx1, by1, bz1] = bounds;
  const nx = Math.ceil((bx1 - bx0) / h) + 1, ny = Math.ceil((by1 - by0) / h) + 1, nz = Math.ceil((bz1 - bz0) / h) + 1;
  const F = new Float32Array(nx * ny * nz);
  let q = 0;
  for (let k = 0; k < nz; k++) {
    const z = bz0 + k * h;
    for (let j = 0; j < ny; j++) {
      const y = by0 + j * h;
      for (let i = 0; i < nx; i++) F[q++] = fn(bx0 + i * h, y, z);
    }
  }
  const { positions, indices } = marchingCubes(F, nx, ny, nz, bx0, by0, bz0, h);
  const normals = new Float32Array(positions.length);
  const grad = (x, y, z) => [
    fn(x + eps, y, z) - fn(x - eps, y, z),
    fn(x, y + eps, z) - fn(x, y - eps, z),
    fn(x, y, z + eps) - fn(x, y, z - eps),
  ];
  for (let v = 0; v < positions.length; v += 3) {
    let x = positions[v], y = positions[v + 1], z = positions[v + 2];
    for (let it = 0; it < 3; it++) {
      const f = fn(x, y, z);
      const g = grad(x, y, z).map((c) => c / (2 * eps));
      const g2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2];
      if (g2 < 1e-12) break;
      x -= (f * g[0]) / g2; y -= (f * g[1]) / g2; z -= (f * g[2]) / g2;
    }
    const g = grad(x, y, z);
    const len = Math.hypot(g[0], g[1], g[2]) || 1;
    positions[v] = x; positions[v + 1] = y; positions[v + 2] = z;
    normals[v] = g[0] / len; normals[v + 1] = g[1] / len; normals[v + 2] = g[2] / len;
  }
  return toGeometry(positions, normals, indices);
}

// Squircle tile as a clean parametric mesh: superellipse outline (resampled by arc length), swept with
// an exact quarter-round edge profile + straight side wall; flat front/back faces as fans.
// (A marching-cubes tile shows faint dashed highlights along the grazing far edge.)
function buildTile() {
  const T = CFG.tile;
  const S = T.size, a = S / 2, H = (S * T.depthRatio) / 2, re = T.edgeR, n = T.n;
  const M = 8192, K = 900, P = 20; // dense samples, ring samples, samples per quarter-round
  const dense = [];
  for (let i = 0; i <= M; i++) {
    const t = (i / M) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    dense.push([a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), a * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]);
  }
  const cum = [0];
  for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const L = cum[M];
  const ring = [];
  for (let k = 0, j = 0; k < K; k++) {
    const target = (k / K) * L;
    while (cum[j + 1] < target) j++;
    const u = (target - cum[j]) / (cum[j + 1] - cum[j] || 1);
    ring.push([dense[j][0] + (dense[j + 1][0] - dense[j][0]) * u, dense[j][1] + (dense[j + 1][1] - dense[j][1]) * u]);
  }
  // outward normals (outline is counter-clockwise)
  const nrm = ring.map((_, k) => {
    const p0 = ring[(k - 1 + K) % K], p1 = ring[(k + 1) % K];
    const tx = p1[0] - p0[0], ty = p1[1] - p0[1], l = Math.hypot(tx, ty) || 1;
    return [ty / l, -tx / l];
  });
  const pos = [], nor = [], idx = [];
  const add = (x, y, z, nx, ny, nz) => { pos.push(x, y, z); nor.push(nx, ny, nz); return pos.length / 3 - 1; };
  // profile: front quarter (phi 90..0) at z = +(H-re), back quarter (phi 0..-90) at z = -(H-re)
  const prof = [];
  for (let j = 0; j <= P; j++) { const f = (Math.PI / 2) * (1 - j / P); prof.push([Math.cos(f), Math.sin(f), H - re]); }
  for (let j = 0; j <= P; j++) { const f = -(Math.PI / 2) * (j / P); prof.push([Math.cos(f), Math.sin(f), -(H - re)]); }
  const R = prof.length;
  const base = [];
  for (let k = 0; k < K; k++) {
    const [px, py] = ring[k], [nx, ny] = nrm[k];
    const ix = px - re * nx, iy = py - re * ny; // inner outline
    base.push(pos.length / 3);
    for (const [c, s, zc] of prof) add(ix + re * c * nx, iy + re * c * ny, zc + re * s, c * nx, c * ny, s);
  }
  for (let k = 0; k < K; k++) {
    const A0 = base[k], B0 = base[(k + 1) % K];
    for (let j = 0; j < R - 1; j++) idx.push(A0 + j, B0 + j, A0 + j + 1, A0 + j + 1, B0 + j, B0 + j + 1);
  }
  // flat faces
  for (const sgn of [1, -1]) {
    const c0 = add(0, 0, sgn * H, 0, 0, sgn);
    const first = pos.length / 3;
    for (let k = 0; k < K; k++) add(ring[k][0] - re * nrm[k][0], ring[k][1] - re * nrm[k][1], sgn * H, 0, 0, sgn);
    for (let k = 0; k < K; k++) idx.push(c0, first + k, first + ((k + 1) % K));
  }
  const positions = new Float32Array(pos), normals = new Float32Array(nor), indices = new Uint32Array(idx);
  // per-triangle orientation from the exact normals
  for (let t = 0; t < indices.length; t += 3) {
    const i0 = indices[t] * 3, i1 = indices[t + 1] * 3, i2 = indices[t + 2] * 3;
    const ux = positions[i1] - positions[i0], uy = positions[i1 + 1] - positions[i0 + 1], uz = positions[i1 + 2] - positions[i0 + 2];
    const vx = positions[i2] - positions[i0], vy = positions[i2 + 1] - positions[i0 + 1], vz = positions[i2 + 2] - positions[i0 + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    const s = cx * (normals[i0] + normals[i1] + normals[i2]) + cy * (normals[i0 + 1] + normals[i1 + 1] + normals[i2 + 1]) + cz * (normals[i0 + 2] + normals[i1 + 2] + normals[i2 + 2]);
    if (s < 0) { const tmp = indices[t + 1]; indices[t + 1] = indices[t + 2]; indices[t + 2] = tmp; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return { geometry: g, H, S };
}

// Spine (no lucide equivalent): chunky, puffy vertebrae (rounded "pill" blocks, slightly flattened
// front-to-back) stacked along a gentle S-curve, with soft green discs in the small gaps.
// Sized to the same visual footprint as heart-pulse / stethoscope (~22 units tall on the 24 grid).
export const SPINE = {
  heights: [3.7, 3.6, 3.5, 3.35, 3.2],       // vertebra heights, bottom -> top
  widths: [9.6, 9.1, 8.6, 8.1, 7.6],         // vertebra widths, bottom -> top
  corner: 1.3,                               // 2D corner radius of a vertebra (front view)
  waist: 0.55,                               // concave "hourglass" sides of a vertebral body
  depth: 2.7, edge: 1.15,                    // front-to-back thickness and edge roundover
  gap: 1.25,                                 // edge-to-edge gap between vertebrae
  amp: 1.7, tiltFollow: 0.5,                 // S-curve amplitude, fraction of the tangent angle applied
  disc: { widthRatio: 0.74, height: 1.0, depth: 2.25, edge: 0.5 },
  grid: 0.08,
};
function buildSpine() {
  const S = SPINE;
  const N = S.heights.length;
  const total = S.heights.reduce((a, b) => a + b, 0) + S.gap * (N - 1);
  const half = total / 2;
  const xOf = (y) => S.amp * Math.sin((Math.PI * y) / half);
  const angOf = (y) => S.tiltFollow * Math.atan(S.amp * (Math.PI / half) * Math.cos((Math.PI * y) / half));
  const prims = [];
  let y = -half;
  const centres = [];
  for (let i = 0; i < N; i++) {
    const yc = y + S.heights[i] / 2;
    centres.push(yc);
    prims.push({ kind: 'v', y: yc, L: S.widths[i], H: S.heights[i], rc: S.corner, D: S.depth, re: S.edge, waist: S.waist });
    y += S.heights[i] + S.gap;
  }
  for (let i = 0; i < N - 1; i++) {
    const yc = centres[i] + S.heights[i] / 2 + S.gap / 2;
    const L = ((S.widths[i] + S.widths[i + 1]) / 2) * S.disc.widthRatio;
    prims.push({ kind: 'd', y: yc, L, H: S.disc.height, rc: S.disc.height / 2, D: S.disc.depth, re: S.disc.edge });
  }
  for (const p of prims) {
    p.cx = xOf(p.y); p.cy = p.y;
    const a = -angOf(p.y);                       // rotate the block to follow the curve
    p.c = Math.cos(a); p.s = Math.sin(a);
    const reach = Math.hypot(p.L / 2, p.H / 2) + 0.6;
    p.bb = [p.cx - reach, p.cy - reach, p.cx + reach, p.cy + reach];
  }
  // rounded rectangle (2D) extruded with rounded edges
  const sdPrim = (p, x, y, z) => {
    const dx = x - p.cx, dy = y - p.cy;
    const lx = dx * p.c - dy * p.s, ly = dx * p.s + dy * p.c;
    // hourglass: pull the sides in around the middle (smooth, zero at the end plates)
    const u = Math.min(1, Math.abs(ly) / (p.H / 2));
    const pinch = p.waist ? p.waist * (1 - u * u) * (1 - u * u) : 0;
    const qx = Math.abs(lx) - (p.L / 2 - p.rc - pinch), qy = Math.abs(ly) - (p.H / 2 - p.rc);
    const d2 = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - p.rc;
    const wx = d2 + p.re, wy = Math.abs(z) - (p.D / 2 - p.re);
    return Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) - p.re;
  };
  const unionFn = (list) => (x, y, z) => {
    let best = 1e9;
    for (const p of list) {
      if (x < p.bb[0] || x > p.bb[2] || y < p.bb[1] || y > p.bb[3]) {
        const ex = Math.max(p.bb[0] - x, 0, x - p.bb[2]), ey = Math.max(p.bb[1] - y, 0, y - p.bb[3]);
        best = Math.min(best, Math.hypot(ex, ey) + 0.5);
        continue;
      }
      best = Math.min(best, sdPrim(p, x, y, z));
    }
    return best;
  };
  const vs = prims.filter((p) => p.kind === 'v'), ds = prims.filter((p) => p.kind === 'd');
  const xr = S.amp + Math.max(...S.widths) / 2 + 1.2;
  const zr = S.depth / 2 + 0.3;
  const bounds = [-xr, -half - 1.2, -zr, xr, half + 1.2, zr];
  return {
    vertebrae: buildSdfGeometry(unionFn(vs), bounds, S.grid, 0.003),
    discs: buildSdfGeometry(unionFn(ds), bounds, S.grid, 0.003),
  };
}

// ------------------------------------------------------------------------------------------------
// Vertex colours
// ------------------------------------------------------------------------------------------------
function diagRange(geos) {
  let lo = Infinity, hi = -Infinity;
  for (const g of geos) {
    const p = g.attributes.position.array;
    for (let v = 0; v < p.length; v += 3) { const s = p[v] + p[v + 1]; if (s < lo) lo = s; if (s > hi) hi = s; }
  }
  return [lo, hi];
}
function gradientColors(g, stops, range, gain = 1) {
  const p = g.attributes.position.array;
  const out = new Float32Array(p.length);
  const [lo, hi] = range;
  for (let v = 0; v < p.length; v += 3) {
    const c = gradientAt(stops, (p[v] + p[v + 1] - lo) / (hi - lo || 1));
    out[v] = c[0] * gain; out[v + 1] = c[1] * gain; out[v + 2] = c[2] * gain;
  }
  return new THREE.BufferAttribute(out, 3);
}
function flatColors(g, hex) {
  const n = g.attributes.position.count;
  const c = gradientAt([hex, hex], 0);
  const out = new Float32Array(n * 3);
  for (let v = 0; v < n; v++) { out[v * 3] = c[0]; out[v * 3 + 1] = c[1]; out[v * 3 + 2] = c[2]; }
  return new THREE.BufferAttribute(out, 3);
}

// ------------------------------------------------------------------------------------------------
// Scene
// ------------------------------------------------------------------------------------------------
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(CFG.size, CFG.size, false);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = CFG.exposure;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = CFG.envIntensity;

const camera = new THREE.PerspectiveCamera(CFG.fov, 1, 1, 1000);

const keyLight = new THREE.DirectionalLight(0xffffff, CFG.light.intensity);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(CFG.light.mapSize, CFG.light.mapSize);
keyLight.shadow.radius = CFG.light.radius;
keyLight.shadow.blurSamples = CFG.light.blurSamples;
keyLight.shadow.bias = CFG.light.bias;
const E = CFG.light.extent;
Object.assign(keyLight.shadow.camera, { left: -E, right: E, top: E, bottom: -E, near: 1, far: 200 });
scene.add(keyLight);
scene.add(keyLight.target);

function applyLight(variant = 'tile') {
  const vm = CFG.variant[variant] || { exposure: 1, env: 1, key: 1 };
  const d = new THREE.Vector3(...CFG.light.dir).normalize();
  keyLight.position.copy(d.multiplyScalar(80));
  keyLight.target.position.set(0, 0, 0);
  keyLight.intensity = CFG.light.intensity * vm.key;
  keyLight.shadow.radius = CFG.light.radius;
  keyLight.shadow.blurSamples = CFG.light.blurSamples;
  keyLight.shadow.bias = CFG.light.bias;
  keyLight.shadow.camera.updateProjectionMatrix();
  keyLight.shadow.needsUpdate = true;
  scene.environmentIntensity = CFG.envIntensity * vm.env;
  renderer.toneMappingExposure = CFG.exposure * vm.exposure;
}

// root: tile front face lies in the z=0 plane of root; glyph floats in front of it
const root = new THREE.Group();
scene.add(root);
function applyTilt() { root.rotation.set(CFG.tiltX * DEG, CFG.tiltY * DEG, 0, 'XYZ'); root.updateMatrixWorld(true); }
applyTilt();

const glyphMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: 0, ...CFG.glyphMat });
const tileMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: 0, ...CFG.tileMat });

const tile = new THREE.Mesh(new THREE.BufferGeometry(), tileMat);
tile.castShadow = true;
tile.receiveShadow = true;
root.add(tile);

const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: CFG.shadow.tile }));
contactShadow.receiveShadow = true;
root.add(contactShadow);

function rebuildTile() {
  const tileData = buildTile();
  tileData.geometry.setAttribute('color', gradientColors(tileData.geometry, CFG.colors.tile, diagRange([tileData.geometry]), CFG.colors.tileGain));
  tile.geometry.dispose();
  tile.geometry = tileData.geometry;
  tile.position.z = -tileData.H;
  contactShadow.position.z = -2 * tileData.H - 0.06;
}
rebuildTile();

const glyphShadow = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: CFG.shadow.glyph }));
glyphShadow.position.z = 0;
glyphShadow.receiveShadow = true;
root.add(glyphShadow);

const glyphHolder = new THREE.Group();
root.add(glyphHolder);

// ------------------------------------------------------------------------------------------------
// Glyph cache
// ------------------------------------------------------------------------------------------------
let GLYPHS = null;
const cache = new Map();

function buildGlyph(key) {
  if (cache.has(key)) return cache.get(key);
  const t0 = performance.now();
  const over = CFG.perIcon[key] || {};
  const r = over.r ?? CFG.tubeR;
  const scale = over.scale ?? 1;
  const parts = []; // { geometry, role: 'grad' | 'disc' }
  if (key === 'spine') {
    const sp = buildSpine();
    parts.push({ geometry: sp.vertebrae, role: 'grad' }, { geometry: sp.discs, role: 'disc' });
  } else {
    const g = GLYPHS.glyphs[key];
    const polylines = glyphToPolylines(g.svg, CFG.sampleStep);
    const segs = polylinesToSegments(polylines, scale);
    parts.push({ geometry: buildTubeGeometry(segs, r, CFG.grid), role: 'grad' });
  }
  // centre in XY on the bbox, push back face to z = 0 (so the gap is measured from the glyph's back)
  const box = new THREE.Box3();
  for (const p of parts) box.union(p.geometry.boundingBox);
  const cx = (box.min.x + box.max.x) / 2, cy = (box.min.y + box.max.y) / 2;
  for (const p of parts) p.geometry.translate(-cx, -cy, -box.min.z);
  const depth = box.max.z - box.min.z;
  const geos = parts.map((p) => p.geometry);
  const range = diagRange(parts.filter((p) => p.role === 'grad').map((p) => p.geometry));
  for (const p of parts) {
    if (p.role === 'grad') {
      p.brand = gradientColors(p.geometry, CFG.colors.brand, range);
      p.light = gradientColors(p.geometry, CFG.colors.light, range);
    } else {
      p.brand = flatColors(p.geometry, CFG.colors.disc);
      p.light = flatColors(p.geometry, CFG.colors.discLight);
    }
    p.geometry.setAttribute('color', p.brand);
    p.mesh = new THREE.Mesh(p.geometry, glyphMat);
    p.mesh.castShadow = true;
    p.mesh.receiveShadow = true;
  }
  const group = new THREE.Group();
  for (const p of parts) group.add(p.mesh);
  group.position.z = CFG.glyphGap;
  const tris = geos.reduce((a, g) => a + g.index.count / 3, 0);
  const info = { key, ms: Math.round(performance.now() - t0), tris, w: +(box.max.x - box.min.x).toFixed(2), h: +(box.max.y - box.min.y).toFixed(2), depth: +depth.toFixed(2) };
  const entry = { parts, group, info };
  cache.set(key, entry);
  return entry;
}

// ------------------------------------------------------------------------------------------------
// Framing
// ------------------------------------------------------------------------------------------------
const _v = new THREE.Vector3();
function worldPointsOf(objects, stride = 1) {
  const pts = [];
  for (const o of objects) {
    o.updateMatrixWorld(true);
    o.traverse((m) => {
      if (!m.isMesh) return;
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i += stride) pts.push(_v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).clone());
    });
  }
  return pts;
}
function ndcBounds(pts) {
  camera.updateMatrixWorld(true);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) {
    _v.copy(p).project(camera);
    x0 = Math.min(x0, _v.x); x1 = Math.max(x1, _v.x); y0 = Math.min(y0, _v.y); y1 = Math.max(y1, _v.y);
  }
  return { x0, y0, x1, y1 };
}
// choose camera distance so the reference points span (1 - 2*padding) of the frame; returns distance
function fitDistance(refPts) {
  camera.clearViewOffset();
  let D = 100;
  for (let it = 0; it < 6; it++) {
    camera.position.set(0, 0, D);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    const b = ndcBounds(refPts);
    const ext = Math.max(b.x1 - b.x0, b.y1 - b.y0);
    D *= ext / (2 * (1 - 2 * CFG.padding));
  }
  return D;
}
function setCamera(D, centrePts) {
  camera.clearViewOffset();
  camera.position.set(0, 0, D);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  if (centrePts) {
    const b = ndcBounds(centrePts);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    const S = CFG.size;
    camera.setViewOffset(S, S, (cx * S) / 2, (-cy * S) / 2, S, S);
    camera.updateProjectionMatrix();
  }
}

let D_TILE = 0, D_GLYPH = 0, TILE_PTS = null;
function computeFraming() {
  applyTilt();
  TILE_PTS = worldPointsOf([tile], 7);
  D_TILE = fitDistance(TILE_PTS);
  const s = CFG.refBox / 2;
  const ref = [[-s, -s], [s, -s], [s, s], [-s, s]].flatMap(([x, y]) => [
    new THREE.Vector3(x, y, CFG.glyphGap).applyMatrix4(root.matrixWorld),
    new THREE.Vector3(x, y, CFG.glyphGap + 2 * CFG.tubeR).applyMatrix4(root.matrixWorld),
  ]);
  D_GLYPH = fitDistance(ref);
}

// ------------------------------------------------------------------------------------------------
// Render API
// ------------------------------------------------------------------------------------------------
function show(entry) {
  glyphHolder.clear();
  glyphHolder.add(entry.group);
}

async function renderIcon(key, variant = 'tile') {
  const entry = buildGlyph(key);
  show(entry);
  applyLight(variant);
  const isTile = variant === 'tile';
  const dbg = CFG.debug || {};
  renderer.shadowMap.enabled = !dbg.noShadows;
  if (dbg.pcf && renderer.shadowMap.type !== THREE.PCFShadowMap) { renderer.shadowMap.type = THREE.PCFShadowMap; keyLight.shadow.map?.dispose(); keyLight.shadow.map = null; }
  tile.receiveShadow = !dbg.tileNoReceive;
  tile.visible = isTile;
  contactShadow.visible = isTile && !dbg.noContact;
  glyphShadow.visible = !isTile;
  glyphShadow.material.opacity = variant === 'light' ? CFG.shadow.light : CFG.shadow.glyph;
  contactShadow.material.opacity = CFG.shadow.tile;
  for (const p of entry.parts) {
    p.geometry.setAttribute('color', variant === 'light' ? p.light : p.brand);
    p.geometry.attributes.color.needsUpdate = true;
  }
  root.updateMatrixWorld(true);
  if (isTile) setCamera(D_TILE, TILE_PTS);
  else setCamera(D_GLYPH, worldPointsOf([entry.group], 5));
  renderer.render(scene, camera);
  return canvas.toDataURL('image/png');
}

// 2D debug: sampled centre-lines drawn with the lucide stroke, to check SVG parsing.
function debugPolylines(key, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  const g = GLYPHS.glyphs[key];
  if (!g || g.type !== 'svg') return c.toDataURL();
  const s = size / 24;
  const pls = glyphToPolylines(g.svg, CFG.sampleStep);
  ctx.strokeStyle = '#0C8456'; ctx.lineWidth = 2 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pl of pls) {
    ctx.beginPath();
    pl.forEach(([x, y], i) => { const X = (x + 12) * s, Y = (12 - y) * s; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    if (pl.length === 1) ctx.lineTo((pl[0][0] + 12) * s + 0.01, (12 - pl[0][1]) * s);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1;
  for (const pl of pls) {
    ctx.beginPath();
    pl.forEach(([x, y], i) => { const X = (x + 12) * s, Y = (12 - y) * s; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    ctx.stroke();
  }
  return c.toDataURL();
}

function reset(overrides = {}) {
  // deep-ish merge of overrides into CFG (and SPINE via the "spine" key), then rebuild dependent state
  const merge = (dst, src) => {
    for (const [k, v] of Object.entries(src)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && dst[k] && typeof dst[k] === 'object' && !Array.isArray(dst[k])) merge(dst[k], v);
      else dst[k] = v;
    }
  };
  const { spine, ...rest } = overrides;
  if (spine) merge(SPINE, spine);
  merge(CFG, rest);
  cache.clear();
  renderer.setSize(CFG.size, CFG.size, false);
  Object.assign(glyphMat, CFG.glyphMat); glyphMat.needsUpdate = true;
  Object.assign(tileMat, CFG.tileMat); tileMat.needsUpdate = true;
  if (rest.tile || rest.colors) rebuildTile();
  applyTilt();
  applyLight();
  computeFraming();
}

async function init() {
  GLYPHS = await (await fetch('./glyphs.json', { cache: 'no-store' })).json();
  applyLight();
  computeFraming();
  window.ICONS = { CFG, renderIcon, debugPolylines, reset, info: (k) => buildGlyph(k).info, keys: GLYPHS.keys, gl: renderer.getContext().getParameter(renderer.getContext().VERSION) };
  window.__ready = true;
}
init().catch((e) => { console.error(e); window.__error = String(e && e.stack || e); });
