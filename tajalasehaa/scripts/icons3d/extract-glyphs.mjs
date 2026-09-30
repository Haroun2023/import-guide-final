// Extracts the source glyphs (lucide icon nodes + 2 custom glyphs) into glyphs.json.
// Read-only access to the project; writes only next to this script.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const LUCIDE = path.join(PROJECT, 'node_modules/lucide-react/dist/esm/icons');

// output key -> lucide icon name ('spine' is modelled in 3D, custom glyphs handled below)
export const LUCIDE_MAP = {
  bone: 'bone', dumbbell: 'dumbbell', bandage: 'bandage', footprints: 'footprints',
  'heart-pulse': 'heart-pulse', house: 'house', droplets: 'droplets', apple: 'apple',
  biceps: 'biceps-flexed', 'hand-heart': 'hand-heart',
  stethoscope: 'stethoscope', 'clipboard-list': 'clipboard-list', 'chart-line': 'chart-line',
  'user-check': 'user-round-check', 'shield-check': 'shield-check', timer: 'timer',
  'calendar-check': 'calendar-check', 'message-circle': 'message-circle', activity: 'activity',
  sparkles: 'sparkles', target: 'target', 'scan-search': 'scan-search', 'heart-handshake': 'heart-handshake',
  'map-pin': 'map-pin', clock: 'clock', phone: 'phone', navigation: 'navigation',
  crown: 'crown', award: 'award', users: 'users', baby: 'baby', car: 'car-front', laptop: 'laptop', gift: 'gift',
};

export const KEYS = [
  // programs
  'spine', 'bone', 'dumbbell', 'bandage', 'footprints', 'heart-pulse', 'house', 'droplets', 'apple', 'biceps', 'hand-heart',
  // commitments / process
  'stethoscope', 'clipboard-list', 'chart-line', 'user-check', 'shield-check', 'timer', 'calendar-check', 'message-circle',
  'activity', 'sparkles', 'target', 'scan-search', 'heart-handshake',
  // contact
  'map-pin', 'clock', 'phone', 'navigation',
  // misc
  'crown', 'award', 'users', 'baby', 'car', 'laptop', 'gift',
  // custom
  'prayer', 'padel',
];

function lucideNode(name) {
  const src = fs.readFileSync(path.join(LUCIDE, `${name}.mjs`), 'utf8');
  const m = src.match(/const __iconData = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error(`no __iconData in ${name}`);
  // eslint-disable-next-line no-new-func
  const data = new Function(`return (${m[1]});`)();
  return data.node;
}

function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

function nodeToSvg(node, strokeWidth) {
  const els = node.map(([tag, attrs]) => {
    const a = Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
    return `<${tag} ${a}/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${els.join('')}</svg>`;
}

// Custom glyphs from src/components/ui/Icons.tsx (read-only): pull the JSX elements of a function body.
function customNode(fnName) {
  const src = fs.readFileSync(path.join(PROJECT, 'src/components/ui/Icons.tsx'), 'utf8');
  const start = src.indexOf(`export function ${fnName}`);
  if (start < 0) throw new Error(`${fnName} not found`);
  const end = src.indexOf('</svg>', start);
  const body = src.slice(start, end);
  const inner = body.slice(body.indexOf('>', body.indexOf('<svg')) + 1);
  const node = [];
  const re = /<(path|circle|rect|line|polyline|polygon|ellipse)\s+([^>]*?)\/>/g;
  let mm;
  while ((mm = re.exec(inner))) {
    const attrs = {};
    const ra = /([a-zA-Z-]+)="([^"]*)"/g;
    let am;
    while ((am = ra.exec(mm[2]))) attrs[am[1]] = am[2];
    node.push([mm[1], attrs]);
  }
  const sw = (body.match(/strokeWidth="([\d.]+)"/) || [])[1];
  return { node, strokeWidth: sw ? parseFloat(sw) : 2 };
}

const out = { keys: KEYS, glyphs: {} };
for (const key of KEYS) {
  if (key === 'spine') { out.glyphs[key] = { type: 'model' }; continue; }
  if (key === 'prayer' || key === 'padel') {
    const { node, strokeWidth } = customNode(key === 'prayer' ? 'PrayerIcon' : 'PadelIcon');
    out.glyphs[key] = { type: 'svg', source: key === 'prayer' ? 'Icons.tsx#PrayerIcon' : 'Icons.tsx#PadelIcon', strokeWidth, node, svg: nodeToSvg(node, strokeWidth) };
    continue;
  }
  const name = LUCIDE_MAP[key];
  const node = lucideNode(name);
  out.glyphs[key] = { type: 'svg', source: `lucide:${name}`, strokeWidth: 2, node, svg: nodeToSvg(node, 2) };
}
fs.writeFileSync(path.join(HERE, 'glyphs.json'), JSON.stringify(out, null, 1));
console.log(`wrote ${Object.keys(out.glyphs).length} glyphs`);
