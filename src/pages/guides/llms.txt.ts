import type { APIRoute } from 'astro';
import { SITE, publishedGuides } from '../../data/guides';

export const GET: APIRoute = () => {
  const lines = [
    '# Study guides · Maula Irfani',
    '',
    '> Small, interactive study guides on AI and machine learning topics, written as public notes.',
    '',
    '## Guides',
    '',
    ...publishedGuides.flatMap((g) => [
      `- [${g.title}](${new URL(g.path, SITE).href}): ${g.description}`,
      `  - Text version: ${new URL(`${g.path}llms.txt`, SITE).href}`,
    ]),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
