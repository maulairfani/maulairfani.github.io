export const SITE = 'https://irfani.me';

export type Guide = {
  /** URL segment. The guide lives at /guides/{slug}/. Keep it stable once published. */
  slug: string;
  title: string;
  description: string;
  /** Topic labels. A guide can have several. */
  tags: string[];
  /** ISO date (YYYY-MM-DD) of the last real content change. Omit when unknown. */
  updated?: string;
  /** Drafts are hidden from every index, the sitemap, and every generated text file. */
  draft?: boolean;
};

/** The one source of truth for /guides, the llms.txt files, and the sitemap. */
export const guides: Guide[] = [
  {
    slug: 'number-formats',
    title: 'Number formats: FP32, FP16, BF16 and INT8',
    description: 'A small, interactive guide to how computers store numbers, and why it matters for model size.',
    tags: ['quantization', 'number formats', 'machine learning'],
  },
  {
    slug: 'llm-inference-fundamentals',
    title: 'LLM Inference Fundamentals',
    description: 'A narrative study guide to LLM inference, with step-by-step explanations and an offline memory calculator.',
    tags: ['llm', 'inference', 'machine learning'],
    updated: '2026-11-21',
  },
];

export const publishedGuides = guides
  .filter((g) => !g.draft)
  .map((g) => ({ ...g, path: `/guides/${g.slug}/` }));
