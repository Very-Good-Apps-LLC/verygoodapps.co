import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('dist');
const files = await readdir(root, { recursive: true });
for (const page of ['index.html', 'privacy/index.html', '404.html', 'privacy-policy/index.html']) {
  const html = await readFile(resolve(root, page), 'utf8');
  assert.match(html, /Very Good Apps LLC/, page);
  if (page !== '404.html')
    assert.doesNotMatch(html, /noindex|PREVIEW_PASSWORD|Password required/, page);
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const target = resolve(root, '.' + url);
    assert.ok(target.startsWith(root + '/') || target === root);
    const info = await stat(target);
    if (info.isDirectory()) await stat(resolve(target, 'index.html'));
  }
}
assert.equal((await readFile(resolve(root, 'CNAME'), 'utf8')).trim(), 'verygoodapps.co');
await stat(resolve(root, '.nojekyll'));
for (const file of files) {
  assert.ok(
    !file.startsWith('concepts/') && !file.includes('netlify'),
    `Unexpected preview asset: ${file}`,
  );
}
const manifest = JSON.parse(await readFile(resolve(root, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons) await stat(resolve(root, '.' + icon.src));
console.log('Production pages, links, icons, custom domain, and preview separation verified.');
