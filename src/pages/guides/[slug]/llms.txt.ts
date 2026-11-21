import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, publishedGuides } from '../../../data/guides';
import { guideMarkdown } from '../../../lib/guide-text';

export const getStaticPaths: GetStaticPaths = () =>
  publishedGuides.map((g) => ({ params: { slug: g.slug }, props: { guide: g } }));

export const GET: APIRoute = ({ props }) => {
  const guide = props.guide as (typeof publishedGuides)[number];
  const pageUrl = new URL(guide.path, SITE).href;
  const html = readFileSync(join(process.cwd(), 'dist', guide.path, 'index.html'), 'utf8');

  const meta = [
    `# ${guide.title}`,
    '',
    `> ${guide.description}`,
    '',
    `- Canonical URL: ${pageUrl}`,
    `- Topics: ${guide.tags.join(', ')}`,
    ...(guide.updated ? [`- Updated: ${guide.updated}`] : []),
  ];

  return new Response([...meta, '', guideMarkdown(html), ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
