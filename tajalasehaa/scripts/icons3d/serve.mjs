// Minimal static server for the icon renderer (port 4455 by default).
//   /three/...  -> project node_modules/three (read-only)
//   everything else -> this work folder
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const THREE_DIR = new URL('../../node_modules/three', import.meta.url).pathname;
const PORT = Number(process.env.PORT || 4455);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

export function startServer(port = PORT) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file;
    if (url.startsWith('/three/')) file = path.join(THREE_DIR, url.slice('/three/'.length));
    else file = path.join(HERE, url === '/' ? 'render.html' : url.slice(1));
    const root = url.startsWith('/three/') ? THREE_DIR : HERE;
    if (!path.resolve(file).startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().then(() => console.log(`serving on http://127.0.0.1:${PORT}`));
}
