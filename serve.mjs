import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const qaRoot = path.resolve(root, '..', 'qa');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:4176');
    const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const selectedRoot = relative.startsWith('/__qa/') ? qaRoot : root;
    const file = path.resolve(selectedRoot, relative.startsWith('/__qa/') ? relative.slice(6) : '.' + relative);
    if (!file.startsWith(selectedRoot + path.sep)) { res.writeHead(403); res.end(); return; }
    let data = await readFile(file);
    if (file === path.join(root, 'index.html') && url.searchParams.has('qa') && (url.searchParams.has('tests') || url.searchParams.has('sheet') || url.searchParams.has('textZoom') || url.searchParams.has('friendTests'))) {
      const script = url.searchParams.has('tests') ? 'browser-tests.js' : url.searchParams.has('friendTests') ? 'friend-tests.js' : url.searchParams.has('sheet') ? 'contact-sheet.js' : 'text-zoom.js';
      data = Buffer.from(data.toString('utf8').replace('</head>', '<link rel="stylesheet" href="/__qa/qa.css"><script defer src="/__qa/' + script + '"></script></head>'));
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(4176, '127.0.0.1', () => console.log('Oddlings preview ready at http://127.0.0.1:4176'));
