import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const source = resolve(root, '../dist');
const target = resolve(root, 'site');
await readFile(resolve(source, 'index.html'));
// Avoid carrying obsolete bundles forward between review builds.
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true, filter: (path) => basename(path) !== 'CNAME' });
for (const file of await readdir(target, { recursive: true })) {
  if (!file.endsWith('.html')) continue;
  const path = resolve(target, file);
  const html = await readFile(path, 'utf8');
  await writeFile(
    path,
    html.replace('<head>', '<head><meta name="robots" content="noindex, nofollow, noarchive" />'),
  );
}
await writeFile(resolve(target, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(
  resolve(target, '_headers'),
  '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Cache-Control: private, no-store\n',
);
console.log('Prepared password-protected review files. Nothing deployed.');
