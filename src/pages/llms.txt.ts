import type { APIRoute } from 'astro';
import { SITE } from '../data/guides';

export const GET: APIRoute = () => {
  const lines = [
    '# Maula Irfani',
    '',
    '> Personal site of Maula Irfani, an AI/ML engineer in Jakarta. It holds small, interactive study guides on AI and machine learning topics.',
    '',
    `- [Study guides](${new URL('/guides/', SITE).href}): index of every published study guide, with a text version of each`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
