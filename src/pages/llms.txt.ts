import type { APIRoute } from 'astro';
import { publishedGuides } from '../data/guides';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://irfani.me');
  const url = (path: string) => new URL(path, base).href;

  const lines = [
    '# Maula Irfani',
    '',
    '> Personal site of Maula Irfani, an AI/ML engineer in Jakarta. It holds small, interactive study guides on AI and machine learning topics, written as public notes.',
    '',
    `## Study guides`,
    '',
    ...publishedGuides.map((g) => `- [${g.title}](${url(g.path)}): ${g.description}`),
    `- [All guides](${url('/guides/')}): index of every published study guide`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
