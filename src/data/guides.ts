export type Guide = {
  title: string;
  description: string;
  /** Route path of the guide. Keep it stable once published; never move a guide. */
  path: string;
  /** Topic labels. A guide can have several. */
  tags: string[];
  /** ISO date (YYYY-MM-DD) of the last real content change. Omit when unknown. */
  updated?: string;
  /** Drafts are hidden from every index, the sitemap, and llms.txt. */
  draft?: boolean;
};

/** The one source of truth for /guides, /llms.txt, and /sitemap.xml. */
export const guides: Guide[] = [
  {
    title: 'Number formats: FP32, FP16, BF16 and INT8',
    description: 'A small, interactive guide to how computers store numbers, and why it matters for model size.',
    path: '/artifacts/number-formats/',
    tags: ['quantization', 'number formats', 'machine learning'],
  },
];

export const publishedGuides = guides.filter((g) => !g.draft);
