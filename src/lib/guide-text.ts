import { parse } from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const converter = new NodeHtmlMarkdown({ useInlineLinks: true, bulletMarker: '-', maxConsecutiveNewlines: 2 });

/**
 * Turn a rendered guide page into Markdown. The source is the same HTML the
 * reader sees, so the text never drifts from the page. Navigation, styles and
 * scripts are removed. Quiz options are kept, because they are part of the
 * lesson. Widget controls such as buttons and inputs are dropped, and their
 * static text explanations stay.
 */
export function guideMarkdown(html: string): string {
  const root = parse(html);
  const main = root.querySelector('main');
  if (!main) throw new Error('guide page has no <main>');

  for (const el of main.querySelectorAll('nav, script, style, noscript, input, svg')) el.remove();
  for (const el of main.querySelectorAll('button')) {
    if (el.closest('[data-quiz]')) {
      el.replaceWith(`<li>${el.innerHTML}</li>`);
      continue;
    }
    el.remove();
  }
  for (const grid of main.querySelectorAll('[data-quiz] .grid')) {
    const items = grid.querySelectorAll('li').map((li) => li.outerHTML).join('');
    grid.replaceWith(`<ul>${items}</ul>`);
  }
  for (const el of main.querySelectorAll('[aria-hidden="true"]')) el.remove();
  for (const el of main.querySelectorAll('ol > li > span.tabular-nums')) el.remove();

  for (const el of main.querySelectorAll('sup')) el.replaceWith(`^${el.text}`);
  for (const el of main.querySelectorAll('sub')) el.replaceWith(`_${el.text}`);

  const body = converter.translate(main.innerHTML);
  return body
    .replace(/\\([=\-.])/g, '$1')
    .replace(/^# /m, '## ')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
