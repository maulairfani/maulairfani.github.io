// Checks the built site in dist/. Run after `npm run build`.
// Verifies discovery (guide index, llms.txt files, sitemap), canonical URLs,
// link resolution, and that each guide's text carries its real content.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const site = 'https://irfani.me';
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};
const read = (rel) => readFileSync(join(dist, rel), 'utf8');
const exists = (rel) => existsSync(join(dist, rel));

// Load the registry through Node's TypeScript loader, so the check uses the real data.
const loaded = execFileSync(
  process.execPath,
  [
    '--experimental-strip-types',
    '--no-warnings',
    '--input-type=module',
    '-e',
    `import { publishedGuides, guides } from './src/data/guides.ts';
     console.log(JSON.stringify({ published: publishedGuides, all: guides }));`,
  ],
  { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
);
const { published, all } = JSON.parse(loaded);
check(published.length > 0, 'registry has no published guides');

const guideIndex = read('guides/index.html');
const guidesTxt = read('guides/llms.txt');
const rootTxt = read('llms.txt');
const sitemap = read('sitemap-0.xml');

// 1. Each published guide: HTML route, text route, and indexes.
for (const g of published) {
  const url = `${site}${g.path}`;
  const textPath = `${g.path}llms.txt`;

  check(exists(join(g.path, 'index.html')), `HTML route missing for ${g.path}`);
  check(exists(textPath), `per-guide llms.txt missing for ${g.path}`);

  // 2. /guides lists it and links the real route.
  check(guideIndex.includes(`href="${g.path}"`), `/guides does not link ${g.path}`);
  check(guideIndex.includes(g.title), `/guides does not show the title of ${g.path}`);

  // 3. /guides/llms.txt lists the canonical URL and its text route.
  check(guidesTxt.includes(`](${url})`), `/guides/llms.txt is missing ${url}`);
  check(guidesTxt.includes(`${site}${textPath}`), `/guides/llms.txt is missing text route ${textPath}`);

  // 4. Canonical URL and sitemap use the new route.
  const page = read(join(g.path, 'index.html'));
  check(page.includes(`rel="canonical" href="${url}"`), `canonical URL of ${g.path} is not ${url}`);
  check(sitemap.includes(`<loc>${url}</loc>`), `sitemap is missing ${url}`);

  // 5. The text version has the guide's real content, not just metadata.
  const text = read(textPath);
  const words = text.split(/\s+/).filter(Boolean).length;
  check(words > 500, `${textPath} has only ${words} words; expected the full lesson`);
  check(/^# /m.test(text), `${textPath} has no top-level title`);
  check((text.match(/^# /gm) || []).length === 1, `${textPath} should have exactly one top-level title`);
  check((text.match(/^## /gm) || []).length >= 6, `${textPath} is missing lesson sections`);
  check(text.includes(`Canonical URL: ${url}`), `${textPath} does not state its canonical URL`);
  check(/^\| .* \|$/m.test(text), `${textPath} has no table`);
  check(/^\d\. .+/m.test(text) && text.includes('Answer key'), `${textPath} is missing the quiz answer key`);
  check(text.includes('2^8') && text.includes('2^-3'), `${textPath} lost formula superscripts`);
  check(text.includes('https://newsletter.maartengrootendorst.com/'), `${textPath} is missing the source link`);
  check(!/<[a-z][^>]*>/i.test(text), `${textPath} contains raw HTML`);
  check(!/Skip to|← Maula Irfani|class=/.test(text), `${textPath} contains navigation or styling leftovers`);
  for (const option of ['7 GB', '14 GB', 'It becomes infinity', 'The biggest FP16 value is 65,504']) {
    check(text.includes(option), `${textPath} is missing quiz text "${option}"`);
  }
}

// 6. Drafts never appear anywhere public.
for (const g of all.filter((x) => x.draft)) {
  check(!guideIndex.includes(g.title), `draft "${g.title}" appears on /guides`);
  check(!guidesTxt.includes(g.slug), `draft "${g.slug}" appears in /guides/llms.txt`);
  check(!sitemap.includes(g.slug), `draft "${g.slug}" appears in the sitemap`);
  check(!exists(`guides/${g.slug}/llms.txt`), `draft "${g.slug}" has a text route`);
}

// 7. Index-level text files.
check(rootTxt.startsWith('# '), 'llms.txt must start with a Markdown H1');
check(rootTxt.includes(`${site}/guides/`), 'llms.txt does not link the study-guide index');
check(guidesTxt.startsWith('# '), '/guides/llms.txt must start with a Markdown H1');
check(sitemap.includes(`<loc>${site}/guides/</loc>`), 'sitemap is missing /guides/');
check(sitemap.includes(`<loc>${site}/</loc>`), 'sitemap is missing the homepage');

// 8. Legacy URLs: the redirect page exists, but is not listed or indexed.
const legacy = read('artifacts/number-formats/index.html');
check(legacy.includes('http-equiv="refresh"') && legacy.includes('/guides/number-formats/'), 'legacy page does not redirect to the new route');
check(legacy.includes('content="noindex"'), 'legacy page is not noindex');
check(!sitemap.includes('/artifacts/'), 'sitemap lists a legacy /artifacts/ URL');
check(!guideIndex.includes('/artifacts/'), '/guides lists a legacy /artifacts/ URL');
check(!guidesTxt.includes('/artifacts/'), '/guides/llms.txt lists a legacy /artifacts/ URL');
check(!rootTxt.includes('/artifacts/'), 'llms.txt lists a legacy /artifacts/ URL');

// 9. Every internal link on the public pages resolves to a built file.
const pages = ['index.html', 'guides/index.html', ...published.map((g) => join(g.path, 'index.html'))];
for (const page of pages) {
  for (const [, href] of read(page).matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href.startsWith('/_astro/') || /\.(ico|svg|css|js)$/.test(href)) continue;
    const target = href.endsWith('/') ? join(href, 'index.html') : href;
    check(exists(target), `${page} links to missing ${href}`);
  }
}
for (const txt of [rootTxt, guidesTxt]) {
  for (const [, url] of txt.matchAll(/\]\((https:\/\/irfani\.me[^)]*)\)/g)) {
    const rel = url.replace(site, '');
    const target = rel.endsWith('/') ? join(rel, 'index.html') : rel;
    check(exists(target), `text index links to missing ${url}`);
  }
}

// 10. Robots and sitemap wiring.
check(read('robots.txt').includes(`Sitemap: ${site}/sitemap-index.xml`), 'robots.txt does not reference the sitemap');
check(!/Disallow:\s*\/\s*$/m.test(read('robots.txt')), 'robots.txt blocks the whole site');

if (failures.length) {
  console.error(`FAILED (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `OK: ${published.length} published guide(s). HTML, text, indexes, sitemap, canonicals and links all checked.`
);
