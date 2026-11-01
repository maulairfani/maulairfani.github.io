export type Artifact = {
  slug: string;
  title: string;
  description: string;
};

export const artifacts: Artifact[] = [
  {
    slug: 'sample',
    title: 'Sample artifact',
    description: 'A tiny counter to check that React and Tailwind work.',
  },
];
