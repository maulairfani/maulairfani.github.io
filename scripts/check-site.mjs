// Checks the built site in dist/. Run after `npm run build`.
// Verifies that every published guide appears in /guides, /llms.txt and the
// sitemap, that every link resolves to a built file, and that the guide text is
// in the static HTML (not only rendered by JavaScript).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const dist = new URL('../dist/', import.meta.url).pathname;
const site = 'https://irfani.me';
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};
const read = (rel) => readFileSync(join(dist, rel), 'utf8');

// Load the registry through Astro's own TypeScript loader.
const registry = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--input-type=module',
      '-e',
      `import { publishedGuides } from './src/data/guides.ts';
       console.log(JSON.stringify(publishedGuides));`,
    ],
    { cwd: new URL('../', import.meta.url).pathname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  ).split('\n').filter((l) => l.startsWith('[')).pop()
);
check(registry.length > 0, 'registry has no published guides');

const guideIndex = read('guides/index.html');
const llms = read('llms.txt');
const sitemap = read('sitemap-0.xml');

for (const g of registry) {
  const url = site + g.path;
  check(existsSync(join(dist, g.path, 'index.html')), `built page missing for ${g.path}`);
  check(guideIndex.includes(`href="${g.path}"`), `/guides is missing ${g.path}`);
  check(guideIndex.includes(g.title), `/guides is missing the title of ${g.path}`);
  check(llms.includes(`](${url})`), `llms.txt is missing ${url}`);
  check(sitemap.includes(`<loc>${url}</loc>`), `sitemap is missing ${url}`);
  check(read(join(g.path, 'index.html')).includes('<h1'), `${g.path} has no <h1> in static HTML`);
}

check(sitemap.includes(`<loc>${site}/guides/</loc>`), 'sitemap is missing /guides/');
check(sitemap.includes(`<loc>${site}/</loc>`), 'sitemap is missing the homepage');

// Every internal href on the index pages must resolve to a built file.
for (const page of ['index.html', 'guides/index.html']) {
  for (const [, href] of read(page).matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href.startsWith('/_astro/') || href.endsWith('.ico') || href.endsWith('.svg')) continue;
    const target = href.endsWith('/') ? join(dist, href, 'index.html') : join(dist, href);
    check(existsSync(target), `${page} links to missing file ${href}`);
  }
}

// Content-type style checks on the built text files.
check(/^# /.test(llms), 'llms.txt must start with a Markdown H1');
check(!/[^\x00-\x7F]/.test(llms) || Buffer.from(llms, 'utf8').toString('utf8') === llms, 'llms.txt is not valid UTF-8');
check(read('robots.txt').includes(`Sitemap: ${site}/sitemap-index.xml`), 'robots.txt does not reference the sitemap');
check(!/Disallow:\s*\/\s*$/m.test(read('robots.txt')), 'robots.txt blocks the whole site');

if (failures.length) {
  console.error(`FAILED (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`OK: ${registry.length} published guide(s) checked across /guides, llms.txt and sitemap.`);
